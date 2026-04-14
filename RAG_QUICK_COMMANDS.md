# RAG Quick Command Reference

## Setup & Installation

```bash
# Navigate to backend
cd backend

# Install all dependencies (including RAG packages)
npm install

# Copy environment template
cp .env.example .env

# Edit .env if using remote MongoDB (optional)
# nano .env  (or use your editor)
```

---

## Running the Application

### Option 1: Two Separate Terminals

**Terminal 1 - MongoDB:**
```bash
mongod
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - Frontend (optional):**
```bash
cd frontend
npm run dev
```

### Option 2: Check Services

```bash
# Check MongoDB running
mongo --version

# Check Node version
node --version

# Check npm version
npm --version
```

---

## Authentication (First Steps)

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Your Name",
    "email": "you@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

### Login & Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "you@example.com",
    "password": "password123"
  }'

# Response will include: "token": "eyJhbGc..."
# Save this token in a variable:
TOKEN="your_token_value"
```

---

## RAG - Quick Test (< 5 Minutes)

### Step 1: Create Test File

**Create test.txt:**
```bash
# Linux/Mac
cat > test.txt << EOF
Machine learning is a subset of artificial intelligence.
Deep learning uses neural networks with multiple layers.
Natural language processing focuses on understanding human language.
Embeddings convert text into numerical vectors for computation.
Transformers are neural network architectures for NLP tasks.
EOF

# Windows PowerShell
@"
Machine learning is a subset of artificial intelligence.
Deep learning uses neural networks with multiple layers.
Natural language processing focuses on understanding human language.
Embeddings convert text into numerical vectors for computation.
Transformers are neural network architectures for NLP tasks.
"@ | Out-File test.txt
```

### Step 2: Upload Document

```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test.txt"

# Save the documentId from response
DOC_ID="doc_id_from_response"
```

### Step 3: Search (The RAG Magic!)

```bash
curl -X POST http://localhost:5000/api/search \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "What is machine learning?",
    "topK": 3
  }'
```

### Step 4: View Results

Results should show:
- Chunk 0: "Machine learning is a subset..." (highest similarity)
- Chunk 1: "Deep learning uses..." (good match)
- And more chunks ranked by relevance

---

## RAG API Testing

### Upload Document
```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@document.pdf"

curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@data.csv"

curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@notes.txt"
```

### List Documents
```bash
curl -X GET http://localhost:5000/api/documents \
  -H "Authorization: Bearer $TOKEN" | jq
```

### Get Document Details
```bash
curl -X GET http://localhost:5000/api/documents/$DOC_ID \
  -H "Authorization: Bearer $TOKEN" | jq
```

### Basic Search
```bash
curl -X POST http://localhost:5000/api/search \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "your search query here",
    "topK": 5
  }' | jq
```

### Advanced Search with Filters
```bash
curl -X POST http://localhost:5000/api/search/advanced \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "your search query",
    "topK": 5,
    "documentId": "'$DOC_ID'",
    "similarityThreshold": 0.5
  }' | jq
```

### Get Similar Chunks
```bash
curl -X POST http://localhost:5000/api/search/similar/$CHUNK_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"topK": 3}' | jq
```

### Get Vector Store Stats
```bash
curl -X GET http://localhost:5000/api/documents/stats/vector-store \
  -H "Authorization: Bearer $TOKEN" | jq
```

### Delete Document
```bash
curl -X DELETE http://localhost:5000/api/documents/$DOC_ID \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## Useful Variables (Save These)

```bash
# After login/register
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# After uploading document
DOC_ID="550e8400-e29b-41d4-a716-446655440000"

# From search results
CHUNK_ID="507f1f77bcf86cd799439011"

# Use in commands
curl -H "Authorization: Bearer $TOKEN" ...
```

---

## Testing Different File Types

### Test with TXT
```bash
echo "Sample text content here..." > test.txt
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test.txt"
```

### Test with CSV
```bash
echo -e "name,value\nitem1,100\nitem2,200" > test.csv
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test.csv"
```

### Test with PDF
```bash
# Download sample PDF or create one
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@sample.pdf"
```

---

## Common Queries for Testing

```bash
# Try these search queries:
"machine learning"
"What is AI?"
"neural networks"
"text processing"
"deep learning"
"embeddings"
"NLP"
"transformers"
"vectors"
"similarity"
```

---

## Debugging Commands

### Check If Ports Are Open
```bash
# Check port 5000 (Backend)
netstat -an | findstr :5000

