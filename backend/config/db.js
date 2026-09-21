const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,

  // Keep MySQL DATE values as "YYYY-MM-DD" strings.
  // This prevents JavaScript timezone conversion from changing the day.
  dateStrings: true,
});

module.exports = pool;