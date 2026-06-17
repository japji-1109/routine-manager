import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { playChime } from "../utils/audioSynth";

function TaskCard({
  task,
  index,
  currentIndex,
  deleteTask,
  updateTask,
}) {
  const [expanded, setExpanded] = useState(false);
  const [newSubtaskText, setNewSubtaskText] = useState("");

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    borderLeft: `5px solid ${task.color || "#00f0ff"}`,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 99 : 1,
  };

  const isActive = index === currentIndex;

  const handlePropertyChange = (property, value) => {
    updateTask(task.id, { ...task, [property]: value });
  };

  // Subtask Handlers
  const handleAddSubtask = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (!newSubtaskText.trim()) return;
      const newSub = {
        id: Date.now() + Math.random(),
        text: newSubtaskText.trim(),
        completed: false,
      };
      const updatedSubtasks = [...(task.subtasks || []), newSub];
      handlePropertyChange("subtasks", updatedSubtasks);
      setNewSubtaskText("");
    }
  };

  const handleToggleSubtask = (subId) => {
    const updatedSubtasks = (task.subtasks || []).map((sub) =>
      sub.id === subId ? { ...sub, completed: !sub.completed } : sub
    );
    handlePropertyChange("subtasks", updatedSubtasks);
  };

  const handleDeleteSubtask = (subId) => {
    const updatedSubtasks = (task.subtasks || []).filter(
      (sub) => sub.id !== subId
    );
    handlePropertyChange("subtasks", updatedSubtasks);
  };

  const handleTestSound = () => {
    playChime(task.sound || "chime", 0.7);
  };

  const colors = [
    "#00f0ff", // Electric Cyan
    "#00ff66", // Emerald Green
    "#bd00ff", // Neon Purple
    "#ffb800", // Amber Orange
    "#ff007a", // Hot Pink
    "#3b82f6", // Ocean Blue
  ];

  const subtasksCount = task.subtasks?.length || 0;
  const subtasksCompleted =
    task.subtasks?.filter((s) => s.completed).length || 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`task-card-v2 ${isActive ? "active" : ""} ${
        task.completed ? "completed" : ""
      }`}
    >
      {/* Header section (Visible when collapsed & expanded) */}
      <div className="task-card-header">
        {/* Grab Handle */}
        <div className="grab-handle" {...attributes} {...listeners}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="5" r="1" />
            <circle cx="9" cy="12" r="1" />
            <circle cx="9" cy="19" r="1" />
            <circle cx="15" cy="5" r="1" />
            <circle cx="15" cy="12" r="1" />
            <circle cx="15" cy="19" r="1" />
          </svg>
        </div>

        {/* Task Summary Info */}
        <div className="task-info-summary" onClick={() => setExpanded(!expanded)}>
          <div className="title-row">
            <span className="task-index-badge">#{index + 1}</span>
            <h4 className="task-title-text">{task.title || "Untitled Task"}</h4>
            {task.completed && <span className="completed-badge">Done</span>}
          </div>
          <div className="meta-row">
            <span className="duration-tag">{task.duration}m</span>
            {subtasksCount > 0 && (
              <span className="subtasks-tag">
                {subtasksCompleted}/{subtasksCount} steps
              </span>
            )}
            <span className="sound-tag-name">🎵 {task.sound || "chime"}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="action-controls">
          <button
            onClick={() => setExpanded(!expanded)}
            className={`expand-btn ${expanded ? "open" : ""}`}
            title="Edit Task"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          <button
            onClick={() => deleteTask(task.id)}
            className="delete-btn-v2"
            title="Delete Task"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>

      {/* Expanded Editor Section */}
      {expanded && (
        <div className="task-card-body">
          <div className="editor-grid">
            {/* Left Column: Properties */}
            <div className="property-editor">
              <div className="editor-group">
                <label>Task Name</label>
                <input
                  type="text"
                  value={task.title}
                  onChange={(e) => handlePropertyChange("title", e.target.value)}
                  placeholder="Task Name"
                />
              </div>

              <div className="editor-group">
                <label>Duration (Minutes)</label>
                <input
                  type="number"
                  min="0.1"
                  step="any"
                  value={task.duration}
                  onChange={(e) =>
                    handlePropertyChange("duration", Number(e.target.value) || 0)
                  }
                  placeholder="Duration"
                />
              </div>

              <div className="editor-group">
                <label>Alarm Sound</label>
                <div className="sound-selector-row">
                  <select
                    value={task.sound || "chime"}
                    onChange={(e) => handlePropertyChange("sound", e.target.value)}
                  >
                    <option value="chime">Glass Chime 🔔</option>
                    <option value="bowl">Zen Bowl 🧘</option>
                    <option value="synth">Synth Pluck 🎹</option>
                    <option value="pulse">Pulsing Alarm 🚨</option>
                  </select>
                  <button onClick={handleTestSound} className="test-sound-btn">
                    Play
                  </button>
                </div>
              </div>

              <div className="editor-group">
                <label>Theme Color</label>
                <div className="color-palette">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => handlePropertyChange("color", c)}
                      className={`color-dot ${task.color === c ? "selected" : ""}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Sub-tasks */}
            <div className="subtask-editor">
              <label>Sub-tasks Checklist</label>
              
              {/* Add Subtask Input */}
              <div className="subtask-input-row">
                <input
                  type="text"
                  value={newSubtaskText}
                  onChange={(e) => setNewSubtaskText(e.target.value)}
                  onKeyDown={handleAddSubtask}
                  placeholder="Add step and press Enter..."
                />
                <button onClick={handleAddSubtask} className="add-subtask-btn">
                  +
                </button>
              </div>

              {/* Checklist list */}
              <div className="subtasks-editor-list">
                {subtasksCount === 0 && (
                  <span className="no-subtasks-text">No micro-steps added yet.</span>
                )}
                {task.subtasks?.map((sub) => (
                  <div key={sub.id} className="subtask-editor-item">
                    <input
                      type="checkbox"
                      checked={sub.completed}
                      onChange={() => handleToggleSubtask(sub.id)}
                    />
                    <span className={sub.completed ? "line-through" : ""}>
                      {sub.text}
                    </span>
                    <button
                      onClick={() => handleDeleteSubtask(sub.id)}
                      className="delete-subtask-item"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskCard;