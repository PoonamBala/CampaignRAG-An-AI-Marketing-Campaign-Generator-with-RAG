# RAG Pipeline Testing Guide

## API Endpoints Overview

### Document Management
- `POST /api/documents/upload` - Upload and process a document
- `GET /api/documents` - List all documents
- `GET /api/documents/:documentId` - Get document details
- `DELETE /api/documents/:documentId` - Delete document
- `GET /api/documents/stats/vector-store` - Get vector store statistics

### Search & Retrieval
- `POST /api/search` - Basic search (RAG retrieval)
- `POST /api/search/advanced` - Advanced search with filters
- `POST /api/search/similar/:chunkId` - Get similar chunks

---

## Testing the RAG Pipeline

### Prerequisites
1. Run backend: `npm run dev` in backend folder
2. Run MongoDB: `mongod`
3. Have a user account (register via `/api/auth/register`)
4. Get authentication token (via `/api/auth/login`)

### Step 1: Upload a Document

Create a test file first:

**test.txt:**
```
Machine learning is a subset of artificial intelligence.
It enables computers to learn from data without explicit programming.
Deep learning uses neural networks with multiple layers.
Natural language processing focuses on understanding human language.
Embeddings convert text into numerical vectors for computation.
```

**Upload the file:**
```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test.txt"
```

**Response:**
```json
{
  "success": true,
  "document": {
    "documentId": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "test.txt",
    "fileType": "txt",
    "chunkCount": 5,
    "uploadedAt": "2026-04-13T10:30:00.000Z"
  },
  "message": "Document processed successfully with 5 chunks"
}
```

**Save the `documentId` for later use.**

---

### Step 2: List Documents

```bash
curl -X GET http://localhost:5000/api/documents \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "documents": [
    {
      "_id": "...",
      "documentId": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "test.txt",
      "fileType": "txt",
      "fileSize": 1024,
      "chunkCount": 5,
      "metadata": {
        "uploadDate": "2026-04-13T10:30:00.000Z",
        "originalName": "test.txt"
      },
      "createdAt": "2026-04-13T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

---

### Step 3: Basic Search (RAG Retrieval)

Search for relevant chunks:

```bash
curl -X POST http://localhost:5000/api/search \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is machine learning?",
    "topK": 3
  }'
```

**Response:**
```json
{
  "success": true,
  "query": "What is machine learning?",
  "results": [
    {
      "chunkId": "...",
      "documentId": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "test.txt",
      "chunkIndex": 0,
      "text": "Machine learning is a subset of artificial intelligence.\nIt enables computers to learn from data without explicit programming.",
      "similarity": 0.87
    },
    {
      "chunkId": "...",
      "documentId": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "test.txt",
      "chunkIndex": 1,
      "text": "Deep learning uses neural networks with multiple layers.",
      "similarity": 0.65
    }
  ],
  "count": 2
}
```

---

### Step 4: Advanced Search with Filters

Search with similarity threshold and specific document:

```bash
curl -X POST http://localhost:5000/api/search/advanced \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "embeddings neural networks",
    "topK": 5,
    "documentId": "550e8400-e29b-41d4-a716-446655440000",
    "similarityThreshold": 0.5
  }'
```

**Response:**
```json
{
  "success": true,
  "query": "embeddings neural networks",
  "filters": {
    "similarityThreshold": 0.5,
    "documentId": "550e8400-e29b-41d4-a716-446655440000"
  },
  "results": [
    {
      "chunkId": "...",
      "documentId": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "test.txt",
      "chunkIndex": 2,
      "text": "Deep learning uses neural networks with multiple layers.",
      "similarity": "72.34%",
      "metadata": {
        "startChar": 105,
        "endChar": 155,
        "filename": "test.txt"
      }
    },
    {
      "chunkId": "...",
      "documentId": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "test.txt",
      "chunkIndex": 4,
      "text": "Embeddings convert text into numerical vectors for computation.",
      "similarity": "68.92%",
      "metadata": {
        "startChar": 200,
        "endChar": 265,
        "filename": "test.txt"
      }
    }
  ],
  "count": 2
}
```

---

### Step 5: Get Similar Chunks

Find chunks similar to a specific chunk:

```bash
# First, get the chunkId from a search result, then:

