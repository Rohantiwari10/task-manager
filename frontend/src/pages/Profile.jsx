import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";

import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Apply saved theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Fetch logged-in user's profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/auth/me");

        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);

        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          window.location.href = "/";
          return;
        }

        setError(error.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleNavigation = (path) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <div className="profile-page">
      {/* Sidebar */}
      <aside
        className={`profile-sidebar ${
          mobileMenuOpen ? "profile-sidebar-open" : ""
        }`}
      >
        <div className="profile-sidebar-brand">
          <div className="profile-brand-icon">✓</div>
          <h1>TaskFlow</h1>
        </div>

        <nav className="profile-sidebar-nav">
          <button
            className="profile-nav-button"
            onClick={() => handleNavigation("/dashboard")}
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            className="profile-nav-button"
            onClick={() => handleNavigation("/tasks")}
          >
            <span>✓</span>
            Tasks
          </button>

          <button
            className="profile-nav-button profile-nav-active"
            onClick={() => handleNavigation("/profile")}
          >
            <span>◉</span>
            Profile
          </button>
        </nav>

        <button className="profile-sidebar-logout" onClick={handleLogout}>
          <span>↪</span>
          Logout
        </button>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="profile-sidebar-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main area */}
      <div className="profile-main">
        <Navbar
          theme={theme}
          toggleTheme={toggleTheme}
          onMenuToggle={() => setMobileMenuOpen((current) => !current)}
        />

        <main className="profile-content">
          <div className="profile-heading">
            <p className="section-label">ACCOUNT</p>

            <h1>My Profile</h1>

            <p>View your account information.</p>
          </div>

          {loading && <div className="profile-message">Loading profile...</div>}

          {error && (
            <div className="profile-message profile-error">{error}</div>
          )}

          {profile && !loading && (
            <div className="profile-card">
              <div className="profile-avatar">
                {profile.name?.charAt(0).toUpperCase()}
              </div>

              <div className="profile-info">
                <h2>{profile.name}</h2>
                <p>{profile.email}</p>
              </div>

              <div className="profile-details">
                <div className="profile-detail">
                  <span>User ID</span>
                  <strong>{profile.id}</strong>
                </div>

                <div className="profile-detail">
                  <span>Name</span>
                  <strong>{profile.name}</strong>
                </div>

                <div className="profile-detail">
                  <span>Email</span>
                  <strong>{profile.email}</strong>
                </div>
              </div>

              <button className="profile-logout-button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
