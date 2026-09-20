const Navbar = ({ theme, toggleTheme, onMenuToggle }) => {
  return (
    <header className="dashboard-navbar">
      {/* Page title */}
      <div className="navbar-title">
        <p className="navbar-label">Workspace</p>

        <h2>My Tasks</h2>
      </div>

      {/* Right-side actions */}
      <div className="navbar-actions">
        {/* Theme toggle */}
        <button
          className="theme-button"
          onClick={toggleTheme}
          title="Toggle theme"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>

        {/* Mobile hamburger */}
        <button
          className="hamburger-button"
          onClick={onMenuToggle}
          title="Open navigation"
          aria-label="Open navigation"
        >
          ☰
        </button>
      </div>
    </header>
  );
};

export default Navbar;