curl -X POST http://localhost:5000/api/search/similar/CHUNK_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "topK": 3
  }'
```

**Response:**
```json
{
  "success": true,
  "referenceChunk": {
    "id": "...",
    "text": "Machine learning is a subset of artificial intelligence..."
  },
  "similarChunks": [
    {
      "chunkId": "...",
      "documentId": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "test.txt",
      "text": "Deep learning uses neural networks with multiple layers.",
      "similarity": "71.45%"
    }
  ],
  "count": 1
}
```

---

### Step 6: Get Vector Store Statistics

```bash
curl -X GET http://localhost:5000/api/documents/stats/vector-store \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalVectors": 5,
    "documents": 1,
    "totalChunksInDB": 5
  }
}
```

---

### Step 7: Delete Document

```bash
curl -X DELETE http://localhost:5000/api/documents/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "message": "Document and 5 chunks deleted"
}
```

---

## Testing with Different File Types

### Test with CSV

**test.csv:**
```
name,description
Machine Learning,Subset of AI
Deep Learning,Neural networks
NLP,Language processing
```

```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@test.csv"
```

### Test with PDF

```bash
# Create a simple PDF with text, then:

curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@document.pdf"
```

---

## How the RAG Pipeline Works

1. **File Upload** → Extract text using appropriate parser (PDF/CSV/TXT)
2. **Chunking** → Split text into overlapping chunks (500 chars, 50 char overlap)
3. **Embeddings** → Generate embeddings for each chunk using mock embeddings
4. **Vector Storage** → Store embeddings in in-memory vector store + MongoDB
5. **Search** → Generate embedding for query, find similar chunks using cosine similarity
6. **Retrieval** → Return top-K chunks with highest similarity scores

---

## Architecture Details

### Vector Store
- **Type**: In-memory (can be replaced with FAISS, Pinecone, Weaviate)
- **Similarity Metric**: Cosine similarity
- **Embedding Dimension**: 384-dimensional vectors

### Embedding Function
- **Type**: Mock embeddings (deterministic hash-based)
- **Replacement**: Can use OpenAI, HuggingFace, LLaMA, or any embedding model

### Database
- **Documents**: Stored in MongoDB with metadata
- **Chunks**: Stored in MongoDB with embeddings
- **Vector Index**: In-memory store with metadata pointers

---

## Key Parameters

### Chunking
- `chunkSize`: 500 characters
- `overlap`: 50 characters overlap between chunks
- Adjustable in `chunking.js`

### Search
- `topK`: Number of results (default 5, max 50)
- `similarityThreshold`: Minimum similarity score (0-1)

### File Upload
- `maxFileSize`: 50MB
- `allowedTypes`: PDF, CSV, TXT
- `uploadDir`: `/backend/uploads/`

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "No token provided" | Include `Authorization: Bearer TOKEN` header |
| "File too large" | File exceeds 50MB limit |
| "Invalid file type" | Only PDF, CSV, TXT supported |
| "Document not found" | Document ID doesn't exist or belongs to another user |
| "Query is required" | Include `query` field in request body |

---

## Production Considerations

1. **Replace Mock Embeddings**
   - Use OpenAI: `openai.embeddings.create()`
   - Use HuggingFace: `sentence-transformers`
   - Use LLaMA: Ollama local inference

2. **Replace In-Memory Vector Store**
   - FAISS: Largest scale, CPU-based
   - Pinecone: Managed, cloud-based
   - Weaviate: Open-source, self-hosted
   - Milvus: Open-source, production-ready

3. **Add Persistence**
   - Save embeddings to database
   - Create indexes for faster retrieval
   - Implement caching layer (Redis)

4. **Optimize Chunking**
   - Use semantic chunking (break at natural boundaries)
   - Implement different chunk sizes for different document types
   - Add metadata for better filtering

5. **Security**
   - Validate file contents
   - Implement rate limiting
   - Add encryption for stored texts
   - Audit logging for searches
