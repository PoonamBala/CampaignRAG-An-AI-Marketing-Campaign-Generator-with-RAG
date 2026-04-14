# Campaign Generation - Quick Test Commands

## Setup

```bash
# Get your token first
TOKEN="your_jwt_token"

# Set backend URL
API="http://localhost:5000/api"
```

---

## Quick Test (2 minutes)

### 1. Generate a Campaign

```bash
curl -X POST $API/campaigns/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "objective": "Increase product awareness",
    "channel": "Social Media",
    "audience": "Tech professionals aged 25-40",
    "product": "AI Marketing Platform",
    "tone": "Professional and innovative"
  }' | jq .campaign.output
```

**What happens:**
1. System searches for relevant documents (brand, campaigns, performance data)
2. Builds context-aware prompt
3. Generates 3 campaign variants
4. Returns recommended variant with reasoning

---

## Advanced Testing

### 2. Generate with RAG Context

Upload sample documents first, then generate:

**Upload brand document:**
```bash
cat > brand.txt << 'EOF'
Brand Voice: Data-driven, customer-centric, innovative
Key Values: Trust, transparency, innovation
Positioning: The easiest marketing automation platform
Target Audience Primary Motivation: ROI and measurable results
EOF

curl -X POST $API/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@brand.txt"
```

**Upload past campaign document:**
```bash
cat > campaigns.txt << 'EOF'
Q1 Social Campaign: "Automate Everything Headline"
- Received 15,000 impressions, 2.5% CTR
- Best performing content: Short format video clips
- Audience response: Positive for "time-saving" messaging

Q1 Email Campaign: "ROI Focused"
- Open rate: 28%, CTR: 5.8%
- Best performing element: Case study with specific metrics
- Audience: Prefer educational over promotional
EOF

curl -X POST $API/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@campaigns.txt"
```

**Upload performance data:**
```bash
cat > performance.txt << 'EOF'
Social Media Metrics:
- Video content: 8x engagement vs images
- Stories format: 12% CTR
- Carousel posts: 6% CTR

Email Metrics:
- Data-driven subject lines: 35% open rate
- Short copy vs long: 2x CTR for short
- CTA button style: Action-focused beats link text by 3x

Audience Preferences:
- 70% prefer case studies over testimonials
- 55% engage with educational content
- Time-saving messaging drives 2x conversion
EOF

curl -X POST $API/documents/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@performance.txt"
```

**Now generate campaign using context:**
```bash
curl -X POST $API/campaigns/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "objective": "Increase email signups by 50%",
    "channel": "Email + Social Media",
    "audience": "B2B marketing directors, mid-market companies",
    "product": "Marketing Automation Platform",
    "tone": "Data-driven and customer-focused"
  }' | jq .
```

**Check if context was used:**
```bash
curl -X POST $API/campaigns/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}' | jq '.campaign.context'

# Should show:
# "documentsRetrieved": 8,
# "contextSources": "Brand docs, past campaigns, performance data"
```

---

## Testing Different Scenarios

### E-commerce Product Launch

```bash
curl -X POST $API/campaigns/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "objective": "Drive first month sales and build email list",
    "channel": "Instagram and TikTok",
    "audience": "Fashion-conscious Gen Z (18-28), mobile-first",
    "product": "Sustainable Fashion Accessories Line",
    "tone": "Trendy, authentic, eco-conscious"
  }' | jq .campaign.output.variants.recommended
```

### B2B SaaS Landing Page

```bash
curl -X POST $API/campaigns/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "objective": "Increase qualified demo requests 40%",
    "channel": "LinkedIn Ads",
    "audience": "Enterprise CTOs and VP Engineering, Fortune 500",
    "product": "Infrastructure Management Platform",
    "tone": "Technical, ROI-focused, authoritative"
  }' | jq .campaign.output
```

### Nonprofit Fundraising

```bash
curl -X POST $API/campaigns/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "objective": "Raise $50K for environmental education",
    "channel": "Email list and Facebook",
    "audience": "Existing donors aged 35-65, environmentally conscious",
    "product": "Environmental Education Program",
    "tone": "Inspiring, hopeful, mission-driven"
  }' | jq .campaign.output.recommended
```

---

## Refining Campaigns

### Step 1: Generate initial campaign

```bash
curl -X POST $API/campaigns/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "objective": "Increase brand awareness",
    "channel": "Twitter/X",
    "audience": "Tech entrepreneurs",
    "product": "Dev Tools Platform",
    "tone": "Tech-savvy and approachable"
  }' > campaign.json
```

### Step 2: Refine based on feedback

