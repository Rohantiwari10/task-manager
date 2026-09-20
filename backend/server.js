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
        message: "Task Manager API is running successfully"
    });
});

app.use("/api/tasks", taskRoutes);

// Start server only after checking database connection
const startServer = async () => {
    try {
        // Test MySQL connection
        await pool.query("SELECT 1");

        console.log("MySQL database connected successfully");

        const PORT = process.env.PORT || 5000;

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error("MySQL connection failed:", error.message);

        // Stop application if database is unavailable
        process.exit(1);
    }
};

startServer();