# Campaign Generation with RAG - API Guide

## Overview

Generate AI-powered marketing campaigns using Retrieval-Augmented Generation (RAG). The system:

1. **Retrieves context** - Searches stored brand docs, past campaigns, performance data
2. **Builds prompt** - Creates optimized prompt with retrieved context
3. **Generates campaigns** - Uses LLM (OpenAI or mock) to generate variants
4. **Returns structured output** - Campaign brief + 3 variants (safe, aggressive, creative)

---

## API Endpoints

### 1. Generate Campaign (Primary)

**Endpoint:**
```
POST /api/campaigns/generate
```

**Headers:**
```
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "objective": "Increase brand awareness and drive conversions",
  "channel": "Social Media (Instagram & TikTok)",
  "audience": "Tech-savvy millennials aged 18-35",
  "product": "AI-powered marketing platform",
  "tone": "Innovative, friendly, professional"
}
```

**Response:**
```json
{
  "success": true,
  "campaign": {
    "input": {
      "objective": "Increase brand awareness and drive conversions",
      "channel": "Social Media (Instagram & TikTok)",
      "audience": "Tech-savvy millennials aged 18-35",
      "product": "AI-powered marketing platform",
      "tone": "Innovative, friendly, professional"
    },
    "output": {
      "campaignBrief": {
        "description": "A comprehensive social media campaign designed to increase brand awareness...",
        "keyMessages": [
          "AI-powered marketing platform delivers measurable results",
          "Innovation meets simplicity in every feature",
          "Join thousands of successful marketers"
        ],
        "callToAction": "Start your free trial today"
      },
      "variants": {
        "safe": {
          "headline": "Experience the Future of Marketing: Trusted by Industry Leaders",
          "copy": "Tech-savvy millennials deserve better marketing tools. Our platform combines cutting-edge AI with proven results...",
          "tone": "Professional, reassuring, trustworthy",
          "riskLevel": "Low"
        },
        "aggressive": {
          "headline": "Stop Wasting Time on Manual Marketing. Start Winning.",
          "copy": "Tired of outdated marketing tools? Your competitors are already using AI-powered platforms...",
          "tone": "Bold, provocative, ambitious",
          "riskLevel": "High"
        },
        "creative": {
          "headline": "Marketing Gets an AI Upgrade: Where Innovation Meets Purpose",
          "copy": "Imagine campaigns that write themselves. Where creativity meets strategy...",
          "tone": "Creative, inspiring, human-centric",
          "riskLevel": "Medium"
        }
      },
      "recommended": {
        "variant": "creative",
        "reasoning": "The 'Creative' variant is recommended for your target audience based on engagement patterns with tech-savvy millennials...",
        "confidence": "High"
      },
      "additionalRecommendations": [
        "A/B test all three variants to validate audience response",
        "Prioritize the Creative variant for initial rollout",
        "Use audience segmentation to customize messaging",
        "Monitor engagement metrics against historical baseline"
      ]
    },
    "context": {
      "documentsRetrieved": 8,
      "contextSources": "Brand docs, past campaigns, performance data",
      "recommendationBasis": "Retrieved context + market data"
    }
  }
}
```

---

### 2. Generate Variants Only

**Endpoint:**
```
POST /api/campaigns/variants
```

**Request:**
```json
{
  "objective": "Drive product launch awareness",
  "channel": "Email",
  "audience": "Existing customers",
  "product": "New SaaS feature",
  "tone": "Exciting, technical"
}
```

**Response:**
```json
{
  "success": true,
  "variants": {
    "safe": {...},
    "aggressive": {...},
    "creative": {...}
  },
  "comparison": {
    "riskProfile": {
      "safe": "Low",
      "aggressive": "High",
      "creative": "Medium"
    },
    "recommendedByContext": "creative",
    "reasoning": "Based on audience data..."
  }
}
```

---

### 3. Refine Campaign

**Endpoint:**
```
POST /api/campaigns/refine
```

**Request:**
```json
{
  "campaignData": {
    "campaignBrief": {...},
    "variants": {...},
    "recommended": {...}
  },
  "feedback": "Make the aggressive variant less confrontational. Include more specific ROI benefits.",
  "focusVariant": "aggressive"
}
```

