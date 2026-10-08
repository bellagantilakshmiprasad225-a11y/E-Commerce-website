const db = require('../config/db');

// GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    const sql = `
      SELECT c.category_id, c.name, COUNT(p.product_id) AS product_count
      FROM Categories c
      LEFT JOIN Products p ON c.category_id = p.category_id
      GROUP BY c.category_id, c.name
      ORDER BY c.name ASC
    `;
    const [rows] = await db.query(sql);
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories
};
