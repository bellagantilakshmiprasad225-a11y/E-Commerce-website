const mysql = require('mysql2/promise');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
require('dotenv').config();

let pool = null;
let sqliteDb = null;
let dbMode = 'mysql';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'ecommerce_db';
const DB_PORT = process.env.DB_PORT || 3306;
const PREFER_DB_TYPE = process.env.DB_TYPE;

// Helper to convert MySQL SQL syntax to SQLite syntax if needed
function translateSqlToSqlite(sql) {
  let translated = sql
    .replace(/DATE_SUB\(NOW\(\),\s*INTERVAL\s+(\d+)\s+DAY\)/gi, "DATETIME('now', '-$1 days')")
    .replace(/NOW\(\)/gi, "DATETIME('now')");
  return translated;
}

// Initialize SQLite fallback database with schema and seed data
function initSqliteFallback() {
  return new Promise((resolve, reject) => {
    const dbPath = path.join(__dirname, '..', 'data.sqlite');
    sqliteDb = new sqlite3.Database(dbPath, async (err) => {
      if (err) return reject(err);
      console.log('⚡ Using SQLite database engine (Local dev fallback)');
      dbMode = 'sqlite';

      try {
        const seedPath = path.join(__dirname, '..', '..', 'database', 'seed.sql');
        let seedSql = fs.readFileSync(seedPath, 'utf8');

        // Prepare SQLite schema
        const sqliteSchema = `
          CREATE TABLE IF NOT EXISTS Categories (
              category_id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT NOT NULL UNIQUE
          );
          CREATE TABLE IF NOT EXISTS Products (
              product_id INTEGER PRIMARY KEY AUTOINCREMENT,
              category_id INTEGER NOT NULL,
              name TEXT NOT NULL,
              description TEXT,
              price REAL NOT NULL,
              stock INTEGER NOT NULL DEFAULT 0,
              image_url TEXT,
              FOREIGN KEY (category_id) REFERENCES Categories(category_id)
          );
          CREATE TABLE IF NOT EXISTS Orders (
              order_id INTEGER PRIMARY KEY AUTOINCREMENT,
              customer_name TEXT NOT NULL,
              customer_email TEXT NOT NULL,
              order_date TEXT DEFAULT (DATETIME('now')),
              total_amount REAL NOT NULL
          );
          CREATE TABLE IF NOT EXISTS Order_Items (
              order_item_id INTEGER PRIMARY KEY AUTOINCREMENT,
              order_id INTEGER NOT NULL,
              product_id INTEGER NOT NULL,
              quantity INTEGER NOT NULL,
              unit_price REAL NOT NULL,
              FOREIGN KEY (order_id) REFERENCES Orders(order_id),
              FOREIGN KEY (product_id) REFERENCES Products(product_id)
          );
        `;

        sqliteDb.exec(sqliteSchema, (err) => {
          if (err) {
            console.error('Error creating SQLite tables:', err);
            return resolve();
          }

          // Check if seed needed
          sqliteDb.get("SELECT COUNT(*) AS count FROM Categories", (err, row) => {
            if (!err && row && row.count === 0) {
              const cleanedSeed = seedSql
                .split('\n')
                .filter(line => !line.trim().startsWith('--') && !line.toUpperCase().includes('USE '))
                .join('\n');
              
              const translatedSeed = translateSqlToSqlite(cleanedSeed);
              sqliteDb.exec(translatedSeed, (seedErr) => {
                if (seedErr) {
                  // Fallback statement by statement insertion if multi-statement fails
                  const statements = translatedSeed.split(';').filter(s => s.trim().length > 0);
                  let completed = 0;
                  statements.forEach(stmt => {
                    sqliteDb.run(stmt.trim(), () => {
                      completed++;
                      if (completed === statements.length) resolve();
                    });
                  });
                } else {
                  console.log('✅ SQLite database seeded successfully.');
                  resolve();
                }
              });
            } else {
              resolve();
            }
          });
        });
      } catch (fileErr) {
        console.warn('Could not load schema/seed for SQLite:', fileErr.message);
        resolve();
      }
    });
  });
}

// Connect to Database (MySQL first, SQLite as fallback)
async function initDb() {
  if (PREFER_DB_TYPE === 'sqlite') {
    await initSqliteFallback();
    return;
  }

  try {
    pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    const conn = await pool.getConnection();
    console.log(`✅ Connected to MySQL database '${DB_NAME}' at ${DB_HOST}:${DB_PORT}`);
    conn.release();
    dbMode = 'mysql';
  } catch (err) {
    console.warn(`⚠️  MySQL connection failed (${err.message}). Falling back to SQLite for seamless operation.`);
    await initSqliteFallback();
  }
}

// Unified Query interface returning [rows]
async function query(sql, params = []) {
  if (dbMode === 'mysql' && pool) {
    return await pool.query(sql, params);
  }

  return new Promise((resolve, reject) => {
    const translatedSql = translateSqlToSqlite(sql);
    const isSelect = translatedSql.trim().toUpperCase().startsWith('SELECT');

    if (isSelect) {
      sqliteDb.all(translatedSql, params, (err, rows) => {
        if (err) return reject(err);
        resolve([rows]);
      });
    } else {
      sqliteDb.run(translatedSql, params, function (err) {
        if (err) return reject(err);
        // Emulate MySQL result object (insertId, affectedRows)
        resolve([{ insertId: this.lastID, affectedRows: this.changes }]);
      });
    }
  });
}

// Transaction helper for Order submission
async function getConnection() {
  if (dbMode === 'mysql' && pool) {
    const connection = await pool.getConnection();
    return {
      beginTransaction: () => connection.beginTransaction(),
      commit: () => connection.commit(),
      rollback: () => connection.rollback(),
      query: (sql, params) => connection.query(sql, params),
      release: () => connection.release()
    };
  }

  // SQLite transaction wrapper
  return new Promise((resolve, reject) => {
    sqliteDb.run("BEGIN TRANSACTION", (err) => {
      if (err) return reject(err);
      
      const connectionWrapper = {
        beginTransaction: async () => {},
        commit: async () => {
          return new Promise((res, rej) => sqliteDb.run("COMMIT", e => e ? rej(e) : res()));
        },
        rollback: async () => {
          return new Promise((res, rej) => sqliteDb.run("ROLLBACK", e => e ? rej(e) : res()));
        },
        query: (sql, params = []) => {
          return new Promise((res, rej) => {
            const translatedSql = translateSqlToSqlite(sql);
            const isSelect = translatedSql.trim().toUpperCase().startsWith('SELECT');
            if (isSelect) {
              sqliteDb.all(translatedSql, params, (e, rows) => e ? rej(e) : res([rows]));
            } else {
              sqliteDb.run(translatedSql, params, function (e) {
                if (e) return rej(e);
                res([{ insertId: this.lastID, affectedRows: this.changes }]);
              });
            }
          });
        },
        release: () => {}
      };

      resolve(connectionWrapper);
    });
  });
}

module.exports = {
  initDb,
  query,
  getConnection,
  getMode: () => dbMode
};
