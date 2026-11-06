import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import authRoutes from './routes/auth.js';
import healthRoutes from './routes/index.js';
import productRoutes from './routes/products.js';
import collectionRoutes from './routes/collections.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ESM: derive __dirname and resolve the frontend dist folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '../../dist');

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/collections', collectionRoutes);

// Serve the built frontend from the repo-root /dist folder
app.use(express.static(distPath));

// Fallback: any GET request that is not an /api route serves the SPA
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'Route not found' });
  }
  return res.sendFile(path.resolve(distPath, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`E-commerce backend running on port ${PORT}`);
});

export default app;