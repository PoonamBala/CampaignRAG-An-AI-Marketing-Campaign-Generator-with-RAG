# CampaignRAG - Complete Project Documentation

> AI-Powered Marketing Campaign Generator with Retrieval-Augmented Generation
<img width="1902" height="962" alt="image" src="https://github.com/user-attachments/assets/f2831c61-1985-41d9-a320-6db347cb19ab" />

A full-stack web application that generates personalized AI-powered marketing campaigns using RAG (Retrieval-Augmented Generation), combining React + Vite, Express, MongoDB, and OpenAI.

# CampaignRAG - Complete Project Documentation

<img width="1853" height="967" alt="image" src="https://github.com/user-attachments/assets/63ad00a7-06d9-4557-bcc1-0bb2fbe8ba37" />


> AI-Powered Marketing Campaign Generator with Retrieval-Augmented Generation

A full-stack web application that generates personalized AI-powered marketing campaigns using RAG (Retrieval-Augmented Generation), combining React + Vite, Express, MongoDB, and OpenAI.

## 🎯 Quick Start

**New?** → [CAMPAIGN_GENERATOR_QUICKSTART.md](CAMPAIGN_GENERATOR_QUICKSTART.md) (5-minute setup)

**Using the app?** → [FRONTEND_CAMPAIGN_UI_GUIDE.md](FRONTEND_CAMPAIGN_UI_GUIDE.md) (Feature guide)

**Setting up dev?** → [FRONTEND_CAMPAIGN_SETUP.md](FRONTEND_CAMPAIGN_SETUP.md) (Technical guide)

**Testing API?** → [CAMPAIGN_GENERATION_QUICK_TEST.md](CAMPAIGN_GENERATION_QUICK_TEST.md) (API testing)

## ✨ Key Features

### Campaign Generation
- ✅ 5-field form for target specifications
- ✅ Real-time AI processing with feedback
- ✅ 3 campaign variants (Safe/Aggressive/Creative)
- ✅ AI recommendation with detailed reasoning
- ✅ 8+ additional actionable recommendations

### RAG-Powered Context
- ✅ Upload brand documents (PDF, CSV, TXT)
- ✅ Semantic search across documents
- ✅ Vector embeddings (384-dimensional)
- ✅ Context-aware campaign generation

### Campaign Management
- ✅ Save all generated campaigns
- ✅ Track status (Draft → Executed)
- ✅ Campaign history with statistics
- ✅ Filter and search capabilities
- ✅ Delete old campaigns

### Export & Integration
- ✅ Export as Markdown (human-readable)
- ✅ Export as JSON (programmatic)
- ✅ Export as CSV (spreadsheet-friendly)
- ✅ Browser download integration

### Authentication & Security
- ✅ User registration and login
- ✅ JWT token authentication
- ✅ Password hashing with bcryptjs
- ✅ User data isolation
- ✅ Protected routes

## 📊 What's New (Latest Extension)

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

---

## 🏗️ Architecture

```
Frontend (React)    →    Backend (Express)    →    Database (MongoDB)
  ├─ Campaign Form       ├─ Campaign Routes      ├─ Campaigns
  ├─ Results Display     ├─ RAG Pipeline        ├─ Users
  └─ History Dashboard   ├─ LLM Integration     ├─ Documents
                         └─ Authentication      └─ Chunks
```

## 📁 Project Structure

```
appz/
├── frontend/                          # React + Vite application
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js
│   │   │   └── campaignApi.js           [NEW]
│   │   ├── components/
│   │   │   ├── CampaignForm.jsx         [NEW]
│   │   │   ├── CampaignResult.jsx       [NEW] 
│   │   │   ├── CampaignList.jsx         [NEW]
│   │   │   └── PrivateRoute.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx            [UPDATED]
│   │   │   ├── CampaignDashboard.jsx    [NEW]
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   └── App.jsx                      [UPDATED]
│   └── package.json
│
├── backend/                           # Express + Node.js application
│   ├── src/
│   │   ├── controllers/
│   │   │   └── campaignController.js    [UPDATED]
│   │   ├── models/
│   │   │   ├── Campaign.js              [NEW]
│   │   │   ├── User.js
│   │   │   ├── Document.js
│   │   │   └── Chunk.js
│   │   ├── routes/
│   │   │   ├── campaigns.js             [UPDATED]
│   │   │   ├── auth.js
│   │   │   ├── documents.js
│   │   │   └── search.js
│   │   ├── utils/
│   │   │   ├── promptTemplates.js
│   │   │   ├── llmService.js
│   │   │   ├── embeddings.js
│   │   │   ├── vectorStore.js
│   │   │   ├── chunking.js
│   │   │   └── fileParser.js
│   │   ├── middleware/
│   │   ├── config/
│   │   └── server.js                    [UPDATED]
│   └── package.json
│
└── Documentation
    ├── README.md                        [THIS FILE]
    ├── CAMPAIGN_GENERATOR_QUICKSTART.md      [5-min setup]
    ├── FRONTEND_CAMPAIGN_UI_GUIDE.md         [User guide]
    ├── FRONTEND_CAMPAIGN_SETUP.md            [Dev guide]
    ├── FRONTEND_EXTENSION_SUMMARY.md         [What's new]
    ├── CAMPAIGN_GENERATION_GUIDE.md          [API docs]
    ├── CAMPAIGN_GENERATION_QUICK_TEST.md     [Testing]
    └── CAMPAIGN_GENERATION_EXAMPLE_RESPONSE.md [Examples]
```

