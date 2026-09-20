import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import api from "../services/api";

import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Controls the mobile sidebar
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Stores tasks received from the backend
  const [tasks, setTasks] = useState([]);

  // UI states for API request
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    localStorage.setItem("theme", theme);
  }, [theme]);

  // Fetch tasks when dashboard loads
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        setError("");

        // JWT is automatically added by the Axios interceptor
        const response = await api.get("/tasks");

        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);

        // If token is invalid/expired, send user back to login
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }

        setError(error.response?.data?.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [navigate]);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  // Close mobile menu after selecting an item
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Calculate dashboard statistics from real API data
  const total = tasks.length;

  const completed = tasks.filter((task) => task.status === "completed").length;

  const pending = tasks.filter((task) => task.status !== "completed").length;

  return (
    <div className="dashboard-page">
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

          {/* Close button - mobile only */}
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

        {/* Logout stays in sidebar only */}
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

        {/* ========================================
            SCROLLABLE CONTENT
        ======================================== */}

        <section className="dashboard-content">
          {/* Welcome */}
          <div className="welcome-section">
            <div>
              <p className="section-label">OVERVIEW</p>

              <h1>Welcome back 👋</h1>

              <p>Here's what's happening with your tasks.</p>
            </div>

            <button className="create-task-button">+ Create Task</button>
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

          {/* Tasks */}
          <section className="tasks-section">
            <div className="tasks-header">
              <div>
                <h2>Your Tasks</h2>

                <p>Manage your work and stay organized.</p>
              </div>

              <button className="view-all-button">View all</button>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="empty-state">
                <h3>Loading tasks...</h3>

                <p>Please wait while we fetch your tasks.</p>
              </div>
            )}

            {/* Error state */}
            {!loading && error && (
              <div className="empty-state">
                <h3>Unable to load tasks</h3>

                <p>{error}</p>
              </div>
            )}

            {/* Empty state */}
            {!loading && !error && tasks.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">✓</div>

                <h3>No tasks yet</h3>

                <p>Create your first task and start organizing your work.</p>

                <button className="create-task-button">
                  + Create your first task
                </button>
              </div>
            )}

            {/* Task list */}
            {!loading && !error && tasks.length > 0 && (
              <div className="task-list">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
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
