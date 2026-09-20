import { useState } from "react";

import api from "../services/api";

import "./TaskForm.css";

const TaskForm = ({ onClose, onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    due_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Update the corresponding form field
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      // JWT is automatically added by our Axios interceptor
      await api.post("/tasks", formData);

      // Tell Dashboard that a new task was created
      onTaskCreated();

      // Close the modal
      onClose();
    } catch (error) {
      console.error("Error creating task:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      }

      setError(error.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form-modal">
        <div className="task-form-header">
          <div>
            <p className="section-label">NEW TASK</p>
            <h2>Create Task</h2>
          </div>

          <button type="button" className="task-form-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">Title</label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Complete JWT authentication"
              required
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="description">Description</label>

            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add some details about this task..."
              rows="4"
            />
          </div>

          {/* Priority */}
          <div className="form-group">
            <label htmlFor="priority">Priority</label>

            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Due date */}
          <div className="form-group">
            <label htmlFor="due_date">Due Date</label>

            <input
              id="due_date"
              name="due_date"
              type="date"
              value={formData.due_date}
              onChange={handleChange}
            />
          </div>

          {/* API error */}
          {error && <p className="task-form-error">{error}</p>}

          {/* Actions */}
          <div className="task-form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-task-button"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
