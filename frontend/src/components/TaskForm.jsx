import { useEffect, useState } from "react";

import api from "../services/api";

import "./TaskForm.css";

const TaskForm = ({ task, onClose, onTaskCreated, onTaskUpdated }) => {
  const isEditMode = Boolean(task);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    status: "pending",
    due_date: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // When editing, fill the form with the selected task
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "medium",
        status: task.status || "pending",
        due_date: task.due_date ? task.due_date.split("T")[0] : "",
      });
    }
  }, [task]);

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

      if (isEditMode) {
        // Update existing task
        await api.put(`/tasks/${task.id}`, formData);

        onTaskUpdated();
      } else {
        // Create new task
        await api.post("/tasks", formData);

        onTaskCreated();
      }

      onClose();
    } catch (error) {
      console.error("Error saving task:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/";
        return;
      }

      setError(error.response?.data?.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-overlay">
      <div className="task-form-modal">
        <div className="task-form-header">
          <div>
            <p className="section-label">
              {isEditMode ? "EDIT TASK" : "NEW TASK"}
            </p>

            <h2>{isEditMode ? "Edit Task" : "Create Task"}</h2>
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

          {/* Status - useful when editing */}
          {isEditMode && (
            <div className="form-group">
              <label htmlFor="status">Status</label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>

                <option value="completed">Completed</option>
              </select>
            </div>
          )}

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
              {loading
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
