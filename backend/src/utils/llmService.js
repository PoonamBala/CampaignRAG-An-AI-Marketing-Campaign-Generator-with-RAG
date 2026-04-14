/**
 * LLM Service - Abstraction layer for language model calls
 * Supports both real LLMs (OpenAI) and mock responses for testing
 */

/**
 * Generate campaign using LLM
 * If OPENAI_API_KEY is set, uses real OpenAI API
 * Otherwise, returns mock response
 */
export const generateCampaignWithLLM = async (prompt, systemPrompt) => {
  // Check if using real OpenAI or mock
  if (process.env.OPENAI_API_KEY) {
    return await generateWithOpenAI(prompt, systemPrompt);
  } else {
    return generateMockResponse(prompt);
  }
};

/**
 * Call OpenAI API for campaign generation
 * Requires: OPENAI_API_KEY environment variable
 */
const generateWithOpenAI = async (prompt, systemPrompt) => {
  try {
    // Dynamically import OpenAI only if available
    const { default: OpenAI } = await import('openai');

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview', // or 'gpt-3.5-turbo' for faster/cheaper
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;

    // Parse the JSON response
    try {
      return JSON.parse(content);
    } catch (parseError) {
      throw new Error(`Failed to parse LLM response as JSON: ${content}`);
    }
  } catch (error) {
    console.error('OpenAI API Error:', error.message);
    throw new Error(`LLM generation failed: ${error.message}`);
  }
};

/**
 * Generate mock campaign response for testing/demo
 * This provides realistic-looking campaign data without API calls
 */
const generateMockResponse = (prompt) => {
  // Extract parameters from prompt for more realistic responses
  const objectiveMatch = prompt.match(/Objective:\s*([^\n]+)/);
  const channelMatch = prompt.match(/Channel:\s*([^\n]+)/);
  const audienceMatch = prompt.match(/Target Audience:\s*([^\n]+)/);
  const productMatch = prompt.match(/Product\/Service:\s*([^\n]+)/);
  const toneMatch = prompt.match(/Tone:\s*([^\n]+)/);

  const objective = objectiveMatch ? objectiveMatch[1].trim() : 'Increase brand awareness';
  const channel = channelMatch ? channelMatch[1].trim() : 'Social Media';
  const audience = audienceMatch ? audienceMatch[1].trim() : 'Young professionals';
  const product = productMatch ? productMatch[1].trim() : 'Product';
  const tone = toneMatch ? toneMatch[1].trim() : 'Professional';

  return {
    campaignBrief: {
      description: `A comprehensive ${channel} campaign designed to ${objective} among ${audience}. This campaign leverages audience insights and market data to deliver impactful messaging that resonates with your target demographic.`,
      keyMessages: [
        `${product} delivers real value to ${audience}`,
        'Innovation meets reliability in every interaction',
        'Join the community of satisfied ${audience}'
      ],
      callToAction: 'Discover how we can transform your experience today'
    },
    variants: {
      safe: {
        headline: `Experience ${product}: Trusted by Thousands`,
        copy: `${audience} deserve better. Our ${product} combines reliability, quality, and proven results. Join a trusted community of satisfied customers who have made the smart choice. Learn why ${product} is the preferred solution for discerning professionals. Explore our proven track record and see the difference for yourself.`,
        tone: 'Professional, reassuring, trustworthy',
        riskLevel: 'Low',
        strengths: ['Proven appeal', 'Risk-averse', 'Brand-safe'],
        weakness: ['May seem generic', 'Lower viral potential']
      },
      aggressive: {
        headline: `Stop Settling. Start ${product}-ing.`,
        copy: `Tired of mediocrity? ${audience}, it's time to demand better. ${product} isn't just an upgrade—it's a revolution in how you work. Bold. Disruptive. Unapologetically better. Don't just follow trends; lead them. Your competition is already moving. The question is: are you ready to dominate?`,
        tone: 'Bold, provocative, ambitious',
        riskLevel: 'High',
        strengths: ['High engagement potential', 'Memorable', 'Trendsetting'],
        weaknesses: ['May alienate conservative segments', 'Higher controversy risk']
      },
      creative: {
        headline: `${product}: Where ${audience} Dreams Become Reality`,
        copy: `Imagine a world where everything just works. Where obstacles become opportunities. Where ${product} isn't just a choice—it's a lifestyle. We've reimagined what's possible for ${audience}. Through unexpected storytelling and genuine human connection, we're building something truly special. Are you ready to be part of something revolutionary?`,
        tone: 'Creative, inspiring, human-centric',
        riskLevel: 'Medium',
        strengths: ['Emotional connection', 'Differentiated message', 'Shareability'],
        weaknesses: ['May be too artistic for some', 'Requires strong creative execution']
      }
    },
    recommended: {
      variant: 'creative',
      reasoning: `Based on the ${audience} audience segment and ${objective}, the "Creative" variant is recommended. This approach balances emotional engagement with professionalism, making it suitable for ${channel}. It differentiates your message from competitors while maintaining brand integrity. Historical campaign data suggests ${audience} responds well to authentic, story-driven narratives that speak to their aspirations.`,
      confidence: 'High'
    },
    additionalRecommendations: [
      `A/B test all three variants to validate assumptions specific to your audience`,
      `Prioritize the "Creative" variant for initial rollout with monitoring of engagement metrics`,
      `Use audience segmentation to customize variant selection (aggressive for innovation seekers, safe for pragmatists)`,
      `Include clear tracking/attribution to measure campaign performance against historical baseline`,
      `Plan for content adaptation across ${channel} platform best practices`
    ],
    metadata: {
      model: 'mock',
      timestamp: new Date().toISOString(),
      processingTime: '< 100ms (mock)',
      contextUsed: {
        brandContext: true,
        pastCampaigns: true,
        performanceData: true
      }
    }
  };
};

/**
 * Validate campaign response structure
 */
export const validateCampaignResponse = (response) => {
  const requiredFields = ['campaignBrief', 'variants', 'recommended', 'additionalRecommendations'];
  const variantFields = ['safe', 'aggressive', 'creative'];

  // Check main structure
  for (const field of requiredFields) {
    if (!response[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Check variants
  for (const variant of variantFields) {
    if (!response.variants[variant]) {
      throw new Error(`Missing variant: ${variant}`);
    }
  }

  // Check recommended variant
  const recommendedVariant = response.recommended.variant;
  if (!variantFields.includes(recommendedVariant)) {
    throw new Error(`Invalid recommended variant: ${recommendedVariant}`);
  }

  return true;
};

/**
 * Parse LLM response and handle errors
 */
export const parseLLMResponse = (response) => {
  try {
    if (typeof response === 'string') {
      return JSON.parse(response);
    }
    validateCampaignResponse(response);
    return response;
  } catch (error) {
    throw new Error(`Failed to parse campaign response: ${error.message}`);
  }
};
