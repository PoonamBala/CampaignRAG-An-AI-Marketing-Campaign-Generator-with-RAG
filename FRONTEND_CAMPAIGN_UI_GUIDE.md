# Campaign Generator Frontend - User Guide

## Overview

The Campaign Generator UI provides an intuitive interface for creating AI-powered marketing campaigns using the RAG (Retrieval-Augmented Generation) system. This guide covers all features and how to use them effectively.

## 📍 Navigation

### Main Routes

- **Home (`/dashboard`)**: Dashboard with overview and key features
- **Campaign Generator (`/campaigns`)**: Main campaign creation interface
- **Login (`/login`)**: Authentication
- **Register (`/register`)**: New user registration

### Navigation Bar

Located at the top of every page:
- Logo (click to go to home)
- Home link
- Campaign Generator link
- User name display
- Logout button

## 🎯 Campaign Generator Features

### View 1: Generate New Campaign

The main view for creating campaigns. Split into two sections:

#### Left Column: Campaign Form
Fields to fill in:

1. **Campaign Objective** (required)
   - Textbox with placeholder
   - Example: "Increase product trial signups by 50% and drive enterprise demos"
   - Describe what you want to achieve

2. **Channel** (required)
   - Text input
   - Example: "LinkedIn + Email", "Instagram", "TikTok", etc.
   - Which platforms will the campaign use?

3. **Target Audience** (required)
   - Textbox with placeholder
   - Example: "Marketing directors and CMOs at mid-market B2B companies, 35-55 years old, tech-forward"
   - Be specific about demographics and psychographics

4. **Product/Service** (required)
   - Textbox
   - Example: "AI-Powered Marketing Automation Platform"
   - What are you promoting?

5. **Campaign Tone** (required)
   - Text input
   - Example: "Professional, innovative, data-driven, trustworthy"
   - What tone should the campaign have?

**Submit Button**
- "Generate Campaign" button at bottom
- Shows loading state with spinner while processing
- Disabled when loading

#### Right Column: Campaign Results
Displays one of three states:

**Empty State**
- Shows when no campaign has been generated yet
- Displays helpful tip about providing detailed information
- Encourages user to start by filling the form

**Loading State**
- Shows in the results area while campaign is generating
- Uses spinner animation
- Indicates processing is happening

**Campaign Details**
- See "Campaign Result Display" section below

### View 2: Campaign History

Shows all campaigns created by the user.

**Statistics Cards**
- Total Campaigns: Overall count
- Draft: Campaigns not yet finalized
- Approved: Campaigns approved for use
- Scheduled: Campaigns scheduled for execution
- Executed: Campaigns that have been run
- Archived: Campaigns in archive

**Filter Buttons**
- "All" - Show all campaigns
- "Draft", "Approved", "Scheduled", "Executed", "Archived" - Filter by status
- Click any button to filter the list

**Campaign List**
Each campaign card shows:
- Campaign objective (truncated if long)
- Product and channel as tags
- Status badge (color-coded)
- Recommended variant badge (⭐)
- Creation date
- Delete button

**Campaign Details**
- Click any campaign to view full details
- Shows all input parameters and metadata
- Can return to history list

## 📊 Campaign Result Display

When a campaign is generated, you see the full results with multiple tabs:

### Tab 1: Campaign Brief
Displays the overall campaign strategy:

**Campaign Brief**
- Full description of the campaign approach
- Explains the strategy and approach

**Key Messages** (4-5 points)
- Core value propositions
- Main selling points
- Key benefits

**Call to Action**
- Primary action the campaign wants the audience to take
- Example: "Schedule a 30-minute demo with our product team"

### Tab 2: Variants

Shows all 3 campaign variants in expandable cards:

**Variant Cards**
- Safe (⭐ if recommended)
- Aggressive (⭐ if recommended)
- Creative (⭐ if recommended)

**Card Header**
- Variant name (capitalized)
- Headline preview
- Risk level badge (Low/Medium/High with color coding)
- Expand button
- Star if recommended

**Expanded Details**
- **Headline**: Main campaign headline
- **Copy**: Full campaign body copy
- **Tone**: Voice and style of the variant
- **Best For**: Target audience type this variant works best for

**Variant Comparison**
- Safe: Low risk, proven results approach
- Aggressive: High risk, competitive pressure approach
- Creative: Medium risk, inspiring narrative approach

### Tab 3: Recommendation

AI's recommendation for which variant to use:

**Recommendation Card** (highlighted in blue)
- ⭐ Shows recommended variant name
- Confidence level (High/Medium/Low)
- Detailed reasoning explaining why this variant is recommended
- Based on analysis of your audience and context

**Additional Recommendations** (numbered list)
- 8-10 actionable next steps
- Includes:
  - Segmentation strategy (which variant for which segments)
  - Email sequencing recommendations
  - Channel-specific strategies
  - Testing approaches
  - Personalization opportunities
  - Follow-up cadence
  - Optimal timing
  - Subject line suggestions

**Technical Details** (expandable)
- Model used (GPT-4, mock, etc.)
- Processing time
- Documents retrieved
- Source documents with relevance scores

### Export Options

Three export buttons available:

1. **Export as Markdown** (📄)
   - Clean, human-readable format
   - Includes all campaign information
   - Good for sharing with teams
   - Easy to edit in any text editor

