const express = require("express");

const router = express.Router();

const { getTasks } = require("../controllers/taskController");

// GET /api/tasks
router.get("/", getTasks);

module.exports = router;