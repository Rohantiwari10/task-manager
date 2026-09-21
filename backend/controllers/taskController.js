const pool = require("../config/db");

// ======================================================
// GET ALL TASKS
// ======================================================
// Returns only tasks that belong to the currently logged-in user.
//
// The user ID comes from the verified JWT token:
// req.user.userId
const getTasks = async (req, res) => {
  try {
    // Get logged-in user's ID from the JWT
    const userId = req.user.userId;

    // Fetch only tasks belonging to this user
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

// ======================================================
// GET SINGLE TASK
// ======================================================
// Returns one task only if it belongs to the logged-in user.
const getTaskById = async (req, res) => {
  try {
    // Get task ID from the URL
    // Example: GET /api/tasks/4
    const { id } = req.params;

    // Get logged-in user's ID from the verified JWT
    const userId = req.user.userId;

    // Find the task only if it belongs to this user
    const [rows] = await pool.query(
      "SELECT * FROM tasks WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    // Task doesn't exist or belongs to another user
    if (rows.length === 0) {
      return res.status(404).json({
        message: "Task not found or access denied",
      });
    }

    // Return the requested task
    res.status(200).json(rows[0]);

  } catch (error) {
    console.error("Error fetching task:", error.message);

    res.status(500).json({
      message: "Failed to fetch task",
    });
  }
};

// ======================================================
// CREATE TASK
// ======================================================
// Creates a new task for the currently logged-in user.
//
// IMPORTANT:
// We do NOT take user_id from req.body.
// We get it from the verified JWT so that a user cannot
// create a task on behalf of another user.
const createTask = async (req, res) => {
  try {
    const { title, description, priority, due_date } = req.body;

    // Get logged-in user's ID from the verified JWT
    const userId = req.user.userId;

    // Validate required fields
    if (!title || !priority) {
      return res.status(400).json({
        message: "Title and priority are required",
      });
    }

    // Allow only supported priority values
    const validPriorities = ["low", "medium", "high"];

    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        message: "Priority must be low, medium or high",
      });
    }

    // Insert task and automatically associate it
    // with the logged-in user
    const [result] = await pool.query(
      `INSERT INTO tasks
       (title, description, priority, due_date, user_id)
       VALUES (?, ?, ?, ?, ?)`,
      [title, description, priority, due_date || null, userId],
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

// ======================================================
// UPDATE TASK
// ======================================================
// Updates a task only when it belongs to the logged-in user.
//
// This is important for AUTHORIZATION.
//
// Even if another user knows the task ID, they cannot
// modify that task because of:
// WHERE id = ? AND user_id = ?
const updateTask = async (req, res) => {
  try {
    // Get task ID from URL
    // Example: PUT /api/tasks/4
    const { id } = req.params;

    const { title, description, status, priority, due_date } = req.body;

    // Get logged-in user's ID from the verified JWT
    const userId = req.user.userId;

    // Validate required fields
    if (!title || !priority) {
      return res.status(400).json({
        message: "Title and priority are required",
      });
    }

    // Allow only supported priority values
    const validPriorities = ["low", "medium", "high"];

    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        message: "Priority must be low, medium or high",
      });
    }

    // Update ONLY if:
    // 1. Task ID matches
    // 2. Task belongs to logged-in user
    const [result] = await pool.query(
      `UPDATE tasks
       SET title = ?,
           description = ?,
           status = ?,
           priority = ?,
           due_date = ?
       WHERE id = ? AND user_id = ?`,
      [title, description, status, priority, due_date || null, id, userId],
    );

    // If no row was updated:
    // - task may not exist
    // - OR task belongs to another user
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

// ======================================================
// DELETE TASK
// ======================================================
// Deletes a task only if it belongs to the logged-in user.
const deleteTask = async (req, res) => {
  try {
    // Get task ID from URL
    // Example: DELETE /api/tasks/4
    const { id } = req.params;

    // Get logged-in user's ID from the verified JWT
    const userId = req.user.userId;

    // Delete only this user's task
    const [result] = await pool.query(
      "DELETE FROM tasks WHERE id = ? AND user_id = ?",
      [id, userId],
    );

    // No row means:
    // - task doesn't exist
    // - OR task belongs to another user
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

// Export all task controller functions
module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
