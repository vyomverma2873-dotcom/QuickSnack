const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');

// Load environment variables from .env.local first (for local dev with secrets), then .env
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/orders');
const placesRoutes = require('./routes/places');
const adminRoutes = require('./routes/admin');
const cartRoutes = require('./routes/cart');
const productsRoutes = require('./routes/products');
const debugRoutes = require('./routes/debug');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting (more permissive for development)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (increased for dev)
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// ✅ CORS configuration (production + development)
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://quicksnack-final-backend.onrender.com',
  'https://quicksnack-eight.vercel.app', // Your Vercel deployment
  process.env.FRONTEND_URL,
  // Allow all Vercel preview deployments
  /^https:\/\/.*\.vercel\.app$/
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check string origins
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Check regex patterns (for Vercel deployments)
      const isAllowed = allowedOrigins.some(allowedOrigin => {
        if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin);
        }
        return false;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        console.log('CORS blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Body:', req.body);
  }
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB with better error handling
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
})
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    console.log(`Database: ${mongoose.connection.name}`);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Full error:', err);
    // Don't exit - let Render see the error in logs
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/places', placesRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/debug', debugRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    success: true,
    message: 'Welcome to QuickSnack API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      user: '/api/user',
      cart: '/api/cart',
      orders: '/api/orders',
      places: '/api/places',
      admin: '/api/admin'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'QuickSnack API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'API endpoint not found' 
  });
});

const PORT = process.env.PORT || 4000;
const HOST = '0.0.0.0'; // Bind to all network interfaces for Render

app.listen(PORT, HOST, () => {
  console.log(`QuickSnack server running on ${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`MongoDB: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
});