## 🚀 Getting Started (5 Minutes)

### Prerequisites
- Node.js 16+
- MongoDB (local or Atlas)
- npm/yarn

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with MongoDB URI
npm run dev
# Should see: Server running on port 5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
# Should see: ready in X ms, http://localhost:5173
```

### 3. Access Application
- Go to http://localhost:5173
- Register new account
- Start generating campaigns!

---

## 📚 Documentation

| Document | Purpose | Audience |
|----------|---------|----------|
| [CAMPAIGN_GENERATOR_QUICKSTART.md](CAMPAIGN_GENERATOR_QUICKSTART.md) | 5-minute setup with first campaign | Everyone |
| [FRONTEND_CAMPAIGN_UI_GUIDE.md](FRONTEND_CAMPAIGN_UI_GUIDE.md) | Complete feature walkthrough | Users |
| [FRONTEND_CAMPAIGN_SETUP.md](FRONTEND_CAMPAIGN_SETUP.md) | Technical development guide | Developers |
| [CAMPAIGN_GENERATION_GUIDE.md](CAMPAIGN_GENERATION_GUIDE.md) | Complete API reference | Developers |
| [CAMPAIGN_GENERATION_QUICK_TEST.md](CAMPAIGN_GENERATION_QUICK_TEST.md) | API testing with curl | Developers |
| [CAMPAIGN_GENERATION_EXAMPLE_RESPONSE.md](CAMPAIGN_GENERATION_EXAMPLE_RESPONSE.md) | Real example output | Everyone |
| [FRONTEND_EXTENSION_SUMMARY.md](FRONTEND_EXTENSION_SUMMARY.md) | What's new in latest update | Developers |

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

## 🎨 UI/UX

### Components
- **CampaignForm**: 5-field input form
- **CampaignResult**: Multi-tab results display
- **CampaignList**: History with stats
- **CampaignDashboard**: Master component

### Design
- Clean, modern interface
- Tailwind CSS styling
- Responsive (mobile/tablet/desktop)
- 3-tab navigation for results
- Expandable variant cards
- Loading states and error handling

### Accessibility
- Semantic HTML
- Clear labels
- Proper heading hierarchy
- Focus states
- ARIA annotations

## 🧪 Testing

### Quick Test
```bash
# See CAMPAIGN_GENERATION_QUICK_TEST.md for full test guide

# Example: Generate campaign with curl
curl -X POST http://localhost:5000/api/campaigns/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "objective": "Increase trial signups",
    "channel": "LinkedIn + Email",
    "audience": "Marketing directors",
    "product": "AI Marketing Platform",
    "tone": "Professional, innovative"
  }'
```

## 📈 Features Checklist

### ✅ Completed
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

### 🎯 Future Enhancements (Optional)
- [ ] Campaign duplication
- [ ] Advanced filtering
- [ ] Performance analytics
- [ ] Campaign scheduling
- [ ] Collaborative editing
- [ ] Mobile app
- [ ] Dark mode
- [ ] A/B testing integration

## 📊 Project Statistics

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

## 🚨 Troubleshooting

### App Won't Start
```bash
# Check Node.js version
node --version  # Should be 16+

# Check MongoDB
mongosh localhost:27017

# Clear cache and reinstall
rm -rf node_modules
npm install
```

### API Calls Failing
```bash
# Check backend running
curl http://localhost:5000/health

