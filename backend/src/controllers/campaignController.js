import Chunk from '../models/Chunk.js';
import Campaign from '../models/Campaign.js';
import vectorStore from '../utils/vectorStore.js';
import {
  campaignPromptTemplates,
  systemPrompts,
  buildCampaignContext
} from '../utils/promptTemplates.js';
import {
  generateCampaignWithLLM,
  parseLLMResponse
} from '../utils/llmService.js';

/**
 * Generate AI campaign using RAG
 * Retrieves relevant brand, campaign, and performance data
 * Uses context to generate targeted campaign variants
 */
export const generateCampaign = async (req, res) => {
  try {
    const { objective, channel, audience, product, tone } = req.body;
    const userId = req.user.id;

    // Validation
    if (!objective || !channel || !audience || !product || !tone) {
      return res.status(400).json({
        message: 'Missing required fields: objective, channel, audience, product, tone'
      });
    }

    // Build search queries to retrieve context
    const searchQueries = [
      `brand guidelines ${product}`,
      `${channel} campaign for ${audience}`,
      `${objective} performance metrics`,
      `${product} messaging and positioning`,
      `${audience} audience insights`
    ];

    // Retrieve relevant context documents via RAG
    const retrievedContext = await retrieveContextForCampaign(userId, searchQueries);

    // Build comprehensive context for the prompt
    const campaignContext = buildCampaignContext(
      { objective, channel, audience, product, tone },
      retrievedContext
    );

    // Build the prompt
    const prompt = campaignPromptTemplates.generateCampaign(campaignContext);
    const systemPrompt = systemPrompts.campaignGeneration;

    // Generate campaign using LLM
    const campaignResponse = await generateCampaignWithLLM(prompt, systemPrompt);

    // Parse and validate response
    const parsedResponse = parseLLMResponse(campaignResponse);

    // Save campaign to database
    const campaignDoc = new Campaign({
      userId,
      input: {
        objective,
        channel,
        audience,
        product,
        tone
      },
      output: parsedResponse,
      status: 'draft'
    });

    await campaignDoc.save();

    // Return comprehensive response
    res.status(200).json({
      success: true,
      campaign: {
        id: campaignDoc._id,
        input: {
          objective,
          channel,
          audience,
          product,
          tone
        },
        output: parsedResponse,
        context: {
          documentsRetrieved: retrievedContext.length,
          contextSources: retrievedContext.length > 0 ? 'Brand docs, past campaigns, performance data' : 'Limited context available',
          recommendationBasis: 'Retrieved context + market data'
        },
        createdAt: campaignDoc.createdAt
      }
    });
  } catch (error) {
    console.error('Campaign generation error:', error);
    res.status(500).json({
      message: error.message || 'Failed to generate campaign'
    });
  }
};

/**
 * Retrieve campaign context from vector store
 * Performs semantic search for brand, campaign, and performance data
 */
