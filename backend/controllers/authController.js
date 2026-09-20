const pool = require("../config/db");
const bcrypt = require("bcryptjs");

// Register a new user
const registerUser = async (req, res) => {
  try {
    // Get user data sent by the client
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    // Check whether the email is already registered
    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    // Convert plain password into a secure hash
    const passwordHash = await bcrypt.hash(password, 10);

    // Store the user and password hash in MySQL
    const [result] = await pool.query(
      `INSERT INTO users (name, email, password)
             VALUES (?, ?, ?)`,
      [name, email, passwordHash],
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Error registering user:", error.message);

    res.status(500).json({
      message: "Failed to register user",
    });
  }
};

module.exports = {
  registerUser,
};
