const express = require("express");
require("dotenv").config();

const pool = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const dns = require("dns").promises;
const net = require("net");

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
    const PORT = process.env.PORT || 10000;

    // Start the server first so Render can detect the open port
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Check whether Render can resolve the Aiven hostname
    const addresses = await dns.lookup(process.env.DB_HOST, {
      all: true,
    });

    console.log("Aiven DNS addresses:", addresses);

    // Check whether Render can reach Aiven MySQL port
    const socket = net.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      timeout: 10000,
    });

    socket.on("connect", async () => {
      console.log("TCP connection to Aiven successful");

      socket.destroy();

      // Test actual MySQL connection
      try {
        await pool.query("SELECT 1");

        console.log("MySQL database connected successfully");
      } catch (error) {
        console.error("MySQL connection failed:", error.message);
      }
    });

    socket.on("timeout", () => {
      console.error("TCP connection to Aiven timed out");
      socket.destroy();
    });

    socket.on("error", (error) => {
      console.error("TCP connection error:", error.message);
    });
  } catch (error) {
    console.error("DNS lookup failed:", error.message);
  }
};

startServer();
