# Frontend Campaign Generator - Setup & Integration Guide

## 📦 New Files Created

### Components (in `frontend/src/components/`)

1. **CampaignForm.jsx**
   - Form for campaign input (objective, channel, audience, product, tone)
   - Handles form validation and submission
   - Calls `/api/campaigns/generate` endpoint
   - Shows loading state with spinner
   - Displays error messages

2. **CampaignResult.jsx**
   - Displays generated campaign results
   - Three tabs: Brief, Variants, Recommendation
   - Expandable variant cards with full details
   - Export buttons (Markdown, JSON, CSV)
   - Shows technical metadata and source documents

3. **CampaignList.jsx**
   - Lists all campaigns for current user
   - Shows statistics (total, by status)
   - Filter by status (draft, approved, scheduled, executed, archived)
   - Click to view campaign details
   - Delete functionality

### Pages (in `frontend/src/pages/`)

1. **CampaignDashboard.jsx**
   - Main campaign generator page
   - Navigation bar with logout
   - Three views: generator, history, detail
   - Combines form, results, and list
   - Handles export and campaign selection

### API Client (in `frontend/src/api/`)

1. **campaignApi.js**
   - Centralized API functions for campaigns
   - Functions:
     - `generateCampaign(data)` - Generate new campaign
     - `generateCampaignVariants(data)` - Get all variants
     - `refineCampaign(data, feedback, variant)` - Refine existing campaign
     - `exportCampaign(data, format)` - Export campaign
     - `getCampaigns(status, limit, skip)` - Get campaign list
     - `getCampaignById(id)` - Get single campaign
     - `updateCampaign(id, updates)` - Update campaign status/notes
     - `deleteCampaign(id)` - Delete campaign
     - `getCampaignStats()` - Get statistics

### Updated Files

1. **App.jsx**
   - Added CampaignDashboard route (`/campaigns`)
   - Changed default route from `/dashboard` to `/campaigns`
   - Integrated PrivateRoute protection

2. **Dashboard.jsx**
   - Enhanced with proper navigation
   - Added links to Campaign Generator
   - Added feature cards explaining capabilities
   - Improved styling with Tailwind CSS
   - Shows how RAG works with feature overview

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ installed
- Backend running on `http://localhost:5000`
- Logged in user with valid JWT token

### Installation

The components are already created. They'll automatically load when the frontend starts.

### Running the Frontend

```bash
cd frontend
npm install  # If dependencies were updated
npm run dev  # Start Vite development server
```

Frontend will run on `http://localhost:5173` by default.

### Accessing the Campaign Generator

1. Register/Login with valid credentials
2. Click "Campaign Generator" in navigation
3. Or go directly to `http://localhost:5173/campaigns`

## 🔌 API Integration

### Backend Requirements

The frontend expects these endpoints to be available:

**Campaign Generation**
```
POST /api/campaigns/generate
- Input: { objective, channel, audience, product, tone }
- Returns: { campaign: { id, input, output, context } }
```

**Campaign Management**
```
GET /api/campaigns                    # List campaigns
GET /api/campaigns/:campaignId         # Get single campaign
PATCH /api/campaigns/:campaignId       # Update campaign
DELETE /api/campaigns/:campaignId      # Delete campaign
GET /api/campaigns/stats               # Get statistics
```

**Campaign Operations**
```
POST /api/campaigns/variants           # Get all variants
POST /api/campaigns/refine             # Refine campaign
POST /api/campaigns/export             # Export campaign
```

All endpoints require authentication header:
```
Authorization: Bearer <jwt_token>
```

### Token Management

Tokens are automatically managed via:
- Stored in `localStorage` with key `token`
- Automatically injected in `api/campaignApi.js`
- Sent with every API request
- Cleared on logout

## 📋 File Structure

