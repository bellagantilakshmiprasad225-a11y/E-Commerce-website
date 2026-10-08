const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const db = require('./config/db');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reportRoutes = require('./routes/reportRoutes');
const apiKeyMiddleware = require('./middleware/apiKeyMiddleware');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS & Body Parser
app.use(cors());
app.use(express.json());

// Serve static images
app.use('/images', express.static(path.join(__dirname, '..', 'frontend', 'public', 'images')));

// Protect all /api endpoints with API Key Middleware
app.use('/api', apiKeyMiddleware);

// API Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);

// Base API route test
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Aura Store REST API',
    database_mode: db.getMode(),
    endpoints: {
      categories: '/api/categories',
      products: '/api/products',
      product_details: '/api/products/:id',
      create_order: 'POST /api/orders',
      order_invoice: '/api/orders/:id',
      sales_reports: '/api/reports/sales'
    }
  });
});

// Serve compiled React frontend in production / single-port mode
const frontendDistPath = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(frontendDistPath)) {
  console.log(`📦 Serving compiled React frontend from ${frontendDistPath}`);
  app.use(express.static(frontendDistPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/images')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Central Error Handler Middleware
app.use(errorHandler);

// Initialize DB and start server
db.initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Express Full-Stack Server running at http://localhost:${PORT}`);
    console.log(`📊 Active DB Engine: ${db.getMode().toUpperCase()}`);
    console.log(`🔐 API Key Security: ${process.env.API_KEY ? 'ENABLED' : 'DISABLED'}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
