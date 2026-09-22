const express = require("express");

const router = express.Router();

const {
  registerUser,
  loginUser,
  getMe,
  guestLogin,
} = require("../controllers/authController");

const authenticateToken = require("../middleware/authMiddleware");

// POST /api/auth/register
router.post("/register", registerUser);

// POST /api/auth/login
router.post("/login", loginUser);

// POST /api/auth/guest
router.post("/guest", guestLogin);

// GET /api/auth/me
// Protected route: user must send a valid JWT.
router.get("/me", authenticateToken, getMe);

module.exports = router;
