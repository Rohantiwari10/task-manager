const pool = require("../config/db");

// Get tasks belonging only to the logged-in user
const getTasks = async (req, res) => {
  try {
    // userId comes from the verified JWT
    const userId = req.user.userId;

    // Fetch only this user's tasks
    const [rows] = await pool.query("SELECT * FROM tasks WHERE user_id = ?", [
      userId,
    ]);

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching tasks:", error.message);

    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
};

// Create a task for the currently logged-in user
const createTask = async (req, res) => {
  try {
    const { title, description, priority, due_date } = req.body;

    // Get user ID from the verified JWT
    const userId = req.user.userId;

    const [result] = await pool.query(
      `INSERT INTO tasks
       (title, description, priority, due_date, user_id)
       VALUES (?, ?, ?, ?, ?)`,
      [title, description, priority, due_date, userId],
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

// Update a task only if it belongs to the logged-in user
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, status, priority, due_date } = req.body;

    // Get the logged-in user's ID from the verified JWT
    const userId = req.user.userId;

    // Update only the task owned by this user
    const [result] = await pool.query(
      `UPDATE tasks
       SET title = ?,
           description = ?,
           status = ?,
           priority = ?,
           due_date = ?
       WHERE id = ? AND user_id = ?`,
      [title, description, status, priority, due_date, id, userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Task not found or access denied",
      });
    }

    res.status(200).json({
      message: "Task updated successfully",
    });
  } catch (error) {
    console.error("Error updating task:", error.message);

    res.status(500).json({
      message: "Failed to update task",
    });
  }
};

// Delete a task only if it belongs to the logged-in user
const deleteTask = async (req, res) => {
  try {
    // Get task ID from the URL
    const { id } = req.params;

    // Get logged-in user's ID from the verified JWT
    const userId = req.user.userId;

    // Delete only this user's task
    const [result] = await pool.query(
      "DELETE FROM tasks WHERE id = ? AND user_id = ?",
      [id, userId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Task not found or access denied",
      });
    }

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task:", error.message);

    res.status(500).json({
      message: "Failed to delete task",
    });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
