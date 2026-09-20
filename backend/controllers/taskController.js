const pool = require("../config/db");

// Get all tasks from the database
const getTasks = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM tasks");

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);

    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, priority, due_date, user_id } = req.body;

    const [result] = await pool.query(
      `INSERT INTO tasks
            (title, description, priority, due_date, user_id)
            VALUES (?, ?, ?, ?, ?)`,
      [title, description, priority, due_date, user_id],
    );

    res.status(201).json({
      message: "Task created successfully",
      taskId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating task:", error.message);

    res.status(500).json({
      message: "Failed to create task",
    });
  }
};

module.exports = {
  getTasks,
  createTask,
};