# Check token validity
# Check browser console for errors
# Check Network tab in DevTools
```

### Campaign Generation Slow
- Normal when retrieving context
- Limit document size if needed
- Check backend logs

See [FRONTEND_CAMPAIGN_SETUP.md](FRONTEND_CAMPAIGN_SETUP.md) for detailed troubleshooting.

## 🔗 Related Files

All documentation files are in root directory:
- Setup guides
- User manuals
- API documentation
- Testing guides
- Example responses

## 📞 Support

**For Users**
→ [FRONTEND_CAMPAIGN_UI_GUIDE.md](FRONTEND_CAMPAIGN_UI_GUIDE.md)

**For Developers**
→ [FRONTEND_CAMPAIGN_SETUP.md](FRONTEND_CAMPAIGN_SETUP.md)

**For API Integration**
→ [CAMPAIGN_GENERATION_GUIDE.md](CAMPAIGN_GENERATION_GUIDE.md)

**For Testing**
→ [CAMPAIGN_GENERATION_QUICK_TEST.md](CAMPAIGN_GENERATION_QUICK_TEST.md)

## 📄 File Overview

| File | Purpose |
|------|---------|
| README.md | Project overview (you are here) |
| CAMPAIGN_GENERATOR_QUICKSTART.md | 5-minute get-started guide |
| FRONTEND_CAMPAIGN_UI_GUIDE.md | User guide for features |
| FRONTEND_CAMPAIGN_SETUP.md | Developer setup & architecture |
| CAMPAIGN_GENERATION_GUIDE.md | Complete API documentation |
| CAMPAIGN_GENERATION_QUICK_TEST.md | API testing with examples |
| CAMPAIGN_GENERATION_EXAMPLE_RESPONSE.md | Real example output |
| FRONTEND_EXTENSION_SUMMARY.md | Latest update details |

## ✅ Getting Started Now

### I'm a User
👉 Start with [CAMPAIGN_GENERATOR_QUICKSTART.md](CAMPAIGN_GENERATOR_QUICKSTART.md)

### I'm a Developer
👉 Read [FRONTEND_CAMPAIGN_SETUP.md](FRONTEND_CAMPAIGN_SETUP.md)

### I want to Test API
👉 Follow [CAMPAIGN_GENERATION_QUICK_TEST.md](CAMPAIGN_GENERATION_QUICK_TEST.md)

### I want Examples
👉 See [CAMPAIGN_GENERATION_EXAMPLE_RESPONSE.md](CAMPAIGN_GENERATION_EXAMPLE_RESPONSE.md)

---

## 🎉 Status

**Version**: 1.0
**Status**: ✅ Production Ready
**Last Updated**: April 2026

**Next Up**:
1. Deploy to production
2. Gather user feedback
3. Optimize performance
4. Plan Phase 2 features

---

**Ready to generate amazing campaigns? [Get Started Now!](CAMPAIGN_GENERATOR_QUICKSTART.md)**

## File Descriptions

### Backend Files

- **server.js**: Express app initialization, middleware setup, route mounting
- **db.js**: MongoDB connection configuration
- **User.js**: Mongoose schema with password hashing and comparison methods
- **authController.js**: Register, login, and getMe logic
- **auth.js (middleware)**: JWT token verification and validation
- **auth.js (routes)**: Route definitions for auth endpoints

### Frontend Files

- **App.jsx**: Main component with routing and route protection
- **main.jsx**: React DOM rendering entry point
- **AuthContext.jsx**: Global auth state and functions
- **client.js**: Axios API client with request interceptors
- **PrivateRoute.jsx**: Component to protect routes from unauthorized access
- **Login.jsx**: Login page component
- **Register.jsx**: Registration page component
- **Dashboard.jsx**: Protected dashboard page

## Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running: `mongod`
- Check MONGODB_URI in .env file
- Verify connection string format

**Frontend Can't Reach Backend**
- Check VITE_API_URL in frontend .env.local
- Ensure backend is running on port 5000
- Check CORS settings in backend server.js

**Port Already in Use**
- Backend: Change PORT in .env (default: 5000)
- Frontend: Vite uses port 5173 by default, change in vite.config.js

**Token Issues**
- Clear localStorage: `localStorage.clear()` in browser console
- Ensure JWT_SECRET is set in .env
- Check token expiration (set to 7 days in authController.js)

## Next Steps

This is a bare-bones setup. To extend:

1. Add more API endpoints
2. Implement RAG functionality
3. Add user profiles
4. Create campaign management features
5. Add database indexes for performance
6. Deploy to production (Heroku, Vercel, etc.)

## Environment Variables

**Backend (.env):**
```
MONGODB_URI=mongodb://localhost:27017/campaignrag
JWT_SECRET=change_this_to_a_strong_secret_key
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Frontend (.env.local):**
```
VITE_API_URL=http://localhost:5000/api
```

## License

MIT
