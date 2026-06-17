import { useState } from "react";

function TaskForm({ tasks, setTasks }) {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [sound, setSound] = useState("chime");
  const [color, setColor] = useState("#00f0ff");

  const colors = [
    "#00f0ff", // Electric Cyan
    "#00ff66", // Emerald Green
    "#bd00ff", // Neon Purple
    "#ffb800", // Amber Orange
    "#ff007a", // Hot Pink
    "#3b82f6", // Ocean Blue
  ];

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!title.trim() || !duration) return;

    const newTask = {
      id: Date.now() + Math.random(),
      title: title.trim(),
      duration: Number(duration),
      sound,
      color,
      subtasks: [],
      completed: false,
    };

    setTasks([...tasks, newTask]);

    // Reset fields except sound/color for faster entry
    setTitle("");
    setDuration("");
  };

  return (
    <form className="task-form-v2" onSubmit={handleAddTask}>
      <h4>➕ Add New Behavior</h4>
      
      <div className="form-group-grid">
        <div className="form-field">
          <label htmlFor="task-name-input">Behavior Title</label>
          <input
            id="task-name-input"
            type="text"
            placeholder="e.g. Morning Meditate, Stretch"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="task-duration-input">Duration (minutes)</label>
          <input
            id="task-duration-input"
            type="number"
            min="0.1"
            step="any"
            placeholder="e.g. 5, 10"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-group-grid">
        <div className="form-field">
          <label htmlFor="task-sound-select">Synthetic Alarm</label>
          <select
            id="task-sound-select"
            value={sound}
            onChange={(e) => setSound(e.target.value)}
          >
            <option value="chime">Glass Chime 🔔</option>
            <option value="bowl">Zen Bowl 🧘</option>
            <option value="synth">Synth Pluck 🎹</option>
            <option value="pulse">Pulsing Alarm 🚨</option>
          </select>
        </div>

        <div className="form-field">
          <label>Accent Color</label>
          <div className="color-picker-row">
            {colors.map((c) => (
              <button
                type="button"
                key={c}
                onClick={() => setColor(c)}
                className={`color-picker-dot ${color === c ? "selected" : ""}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>

      <button type="submit" className="add-task-submit-btn">
        Append to Matrix
      </button>
    </form>
  );
}

export default TaskForm;