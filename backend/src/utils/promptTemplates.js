/**
 * Prompt templates for AI campaign generation
 */

export const campaignPromptTemplates = {
  /**
   * Main campaign generation prompt
   */
  generateCampaign: (context) => `
You are an expert marketing strategist and creative copywriter. Generate a comprehensive marketing campaign based on the provided context.

CAMPAIGN BRIEF:
Objective: ${context.objective}
Channel: ${context.channel}
Target Audience: ${context.audience}
Product/Service: ${context.product}
Tone: ${context.tone}

BRAND CONTEXT:
${context.brandContext || 'No brand documentation available'}

PAST CAMPAIGN EXAMPLES:
${context.pastCampaigns || 'No historical campaign data available'}

MARKET/PERFORMANCE DATA:
${context.performanceData || 'No performance metrics available'}

Generate a JSON response with the following structure:
{
  "campaignBrief": {
    "description": "A 2-3 sentence executive summary",
    "keyMessages": ["message1", "message2", "message3"],
    "callToAction": "Primary call to action"
  },
  "variants": {
    "safe": {
      "headline": "Moderate, proven approach headline",
      "copy": "Body copy that is professional and risk-averse",
      "tone": "Safe tone description",
      "riskLevel": "Low"
    },
    "aggressive": {
      "headline": "Bold, attention-grabbing headline",
      "copy": "Body copy that is provocative and ambitious",
      "tone": "Aggressive tone description",
      "riskLevel": "High"
    },
    "creative": {
      "headline": "Unique, unexpected creative headline",
      "copy": "Body copy with creative hooks and storytelling",
      "tone": "Creative tone description",
      "riskLevel": "Medium"
    }
  },
  "recommended": {
    "variant": "safe|aggressive|creative",
    "reasoning": "Explanation for why this variant is recommended based on the audience, objective, and market data"
  },
  "additionalRecommendations": [
    "Recommendation 1",
    "Recommendation 2",
    "Recommendation 3"
  ]
}

Ensure the response is valid JSON and incorporates insights from the provided context.
Remember: Base recommendations on retrieved context (brand guidelines, past campaign performance, audience data).
Avoid generic guidance without contextual basis.
`,

  /**
   * Prompt for extracting brand context
   */
  extractBrandContext: (documents) => `
Extract key brand information from the following documents:
${documents}

Provide a concise summary of:
1. Brand voice and values
2. Key messaging
3. Target audience characteristics
4. Brand personality
5. Primary differentiators

Keep it to 150-200 words.
`,

  /**
   * Prompt for analyzing past campaigns
   */
  analyzePastCampaigns: (campaigns) => `
Analyze the following past campaigns and extract learnings:
${campaigns}

Summarize:
1. What worked well (high engagement/conversion)
2. What didn't work (low performance)
3. Audience preferences evident in successful campaigns
4. Messaging patterns that resonated

Keep it to 200-250 words.
`,

  /**
   * Prompt for incorporating performance data
   */
  performanceInsights: (data) => `
Based on the following performance metrics:
${data}

Provide strategic insights for the upcoming campaign:
1. Channels with highest ROI
2. Audience segments with best engagement
3. Content types that convert best
4. Optimal times/frequencies for messaging

Keep recommendations actionable and data-driven.
`
};

/**
 * System prompts for different modes
 */
export const systemPrompts = {
  campaignGeneration: `You are an expert marketing AI trained in campaign strategy, copywriting, and audience psychology. You generate high-quality marketing campaigns tailored to specific objectives and audiences. You always incorporate available context and data into your recommendations. You provide structured, actionable output in JSON format.`,

  contextExtractor: `You are a skilled marketing analyst. You extract key insights from marketing documents, past campaigns, and performance data. You provide concise, actionable summaries that inform campaign strategy.`
};

/**
 * Build context for the campaign prompt
 */
export const buildCampaignContext = (campaignRequest, retrievedDocs = []) => {
  let brandContext = '';
  let pastCampaigns = '';
  let performanceData = '';

  // Extract context from retrieved documents
  retrievedDocs.forEach((doc) => {
    if (doc.type === 'brand') {
      brandContext += `${doc.text}\n`;
    } else if (doc.type === 'campaign') {
      pastCampaigns += `${doc.text}\n`;
    } else if (doc.type === 'performance') {
      performanceData += `${doc.text}\n`;
    }
  });

  return {
    objective: campaignRequest.objective,
    channel: campaignRequest.channel,
    audience: campaignRequest.audience,
    product: campaignRequest.product,
    tone: campaignRequest.tone,
    brandContext: brandContext || 'No brand documentation uploaded',
    pastCampaigns: pastCampaigns || 'No past campaigns available',
    performanceData: performanceData || 'No performance data available'
  };
};
