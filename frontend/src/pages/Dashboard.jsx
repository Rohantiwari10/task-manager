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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [showTaskForm, setShowTaskForm] = useState(false);

  const [editingTask, setEditingTask] = useState(null);

  // Tasks received from the backend.
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Stores the ID of the task currently being updated.
  // This prevents repeated checkbox clicks while the API request is running.
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
        // Only show the full loading state on initial/page loading.
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
        // Don't show the loading screen during small background refreshes.
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
  // DATE HELPERS
  // ========================================

  // Converts a date into YYYY-MM-DD.
  const getDateOnly = (date) => {
    if (!date) {
      return null;
    }

    return String(date).split("T")[0];
  };

  // Get today's date using the user's local time.
  const getToday = () => {
    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, "0");

    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

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
  // CREATE
  // ========================================

  const openCreateForm = () => {
    setEditingTask(null);
    setShowTaskForm(true);
  };

  // ========================================
  // EDIT
  // ========================================

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  // ========================================
  // DELETE
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
  // COMPLETE / PENDING
  // ========================================

  const handleToggleComplete = async (task) => {
    try {
      setError("");
      setUpdatingTaskId(task.id);

      // Toggle between pending and completed.
      const newStatus = task.status === "completed" ? "pending" : "completed";

      await api.put(`/tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        status: newStatus,
        priority: task.priority,
        due_date: task.due_date ? String(task.due_date).split("T")[0] : null,
      });

      // Fetch fresh data after successful update.
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
  // STATISTICS
  // ========================================

  const total = tasks.length;

  const completed = tasks.filter((task) => task.status === "completed").length;

  const pending = tasks.filter((task) => task.status !== "completed").length;

  // ========================================
  // DASHBOARD TASK GROUPS
  // ========================================

  const today = getToday();

  // Dashboard only displays unfinished tasks.
  const pendingTasks = tasks.filter((task) => task.status !== "completed");

  // Tasks whose due date has already passed.
  const overdueTasks = pendingTasks
    .filter((task) => {
      const dueDate = getDateOnly(task.due_date);

      return dueDate && dueDate < today;
    })
    .sort((a, b) =>
      getDateOnly(a.due_date).localeCompare(getDateOnly(b.due_date)),
    )
    .slice(0, 5);

  // Tasks due today.
  const todayTasks = pendingTasks
    .filter((task) => getDateOnly(task.due_date) === today)
    .slice(0, 5);

  // Tasks with a future due date.
  const upcomingTasks = pendingTasks
    .filter((task) => {
      const dueDate = getDateOnly(task.due_date);

      return dueDate && dueDate > today;
    })
    .sort((a, b) =>
      getDateOnly(a.due_date).localeCompare(getDateOnly(b.due_date)),
    )
    .slice(0, 5);

  // Tasks without a due date.
  const noDueDateTasks = pendingTasks
    .filter((task) => !getDateOnly(task.due_date))
    .slice(0, 3);

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
          <button
            className="nav-item active"
            onClick={() => navigate("/dashboard")}
          >
            <span>▦</span>
            Dashboard
          </button>

          <button className="nav-item" onClick={() => navigate("/tasks")}>
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
          {/* Welcome */}
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

          {/* Statistics */}
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
              TASK OVERVIEW
          ======================================== */}

          <section className="tasks-section">
            <div className="tasks-header">
              <div>
                <h2>Your Tasks</h2>

                <p>Focus on what's coming next.</p>
              </div>

              <button
                className="view-all-button"
                onClick={() => navigate("/tasks")}
              >
                View all
              </button>
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

            {/* No pending tasks */}
            {!error && !loading && pendingTasks.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">✓</div>

                <h3>You're all caught up!</h3>

                <p>You don't have any pending tasks right now.</p>

                <button className="create-task-button" onClick={openCreateForm}>
                  + Create a task
                </button>
              </div>
            )}

            {/* Pending task groups */}
            {!error && !loading && pendingTasks.length > 0 && (
              <div className="dashboard-task-groups">
                {/* Overdue */}
                <div className="dashboard-task-group">
                  <div className="dashboard-task-group-header">
                    <h3>Overdue</h3>

                    <span>{overdueTasks.length}</span>
                  </div>

                  {overdueTasks.length > 0 ? (
                    <div className="task-list">
                      {overdueTasks.map((task) => (
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
                  ) : (
                    <p className="dashboard-empty-group">No overdue tasks.</p>
                  )}
                </div>

                {/* Today */}
                <div className="dashboard-task-group">
                  <div className="dashboard-task-group-header">
                    <h3>Today</h3>

                    <span>{todayTasks.length}</span>
                  </div>

                  {todayTasks.length > 0 ? (
                    <div className="task-list">
                      {todayTasks.map((task) => (
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
                  ) : (
                    <p className="dashboard-empty-group">No tasks due today.</p>
                  )}
                </div>

                {/* Upcoming */}
                <div className="dashboard-task-group">
                  <div className="dashboard-task-group-header">
                    <h3>Upcoming</h3>

                    <span>{upcomingTasks.length}</span>
                  </div>

                  {upcomingTasks.length > 0 ? (
                    <div className="task-list">
                      {upcomingTasks.map((task) => (
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
                  ) : (
                    <p className="dashboard-empty-group">No upcoming tasks.</p>
                  )}
                </div>

                {/* No Due Date */}
                <div className="dashboard-task-group">
                  <div className="dashboard-task-group-header">
                    <h3>No Due Date</h3>

                    <span>{noDueDateTasks.length}</span>
                  </div>

                  {noDueDateTasks.length > 0 ? (
                    <div className="task-list">
                      {noDueDateTasks.map((task) => (
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
                  ) : (
                    <p className="dashboard-empty-group">
                      No tasks without a due date.
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
