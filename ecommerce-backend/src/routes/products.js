import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const router = Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProduct);

// Protected admin routes
router.post('/', authMiddleware, adminMiddleware, createProduct);
router.put('/:id', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:id', authMiddleware, adminMiddleware, deleteProduct);

export default router;