const retrieveContextForCampaign = async (userId, searchQueries) => {
  const allResults = [];
  const vectorStoreResults = [];

  try {
    // Perform semantic search for each query
    for (const query of searchQueries) {
      // Generate query embeddings
      const { generateEmbedding } = await import('../utils/embeddings.js');
      const queryEmbedding = generateEmbedding(query);

      // Search in vector store (in-memory)
      const results = vectorStore.search(queryEmbedding, 3);

      // For each result, fetch full document from MongoDB
      for (const result of results) {
        const chunk = await Chunk.findOne({
          userId,
          documentId: result.metadata.documentId,
          chunkIndex: result.metadata.chunkIndex
        });

        if (chunk) {
          allResults.push({
            text: chunk.text,
            filename: result.metadata.filename,
            similarity: result.score,
            documentId: result.metadata.documentId,
            chunkIndex: result.metadata.chunkIndex
          });

          vectorStoreResults.push(result);
        }
      }
    }

    // Remove duplicates (same chunk retrieved multiple times)
    const uniqueResults = [];
    const seen = new Set();

    allResults.forEach((result) => {
      const key = `${result.documentId}-${result.chunkIndex}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueResults.push(result);
      }
    });

    // Sort by similarity and return top results
    return uniqueResults.sort((a, b) => b.similarity - a.similarity).slice(0, 10);
  } catch (error) {
    console.log('Warning: Context retrieval failed, continuing with limited context:', error.message);
    return [];
  }
};

/**
 * Generate multiple campaign options
 * Returns different campaign approaches for comparison
 */
export const generateCampaignVariants = async (req, res) => {
  try {
    const { objective, channel, audience, product, tone, numVariants = 3 } = req.body;
    const userId = req.user.id;

    if (!objective || !channel || !audience || !product || !tone) {
      return res.status(400).json({
        message: 'Missing required fields: objective, channel, audience, product, tone'
      });
    }

    // Generate base campaign
    const campaign = await generateCampaignWithContext(
      { objective, channel, audience, product, tone },
      userId
    );

    // Return all variants with comparison
    res.status(200).json({
      success: true,
      variants: {
        safe: {
          ...campaign.variants.safe,
          bestFor: 'Risk-averse brands, established audiences'
        },
        aggressive: {
          ...campaign.variants.aggressive,
          bestFor: 'Growth-focused brands, younger audiences'
        },
        creative: {
          ...campaign.variants.creative,
          bestFor: 'Innovative brands, engaged communities'
        }
      },
      comparison: {
        riskProfile: {
          safe: 'Low',
          aggressive: 'High',
          creative: 'Medium'
        },
        recommendedByContext: campaign.recommended.variant,
        reasoning: campaign.recommended.reasoning
      },
      input: { objective, channel, audience, product, tone }
    });
  } catch (error) {
    console.error('Variant generation error:', error);
    res.status(500).json({
      message: 'Failed to generate campaign variants'
    });
  }
};

/**
 * Helper: Generate campaign with RAG context
 */
const generateCampaignWithContext = async (campaignRequest, userId) => {
  const searchQueries = [
    `${campaignRequest.channel} campaigns`,
    `${campaignRequest.audience} audience`,
    `${campaignRequest.product} positioning`
  ];

  const context = await retrieveContextForCampaign(userId, searchQueries);

  const campaignContext = buildCampaignContext(campaignRequest, context);
  const prompt = campaignPromptTemplates.generateCampaign(campaignContext);
  const systemPrompt = systemPrompts.campaignGeneration;

  const response = await generateCampaignWithLLM(prompt, systemPrompt);
  return parseLLMResponse(response);
};

/**
 * Refine campaign based on feedback
 * Takes initial campaign and user feedback to iterate
 */
export const refineCampaign = async (req, res) => {
  try {
    const { campaignData, feedback, focusVariant } = req.body;
    const userId = req.user.id;

    if (!campaignData || !feedback) {
      return res.status(400).json({
        message: 'Missing required fields: campaignData, feedback'
      });
    }

    // Build refinement prompt
    const refinementPrompt = `
You are a marketing expert refining a campaign based on stakeholder feedback.

ORIGINAL CAMPAIGN:
${JSON.stringify(campaignData, null, 2)}

USER FEEDBACK:
${feedback}

FOCUS VARIANT:
${focusVariant || 'creative'}

Based on the feedback, refine the campaign to:
1. Address specific concerns raised
2. Strengthen the "${focusVariant || 'creative'}" variant
3. Maintain brand consistency
4. Improve resonance with the target audience

Provide refined campaign in the same JSON structure as the original, incorporating improvements while keeping the campaign strategic and actionable.
`;

    const systemPrompt = systemPrompts.campaignGeneration;

    const refinedResponse = await generateCampaignWithLLM(refinementPrompt, systemPrompt);
    const parsedResponse = parseLLMResponse(refinedResponse);

    res.status(200).json({
      success: true,
      refinedCampaign: parsedResponse,
      iterationInfo: {
        feedbackIncorporated: true,
        focusVariant: focusVariant || 'creative',
        requiresAdditionalRefinement: false
      }
    });
  } catch (error) {
    console.error('Campaign refinement error:', error);
    res.status(500).json({
      message: 'Failed to refine campaign'
    });
  }
};

/**
 * Export campaign in different formats
 */
export const exportCampaign = async (req, res) => {
  try {
    const { campaignData, format = 'json' } = req.body;

    if (!campaignData) {
      return res.status(400).json({
        message: 'Missing campaignData'
      });
    }

    let output;

    switch (format.toLowerCase()) {
      case 'markdown':
        output = formatCampaignMarkdown(campaignData);
        break;
      case 'csv':
        output = formatCampaignCSV(campaignData);
        break;
      case 'json':
      default:
        output = campaignData;
        break;
    }

    res.status(200).json({
      success: true,
      format,
      campaign: output
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to export campaign'
    });
  }
};

/**
 * Format campaign as Markdown
 */
const formatCampaignMarkdown = (campaign) => {
  const { campaignBrief, variants, recommended } = campaign;

  let md = '# Campaign Brief\n\n';
  md += `${campaignBrief.description}\n\n`;
  md += '## Key Messages\n';
  campaignBrief.keyMessages.forEach((msg) => {
    md += `- ${msg}\n`;
  });
  md += `\n**Call to Action:** ${campaignBrief.callToAction}\n\n`;

  md += '## Campaign Variants\n\n';

  Object.entries(variants).forEach(([variantName, variant]) => {
    const isRecommended = recommended.variant === variantName ? ' ⭐ RECOMMENDED' : '';
    md += `### ${variantName.toUpperCase()}${isRecommended}\n`;
    md += `**Headline:** ${variant.headline}\n`;
    md += `**Tone:** ${variant.tone}\n`;
    md += `**Risk Level:** ${variant.riskLevel}\n\n`;
    md += `${variant.copy}\n\n`;
  });

  md += '## Recommendation\n\n';
  md += `**Variant:** ${recommended.variant.toUpperCase()}\n`;
  md += `**Reasoning:** ${recommended.reasoning}\n`;

  return md;
};

/**
 * Format campaign as CSV
 */
const formatCampaignCSV = (campaign) => {
  const { variants, recommended, campaignBrief } = campaign;

  let csv = 'Variant,Headline,Risk Level,Tone,Copy\n';

  Object.entries(variants).forEach(([name, variant]) => {
    const isRec = name === recommended.variant ? '[REC] ' : '';
    const headline = `"${isRec}${variant.headline}"`;
    const copy = `"${variant.copy.substring(0, 100)}..."`;

    csv += `${name},${headline},${variant.riskLevel},${variant.tone},${copy}\n`;
  });

  csv += `\n"Campaign Brief:","${campaignBrief.description}"\n`;

  return csv;
};

/**
 * Get user's campaigns
 * Returns list with pagination and optional filtering
 */
export const getCampaigns = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, limit = 10, skip = 0 } = req.query;

    let query = { userId };
    if (status) {
      query.status = status;
    }

    const campaigns = await Campaign.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .select('_id input status createdAt output.recommended updatedAt');

    const total = await Campaign.countDocuments(query);

    res.status(200).json({
      success: true,
      campaigns: campaigns.map((campaign) => ({
        id: campaign._id,
        objective: campaign.input.objective,
        product: campaign.input.product,
        channel: campaign.input.channel,
        audience: campaign.input.audience,
        tone: campaign.input.tone,
        recommendedVariant: campaign.output.recommended?.variant || 'unknown',
        status: campaign.status,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt
      })),
      pagination: {
        total,
        limit: parseInt(limit),
        skip: parseInt(skip),
        hasMore: parseInt(skip) + parseInt(limit) < total
      }
    });
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    res.status(500).json({
      message: 'Failed to fetch campaigns'
    });
  }
};

