const pool = require("../config/db");

// Get all tasks from the database
const getTasks = async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM tasks"
        );

        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching tasks:", error.message);

        res.status(500).json({
            message: "Failed to fetch tasks"
        });
    }
};

module.exports = {
    getTasks
};