import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Register.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess("");

      // Send registration data to backend
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      setSuccess("Account created successfully!");

      // Give the user a moment to see the success message
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (error) {
      setError(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">

        {/* Branding section */}
        <div className="auth-brand">
          <div className="brand-icon">✓</div>

          <h1>TaskFlow</h1>

          <p>
            Create your workspace and start managing
            your tasks efficiently.
          </p>

          <div className="brand-features">
            <span>✓ Create and organize tasks</span>
            <span>✓ Track task priorities</span>
            <span>✓ Keep your work secure</span>
          </div>
        </div>

        {/* Registration form */}
        <div className="auth-card">

          <div className="auth-header">
            <h2>Create account</h2>
            <p>Start managing your tasks today</p>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Name</label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

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
                placeholder="Minimum 6 characters"
                required
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                {success}
              </div>
            )}

            <button
              type="submit"
              className="primary-button"
            >
              Create Account
            </button>

          </form>

          <p className="auth-footer">
            Already have an account?

            <span onClick={() => navigate("/")}>
              Login
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;