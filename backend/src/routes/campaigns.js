import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  generateCampaign,
  generateCampaignVariants,
  refineCampaign,
  exportCampaign,
  getCampaigns,
  getCampaign,
  updateCampaign,
  deleteCampaign,
  getCampaignStats
} from '../controllers/campaignController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

/**
 * GET /api/campaigns
 * Get user's campaigns with pagination
 */
router.get('/', getCampaigns);

/**
 * GET /api/campaigns/stats
 * Get campaign statistics
 */
router.get('/stats', getCampaignStats);

/**
 * GET /api/campaigns/:campaignId
 * Get single campaign details
 */
router.get('/:campaignId', getCampaign);

/**
 * POST /api/campaigns/generate
 * Generate AI campaign using RAG with retrieved context
 */
router.post('/generate', generateCampaign);

/**
 * POST /api/campaigns/variants
 * Generate and compare all campaign variants
 */
router.post('/variants', generateCampaignVariants);

/**
 * POST /api/campaigns/refine
 * Refine campaign based on feedback
 */
router.post('/refine', refineCampaign);

/**
 * POST /api/campaigns/export
 * Export campaign in different formats
 */
router.post('/export', exportCampaign);

/**
 * PATCH /api/campaigns/:campaignId
 * Update campaign (status, notes, performance)
 */
router.patch('/:campaignId', updateCampaign);

/**
 * DELETE /api/campaigns/:campaignId
 * Delete campaign
 */
router.delete('/:campaignId', deleteCampaign);

export default router;
