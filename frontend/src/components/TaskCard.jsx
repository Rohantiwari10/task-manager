import "./TaskCard.css";

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete, isUpdating }) => {
  const isCompleted = task.status === "completed";

  // MySQL DATE should be treated as a date-only value.
  // We avoid new Date() here because timezone conversion
  // can change the displayed day.
  const getDateOnly = (date) => {
    if (!date) {
      return null;
    }

    return String(date).split("T")[0];
  };

  const dueDate = getDateOnly(task.due_date);

  // Display YYYY-MM-DD as DD Mon YYYY without timezone conversion.
  const formattedDueDate = dueDate
    ? (() => {
        const [year, month, day] = dueDate.split("-");

        const monthNames = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        return `${day} ${monthNames[Number(month) - 1]} ${year}`;
      })()
    : null;

  return (
    <div className={`task-card ${isCompleted ? "task-completed" : ""}`}>
      {/* Completion checkbox */}
      <button
        className={`task-check ${isCompleted ? "checked" : ""}`}
        onClick={() => onToggleComplete(task)}
        disabled={isUpdating}
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

        {formattedDueDate ? (
          <small className="task-due-date">Due: {formattedDueDate}</small>
        ) : (
          <small className="task-due-date">No due date</small>
        )}
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