```bash
curl -X POST $API/campaigns/refine \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "campaignData": '"$(cat campaign.json | jq '.campaign.output')"',
    "feedback": "Make the aggressive variant less hostile. Add more specific technical benefits. Focus on developer experience.",
    "focusVariant": "aggressive"
  }' | jq .refinedCampaign
```

---

## Export Formats

### JSON Export (Default)

```bash
curl -X POST $API/campaigns/export \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "campaignData": {...},
    "format": "json"
  }' | jq
```

### Markdown Export (For docs/presentations)

```bash
curl -X POST $API/campaigns/export \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "campaignData": {...},
    "format": "markdown"
  }' | jq -r '.campaign' > campaign.md

# Now you have a formatted markdown file
cat campaign.md
```

### CSV Export (For spreadsheets)

```bash
curl -X POST $API/campaigns/export \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "campaignData": {...},
    "format": "csv"
  }' | jq -r '.campaign' > campaign.csv

# Open in Excel/Google Sheets
```

---

## Testing All Variants Comparison

```bash
curl -X POST $API/campaigns/variants \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "objective": "Launch new product",
    "channel": "YouTube Ads",
    "audience": "Content creators aged 18-35",
    "product": "Video Editing Software",
    "tone": "Creative and professional"
  }' | jq .variants
```

**Output shows all 3 variants with:**
- Headlines
- Copy
- Tone descriptions
- Risk levels
- Recommendations

---

## Real vs Mock Mode

### Check which mode is active

```bash
# If OPENAI_API_KEY is not set, you're in MOCK mode
# Check the metadata in response:
curl -X POST $API/campaigns/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}' | jq '.campaign.output.metadata'

# Should show:
# "model": "mock"  OR  "model": "gpt-4"
```

### Switch to Real LLM

1. Get OpenAI API key from https://platform.openai.com
2. Add to backend/.env:
   ```
   OPENAI_API_KEY=sk-proj-...
   ```
3. Restart backend: `npm run dev`
4. Now uses GPT-4 instead of mock

---

## Bulk Campaign Generation

Create multiple campaigns for different channels:

```bash
#!/bin/bash

CHANNELS=("Email" "Twitter" "Instagram" "LinkedIn")
TOKEN="your_token"

for channel in "${CHANNELS[@]}"; do
  echo "Generating for $channel..."
  
  curl -X POST http://localhost:5000/api/campaigns/generate \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
      "objective": "Product launch awareness",
      "channel": "'$channel'",
      "audience": "Tech professionals",
      "product": "Platform",
      "tone": "Professional"
    }' > "campaign_$channel.json"
  
  echo "✓ Saved to campaign_$channel.json"
done
```

---

## Compare Outputs

```bash
# Generate 2 campaigns with different tones
curl -X POST $API/campaigns/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "objective": "Increase sales",
    "channel": "Facebook",
    "audience": "Homeowners 45-65",
    "product": "Home Security System",
    "tone": "Warm and reassuring"
  }' | jq '.campaign.output.recommended' > tone1.json

curl -X POST $API/campaigns/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "objective": "Increase sales",
    "channel": "Facebook",
    "audience": "Homeowners 45-65",
    "product": "Home Security System",
    "tone": "Modern and tech-forward"
  }' | jq '.campaign.output.recommended' > tone2.json

# Compare recommendations
diff tone1.json tone2.json
```

---

## Verify RAG is Working

The system should retrieve documents and use them:

```bash
# Check context retrieval
curl -X POST $API/campaigns/generate \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "objective": "Increase awareness",
    "channel": "Social",
    "audience": "Professionals",
    "product": "Platform",
    "tone": "Professional"
  }' | jq '.campaign.context'

# Should show:
# "documentsRetrieved": [number > 0]
# "contextSources": "Brand docs, past campaigns, performance data"
```

If `documentsRetrieved: 0`, upload more documents!

---

## Performance Tips

1. **Mock mode is faster** - Use for testing
2. **Real mode is better** - Use for production
3. **Caching** - Save generated campaigns, don't regenerate
4. **Batch** - Generate multiple campaigns together

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| No context retrieved | Upload brand/campaign documents first |
| LLM API error | Check OPENAI_API_KEY is set correctly |
| Slow response | Use GPT-3.5-turbo instead of GPT-4 |
| Low quality output | Upload more relevant documents for context |

---

## Next Steps

1. Upload your brand documents
2. Run a campaign generation
3. Check context was retrieved
4. Compare the 3 variants
5. Refine based on feedback
6. Export in your preferred format

See CAMPAIGN_GENERATION_GUIDE.md for detailed documentation.
