const express = require("express");

const router = express.Router();

const authenticateToken = require("../middleware/authMiddleware");

const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// GET /api/tasks - get all tasks
router.get("/", authenticateToken, getTasks);

// GET /api/tasks/:id - get one task
router.get("/:id", authenticateToken, getTaskById);

// POST /api/tasks - create a new task
router.post("/", authenticateToken, createTask);

// PUT /api/tasks/:id - update an existing task
router.put("/:id", authenticateToken, updateTask);

// DELETE /api/tasks/:id - delete a task
router.delete("/:id", authenticateToken, deleteTask);

module.exports = router;
