const express = require('express');
const router = express.Router();
const { getSalesReport } = require('../controllers/reportController');

// GET /api/reports/sales
router.get('/sales', getSalesReport);

module.exports = router;
