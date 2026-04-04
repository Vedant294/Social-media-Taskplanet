import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import { errorHandler } from './middleware/errorHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use('/api/', apiLimiter);

// Routes
app.use('/api/auth',  authRoutes);
app.use('/api/posts', postRoutes);

// Health check
app.get('/health', (req, res) =>
  res.json({ status: 'OK', uptime: process.uptime() })
);

// Global error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);

  // Keep-alive ping every 10 minutes to prevent Render free tier spin-down
  if (process.env.NODE_ENV === 'production' && process.env.RENDER_EXTERNAL_URL) {
    setInterval(async () => {
      try {
        const url = `${process.env.RENDER_EXTERNAL_URL}/health`;
        const res = await fetch(url);
        console.log(`💓 Keep-alive ping: ${res.status}`);
      } catch (e) {
        console.log('💓 Keep-alive ping failed:', e.message);
      }
    }, 10 * 60 * 1000); // every 10 minutes
  }
});
