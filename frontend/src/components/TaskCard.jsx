import "./TaskCard.css";

const TaskCard = ({ task }) => {
  return (
    <div className="task-card">
      {/* Task information */}
      <div className="task-info">
        <h3>{task.title}</h3>

        {task.description && (
          <p>{task.description}</p>
        )}
      </div>

      {/* Task status and priority */}
      <div className="task-meta">
        <span className={`priority-${task.priority}`}>
          {task.priority}
        </span>

        <span className={`status-${task.status}`}>
          {task.status}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;