# RAG API Quick Reference

## Setup (Before Testing)

```bash
# 1. Start MongoDB
mongod

# 2. Install dependencies
cd backend
npm install

# 3. Start backend
npm run dev

# 4. Register and login to get token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  | jq -r '.token')

echo $TOKEN  # Save this token for all following requests
```

---

## 1. Upload Document

**Single File:**
```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@document.txt"
```

**Response saves `documentId`:**
```bash
DOC_ID="<documentId from response>"
```

---

## 2. List Documents

```bash
curl -X GET http://localhost:5000/api/documents \
  -H "Authorization: Bearer $TOKEN"
```

---

## 3. Basic Search (Most Important!)

```bash
curl -X POST http://localhost:5000/api/search \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is machine learning?",
    "topK": 5
  }'
```

---

## 4. Advanced Search with Filters

```bash
curl -X POST http://localhost:5000/api/search/advanced \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "neural networks",
    "topK": 3,
    "documentId": "'$DOC_ID'",
    "similarityThreshold": 0.4
  }'
```

---

## 5. Find Similar Chunks

```bash
# First get a chunkId from search results above, then:

curl -X POST http://localhost:5000/api/search/similar/$CHUNK_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"topK": 3}'
```

---

## 6. Get Document Stats

```bash
curl -X GET http://localhost:5000/api/documents/stats/vector-store \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 7. Delete Document

```bash
curl -X DELETE http://localhost:5000/api/documents/$DOC_ID \
  -H "Authorization: Bearer $TOKEN"
```

---

## Test Data (Create test.txt)

```txt
Machine learning is a subset of artificial intelligence.
It enables computers to learn from data without explicit programming.
Deep learning uses neural networks with multiple layers.
Natural language processing focuses on understanding human language.
Embeddings convert text into numerical vectors for computation.
Transformers are neural network architectures for NLP tasks.
Attention mechanisms allow models to focus on relevant parts.
Tokenization is the process of breaking text into tokens.
Vector databases store embeddings for fast retrieval.
Semantic search finds meaning-based similarity between texts.
```

---

## Common Test Queries

These work well with the test data above:

1. `"What is machine learning?"`
2. `"Tell me about neural networks"`
3. `"How do embeddings work?"`
4. `"What is NLP?"`
5. `"Explain transformers"`

---

## Response Examples

### Successful Search
```json
{
  "success": true,
  "query": "What is machine learning?",
  "results": [
    {
      "documentId": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "test.txt",
      "text": "Machine learning is a subset of artificial intelligence...",
      "similarity": 0.92,
      "chunkIndex": 0
    },
    {
      "documentId": "550e8400-e29b-41d4-a716-446655440000",
      "filename": "test.txt",
      "text": "It enables computers to learn from data...",
      "similarity": 0.85,
      "chunkIndex": 1
    }
  ],
  "count": 2
}
```

### Upload Success
```json
{
  "success": true,
  "document": {
    "documentId": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "test.txt",
    "fileType": "txt",
    "chunkCount": 10,
    "uploadedAt": "2026-04-13T10:30:00.000Z"
  },
  "message": "Document processed successfully with 10 chunks"
}
```

---

## Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| `"No token provided"` | Missing Authorization header | Add `-H "Authorization: Bearer $TOKEN"` |
| `"Invalid token"` | Expired or wrong token | Get new token from login |
| `"File too large"` | > 50MB | Split file or increase limit |
| `"Invalid file type"` | Not PDF/CSV/TXT | Use supported format |
| `"Document not found"` | Wrong documentId | Check ID from upload response |
| `"404 Not Found"` | Wrong endpoint | Check URL path spelling |

---

## Windows PowerShell Notes

If using PowerShell, use line continuation with backtick:

```powershell
curl -X POST http://localhost:5000/api/documents/upload `
  -H "Authorization: Bearer $TOKEN" `
  -F "file=@document.txt"
```

Or save token in Windows:

```powershell
$TOKEN = 'your_token_here'
curl -X GET http://localhost:5000/api/documents -H "Authorization: Bearer $TOKEN"
```

---

## Performance Testing

### Upload Performance
```bash
time curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@large_document.txt"
```
Expected: < 5 seconds for 10MB file

### Search Performance
```bash
time curl -X POST http://localhost:5000/api/search \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"test","topK":10}'
```
Expected: < 100ms response time

---

## Batch Upload Script

Create `batch_upload.sh`:

```bash
#!/bin/bash

TOKEN=$1
FOLDER=$2

for file in $FOLDER/*; do
  echo "Uploading $(basename $file)..."
  curl -s -X POST http://localhost:5000/api/documents/upload \
    -H "Authorization: Bearer $TOKEN" \
    -F "file=@$file" | jq '.document.documentId'
done
```

Usage:
```bash
./batch_upload.sh $TOKEN ./documents/
```

---

## Next: Frontend Integration

Coming soon - React components for:
- File upload with progress
- Search interface
- Results display
- Document management UI
