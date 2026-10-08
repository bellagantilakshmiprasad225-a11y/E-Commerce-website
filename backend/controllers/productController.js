const db = require('../config/db');

// GET /api/products?category_id=
const getProducts = async (req, res, next) => {
  try {
    const { category_id, search } = req.query;
    let sql = `
      SELECT p.product_id, p.category_id, c.name AS category_name, p.name, 
             p.description, p.price, p.stock, p.image_url
      FROM Products p
      JOIN Categories c ON p.category_id = c.category_id
    `;
    const params = [];
    const conditions = [];

    if (category_id && category_id !== 'all') {
      conditions.push(`p.category_id = ?`);
      params.push(parseInt(category_id, 10));
    }

    if (search) {
      conditions.push(`(p.name LIKE ? OR p.description LIKE ?)`);
      params.push(`%${search}%`, `%${search}%`);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ` + conditions.join(' AND ');
    }

    sql += ` ORDER BY p.product_id ASC`;

    const [rows] = await db.query(sql, params);
    res.json({
      success: true,
      data: rows
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT p.product_id, p.category_id, c.name AS category_name, p.name, 
             p.description, p.price, p.stock, p.image_url
      FROM Products p
      JOIN Categories c ON p.category_id = c.category_id
      WHERE p.product_id = ?
    `;
    const [rows] = await db.query(sql, [id]);

    if (rows.length === 0) {
      const err = new Error(`Product with ID ${id} not found.`);
      err.statusCode = 404;
      return next(err);
    }

    res.json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById
};
