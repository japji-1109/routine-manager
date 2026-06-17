import React from "react";

function ControlPanel({
  running,
  startTimer,
  pauseTimer,
  resetTimer,
  skipTask,
  prevTask,
  speedMultiplier,
  setSpeedMultiplier,
  currentIndex = 0,
  totalTasks = 0,
}) {
  const speeds = [1, 5, 10, 60];

  return (
    <div className="control-panel-v2">
      {/* Primary Player Controls */}
      <div className="player-controls">
        {/* Back Button */}
        <button
          onClick={prevTask}
          className="control-btn secondary-btn"
          disabled={currentIndex === 0}
          title="Previous Behavior"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="19 20 9 12 19 4 19 20"></polygon>
            <line x1="5" y1="19" x2="5" y2="5"></line>
          </svg>
        </button>

        {/* Play/Pause Button */}
        {running ? (
          <button
            onClick={pauseTimer}
            className="control-btn primary-btn active-pause"
            title="Pause Routine"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="6" y="4" width="4" height="16"></rect>
              <rect x="14" y="4" width="4" height="16"></rect>
            </svg>
          </button>
        ) : (
          <button
            onClick={startTimer}
            className="control-btn primary-btn active-play"
            disabled={totalTasks === 0}
            title="Start Routine"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          </button>
        )}

        {/* Skip Button */}
        <button
          onClick={skipTask}
          className="control-btn secondary-btn"
          disabled={totalTasks === 0}
          title="Skip Behavior"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 4 15 12 5 20 5 4"></polygon>
            <line x1="19" y1="5" x2="19" y2="19"></line>
          </svg>
        </button>

        {/* Reset Button */}
        <button
          onClick={resetTimer}
          className="control-btn danger-btn"
          disabled={totalTasks === 0}
          title="Reset Routine"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"></path>
          </svg>
        </button>
      </div>

      {/* Speed Multiplier Segment */}
      <div className="speed-multiplier-control">
        <span className="speed-label">Simulation Speed:</span>
        <div className="speed-pills">
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => setSpeedMultiplier(s)}
              className={`speed-pill ${speedMultiplier === s ? "active" : ""}`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;