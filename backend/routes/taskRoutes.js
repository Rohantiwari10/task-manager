const express = require("express");

const router = express.Router();

const {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

// GET /api/tasks - get all tasks
router.get("/", getTasks);

// POST /api/tasks - create a new task
router.post("/", createTask);

// PUT /api/tasks/:id - update an existing task
router.put("/:id", updateTask);

// DELETE /api/tasks/:id - delete a task
router.delete("/:id", deleteTask);

module.exports = router;
