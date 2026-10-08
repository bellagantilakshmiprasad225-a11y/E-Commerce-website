const db = require('../config/db');

/**
 * GET /api/reports/sales
 * Generates billing & sales reports using SQL aggregate queries as defined in specifications.
 */
const getSalesReport = async (req, res, next) => {
  try {
    // Query 1: Revenue per order
    const revenuePerOrderSql = `
      SELECT o.order_id, 
             o.customer_name, 
             o.customer_email, 
             o.order_date, 
             COUNT(oi.order_item_id) AS items_count,
             SUM(oi.quantity * oi.unit_price) AS subtotal,
             o.total_amount AS grand_total
      FROM Orders o
      JOIN Order_Items oi ON o.order_id = oi.order_id
      GROUP BY o.order_id, o.customer_name, o.customer_email, o.order_date, o.total_amount
      ORDER BY o.order_id DESC
    `;

    // Query 2: Sales per category
    const salesPerCategorySql = `
      SELECT c.category_id,
             c.name AS category_name, 
             COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS revenue,
             COALESCE(SUM(oi.quantity), 0) AS total_units_sold
      FROM Categories c
      LEFT JOIN Products p ON p.category_id = c.category_id
      LEFT JOIN Order_Items oi ON oi.product_id = p.product_id
      GROUP BY c.category_id, c.name
      ORDER BY revenue DESC
    `;

    // Query 3: Key Performance Indicators Summary
    const summarySql = `
      SELECT 
        COUNT(DISTINCT o.order_id) AS total_orders,
        COALESCE(SUM(oi.quantity * oi.unit_price), 0) AS gross_revenue,
        COALESCE(SUM(oi.quantity), 0) AS total_items_sold,
        COALESCE(AVG(o.total_amount), 0) AS average_order_value
      FROM Orders o
      JOIN Order_Items oi ON o.order_id = oi.order_id
    `;

    const [revenuePerOrder] = await db.query(revenuePerOrderSql);
    const [salesPerCategory] = await db.query(salesPerCategorySql);
    const [summaryRows] = await db.query(summarySql);

    const summary = summaryRows[0] || {
      total_orders: 0,
      gross_revenue: 0,
      total_items_sold: 0,
      average_order_value: 0
    };

    res.json({
      success: true,
      data: {
        summary: {
          total_orders: parseInt(summary.total_orders, 10),
          gross_revenue: parseFloat(summary.gross_revenue),
          total_items_sold: parseInt(summary.total_items_sold, 10),
          average_order_value: Number(parseFloat(summary.average_order_value).toFixed(2))
        },
        revenue_per_order: revenuePerOrder.map(r => ({
          ...r,
          items_count: parseInt(r.items_count, 10),
          subtotal: parseFloat(r.subtotal),
          grand_total: parseFloat(r.grand_total)
        })),
        sales_per_category: salesPerCategory.map(c => ({
          ...c,
          revenue: parseFloat(c.revenue),
          total_units_sold: parseInt(c.total_units_sold, 10)
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSalesReport
};
