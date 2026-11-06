import { Router } from 'express';
import {
  createCollection,
  getCollections,
  getCollection,
  updateCollection,
  deleteCollection,
} from '../controllers/collectionController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getCollections);
router.get('/:id', getCollection);

// Protected admin routes
router.post('/', authMiddleware, adminMiddleware, createCollection);
router.put('/:id', authMiddleware, adminMiddleware, updateCollection);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCollection);

export default router;