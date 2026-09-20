const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

// Login an existing user
const loginUser = async (req, res) => {
  try {
    // Get login credentials from the request body
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find the user by email
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    // Do not reveal whether the email exists
    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    // Compare the plain password with the stored bcrypt hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create a signed JWT after successful authentication
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("Error logging in:", error.message);

    res.status(500).json({
      message: "Login failed",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
