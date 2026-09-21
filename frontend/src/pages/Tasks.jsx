import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import api from "../services/api";

import "./Tasks.css";

const Tasks = () => {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Mobile sidebar
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Create/Edit task modal
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Tasks from backend
  const [tasks, setTasks] = useState([]);

  // Search and filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  // Sorting
  const [sortBy, setSortBy] = useState("due_asc");

  // API states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Stores the ID of the task currently being updated.
  // Prevents repeated checkbox clicks during an API request.
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  // ========================================
  // THEME
  // ========================================

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  // ========================================
  // FETCH TASKS
  // ========================================

  const fetchTasks = useCallback(
    async (showLoading = true) => {
      try {
        if (showLoading) {
          setLoading(true);
        }
        setError("");

        const response = await api.get("/tasks");

        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        setError(error.response?.data?.message || "Failed to load tasks");
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [navigate],
  );

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  // ========================================
  // MOBILE MENU
  // ========================================

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // ========================================
  // CREATE TASK
  // ========================================

  const openCreateForm = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  // ========================================
  // EDIT TASK
  // ========================================

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  // ========================================
  // DELETE TASK
  // ========================================

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await api.delete(`/tasks/${taskId}`);

      await fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      setError(error.response?.data?.message || "Failed to delete task");
    }
  };

  // ========================================
  // TOGGLE COMPLETION
  // ========================================

  const handleToggleComplete = async (task) => {
    try {
      setError("");
      setUpdatingTaskId(task.id);

      const newStatus = task.status === "completed" ? "pending" : "completed";

      await api.put(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        status: newStatus,
        priority: task.priority,

        // Keep the existing due date when changing status.
        due_date: task.due_date ? String(task.due_date).split("T")[0] : null,
      });

      // Fetch fresh data after the update succeeds.
      await fetchTasks(false);
    } catch (error) {
      console.error("Error updating task status:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      setError(error.response?.data?.message || "Failed to update task");
    } finally {
      // Allow checkbox interaction again.
      setUpdatingTaskId(null);
    }
  };

  // ========================================
  // AFTER CREATE / UPDATE
  // ========================================

  const handleTaskCreated = async () => {
    await fetchTasks();
  };

  const handleTaskUpdated = async () => {
    await fetchTasks();
  };

  // ========================================
  // CLOSE FORM
  // ========================================

  const closeTaskForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
  };

  // ========================================
  // FILTER TASKS
  // ========================================

  const filteredTasks = tasks
    // Status filter
    .filter((task) => {
      if (statusFilter === "all") {
        return true;
      }

      return task.status === statusFilter;
    })

    // Priority filter
    .filter((task) => {
      if (priorityFilter === "all") {
        return true;
      }

      return task.priority === priorityFilter;
    })

    // Search
    .filter((task) => {
      if (!search.trim()) {
        return true;
      }

      const searchText = search.toLowerCase();

      return (
        task.title?.toLowerCase().includes(searchText) ||
        task.description?.toLowerCase().includes(searchText)
      );
    });

  // ========================================
  // SORT TASKS
  // ========================================

  const getDateOnly = (date) => {
    if (!date) {
      return null;
    }

    return String(date).split("T")[0];
  };

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // Pending tasks always appear before completed tasks.
    const aCompleted = a.status === "completed";
    const bCompleted = b.status === "completed";

    if (aCompleted !== bCompleted) {
      return Number(aCompleted) - Number(bCompleted);
    }

    // ----------------------------------------
    // Due date sorting
    // ----------------------------------------

    if (sortBy === "due_asc" || sortBy === "due_desc") {
      const aDate = getDateOnly(a.due_date);
      const bDate = getDateOnly(b.due_date);

      // Both have no due date.
      if (!aDate && !bDate) {
        return 0;
      }

      // Tasks without due date go last.
      if (!aDate) {
        return 1;
      }

      if (!bDate) {
        return -1;
      }

      if (sortBy === "due_asc") {
        return aDate.localeCompare(bDate);
      }

      return bDate.localeCompare(aDate);
    }

    // ----------------------------------------
    // Created date sorting
    // ----------------------------------------

    if (sortBy === "newest") {
      return new Date(b.created_at) - new Date(a.created_at);
    }

    if (sortBy === "oldest") {
      return new Date(a.created_at) - new Date(b.created_at);
    }

    return 0;
  });

  // ========================================
  // UI
  // ========================================

  return (
    <div className="dashboard-page">
      {/* Create / Edit modal */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onClose={closeTaskForm}
          onTaskCreated={handleTaskCreated}
          onTaskUpdated={handleTaskUpdated}
        />
      )}

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="mobile-overlay" onClick={closeMobileMenu} />
      )}

      {/* ========================================
          SIDEBAR
      ======================================== */}

      <aside
        className={`sidebar ${mobileMenuOpen ? "mobile-sidebar-open" : ""}`}
      >
        <div className="sidebar-brand">
          <div className="sidebar-logo">✓</div>

          <span>TaskFlow</span>

          <button className="mobile-close-button" onClick={closeMobileMenu}>
            ×
          </button>
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => navigate("/dashboard")}>
            <span>▦</span>
            Dashboard
          </button>

          <button className="nav-item active" onClick={closeMobileMenu}>
            <span>✓</span>
            Tasks
          </button>

          <button className="nav-item" onClick={() => navigate("/profile")}>
            <span>◉</span>
            Profile
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button className="nav-item" onClick={handleLogout}>
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* ========================================
          MAIN AREA
      ======================================== */}

      <main className="dashboard-main">
        <Navbar
          theme={theme}
          toggleTheme={toggleTheme}
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        <section className="dashboard-content">
          {/* Page header */}
          <div className="tasks-page-header">
            <div>
              <p className="section-label">TASK MANAGEMENT</p>

              <h1>All Tasks</h1>

              <p>Search, filter and manage all your tasks.</p>
            </div>

            <button className="create-task-button" onClick={openCreateForm}>
              + Create Task
            </button>
          </div>

          {/* ========================================
              FILTERS
          ======================================== */}

          <div className="task-filters">
            {/* Search */}
            <input
              type="text"
              className="task-search"
              placeholder="Search tasks..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All Status</option>

              <option value="pending">Pending</option>

              <option value="completed">Completed</option>
            </select>

            {/* Priority */}
            <select
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
            >
              <option value="all">All Priority</option>

              <option value="low">Low</option>

              <option value="medium">Medium</option>

              <option value="high">High</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="due_asc">Due Date: Earliest</option>

              <option value="due_desc">Due Date: Latest</option>

              <option value="newest">Newest Created</option>

              <option value="oldest">Oldest Created</option>
            </select>
          </div>

          {/* Error */}
          {error && <div className="tasks-error">{error}</div>}

          {/* Loading */}
          {!error && loading && (
            <div className="empty-state">
              <h3>Loading tasks...</h3>

              <p>Please wait while we fetch your tasks.</p>
            </div>
          )}

          {/* No matching tasks */}
          {!error && !loading && sortedTasks.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">✓</div>

              <h3>
                {tasks.length === 0 ? "No tasks yet" : "No matching tasks"}
              </h3>

              <p>
                {tasks.length === 0
                  ? "Create your first task and start organizing your work."
                  : "Try changing your search or filters."}
              </p>

              {tasks.length === 0 && (
                <button className="create-task-button" onClick={openCreateForm}>
                  + Create your first task
                </button>
              )}
            </div>
          )}

          {/* Task list */}
          {!error && !loading && sortedTasks.length > 0 && (
            <div className="tasks-page-list">
              {sortedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleComplete={handleToggleComplete}
                  isUpdating={updatingTaskId === task.id}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Tasks;