**Response:**
```json
{
  "success": true,
  "refinedCampaign": {
    "campaignBrief": {...},
    "variants": {...},
    "recommended": {...}
  },
  "iterationInfo": {
    "feedbackIncorporated": true,
    "focusVariant": "aggressive",
    "requiresAdditionalRefinement": false
  }
}
```

---

### 4. Export Campaign

**Endpoint:**
```
POST /api/campaigns/export
```

**Request:**
```json
{
  "campaignData": {...},
  "format": "markdown"
}
```

**Supported Formats:**
- `json` - Returns structured JSON (default)
- `markdown` - Returns formatted Markdown
- `csv` - Returns CSV table

**Response:**
```json
{
  "success": true,
  "format": "markdown",
  "campaign": "# Campaign Brief\n\n..."
}
```

---

## How RAG Works

### Context Retrieval

When you generate a campaign, the system:

1. **Creates search queries** for your inputs:
   - `"brand guidelines [product]"`
   - `"[channel] campaign for [audience]"`
   - `"[objective] performance metrics"`
   - `"[product] messaging and positioning"`
   - `"[audience] audience insights"`

2. **Searches vector store** using semantic similarity:
   - Finds relevant chunks from your uploaded documents
   - Ranks by relevance (cosine similarity)

3. **Retrieves context** from MongoDB:
   - Past successful campaigns
   - Brand guidelines and voice
   - Audience data and insights
   - Performance metrics

4. **Builds prompt** with context:
   - Includes relevant brand information
   - Past campaign examples
   - Audience insights
   - Performance data

5. **Generates campaign** using LLM:
   - Uses retrieved context to inform recommendations
   - Respects brand voice from documents
   - Learns from past campaign performance

---

## Campaign Output Structure

### Campaign Brief
```json
{
  "description": "2-3 sentence executive summary",
  "keyMessages": ["message1", "message2", "message3"],
  "callToAction": "Primary call to action"
}
```

### Variants
Each variant (safe, aggressive, creative) includes:
```json
{
  "headline": "Campaign headline",
  "copy": "Body copy/ad copy",
  "tone": "Tone description",
  "riskLevel": "Low/Medium/High"
}
```

### Recommendation
```json
{
  "variant": "safe|aggressive|creative",
  "reasoning": "Why this variant is recommended",
  "confidence": "High/Medium/Low"
}
```

---

## Using Retrieved Context

### Context Sources

The system retrieves from three types of documents:

**1. Brand Context**
- Brand guidelines
- Voice and tone standards
- Company values
- Product positioning
- Key messaging

**2. Past Campaigns**
- Previous campaign copy
- Successful messaging
- Channel-specific performance
- Audience response data

**3. Performance Data**
- Engagement metrics
- Conversion rates by variant
- Channel performance
- Audience preferences
- Seasonal patterns

### How Context Influences Output

```
Context Retrieved → Embedded in Prompt → Influences LLM Output

Example:
- If brand docs say "use data-driven language"
  → Campaign emphasizes metrics and results
  
- If past emails performed 30% better with urgency
  → Campaign includes time-sensitive elements
  
- If audience data shows preference for storytelling
  → Campaign variants emphasize narratives
```

---

## Mock vs. Real LLM

### Mock Mode (Default)

**When:** `OPENAI_API_KEY` is not set

**Behavior:**
- Returns realistic-looking campaigns instantly
- No API calls or latency
- Good for testing and development
- Deterministic responses

**To use:** Just don't set `OPENAI_API_KEY` in `.env`

### Real LLM Mode

**When:** `OPENAI_API_KEY` is set

**Behavior:**
- Calls OpenAI GPT-4 or GPT-3.5-turbo
- Higher quality, more creative campaigns
- Slower (2-5 second response time)
- Costs ~$0.01-0.10 per campaign

**To use:** Set in `.env`:
```
OPENAI_API_KEY=sk-...
```

---

## Testing Guide

### Setup

