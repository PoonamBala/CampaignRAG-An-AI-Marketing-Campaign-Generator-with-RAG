import Chunk from '../models/Chunk.js';
import { generateEmbedding } from '../utils/embeddings.js';
import vectorStore from '../utils/vectorStore.js';

/**
 * Search for relevant chunks using RAG
 */
export const search = async (req, res) => {
  try {
    const { query, topK = 5, documentId } = req.body;
    const userId = req.user.id;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: 'Query is required' });
    }

    if (topK < 1 || topK > 50) {
      return res.status(400).json({ message: 'topK must be between 1 and 50' });
    }

    // Generate embedding for query
    const queryEmbedding = generateEmbedding(query);

    // Search in vector store
    let searchResults = vectorStore.search(queryEmbedding, topK * 2); // Get more to filter

    // Filter by document if specified
    if (documentId) {
      searchResults = searchResults.filter(
        (result) => result.metadata.documentId === documentId
      );
    }

    // Fetch full chunk data from database
    const chunks = await Promise.all(
      searchResults.slice(0, topK).map(async (result) => {
        const chunk = await Chunk.findOne({
          userId,
          documentId: result.metadata.documentId,
          chunkIndex: result.metadata.chunkIndex
        });

        return {
          chunkId: chunk?._id,
          documentId: result.metadata.documentId,
          filename: result.metadata.filename,
          chunkIndex: result.metadata.chunkIndex,
          text: chunk?.text,
          similarity: result.score,
          metadata: chunk?.metadata
        };
      })
    );

    res.status(200).json({
      success: true,
      query,
      results: chunks,
      count: chunks.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Advanced search with filters
 */
export const advancedSearch = async (req, res) => {
  try {
    const { query, topK = 5, documentId, similarityThreshold = 0.3 } = req.body;
    const userId = req.user.id;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: 'Query is required' });
    }

    // Generate embedding for query
    const queryEmbedding = generateEmbedding(query);

    // Search in vector store
    let searchResults = vectorStore.search(queryEmbedding, topK * 3);

    // Filter by similarity threshold
    searchResults = searchResults.filter(
      (result) => result.score >= similarityThreshold
    );

    // Filter by document if specified
    if (documentId) {
      searchResults = searchResults.filter(
        (result) => result.metadata.documentId === documentId
      );
    }

    // Fetch full chunk data
    const chunks = await Promise.all(
      searchResults.slice(0, topK).map(async (result) => {
        const chunk = await Chunk.findOne({
          userId,
          documentId: result.metadata.documentId,
          chunkIndex: result.metadata.chunkIndex
        });

        return {
          chunkId: chunk?._id,
          documentId: result.metadata.documentId,
          filename: result.metadata.filename,
          chunkIndex: result.metadata.chunkIndex,
          text: chunk?.text,
          similarity: (result.score * 100).toFixed(2) + '%',
          metadata: chunk?.metadata
        };
      })
    );

    res.status(200).json({
      success: true,
      query,
      filters: {
        similarityThreshold,
        documentId: documentId || 'all'
      },
      results: chunks,
      count: chunks.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get similar chunks to a given chunk
 */
export const getSimilarChunks = async (req, res) => {
  try {
    const { chunkId } = req.params;
    const { topK = 5 } = req.body;
    const userId = req.user.id;

    // Get the reference chunk
    const referenceChunk = await Chunk.findById(chunkId);

    if (!referenceChunk || referenceChunk.userId.toString() !== userId) {
      return res.status(404).json({ message: 'Chunk not found' });
    }

    // Search for similar chunks
    const searchResults = vectorStore.search(referenceChunk.embedding, topK + 1);

    // Fetch full chunk data
    const chunks = await Promise.all(
      searchResults
        .filter((result) => result.id !== `chunk-${referenceChunk.documentId}-${referenceChunk.chunkIndex}`)
        .slice(0, topK)
        .map(async (result) => {
          const chunk = await Chunk.findOne({
            userId,
            documentId: result.metadata.documentId,
            chunkIndex: result.metadata.chunkIndex
          });

          return {
            chunkId: chunk?._id,
            documentId: result.metadata.documentId,
            filename: result.metadata.filename,
            text: chunk?.text,
            similarity: (result.score * 100).toFixed(2) + '%'
          };
        })
    );

    res.status(200).json({
      success: true,
      referenceChunk: {
        id: referenceChunk._id,
        text: referenceChunk.text.substring(0, 200) + '...'
      },
      similarChunks: chunks,
      count: chunks.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
