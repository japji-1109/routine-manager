import React from "react";

const COLOR_TO_CATEGORY = {
  "#00f0ff": { name: "Focus & Work", label: "Focus" },
  "#00ff66": { name: "Exercise & Physical", label: "Physical" },
  "#bd00ff": { name: "Mindset & Meditate", label: "Mindset" },
  "#ffb800": { name: "Nutrition & Breaks", label: "Nutrition" },
  "#ff007a": { name: "Hygiene & Care", label: "Hygiene" },
  "#3b82f6": { name: "Rest & Reflection", label: "Rest" },
};

function Analytics({ tasks = [], currentIndex = 0, sessionLogs = [] }) {
  const totalTasks = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.completed).length;

  const totalDuration = tasks.reduce((sum, t) => sum + t.duration, 0);
  const completedDuration = tasks
    .filter((t) => t.completed)
    .reduce((sum, t) => sum + t.duration, 0);

  // Calculate category distributions
  const categoryDurations = {};
  // Initialize categories
  Object.keys(COLOR_TO_CATEGORY).forEach((color) => {
    categoryDurations[color] = 0;
  });

  tasks.forEach((task) => {
    const color = task.color || "#00f0ff";
    if (categoryDurations[color] !== undefined) {
      categoryDurations[color] += task.duration;
    } else {
      categoryDurations[color] = task.duration;
    }
  });

  const categoryBreakdown = Object.keys(COLOR_TO_CATEGORY)
    .map((color) => {
      const duration = categoryDurations[color] || 0;
      const pct = totalDuration > 0 ? (duration / totalDuration) * 100 : 0;
      return {
        color,
        duration,
        percentage: Math.round(pct),
        ...COLOR_TO_CATEGORY[color],
      };
    })
    .filter((cat) => cat.duration > 0); // Only show categories present in the current routine

  const routineProgressPercentage =
    totalDuration > 0 ? Math.round((completedDuration / totalDuration) * 100) : 0;

  return (
    <div className="analytics-container">
      <h3>📊 Routine Analytics</h3>

      <div className="analytics-metrics-grid">
        <div className="metric-card">
          <span className="metric-label">Completed Tasks</span>
          <span className="metric-value">
            {completedTasksCount} <span className="metric-slash">/</span> {totalTasks}
          </span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Completed Time</span>
          <span className="metric-value">
            {completedDuration.toFixed(1)}m{" "}
            <span className="metric-slash">/</span> {totalDuration.toFixed(1)}m
          </span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Progress</span>
          <span className="metric-value">{routineProgressPercentage}%</span>
        </div>
      </div>

      {/* Routine Progress Bar */}
      <div className="analytics-progress-bar-container">
        <div
          className="analytics-progress-bar-fill"
          style={{
            width: `${routineProgressPercentage}%`,
            background: "linear-gradient(90deg, #00f0ff, #bd00ff)",
            boxShadow: "0 0 10px rgba(0, 240, 255, 0.4)",
          }}
        />
      </div>

      {/* Category Breakdown list */}
      <div className="category-breakdown-section">
        <h4>Category Allocation</h4>
        {categoryBreakdown.length === 0 ? (
          <p className="no-analytics-text">Add tasks to see category breakdown.</p>
        ) : (
          <div className="category-bars-list">
            {categoryBreakdown.map((cat) => (
              <div key={cat.color} className="category-bar-item">
                <div className="category-bar-info">
                  <span className="category-name">
                    <span className="color-indicator-dot" style={{ backgroundColor: cat.color }} />
                    {cat.name}
                  </span>
                  <span className="category-pct">
                    {cat.duration.toFixed(1)} mins ({cat.percentage}%)
                  </span>
                </div>
                <div className="category-track">
                  <div
                    className="category-fill"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: cat.color,
                      boxShadow: `0 0 8px ${cat.color}60`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chronological Session Log */}
      <div className="session-log-section">
        <h4>Session History Log</h4>
        <div className="session-log-list">
          {sessionLogs.length === 0 ? (
            <p className="no-logs-text">No behaviors completed in this session yet.</p>
          ) : (
            sessionLogs.map((log) => (
              <div key={log.id} className="session-log-card">
                <span className="log-time">{log.timeCompleted}</span>
                <span className="log-title">{log.taskTitle}</span>
                <span className="log-duration">+{log.duration} mins</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Analytics;