```bash
# 1. Start backend
cd backend
npm run dev

# 2. Register and login
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Get token from login response
TOKEN="your_token"
```

### Upload Sample Documents

Create sample brand and campaign documents:

**brand.txt:**
```
Our brand voice is approachable yet authoritative.
We emphasize innovation, reliability, and customer success.
Our audience values data-driven insights and measurable results.
```

**past_campaigns.txt:**
```
Past Email Campaign 1: Subject line about ROI increased open rate by 25%
Past Campaign 2: Social posts with user testimonials saw 3x engagement
Past Campaign 3: Video content outperformed static images
```

**performance.txt:**
```
Q4 Email Campaigns: Average CTR 6.5%, Conversion rate 3.2%
Social Media: Videos see 8x more engagement than images
Audience: 65% prefer educational content, 35% prefer entertaining content
```

Upload these:
```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@brand.txt"

curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@past_campaigns.txt"

curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@performance.txt"
```

### Generate Campaign

```bash
curl -X POST http://localhost:5000/api/campaigns/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "objective": "Drive Q2 product launch awareness",
    "channel": "Email and Social Media",
    "audience": "Existing customers aged 25-45, tech-savvy professionals",
    "product": "New Analytics Dashboard",
    "tone": "Professional, innovative, data-driven"
  }' | jq
```

### Verify RAG Context

The response includes:
```json
"context": {
  "documentsRetrieved": 8,
  "contextSources": "Brand docs, past campaigns, performance data",
  "recommendationBasis": "Retrieved context + market data"
}
```

This shows the campaign used actual retrieved documents!

---

## Campaign Variants Explained

### Safe Variant
- **Best for:** Risk-averse brands, established products
- **Approach:** Proven, professional, trustworthy
- **Strengths:** Lower risk, brand-safe, predictable
- **Weaknesses:** May seem generic, lower viral potential

### Aggressive Variant
- **Best for:** Growth-focused companies, younger audiences
- **Approach:** Bold, disruptive, ambitious
- **Strengths:** High engagement, memorable, attention-grabbing
- **Weaknesses:** May alienate some segments, controversy risk

### Creative Variant
- **Best for:** Innovative brands, engaged communities
- **Approach:** Unique, storytelling-driven, emotional
- **Strengths:** Differentiated, shareable, emotional connection
- **Weaknesses:** Requires strong creative execution, risky if misaligned

---

## Best Practices

### 1. Upload Quality Context Documents

The better your source documents, the better your campaigns:
- Include brand guidelines (voice, values, positioning)
- Upload past successful campaigns
- Include audience insights and performance data
- Add competitive intelligence if available

### 2. Specific Inputs

Be specific in your request:
```json
// Good
{
  "objective": "Increase email signups by 40% from cold outreach",
  "channel": "LinkedIn Paid Ads",
  "audience": "B2B SaaS CTOs, 30-50, enterprise focus",
  "product": "Marketing Automation Platform",
  "tone": "Technical, ROI-focused, educational"
}

// Vague
{
  "objective": "more leads",
  "channel": "ads",
  "audience": "executives",
  "product": "our product",
  "tone": "professional"
}
```

### 3. A/B Test Variants

Always test multiple variants:
```bash
# Use the output to create actual campaigns
# Run A/B test on "safe" vs "creative"
# Measure engagement and conversion
# Use results to refine future campaigns
```

### 4. Iterate with Feedback

Refine based on results:
```json
{
  "campaignData": {...},
  "feedback": "Add more urgency messaging. Include specific ROI statistics from our documentation.",
  "focusVariant": "aggressive"
}
```

### 5. Monitor Context Freshness

Keep documents updated:
- Add recent campaign results
- Update audience insights
- Include new brand guidelines
- Add competitive intelligence

---

## Error Handling

### Missing Required Fields

```json
{
  "message": "Missing required fields: objective, channel, audience, product, tone"
}
```

**Solution:** Include all 5 required fields

### No Context Retrieved

```json
"context": {
  "documentsRetrieved": 0,
  "contextSources": "Limited context available"
}
```

**Solution:** Upload brand documents to improve context

### LLM API Error (Real Mode)

