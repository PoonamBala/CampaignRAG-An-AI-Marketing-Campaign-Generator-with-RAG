import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import Document from '../models/Document.js';
import Chunk from '../models/Chunk.js';
import { extractTextFromFile } from '../utils/fileParser.js';
import { createChunksWithMetadata } from '../utils/chunking.js';
import { generateEmbedding } from '../utils/embeddings.js';
import vectorStore from '../utils/vectorStore.js';

/**
 * Upload and process a document
 */
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file provided' });
    }

    const { filename, path: filePath, mimetype, size } = req.file;
    const userId = req.user.id;
    const documentId = uuidv4();

    // Determine file type
    const fileExt = path.extname(filename).toLowerCase().replace('.', '');
    const fileType = fileExt === 'txt' ? 'txt' : fileExt;

    // Extract text from file
    let extractedText;
    try {
      extractedText = await extractTextFromFile(filePath, fileType);
    } catch (error) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: `Failed to parse file: ${error.message}` });
    }

    // Create chunks
    const chunksData = createChunksWithMetadata(extractedText, 500, 50);

    // Generate embeddings and prepare chunk data
    const chunks = await Promise.all(
      chunksData.map(async (chunk, index) => {
        const embedding = generateEmbedding(chunk.text);

        // Add to vector store
        vectorStore.add(`chunk-${documentId}-${index}`, embedding, {
          documentId,
          filename,
          chunkIndex: index
        });

        // Prepare document chunk
        return {
          documentId,
          userId,
          text: chunk.text,
          embedding,
          chunkIndex: index,
          metadata: {
            ...chunk.metadata,
            filename
          }
        };
      })
    );

    // Save document metadata
    const document = new Document({
      documentId,
      userId,
      filename,
      fileType,
      fileSize: size,
      extractedText: extractedText.substring(0, 5000), // Store first 5000 chars
      chunkCount: chunks.length,
      metadata: {
        uploadDate: new Date(),
        originalName: filename
      }
    });

    await document.save();

    // Save chunks to database
    await Chunk.insertMany(chunks);

    // Clean up uploaded file (optional - can keep for backup)
    fs.unlinkSync(filePath);

    res.status(201).json({
      success: true,
      document: {
        documentId: document.documentId,
        filename: document.filename,
        fileType: document.fileType,
        chunkCount: document.chunkCount,
        uploadedAt: document.createdAt
      },
      message: `Document processed successfully with ${chunks.length} chunks`
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get document details
 */
export const getDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;

    const document = await Document.findOne({ documentId, userId });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    const chunks = await Chunk.find({ documentId, userId });

    res.status(200).json({
      success: true,
      document,
      chunkCount: chunks.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * List all documents for a user
 */
export const listDocuments = async (req, res) => {
  try {
    const userId = req.user.id;

    const documents = await Document.find({ userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      documents,
      count: documents.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete document and associated chunks
 */
export const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const userId = req.user.id;

    const document = await Document.findOneAndDelete({ documentId, userId });

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Delete associated chunks from database
    await Chunk.deleteMany({ documentId, userId });

    // Delete from vector store
    const deletedCount = vectorStore.deleteByDocumentId(documentId);

    res.status(200).json({
      success: true,
      message: `Document and ${deletedCount} chunks deleted`
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get vector store statistics
 */
export const getVectorStoreStats = async (req, res) => {
  try {
    const stats = vectorStore.getStats();
    const dbChunks = await Chunk.countDocuments({ userId: req.user.id });

    res.status(200).json({
      success: true,
      stats: {
        ...stats,
        totalChunksInDB: dbChunks
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
