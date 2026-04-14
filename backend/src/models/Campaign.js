import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    input: {
      objective: { type: String, required: true },
      channel: { type: String, required: true },
      audience: { type: String, required: true },
      product: { type: String, required: true },
      tone: { type: String, required: true },
    },
    output: {
      campaignBrief: {
        description: String,
        keyMessages: [String],
        callToAction: String,
      },
      variants: {
        safe: {
          headline: String,
          copy: String,
          tone: String,
          riskLevel: String,
          bestFor: String,
        },
        aggressive: {
          headline: String,
          copy: String,
          tone: String,
          riskLevel: String,
          bestFor: String,
        },
        creative: {
          headline: String,
          copy: String,
          tone: String,
          riskLevel: String,
          bestFor: String,
        },
      },
      recommended: {
        variant: String,
        reasoning: String,
        confidence: String,
      },
      additionalRecommendations: [String],
      metadata: {
        model: String,
        timestamp: Date,
        processingTime: Number,
        tokensUsed: Number,
        contextUsed: {
          brandContext: Boolean,
          pastCampaigns: Boolean,
          performanceData: Boolean,
          documentsRetrieved: Number,
        },
        retrievedDocuments: [
          {
            filename: String,
            relevance: Number,
            type: String,
          },
        ],
      },
    },
    notes: { type: String, default: '' },
    status: {
      type: String,
      enum: ['draft', 'approved', 'scheduled', 'executed', 'archived'],
      default: 'draft',
    },
    executedAt: Date,
    performance: {
      impressions: Number,
      clicks: Number,
      conversions: Number,
      ctr: Number,
      conversionRate: Number,
    },
  },
  { timestamps: true }
);

// Index for efficient queries
campaignSchema.index({ userId: 1, createdAt: -1 });
campaignSchema.index({ userId: 1, status: 1 });

const Campaign = mongoose.model('Campaign', campaignSchema);

export default Campaign;
