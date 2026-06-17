import React from "react";

function CircularTimer({
  tasks = [],
  currentIndex = 0,
  secondsLeft = 0,
  taskProgress = 0,
  toggleSubtask,
}) {
  const activeTask = tasks[currentIndex];
  
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (taskProgress / 100) * circumference;

  // Format MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // Sub-task node positions
  const subtasks = activeTask?.subtasks || [];
  const totalSubtasks = subtasks.length;
  
  const subtaskNodes = subtasks.map((subtask, idx) => {
    // Distribute angles evenly around the 360deg circle (starting from -90deg at the top)
    const angleInDegrees = -90 + (idx * 360) / (totalSubtasks || 1);
    const angleInRadians = (angleInDegrees * Math.PI) / 180;
    
    const x = 140 + radius * Math.cos(angleInRadians);
    const y = 140 + radius * Math.sin(angleInRadians);
    
    return {
      ...subtask,
      x,
      y,
      index: idx,
    };
  });

  const activeColor = activeTask?.color || "#00f0ff";

  return (
    <div className="circular-timer-container">
      <div className="timer-svg-wrapper">
        <svg width="280" height="280" viewBox="0 0 280 280">
          <defs>
            {/* Outer ring glow */}
            <filter id="timer-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            
            {/* Color gradient specific to active task */}
            <linearGradient id="timer-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={activeColor} />
              <stop offset="100%" stopColor="#0a0f1d" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          {/* Background Ring */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            stroke="#1e293b"
            strokeWidth="10"
            fill="none"
          />

          {/* Progress Ring */}
          {activeTask && (
            <circle
              cx="140"
              cy="140"
              r={radius}
              stroke={activeColor}
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform="rotate(-90 140 140)"
              filter="url(#timer-glow)"
              style={{ transition: "stroke-dashoffset 0.05s linear, stroke 0.4s" }}
            />
          )}

          {/* Sub-task Milestone Nodes on the Ring */}
          {activeTask &&
            subtaskNodes.map((node) => (
              <g
                key={node.id}
                className="subtask-node-group"
                onClick={() => toggleSubtask(activeTask.id, node.id)}
                style={{ cursor: "pointer" }}
              >
                {/* Glow ring when completed */}
                {node.completed && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="10"
                    fill="none"
                    stroke={activeColor}
                    strokeWidth="1.5"
                    opacity="0.8"
                    filter="url(#timer-glow)"
                  />
                )}
                {/* Main dot */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="7"
                  fill={node.completed ? activeColor : "#0f172a"}
                  stroke={node.completed ? "#ffffff" : "#475569"}
                  strokeWidth="2.5"
                  className="subtask-node-dot"
                  style={{ transition: "fill 0.3s, stroke 0.3s" }}
                />
                {/* Index tooltip */}
                <text
                  x={node.x}
                  y={node.y + 3}
                  textAnchor="middle"
                  fill={node.completed ? "#000000" : "#94a3b8"}
                  fontSize="8"
                  fontWeight="bold"
                  pointerEvents="none"
                >
                  {node.index + 1}
                </text>
              </g>
            ))}
        </svg>

        {/* Center Countdown Display */}
        <div className="timer-content-center">
          {activeTask ? (
            <>
              <span className="current-task-badge" style={{ backgroundColor: `${activeColor}20`, color: activeColor, borderColor: `${activeColor}40` }}>
                {activeTask.title}
              </span>
              <div className="countdown-time" style={{ textShadow: `0 0 15px ${activeColor}40` }}>
                {formatTime(secondsLeft)}
              </div>
              <div className="timer-subtask-progress">
                {subtasks.filter((s) => s.completed).length} / {totalSubtasks} steps
              </div>
            </>
          ) : (
            <>
              <span className="current-task-badge neutral">Routine Idle</span>
              <div className="countdown-time idle">00:00</div>
              <div className="timer-subtask-progress">Ready to start</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CircularTimer;