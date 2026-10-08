const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./config/db');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reportRoutes = require('./routes/reportRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS & Middleware
app.use(cors());
app.use(express.json());

// Serve static images if present in frontend public or local uploads
app.use('/images', express.static(path.join(__dirname, '..', 'frontend', 'public', 'images')));

// API Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reports', reportRoutes);

// Base route test
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Simple E-Commerce Cart & Order Management API',
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

// Central Error Handler Middleware
app.use(errorHandler);

// Initialize DB and start server
db.initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Express REST API server running at http://localhost:${PORT}`);
    console.log(`📊 Active DB Engine: ${db.getMode().toUpperCase()}`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
