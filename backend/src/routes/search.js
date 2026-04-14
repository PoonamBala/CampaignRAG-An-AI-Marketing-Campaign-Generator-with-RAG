import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  search,
  advancedSearch,
  getSimilarChunks
} from '../controllers/searchController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Basic search
router.post('/', search);

// Advanced search with filters
router.post('/advanced', advancedSearch);

// Get similar chunks
router.post('/similar/:chunkId', getSimilarChunks);

export default router;
