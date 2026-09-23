const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

// Create a MySQL connection pool.
// The pool manages multiple database connections efficiently.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  // Aiven requires an SSL connection.
  ssl: {
    ca: fs.readFileSync(path.join(__dirname, "..", process.env.DB_SSL_CA)),
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  // Keep MySQL DATE values as YYYY-MM-DD strings.
  // This prevents timezone-related date shifting in JavaScript.
  dateStrings: true,
});

module.exports = pool;
