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


const updateTask = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            title,
            description,
            status,
            priority,
            due_date
        } = req.body;

        const [result] = await pool.query(
            `UPDATE tasks
             SET title = ?,
                 description = ?,
                 status = ?,
                 priority = ?,
                 due_date = ?
             WHERE id = ?`,
            [title, description, status, priority, due_date, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.status(200).json({
            message: "Task updated successfully"
        });

    } catch (error) {
        console.error("Error updating task:", error.message);

        res.status(500).json({
            message: "Failed to update task"
        });
    }
};

module.exports = {
  getTasks,
  createTask,
  updateTask
};
