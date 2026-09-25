const express = require("express");
require("dotenv").config();

const pool = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

const app = express();

// Allow requests from our React frontend
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Authentication routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Task Manager API is running successfully",
  });
});

app.use("/api/tasks", taskRoutes);

// Start server only after checking database connection
const startServer = async () => {
  try {
    // Render provides PORT through environment variables.
    // 10000 is used as a fallback for local/other environments.
    const PORT = process.env.PORT || 10000;

    // Check database connection before starting the server.
    await pool.query("SELECT 1");

    console.log("MySQL database connected successfully");

    // Start the Express server after database connection succeeds.
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("MySQL connection failed:", error.message);
  }
};

startServer();
