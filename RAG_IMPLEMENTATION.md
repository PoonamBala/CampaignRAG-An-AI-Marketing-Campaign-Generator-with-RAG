# CampaignRAG - RAG Implementation Guide

## Overview

RAG (Retrieval-Augmented Generation) pipeline implemented for document ingestion, chunking, embedding, and semantic search.

---

## System Architecture

```
File Upload
    ↓
File Parser (PDF/CSV/TXT)
    ↓
Text Extraction
    ↓
Text Chunking (500 chars, 50 overlap)
    ↓
Embedding Generation (Mock)
    ↓
Vector Storage + Database
    ↓
Search Query → Retrieve Top-K Chunks
```

---

## File Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── documentController.js    # Upload, list, delete documents
│   │   └── searchController.js      # Search, similarity retrieval
│   ├── models/
│   │   ├── Document.js              # Document metadata schema
│   │   └── Chunk.js                 # Text chunk schema with embeddings
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification
│   │   └── upload.js                # Multer file upload config
│   ├── routes/
│   │   ├── documents.js             # Document endpoints
│   │   └── search.js                # Search endpoints
│   ├── utils/
│   │   ├── fileParser.js            # Extract text from files
│   │   ├── chunking.js              # Text chunking logic
│   │   ├── embeddings.js            # Embedding generation
│   │   └── vectorStore.js           # In-memory vector database
│   └── server.js                    # Express app setup
└── uploads/                         # Temporary uploaded files
```

---

## Core Components

### 1. File Parser (`fileParser.js`)

Extracts text from multiple file formats:

```javascript
// Extract from any supported format
const text = await extractTextFromFile(filePath, 'pdf');

// Supports:
// - PDF: Uses pdf-parse
// - CSV: Uses papaparse
// - TXT: Plain text reading
```

**Supported Formats:**
- **PDF**: Extracts all text from pages
- **CSV**: Converts rows to readable text format
- **TXT**: Plain text files

---

### 2. Text Chunking (`chunking.js`)

Splits large documents into manageable chunks:

```javascript
const chunks = chunkText(text, 500, 50);
// Returns array of chunks with 500 char size and 50 char overlap

const chunksWithMeta = createChunksWithMetadata(text);
// Returns chunks with position metadata (startChar, endChar)
```

**Parameters:**
- `chunkSize`: 500 characters (configurable)
- `overlap`: 50 characters (handles sentence boundaries)
- **Smart Breaking**: Breaks at periods or newlines when possible

---

### 3. Embedding Generation (`embeddings.js`)

Generate vector representations of text:

```javascript
// Generate single embedding
const embedding = generateEmbedding(text);
// Returns 384-dimensional vector

// Batch mode
const embeddings = await generateBatchEmbeddings(texts);

// Calculate similarity
const score = cosineSimilarity(vec1, vec2);
// Returns similarity score (0-1)
```

**Current Implementation:**
- Mock embeddings using deterministic hashing
- 384-dimensional vectors
- Cosine similarity for comparison

**Replacement Options:**
```javascript
// OpenAI
generateEmbeddingOpenAI(text) // GPT-3.5

// HuggingFace
sentence_transformers('all-MiniLM-L6-v2')

// LLaMA
ollama embed llama2
```

---

### 4. Vector Store (`vectorStore.js`)

In-memory database for vector storage and retrieval:

```javascript
// Add vector
vectorStore.add(id, embedding, metadata);

// Search
const results = vectorStore.search(queryEmbedding, k=5);
// Returns top 5 similar vectors with scores

// Get statistics
const stats = vectorStore.getStats();
// {totalVectors: 100, documents: 5}
```

**Features:**
- Add/delete vectors
- Semantic search
- Filter by document
- Get statistics

**Production Replacements:**
- FAISS: Up to 1B+ vectors
- Pinecone: Managed cloud service
- Weaviate: Self-hosted graph database
- Milvus: Open-source at scale

---

## Database Models

### Document Schema

```javascript
{
  documentId: String (unique),      // UUID for document
  userId: ObjectId (ref User),       // Owner
  filename: String,                  // Original filename
  fileType: String (pdf|csv|txt),   // File format
  fileSize: Number,                  // Bytes
  extractedText: String,             // First 5000 chars
  chunkCount: Number,                // Total chunks
  metadata: {
    uploadDate: Date,
    originalName: String
  },
  timestamps: true
}
```

### Chunk Schema

```javascript
{
  documentId: String (indexed),      // Parent document
  userId: ObjectId (ref User),       // Owner
  text: String,                      // Chunk content
  embedding: [Number],               // 384-dim vector
  chunkIndex: Number,                // Position in document
  metadata: {
    startChar: Number,
    endChar: Number,
    filename: String
  },
  timestamps: true
}
```

---

## API Endpoints

### Document Management

**Upload Document**
```
POST /api/documents/upload
Headers: Authorization: Bearer TOKEN
Body: multipart/form-data { file }

Response:
{
  "success": true,
  "document": {
    "documentId": "...",
    "filename": "...",
    "fileType": "txt",
    "chunkCount": 5,
    "uploadedAt": "..."
  }
}
```

**List Documents**
```
GET /api/documents
Headers: Authorization: Bearer TOKEN

Response:
{
  "success": true,
  "documents": [...],
  "count": 1
}
```

**Get Document Details**
```
GET /api/documents/:documentId
Headers: Authorization: Bearer TOKEN

Response:
{
  "success": true,
  "document": {...},
  "chunkCount": 5
}
```

**Delete Document**
```
DELETE /api/documents/:documentId
Headers: Authorization: Bearer TOKEN

