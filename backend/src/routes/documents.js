import express from 'express';
import { protect } from '../middleware/auth.js';
import { uploadSingle } from '../middleware/upload.js';
import {
  uploadDocument,
  getDocument,
  listDocuments,
  deleteDocument,
  getVectorStoreStats
} from '../controllers/documentController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Upload a document
router.post('/upload', uploadSingle, uploadDocument);

// Get document details
router.get('/:documentId', getDocument);

// List all documents
router.get('/', listDocuments);

// Delete document
router.delete('/:documentId', deleteDocument);

// Get vector store statistics
router.get('/stats/vector-store', getVectorStoreStats);

export default router;