```
frontend/
├── src/
│   ├── api/
│   │   ├── client.js                    # Axios instance
│   │   └── campaignApi.js               # Campaign API functions [NEW]
│   ├── components/
│   │   ├── PrivateRoute.jsx             # Protected routes
│   │   ├── CampaignForm.jsx             # Form component [NEW]
│   │   ├── CampaignResult.jsx           # Results display [NEW]
│   │   └── CampaignList.jsx             # Campaign list [NEW]
│   ├── context/
│   │   └── AuthContext.jsx              # Auth state
│   ├── pages/
│   │   ├── Login.jsx                    # Login page
│   │   ├── Register.jsx                 # Register page
│   │   ├── Dashboard.jsx                # Home page [UPDATED]
│   │   └── CampaignDashboard.jsx        # Campaign page [NEW]
│   ├── App.jsx                          # Router setup [UPDATED]
│   ├── main.jsx                         # Entry point
│   └── index.css                        # Tailwind imports
├── vite.config.js
├── package.json
└── tailwind.config.js
```

## 🎨 Component Architecture

### CampaignForm Component Flow

```
CampaignForm
  ├── State: formData, error, isLoading
  ├── Input Fields (5)
  ├── Validation
  ├── API Call to /api/campaigns/generate
  └── Callback: onCampaignGenerated(campaign)
```

### CampaignResult Component Flow

```
CampaignResult
  ├── Props: campaign, onExport callback
  ├── Tabs: Brief, Variants, Recommendation
  ├── Expandable variant cards
  ├── Export buttons with download logic
  └── Technical details (expandable)
```

### CampaignList Component Flow

```
CampaignList
  ├── State: campaigns, stats, isLoading, filter
  ├── Statistics cards
  ├── Filter buttons (by status)
  ├── API calls: getCampaigns(), getCampaignStats()
  ├── Campaign cards with delete
  └── Callback: onSelectCampaign(campaign)
```

### CampaignDashboard Master Component Flow

```
CampaignDashboard
  ├── State: campaign, activeView, selectedCampaign
  ├── Header & Navigation
  ├── Views:
  │   ├── Generator (CampaignForm + CampaignResult)
  │   ├── History (CampaignList)
  │   └── Detail (Single campaign details)
  ├── Methods:
  │   ├── handleCampaignGenerated()
  │   ├── handleExport()
  │   ├── handleSelectCampaign()
  │   └── handleBack()
  └── Integration with all sub-components
```

## 🔄 Data Flow

### Campaign Generation Flow

```
User fills form
    ↓
CampaignForm validates
    ↓
API call: POST /api/campaigns/generate
    ↓
Backend: generateCampaign()
  - Retrieve context from RAG
  - Build prompt with context
  - Call LLM (OpenAI or mock)
  - Save to MongoDB
  - Return campaign + metadata
    ↓
Frontend: onCampaignGenerated callback
    ↓
CampaignResult displays output
```

### History/List Flow

```
User clicks "Campaign History"
    ↓
CampaignList mounts
    ↓
API call: GET /api/campaigns + GET /api/campaigns/stats
    ↓
Backend:
  - Query MongoDB for user campaigns
  - Count by status
  - Get recent campaigns
    ↓
Frontend: Display stats + list
    ↓
User clicks campaign
    ↓
onSelectCampaign triggers view change
```

## 🎯 Customization Guide

### Styling

All components use Tailwind CSS classes. To customize:

1. **Colors**: Edit Tailwind classes (blue-600, gray-900, etc.)
2. **Spacing**: Modify padding/margins (px-4, py-2, etc.)
3. **Typography**: Change text size (text-lg, font-bold, etc.)

Example:
```jsx
// Change button color from blue-600 to purple-600
className="bg-blue-600 hover:bg-blue-700"
// becomes
className="bg-purple-600 hover:bg-purple-700"
```

### Form Fields

To add new fields to CampaignForm:

1. Add to formData state:
```jsx
const [formData, setFormData] = useState({
  objective: '',
  newField: ''  // Add here
});
```

2. Add input element:
```jsx
<input
  type="text"
  name="newField"
  value={formData.newField}
  onChange={handleChange}
  placeholder="..."
/>
```