# Check port 5173 (Frontend)
netstat -an | findstr :5173

# Check port 27017 (MongoDB)
netstat -an | findstr :27017
```

### Check Environment Variables
```bash
# See what's in .env
cat backend/.env

# On Windows
type backend\.env
```

### Check MongoDB Connection
```bash
# Try to connect
mongo
# or
mongosh
```

### View Backend Logs
```bash
# Should show in running terminal:
# Server running on port 5000
# MongoDB connected successfully
```

---

## Performance Testing

### Test Upload Speed
```bash
time curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@large_file.txt"
```

### Test Search Speed
```bash
time curl -X POST http://localhost:5000/api/search \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"test","topK":10}'
```

---

## Stop Services

```bash
# Stop Backend (Ctrl+C in terminal)
# or
lsof -ti:5000 | xargs kill -9

# Stop MongoDB (Ctrl+C in terminal)
# or
# Use MongoDB admin panel

# Stop Frontend (Ctrl+C in terminal)
```

---

## Clean Up & Reset

```bash
# Delete all uploaded files
rm -rf backend/uploads/*

# Clear MongoDB data
mongo
> use campaignrag
> db.dropDatabase()

# Reinstall dependencies
rm -rf backend/node_modules
npm install
```

---

## Windows PowerShell Tips

```powershell
# Save token in variable
$TOKEN = "your_token_value"

# Use in curl with quotes
curl -X GET http://localhost:5000/api/documents `
  -H "Authorization: Bearer $TOKEN"

# Create test file
@"
Your text here
"@ | Out-File test.txt -Encoding UTF8

# Check running processes
Get-Process node
```

---

## Docker (Optional Future)

If you want to run in containers:

```bash
# Would need Dockerfile (not created yet)
docker build -t campaignrag-backend .
docker run -p 5000:5000 campaignrag-backend
```

---

## Database Connections

### Local MongoDB
```
mongodb://localhost:27017/campaignrag
```

### MongoDB Atlas (Cloud)
```
mongodb+srv://username:password@cluster.mongodb.net/campaignrag
```

---

## Health Checks

### Check Backend
```bash
curl http://localhost:5000/api/health
# Response: {"status":"Backend is running"}
```

### Check Frontend
```bash
# Go to http://localhost:5173
# Should see login page
```

### Check MongoDB
```bash
mongo
> db.adminCommand('ping')
# Should return { ok: 1 }
```

---

## Full Testing Sequence

```bash
# 1. Start MongoDB
mongod &

# 2. Start Backend
cd backend && npm run dev &

# 3. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123","confirmPassword":"test123"}'

# 4. Login and save token
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}' \
  | grep -o '"token":"[^"]*' | cut -d'"' -f4)

# 5. Upload document
DOC_ID=$(curl -s -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@test.txt" \
  | grep -o '"documentId":"[^"]*' | cut -d'"' -f4)

# 6. Search
curl -X POST http://localhost:5000/api/search \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"machine learning","topK":3}' | jq

# 7. Get stats
curl -X GET http://localhost:5000/api/documents/stats/vector-store \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## Success Indicators

✅ Backend starts without errors
✅ MongoDB connection message appears
✅ Can register and login
✅ Can upload documents
✅ Search returns relevant chunks
✅ Results have similarity scores
✅ Vector store stats populate
✅ Delete works (cascade delete)

---

## Quick Links

- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- MongoDB: localhost:27017
- API Docs: See RAG_API_REFERENCE.md
- Testing: See RAG_TESTING.md

---

## Next: Frontend Integration

Once backend is working, integrate with React frontend:

```bash
cd frontend
npm install
npm run dev
```

More coming soon!

---

Everything ready to go! Use this guide for quick testing and deployment. 🚀
