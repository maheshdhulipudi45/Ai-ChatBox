import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import conversationRoutes from './routes/conversationRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import authRoutes from './routes/authRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for development; in production restrict to frontend domain
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/chat', chatRoutes);

// GET / Health check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is running successfully 🚀"
  });
});

// GET /health legacy support
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'PromptPilot AI Workspace Server is running smoothly' });
});

// Undefined API Routes 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.originalUrl}`
  });
});

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB and start listening
const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database connection. Server failed to start:', err);
    process.exit(1);
  });
