const express = require('express');
const router = express.Router();
const { createOrder, getOrderInvoice } = require('../controllers/orderController');

// POST /api/orders
router.post('/', createOrder);

// GET /api/orders/:id
router.get('/:id', getOrderInvoice);

module.exports = router;
