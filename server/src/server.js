import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB, getIsConnected } from './config/db.js';
import { memoryStore } from './config/memoryStore.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Allow any origin in dev for seamless preview & testing
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: getIsConnected() ? 'MongoDB (Connected)' : 'In-Memory Demo Mode (Fallback Active)',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize in-memory fallback store and database connection
const startServer = async () => {
  await memoryStore.init();
  await connectDB();

  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`\n🚀 \x1b[32mE-Commerce Server running on http://localhost:${PORT}\x1b[0m`);
      console.log(`📦 \x1b[36mAPI Documentation & Endpoints:\x1b[0m`);
      console.log(`   - GET  /api/health`);
      console.log(`   - POST /api/auth/register`);
      console.log(`   - POST /api/auth/login`);
      console.log(`   - GET  /api/auth/me`);
      console.log(`   - GET  /api/products`);
      console.log(`   - POST /api/products (Admin)`);
      console.log(`   - POST /api/orders`);
      console.log(`   - GET  /api/orders/my-orders\n`);
    });
  }
};

startServer();

export default app;