Response:
{
  "success": true,
  "message": "Document and 5 chunks deleted"
}
```

### Search & Retrieval

**Basic Search (RAG)**
```
POST /api/search
Headers: Authorization: Bearer TOKEN
Body:
{
  "query": "What is machine learning?",
  "topK": 5
}

Response:
{
  "success": true,
  "query": "...",
  "results": [
    {
      "documentId": "...",
      "filename": "...",
      "text": "...",
      "similarity": 0.87
    }
  ],
  "count": 1
}
```

**Advanced Search**
```
POST /api/search/advanced
Body:
{
  "query": "embeddings",
  "topK": 5,
  "documentId": "...",        // optional
  "similarityThreshold": 0.5
}
```

**Find Similar Chunks**
```
POST /api/search/similar/:chunkId
Body:
{
  "topK": 3
}
```

### Statistics

**Vector Store Stats**
```
GET /api/documents/stats/vector-store
Response:
{
  "stats": {
    "totalVectors": 50,
    "documents": 3,
    "totalChunksInDB": 50
  }
}
```

---

## Data Flow Example

### Upload Document

```
1. User uploads test.txt
   ↓
2. Multer saves to /uploads/
   ↓
3. extractTextFromFile reads file
   ↓
4. Text: "Machine learning is... Deep learning uses..."
   ↓
5. chunkText splits into chunks:
   - Chunk 0: "Machine learning is..."
   - Chunk 1: "Deep learning uses..."
   ↓
6. For each chunk:
   - generateEmbedding() → 384-dim vector
   - Store in vectorStore.add(id, embedding, metadata)
   - Save to Chunk collection in MongoDB
   ↓
7. Save Document metadata to MongoDB
   ↓
8. Delete temporary file, return documentId
```

### Search Query

```
1. User sends query: "What is embedding?"
   ↓
2. generateEmbedding(query) → 384-dim vector
   ↓
3. vectorStore.search(queryEmbed, topK=5)
   - Calculate cosineSimilarity for all vectors
   - Sort by score descending
   - Return top 5
   ↓
4. Fetch full chunk text from MongoDB
   ↓
5. Return results with similarity scores
```

---

## Configuration & Customization

### Chunking Strategy

**Current (Simple):**
```javascript
const chunks = chunkText(text, 500, 50);
```

**Custom Strategy:**
```javascript
// Sentence-based chunking
function chunkBySentence(text, sentencesPerChunk = 3) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  const chunks = [];
  for (let i = 0; i < sentences.length; i += sentencesPerChunk) {
    chunks.push(sentences.slice(i, i + sentencesPerChunk).join(''));
  }
  return chunks;
}
```

### Embedding Dimension

```javascript
// Current: 384 dimensions
const EMBEDDING_DIMENSION = 384;

// Adjust for:
// - Speed: Lower dimension (128-256)
// - Accuracy: Higher dimension (512+)
```

### Similarity Threshold

```javascript
// In search request:
{
  "query": "...",
  "similarityThreshold": 0.3  // Range: 0-1
  // 0 = all results, 1 = exact match only
}
```

---

## Performance Considerations

### File Size Handling
- Max upload: 50MB
- Typical processing time: 1-5 seconds per document
- Storage: ~10KB per chunk in MongoDB

### Search Speed
- In-memory vector store: < 10ms for 10K vectors
- With database fetch: 50-200ms depending on chunk count

### Optimization Strategies

1. **Caching**
   ```javascript
   // Cache frequent queries
   const cache = new Map();
   ```

2. **Indexing**
   ```javascript
   // Add MongoDB indexes
   db.chunks.createIndex({ documentId: 1, userId: 1 });
   ```

3. **Batch Processing**
   ```javascript
   // Process multiple documents in parallel
   await Promise.all(uploadPromises);
   ```

---

## Error Handling

**File Upload Errors:**
- Invalid file type → 400
- File too large → 400
- Parse failure → 400

**Search Errors:**
- No query provided → 400
- Invalid topK → 400
- Document not found → 404
- Unauthorized → 401

---

## Security Features

✅ **Authentication**: JWT token required
✅ **Authorization**: Users only access their documents
✅ **File Validation**: Type and size checks
✅ **Input Sanitization**: Query validation
✅ **Database Indexing**: Fast lookups by userId

---

## Next Steps / Enhancements

1. **Real Embeddings**
   - OpenAI API integration
   - HuggingFace transformers
   - Local LLaMA inference

2. **Production Vector Store**
   - FAISS for large scale
   - Pinecone for cloud
   - Weaviate for flexibility

3. **Advanced Features**
   - Semantic chunking
   - Multi-language support
   - Hybrid search (BM25 + semantic)
   - Query rewriting

4. **Performance**
   - Caching layer (Redis)
   - Database indexing
   - Async processing
   - Batch operations

5. **UI Integration**
   - Document upload interface
   - Search interface
   - Result display

---

## Testing Checklist

- [ ] Upload TXT file (5 chunks)
- [ ] Upload PDF file (extract text)
- [ ] Upload CSV file (convert to text)
- [ ] Search for relevant chunks
- [ ] Test similarity threshold
- [ ] Filter by document ID
- [ ] Find similar chunks
- [ ] View vector store stats
- [ ] Delete document (cascade delete)
- [ ] Test with large files (10MB+)
- [ ] Multiple user isolation
- [ ] Token expiration handling

---

## Dependencies

```json
{
  "multer": "File uploads",
  "pdf-parse": "PDF text extraction",
  "papaparse": "CSV parsing",
  "uuid": "Unique document IDs"
}
```

All utilities are self-contained and can be swapped for different implementations.
