const db = require('../config/db');

/**
 * POST /api/orders
 * Order submission flow with ACID Transaction
 */
const createOrder = async (req, res, next) => {
  const { customer_name, customer_email, items } = req.body;

  // 1. Basic Input Validation
  if (!customer_name || !customer_email) {
    const err = new Error('Customer name and email are required.');
    err.statusCode = 400;
    return next(err);
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(customer_email)) {
    const err = new Error('Please provide a valid email address.');
    err.statusCode = 400;
    return next(err);
  }

  if (!Array.isArray(items) || items.length === 0) {
    const err = new Error('Order must contain at least one item.');
    err.statusCode = 400;
    return next(err);
  }

  let connection = null;

  try {
    // 2. Open DB Transaction
    connection = await db.getConnection();
    await connection.beginTransaction();

    let calculatedTotal = 0;
    const verifiedItems = [];

    // 3. Check stock and fetch current price directly from database
    for (const item of items) {
      const productId = parseInt(item.product_id || item.id, 10);
      const qty = parseInt(item.quantity || item.qty, 10);

      if (!productId || isNaN(qty) || qty <= 0) {
        throw { statusCode: 400, message: `Invalid item format or quantity for product ID ${item.product_id}` };
      }

      const [products] = await connection.query(
        'SELECT product_id, name, price, stock FROM Products WHERE product_id = ?',
        [productId]
      );

      if (products.length === 0) {
        throw { statusCode: 404, message: `Product ID ${productId} does not exist.` };
      }

      const product = products[0];

      if (product.stock < qty) {
        throw {
          statusCode: 400,
          message: `Insufficient stock for product '${product.name}'. Requested: ${qty}, Available: ${product.stock}`
        };
      }

      const currentUnitPrice = parseFloat(product.price);
      const itemSubtotal = currentUnitPrice * qty;
      calculatedTotal += itemSubtotal;

      verifiedItems.push({
        product_id: product.product_id,
        name: product.name,
        quantity: qty,
        unit_price: currentUnitPrice,
        total: itemSubtotal
      });
    }

    // Include 5% tax as per specs calculation if needed, or subtotal calculation
    const grandTotal = Number((calculatedTotal * 1.05).toFixed(2));

    // 4. Insert into Orders table
    const [orderResult] = await connection.query(
      `INSERT INTO Orders (customer_name, customer_email, order_date, total_amount) VALUES (?, ?, NOW(), ?)`,
      [customer_name, customer_email, grandTotal]
    );

    const orderId = orderResult.insertId;

    // 5. Insert into Order_Items table and reduce Product stock
    for (const vItem of verifiedItems) {
      await connection.query(
        `INSERT INTO Order_Items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)`,
        [orderId, vItem.product_id, vItem.quantity, vItem.unit_price]
      );

      await connection.query(
        `UPDATE Products SET stock = stock - ? WHERE product_id = ?`,
        [vItem.quantity, vItem.product_id]
      );
    }

    // 6. Commit transaction
    await connection.commit();
    connection.release();

    // 7. Return complete invoice
    res.status(201).json({
      success: true,
      message: 'Order created successfully!',
      invoice: {
        order_id: orderId,
        customer_name,
        customer_email,
        order_date: new Date().toISOString(),
        items: verifiedItems,
        subtotal: Number(calculatedTotal.toFixed(2)),
        tax: Number((calculatedTotal * 0.05).toFixed(2)),
        total_amount: grandTotal
      }
    });

  } catch (error) {
    if (connection) {
      try {
        await connection.rollback();
        connection.release();
      } catch (rbErr) {
        console.error('Rollback error:', rbErr);
      }
    }
    next(error);
  }
};

/**
 * GET /api/orders/:id
 * Fetch Invoice details for an order
 */
const getOrderInvoice = async (req, res, next) => {
  try {
    const { id } = req.params;

    const orderSql = `
      SELECT order_id, customer_name, customer_email, order_date, total_amount
      FROM Orders
      WHERE order_id = ?
    `;
    const [orders] = await db.query(orderSql, [id]);

    if (orders.length === 0) {
      const err = new Error(`Order with ID ${id} not found.`);
      err.statusCode = 404;
      return next(err);
    }

    const order = orders[0];

    const itemsSql = `
      SELECT oi.order_item_id, oi.product_id, p.name AS product_name, p.image_url,
             oi.quantity, oi.unit_price, (oi.quantity * oi.unit_price) AS line_total
      FROM Order_Items oi
      JOIN Products p ON oi.product_id = p.product_id
      WHERE oi.order_id = ?
    `;
    const [items] = await db.query(itemsSql, [id]);

    const subtotal = items.reduce((sum, item) => sum + parseFloat(item.line_total), 0);
    const tax = subtotal * 0.05;

    res.json({
      success: true,
      data: {
        order_id: order.order_id,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        order_date: order.order_date,
        subtotal: Number(subtotal.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        total_amount: parseFloat(order.total_amount),
        items: items
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getOrderInvoice
};