2. **Export as JSON** (⚙️)
   - Complete structured data
   - Includes all metadata
   - Good for integration with tools
   - Easy to parse and process

3. **Export as CSV** (📊)
   - Tabular format
   - Good for spreadsheets
   - Quick comparison of variants
   - Best for performance tracking

## 🎨 UI/UX Features

### Responsive Design
- Works on desktop, tablet, and mobile
- Grid layouts adapt to screen size
- Touch-friendly buttons and inputs

### Color Coding
- **Blue**: Primary actions, recommended items
- **Yellow**: Warnings, medium priority
- **Red**: Deletions, high risk, errors
- **Green**: Success, low risk
- **Purple**: Statistics cards
- **Gray**: Secondary, neutral elements

### Loading States
- Spinner animations
- Disabled form inputs during processing
- Visual feedback on buttons
- Progress indication

### Accessibility
- Semantic HTML structure
- Clear labels on all form inputs
- Proper heading hierarchy
- Focus states on interactive elements
- ARIA labels where needed

## 💡 Tips for Best Results

### Campaign Form Tips

1. **Be Specific with Objective**
   - Not just "increase sales" but "increase trial signups by 50%"
   - Include quantifiable goals
   - Mention timeframe if relevant

2. **Describe Audience in Detail**
   - Include age, role, company size
   - Mention pain points if known
   - Include buying behavior if relevant
   - More specificity = better campaigns

3. **Use Your Uploaded Documents**
   - Upload brand guidelines before generating
   - Include past campaigns for reference
   - Add performance data if available
   - The AI uses this context to create relevant campaigns

4. **Provide Quality Tone Description**
   - List 3-5 descriptive words
   - Consider brand personality
   - Think about audience preferences
   - Be consistent with brand voice

### Campaign Selection Tips

1. **Using Variants**
   - Safe: For conservative, risk-averse audiences
   - Aggressive: For competitive markets, growth-focused companies
   - Creative: For innovative brands, engaged audiences
   - Don't always pick "recommended" - consider your needs

2. **Testing Recommendations**
   - A/B test variants on small portions first
   - Use segmentation to test different variants
   - Track which variant performs best
   - Update status in history for tracking

3. **Export Strategy**
   - Markdown for sharing with team
   - JSON for tool integration
   - CSV for comparison and tracking
   - Export multiple formats for different use cases

## 🔧 Workflow Example

### Complete Workflow

1. **Prepare Content**
   - Collect brand documents
   - Gather past campaigns
   - Get performance data
   - Upload to system (via API/backend)

2. **Generate Campaign**
   - Go to Campaign Generator
   - Fill in all 5 required fields
   - Click "Generate Campaign"
   - Wait for AI to process

3. **Review Results**
   - Read campaign brief
   - Compare all 3 variants
   - Read AI recommendation and reasoning
   - Review additional recommendations

4. **Make Decision**
   - Select variant based on your goals
   - Consider audience and market
   - Review additional recommendations
   - Plan execution

5. **Export & Use**
   - Export in needed format
   - Share with marketing team
   - Customize as needed
   - Execute campaign

6. **Track Performance**
   - Document how campaign performs
   - Update campaign status in history
   - Add performance metrics
   - Use insights for next campaigns

## 🐛 Common Issues & Solutions

### Issue: Form Submit Button Stays Disabled
**Solution**: Check that all 5 fields are filled in. The button will enable once all required fields have text.

### Issue: Campaign Takes Long Time to Generate
**Solution**: Processing takes longer when retrieving context from large document libraries. This is normal. The system is finding relevant documents to inform the campaign.

### Issue: Export Not Downloading
**Solution**: Check your browser's download settings. Allow downloads from localhost if prompted. Try a different format if one doesn't work.

### Issue: Campaigns Not Saving to History
**Solution**: Ensure you're logged in and have a valid session token. Refresh the page and try again. Check browser console for errors.

### Issue: Campaign Recommendation Seems Off
**Solution**: Upload more context documents for better recommendations. The more brand/campaign/performance data you provide, the better the AI recommendations.

## 📱 Mobile Usage

The campaign generator works on mobile but is optimized for desktop:

**Desktop Layout**
- Form on left, results on right
- Ideal for side-by-side comparison

**Mobile Layout**
- Form and results stack vertically
- Variants can be collapsed/expanded to save space
- All functionality available

**Recommendation**: Use desktop for best experience, especially when comparing variants side-by-side.

## 🔐 Data & Privacy

- All campaigns are saved to your user account
- Only you can see your campaigns
- Logout to clear your session
- Used contact information is not stored by default

## ⚙️ Developer Integration

The component structure makes it easy to integrate:

- **CampaignForm**: Handles input and API calls
- **CampaignResult**: Displays full campaign output
- **CampaignList**: Shows campaign history
- **CampaignDashboard**: Main page combining all components

For API integration documentation, see `CAMPAIGN_GENERATION_GUIDE.md`.

## 📞 Support

Issues or suggestions?
- Check the API documentation in `CAMPAIGN_GENERATION_GUIDE.md`
- Review test commands in `CAMPAIGN_GENERATION_QUICK_TEST.md`
- Check example responses in `CAMPAIGN_GENERATION_EXAMPLE_RESPONSE.md`
