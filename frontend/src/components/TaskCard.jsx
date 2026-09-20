import "./TaskCard.css";

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const isCompleted = task.status === "completed";

  return (
    <div className={`task-card ${isCompleted ? "task-completed" : ""}`}>
      {/* Completion checkbox */}
      <button
        className={`task-check ${isCompleted ? "checked" : ""}`}
        onClick={() => onToggleComplete(task)}
        title={isCompleted ? "Mark as pending" : "Mark as completed"}
        aria-label={
          isCompleted ? "Mark task as pending" : "Mark task as completed"
        }
      >
        {isCompleted ? "✓" : ""}
      </button>

      {/* Task information */}
      <div className="task-info">
        <h3>{task.title}</h3>

        {task.description && <p>{task.description}</p>}
      </div>

      {/* Status, priority and actions */}
      <div className="task-card-right">
        <div className="task-meta">
          <span className={`priority-${task.priority}`}>{task.priority}</span>

          <span className={`status-${task.status}`}>{task.status}</span>
        </div>

        <div className="task-actions">
          <button className="edit-task-button" onClick={() => onEdit(task)}>
            Edit
          </button>

          <button
            className="delete-task-button"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