/**
 * Get single campaign details
 */
export const getCampaign = async (req, res) => {
  try {
    const userId = req.user.id;
    const { campaignId } = req.params;

    const campaign = await Campaign.findOne({
      _id: campaignId,
      userId
    });

    if (!campaign) {
      return res.status(404).json({
        message: 'Campaign not found'
      });
    }

    res.status(200).json({
      success: true,
      campaign: {
        id: campaign._id,
        input: campaign.input,
        output: campaign.output,
        status: campaign.status,
        notes: campaign.notes,
        performance: campaign.performance,
        createdAt: campaign.createdAt,
        updatedAt: campaign.updatedAt,
        executedAt: campaign.executedAt
      }
    });
  } catch (error) {
    console.error('Error fetching campaign:', error);
    res.status(500).json({
      message: 'Failed to fetch campaign'
    });
  }
};

/**
 * Update campaign (status, notes, performance)
 */
export const updateCampaign = async (req, res) => {
  try {
    const userId = req.user.id;
    const { campaignId } = req.params;
    const { status, notes, performance } = req.body;

    const campaign = await Campaign.findOne({
      _id: campaignId,
      userId
    });

    if (!campaign) {
      return res.status(404).json({
        message: 'Campaign not found'
      });
    }

    if (status) campaign.status = status;
    if (notes !== undefined) campaign.notes = notes;
    if (performance) {
      campaign.performance = {
        ...campaign.performance?.toObject?.() || {},
        ...performance
      };
    }

    if (status === 'executed' && !campaign.executedAt) {
      campaign.executedAt = new Date();
    }

    await campaign.save();

    res.status(200).json({
      success: true,
      campaign: {
        id: campaign._id,
        status: campaign.status,
        notes: campaign.notes,
        updatedAt: campaign.updatedAt
      }
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({
      message: 'Failed to update campaign'
    });
  }
};

/**
 * Delete campaign
 */
export const deleteCampaign = async (req, res) => {
  try {
    const userId = req.user.id;
    const { campaignId } = req.params;

    const result = await Campaign.findOneAndDelete({
      _id: campaignId,
      userId
    });

    if (!result) {
      return res.status(404).json({
        message: 'Campaign not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({
      message: 'Failed to delete campaign'
    });
  }
};

/**
 * Get campaign statistics
 */
export const getCampaignStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalCampaigns = await Campaign.countDocuments({ userId });
    const statusCounts = await Campaign.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId(userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const recentCampaigns = await Campaign.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('input status createdAt output.recommended');

    res.status(200).json({
      success: true,
      stats: {
        totalCampaigns,
        byStatus: statusCounts.reduce((acc, row) => {
          acc[row._id] = row.count;
          return acc;
        }, {}),
        recentCampaigns: recentCampaigns.map((c) => ({
          objective: c.input.objective,
          recommendedVariant: c.output.recommended?.variant,
          status: c.status,
          createdAt: c.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      message: 'Failed to fetch campaign statistics'
    });
  }
};
