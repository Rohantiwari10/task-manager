import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // Save JWT for future protected API requests
      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Unable to login");
    }
  };

  // Login as a new temporary guest user.
  const handleGuestLogin = async () => {
    try {
      setError("");

      const response = await api.post("/auth/guest");

      // Save guest JWT just like a normal login.
      localStorage.setItem("token", response.data.token);

      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Unable to continue as guest");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* Left branding section */}
        <div className="auth-brand">
          <div className="brand-icon">✓</div>

          <h1>TaskFlow</h1>

          <p>Organize your work, manage your tasks, and stay productive.</p>

          <div className="brand-features">
            <span>✓ Simple task management</span>
            <span>✓ Secure authentication</span>
            <span>✓ Track your progress</span>
          </div>
        </div>

        {/* Login form */}
        <div className="auth-card">
          <div className="auth-header">
            <h2>Welcome back</h2>
            <p>Login to continue to your workspace</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="primary-button">
              Login
            </button>
          </form>

          {/* Guest login */}
          <button
            type="button"
            className="guest-button"
            onClick={handleGuestLogin}
          >
            Continue as Guest
          </button>

          <p className="auth-footer">
            Don't have an account?
            <span onClick={() => navigate("/register")}>Create account</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
