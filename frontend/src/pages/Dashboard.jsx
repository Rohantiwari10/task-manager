import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  // Controls the mobile sidebar
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Temporary data.
  // We will replace this with API data next.
  const [stats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    localStorage.setItem("theme", theme);
  }, [theme]);

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
                <h2>{stats.total}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon orange">◷</div>

              <div>
                <p>Pending</p>
                <h2>{stats.pending}</h2>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">✓</div>

              <div>
                <p>Completed</p>
                <h2>{stats.completed}</h2>
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

            <div className="empty-state">
              <div className="empty-icon">✓</div>

              <h3>No tasks yet</h3>

              <p>Create your first task and start organizing your work.</p>

              <button className="create-task-button">
                + Create your first task
              </button>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
