import { Router } from 'express';
import { healthCheck } from '../middleware/health.js';

const router = Router();

router.get('/health', healthCheck);

export default router;