3. Update API call to include field

### Export Formats

To add new export format in CampaignResult:

1. Add button:
```jsx
<button onClick={() => onExport?.('xml')} ...>
  📁 Export as XML
</button>
```

2. Update backend `exportCampaign` endpoint to handle format

### Tabs/Views

To add new tab to CampaignResult:

1. Add tab button:
```jsx
<button onClick={() => setActiveTab('newTab')} ...>
  New Tab
</button>
```

2. Add conditional render:
```jsx
{activeTab === 'newTab' && (
  <div>Content here</div>
)}
```

## 🧪 Testing Tips

### Local Testing (Without Real API)

1. Use mock backend responses
2. Hardcode campaign data in component state
3. Test UI without API calls

### API Integration Testing

1. Ensure backend is running
2. Use quick test commands from `CAMPAIGN_GENERATION_QUICK_TEST.md`
3. Check Network tab in browser DevTools
4. Verify request/response headers

### Common Test Cases

- [ ] Generate campaign with all fields
- [ ] Missing required field validation
- [ ] Upload documents and generate with context
- [ ] View campaign history and statistics
- [ ] Filter campaigns by status
- [ ] Delete a campaign
- [ ] Export in all 3 formats
- [ ] Click back from detail view
- [ ] Responsive design on mobile

## 🚨 Error Handling

### Frontend Error Handling

**CampaignForm**
- Validation errors on submit
- Network error display
- Partial error recovery

**CampaignList**
- Empty state when no campaigns
- Loading state with spinner
- Error messages from API

**CampaignResult**
- Missing data fallbacks
- Expandable sections for long content
- Export error notifications

### Debug Mode

To enable detailed logging:

1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for API calls
4. Inspect Elements tab for markup

## 📚 Related Files

- **Backend Routes**: `backend/src/routes/campaigns.js`
- **Backend Controller**: `backend/src/controllers/campaignController.js`
- **Backend Model**: `backend/src/models/Campaign.js`
- **API Documentation**: `CAMPAIGN_GENERATION_GUIDE.md`
- **Quick Tests**: `CAMPAIGN_GENERATION_QUICK_TEST.md`
- **Example Response**: `CAMPAIGN_GENERATION_EXAMPLE_RESPONSE.md`
- **UI Guide**: `FRONTEND_CAMPAIGN_UI_GUIDE.md` (This file)

## ✅ Checklist for Production

- [ ] Backend endpoints tested and working
- [ ] Authentication tokens validated
- [ ] Error handling implemented
- [ ] Loading states visible to users
- [ ] Mobile responsive tested
- [ ] Export functionality works in all browsers
- [ ] Campaign history displays correctly
- [ ] Database indexes created (userId, status)
- [ ] Environment variables set (.env)
- [ ] API error messages user-friendly
- [ ] XSS/CSRF protections checked
- [ ] Rate limiting configured
- [ ] Backup and recovery plan

## 🐛 Troubleshooting

### Components Not Showing

Check:
```bash
# Verify files exist
ls frontend/src/components/Campaign*.jsx
ls frontend/src/pages/CampaignDashboard.jsx
```

### API Calls Failing

Check:
1. Backend running: `curl http://localhost:5000/health`
2. Token valid: Check localStorage in DevTools
3. CORS enabled in backend
4. Network tab shows request/response

### Styling Issues

Check:
1. Tailwind CSS classes spelled correctly
2. Tailwind config includes `stories` and `components` paths
3. No CSS conflicts from other stylesheets

### Form Not Submitting

Check:
1. All 5 fields have values
2. No JavaScript console errors
3. Backend endpoint is available
4. POST request returns valid JSON

## 📞 Support Resources

- Vue official docs: https://vitejs.dev/
- React docs: https://react.dev/
- Tailwind CSS: https://tailwindcss.com/
- Axios docs: https://axios-http.com/
- This project's API docs: `CAMPAIGN_GENERATION_GUIDE.md`
