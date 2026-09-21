const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ======================================================
// REGISTER USER
// ======================================================
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic input validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    if (!email.includes("@")) {
      return res.status(400).json({
        message: "Please provide a valid email",
      });
    }

    // Check for duplicate email
    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "Email already registered",
      });
    }

    // Hash password before storing it
    const passwordHash = await bcrypt.hash(password, 10);

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

// ======================================================
// LOGIN USER
// ======================================================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user by email
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const user = users[0];

    // Compare entered password with bcrypt hash
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Create JWT
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

// ======================================================
// GET CURRENT USER
// ======================================================
// Returns profile information of the logged-in user.
//
// The auth middleware has already verified the JWT and
// stored the decoded user information in req.user.
const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Fetch only safe profile information.
    // Never return the password hash.
    const [users] = await pool.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [userId],
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(users[0]);
  } catch (error) {
    console.error("Error fetching profile:", error.message);

    res.status(500).json({
      message: "Failed to fetch profile",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