```json
{
  "message": "LLM generation failed: Invalid API key"
}
```

**Solution:** 
- Check OPENAI_API_KEY in .env
- Verify API key is valid
- Check account has available credits

---

## Production Deployment

### Configuration

```bash
# In production .env:
OPENAI_API_KEY=sk-proj-...          # For real campaigns
NODE_ENV=production
MONGODB_URI=mongodb+srv://...       # MongoDB Atlas
JWT_SECRET=<strong-random-secret>
```

### Performance Optimization

1. **Cache campaigns**
   - Store generated campaigns in database
   - Don't regenerate identical requests

2. **Batch operations**
   - Generate multiple variants in parallel
   - Combine similar queries

3. **Monitor tokens**
   - Track OpenAI API usage
   - Set spending limits
   - Consider GPT-3.5-turbo for cost savings

4. **Rate limiting**
   - Limit campaign generation per user/hour
   - Queue long-running jobs

---

## Architecture Diagram

```
User Request
    ↓
/api/campaigns/generate
    ↓
Validate Inputs
    ↓
Generate Search Queries
    ↓
RAG: Semantic Search (Vector Store)
    ↓
Retrieve Documents (MongoDB)
    ↓
Build Context → Create Prompt
    ↓
Call LLM (OpenAI or Mock)
    ↓
Parse Response
    ↓
Return Structured Campaign JSON
```

---

## Sample Campaign Output

```json
{
  "campaignBrief": {
    "description": "A comprehensive email and social media campaign designed to drive Q2 Analytics Dashboard launch awareness among existing customers aged 25-45. This campaign leverages proven messaging patterns and emphasizes data-driven value propositions that resonate with tech-savvy professionals.",
    "keyMessages": [
      "New Analytics Dashboard delivers 10x better insights at a fraction of the cost",
      "Real-time data visualization enables faster, better business decisions",
      "Join 5,000+ companies already using our platform for smarter analytics"
    ],
    "callToAction": "Schedule a 15-minute demo of the new Dashboard today"
  },
  "variants": {
    "safe": {
      "headline": "Experience More Powerful Analytics: Our Dashboard Gets an Upgrade",
      "copy": "We're excited to introduce our completely redesigned Analytics Dashboard. Built on customer feedback and months of development, this new tool delivers the insights you need, faster than ever before...",
      "tone": "Professional, exciting, trustworthy",
      "riskLevel": "Low"
    },
    "aggressive": {
      "headline": "Your Analytics Just Got 10x Better. Are You Ready?",
      "copy": "Tired of scattered insights and slow dashboards? We've completely reimagined analytics. Faster. Smarter. More powerful. Your competitors are already moving...",
      "tone": "Bold, urgent, competitive",
      "riskLevel": "High"
    },
    "creative": {
      "headline": "Analytics Gets Its Moment to Shine",
      "copy": "Great insights should spark inspiration, not frustration. Our new Analytics Dashboard transforms how you see your data—turning numbers into narratives, metrics into meaning...",
      "tone": "Inspiring, human-centric, visionary",
      "riskLevel": "Medium"
    }
  },
  "recommended": {
    "variant": "creative",
    "reasoning": "Based on audience insights showing a 65% preference for educational and inspiring content, combined with past campaign performance data that shows story-driven narratives generate 3x more engagement, the Creative variant is recommended for initial rollout.",
    "confidence": "High"
  },
  "additionalRecommendations": [
    "A/B test Creative vs. Safe variants to validate data-driven audience preferences",
    "Segment audience by company size and use appropriate variant (Enterprise: Safe, SMB: Creative)",
    "Include concrete ROI metrics from case studies in email body",
    "Schedule email send for Tuesday 10am based on historical engagement data",
    "Create carousel post format for LinkedIn (shown to generate 2x clicks vs. static)"
  ]
}
```

---

## Next Steps

1. Upload brand documents
2. Generate first campaign
3. Verify context was retrieved
4. A/B test variants
5. Monitor performance
6. Refine based on results
7. Build template library

---

See RAG_API_REFERENCE.md for general RAG search endpoints.
