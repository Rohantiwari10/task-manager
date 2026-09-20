import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import api from "../services/api";

import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Mobile sidebar state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Create/Edit task modal
  const [showTaskForm, setShowTaskForm] = useState(false);

  // Stores the task currently being edited
  const [editingTask, setEditingTask] = useState(null);

  // Tasks received from backend
  const [tasks, setTasks] = useState([]);

  // API states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // JWT is automatically added by Axios interceptor
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
      setLoading(false);
    }
  }, [navigate]);

  // Fetch tasks when dashboard loads
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
  // TOGGLE TASK COMPLETION
  // ========================================

  const handleToggleComplete = async (task) => {
    try {
      setError("");

      const newStatus = task.status === "completed" ? "pending" : "completed";

      // Backend update API requires the complete
      // task data, so send the existing values
      // with only status changed.
      await api.put(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        status: newStatus,
        priority: task.priority,
        due_date: task.due_date ? task.due_date.split("T")[0] : null,
      });

      // Fetch updated data so stats and ordering
      // are updated from the backend.
      await fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
        return;
      }

      setError(error.response?.data?.message || "Failed to update task");
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
  // STATISTICS
  // ========================================

  const total = tasks.length;

  const completed = tasks.filter((task) => task.status === "completed").length;

  const pending = tasks.filter((task) => task.status !== "completed").length;

  // ========================================
  // TASK ORDER
  // ========================================

  // Pending tasks first, completed tasks last.
  const sortedTasks = [...tasks].sort((a, b) => {
    const aCompleted = a.status === "completed";

    const bCompleted = b.status === "completed";

    return Number(aCompleted) - Number(bCompleted);
  });

  // ========================================
  // UI
  // ========================================

  return (
    <div className="dashboard-page">
      {/* ========================================
          CREATE / EDIT MODAL
      ======================================== */}

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
          <button className="nav-item active" onClick={closeMobileMenu}>
            <span>▦</span>
            Dashboard
          </button>

          <button className="nav-item" onClick={closeMobileMenu}>
            <span>✓</span>
            Tasks
          </button>

          <button className="nav-item" onClick={closeMobileMenu}>
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
          {/* ========================================
              WELCOME
          ======================================== */}

          <div className="welcome-section">
            <div>
              <p className="section-label">OVERVIEW</p>

              <h1>Welcome back 👋</h1>

              <p>Here's what's happening with your tasks.</p>
            </div>

            <button className="create-task-button" onClick={openCreateForm}>
              + Create Task
            </button>
          </div>

          {/* ========================================
              STATISTICS
          ======================================== */}

          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue">✓</div>

              <div>
                <p>Total Tasks</p>
                <h2>{total}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">◷</div>

              <div>
                <p>Pending</p>
                <h2>{pending}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">✓</div>

              <div>
                <p>Completed</p>
                <h2>{completed}</h2>
              </div>
            </div>
          </div>

          {/* ========================================
              TASKS
          ======================================== */}

          <section className="tasks-section">
            <div className="tasks-header">
              <div>
                <h2>Your Tasks</h2>

                <p>Manage your work and stay organized.</p>
              </div>

              <button className="view-all-button">View all</button>
            </div>

            {/* Error */}
            {error && (
              <div className="empty-state">
                <h3>Something went wrong</h3>

                <p>{error}</p>
              </div>
            )}

            {/* Loading */}
            {!error && loading && (
              <div className="empty-state">
                <h3>Loading tasks...</h3>

                <p>Please wait while we fetch your tasks.</p>
              </div>
            )}

            {/* Empty */}
            {!error && !loading && tasks.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">✓</div>

                <h3>No tasks yet</h3>

                <p>Create your first task and start organizing your work.</p>

                <button className="create-task-button" onClick={openCreateForm}>
                  + Create your first task
                </button>
              </div>
            )}

            {/* Task list */}
            {!error && !loading && tasks.length > 0 && (
              <div className="task-list">
                {sortedTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleComplete={handleToggleComplete}
                  />
                ))}
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
