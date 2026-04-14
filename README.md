# CampaignRAG

> AI-Powered Marketing Campaign Generator with Retrieval-Augmented Generation
<img width="1902" height="962" alt="image" src="https://github.com/user-attachments/assets/f2831c61-1985-41d9-a320-6db347cb19ab" />

A full-stack web application that generates personalized AI-powered marketing campaigns using RAG (Retrieval-Augmented Generation), combining React + Vite, Express, MongoDB, and OpenAI.

# CampaignRAG - Complete Project Documentation

<img width="1853" height="967" alt="image" src="https://github.com/user-attachments/assets/63ad00a7-06d9-4557-bcc1-0bb2fbe8ba37" />


> AI-Powered Marketing Campaign Generator with Retrieval-Augmented Generation

A full-stack web application that generates personalized AI-powered marketing campaigns using RAG (Retrieval-Augmented Generation), combining React + Vite, Express, MongoDB, and OpenAI.

## ✨ Key Features

### Campaign Generation
-  5-field form for target specifications
-  Real-time AI processing with feedback
-  3 campaign variants (Safe/Aggressive/Creative)
-  AI recommendation with detailed reasoning
-  8+ additional actionable recommendations

### RAG-Powered Context
-  Upload brand documents (PDF, CSV, TXT)
-  Semantic search across documents
-  Vector embeddings (384-dimensional)
-  Context-aware campaign generation

### Campaign Management
-  Save all generated campaigns
-  Track status (Draft → Executed)
-  Campaign history with statistics
-  Filter and search capabilities
-  Delete old campaigns

### Export & Integration
-  Export as Markdown (human-readable)
-  Export as JSON (programmatic)
-  Export as CSV (spreadsheet-friendly)
-  Browser download integration

### Authentication & Security
-  User registration and login
-  JWT token authentication
-  Password hashing with bcryptjs
-  User data isolation
-  Protected routes

##  What's New (Latest Extension)

**Frontend Campaign Generator**
- 4 new React components
- Campaign form with validation
- Results display with 3 tabs
- Campaign history dashboard
- Statistics and analytics

**Backend Enhancements**
- Campaign model for persistence
- 5 new controller methods
- Campaign listing and filtering
- Status tracking
- Statistics aggregation

**Documentation**
- Complete user guide
- Developer setup guide
- API testing guide
- Examples and use cases


## 🔧 Technology Stack

**Frontend**
- React 18 with Hooks
- Vite (modern bundler)
- Tailwind CSS (styling)
- Axios (HTTP)

**Backend**
- Express 4.18.2
- Node.js (ES modules)
- MongoDB + Mongoose
- OpenAI API

**Additional**
- JWT Authentication
- bcryptjs (password hashing)
- PDF/CSV/TXT parsing
- Vector embeddings (384-dim)
- Semantic search

## 🎯 Core Workflows

### Generate Campaign
1. User fills 5-field form
2. System retrieves context from uploaded documents
3. AI generates 3 campaign variants
4. Results saved and displayed
5. Export or refine

### Manage Campaigns
1. View all campaigns in history
2. Filter by status
3. View statistics
4. Update campaign status
5. Delete old campaigns

### Export Campaign
1. Choose export format (Markdown/JSON/CSV)
2. File downloads to computer
3. Customize in your editor
4. Use in marketing tools

## 🔐 API Endpoints (12 Total)

### Authentication (3)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Campaigns (4 NEW)
- `POST /api/campaigns/generate`
- `GET /api/campaigns`
- `GET /api/campaigns/:id`
- `PATCH /api/campaigns/:id`
- `DELETE /api/campaigns/:id`
- `GET /api/campaigns/stats`
- `POST /api/campaigns/export`
- `POST /api/campaigns/variants`
- `POST /api/campaigns/refine`

### Documents & RAG (5)
- `POST /api/documents/upload`
- `GET /api/documents`
- `DELETE /api/documents/:id`
- `GET /api/documents/stats`
- `POST /api/search`

## 📊 Data Models

**Campaign** (NEW)
- Stores generated campaigns
- Includes input and output
- Tracks status and performance
- MongoDB document

**User**
- Email, name, hashed password
- JWT authentication

**Document**
- Uploaded brand documents
- Associated chunks
- Metadata (filename, type, size)

**Chunk**
- Text segments from documents
- 384-dim embeddings
- Position metadata
- For semantic search


##  Features Checklist

###  Completed
- [x] User authentication
- [x] Document upload
- [x] Text chunking
- [x] Vector embeddings
- [x] Semantic search
- [x] Campaign generation
- [x] 3 variants
- [x] AI recommendations
- [x] Campaign persistence
- [x] Campaign management
- [x] Export (3 formats)
- [x] Statistics
- [x] Responsive UI
- [x] Complete documentation

###  Future Enhancements (Optional)
- [ ] Campaign duplication
- [ ] Advanced filtering
- [ ] Performance analytics
- [ ] Campaign scheduling
- [ ] Collaborative editing
- [ ] Mobile app
- [ ] Dark mode
- [ ] A/B testing integration

##  Project Statistics

**Code**
- 4 new React components
- 1 new MongoDB model
- 5 new backend methods
- 4 new API endpoints
- 8 documentation files

**Features**
- Campaign generation with RAG
- 3-variant generation
- AI recommendations
- Full CRUD for campaigns
- 3-format export
- Statistics tracking

**Technology**
- React 18
- Express.js
- MongoDB
- OpenAI (optional)
- JWT auth
- Vector search

