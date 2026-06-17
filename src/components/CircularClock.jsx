import { useState, useEffect } from "react";

// Helper functions for drawing SVG arcs
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  
  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
}

function CircularClock({ tasks = [], currentIndex = 0, secondsLeft = 0 }) {
  const [time, setTime] = useState(new Date());

  // Update clock hands in real-time (smooth sweeps using requestAnimationFrame)
  useEffect(() => {
    let animId;
    const updateTime = () => {
      setTime(new Date());
      animId = requestAnimationFrame(updateTime);
    };
    animId = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(animId);
  }, []);

  const hrs = time.getHours();
  const mins = time.getMinutes();
  const secs = time.getSeconds();
  const ms = time.getMilliseconds();

  // Hand rotations
  const hrAngle = ((hrs % 12) * 30) + (mins * 0.5);
  const minAngle = (mins * 6) + (secs * 0.1);
  // Smooth second hand sweep
  const secAngle = (secs * 6) + (ms * 0.006);

  // Compute Task Arcs
  const totalMins = tasks.reduce((sum, t) => sum + t.duration, 0) || 1;
  let accumulatedAngle = 0;
  const taskArcs = tasks.map((task) => {
    const angleSpan = (task.duration / totalMins) * 360;
    const startAngle = accumulatedAngle;
    const endAngle = accumulatedAngle + angleSpan;
    accumulatedAngle = endAngle;
    return {
      ...task,
      startAngle,
      endAngle,
    };
  });

  // Compute overall routine progress angle
  let completedDuration = 0;
  for (let i = 0; i < currentIndex; i++) {
    completedDuration += tasks[i]?.duration || 0;
  }
  const currentTask = tasks[currentIndex];
  if (currentTask && secondsLeft > 0) {
    const elapsedSecondsInTask = (currentTask.duration * 60) - secondsLeft;
    completedDuration += elapsedSecondsInTask / 60;
  }
  const overallProgressPercentage = (completedDuration / totalMins) * 100;
  const progressAngle = (completedDuration / totalMins) * 360;

  return (
    <div className="clock-visualizer">
      <svg width="280" height="280" viewBox="0 0 280 280" className="svg-wall-clock">
        <defs>
          {/* Shadow/Glow filters */}
          <filter id="clock-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="hand-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          {/* Gradients */}
          <radialGradient id="face-grad" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#0b0f19" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#1e293b" stopOpacity="0.4" />
          </radialGradient>
        </defs>

        {/* Clock Face Background */}
        <circle cx="140" cy="140" r="130" fill="url(#face-grad)" stroke="#334155" strokeWidth="2.5" />
        <circle cx="140" cy="140" r="122" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="4, 4" />

        {/* Clock hour marks */}
        {[...Array(12)].map((_, i) => {
          const angle = i * 30;
          const outerPt = polarToCartesian(140, 140, 118, angle);
          const innerPt = polarToCartesian(140, 140, i % 3 === 0 ? 108 : 113, angle);
          return (
            <line
              key={i}
              x1={outerPt.x}
              y1={outerPt.y}
              x2={innerPt.x}
              y2={innerPt.y}
              stroke={i % 3 === 0 ? "#00f0ff" : "#475569"}
              strokeWidth={i % 3 === 0 ? 2.5 : 1.5}
            />
          );
        })}

        {/* Task Matrix Ring (Radius 85) */}
        {tasks.length > 0 ? (
          taskArcs.map((arc, index) => {
            // If there's only one task or it occupies 360 degrees
            if (arc.endAngle - arc.startAngle >= 359.9) {
              return (
                <circle
                  key={arc.id}
                  cx="140"
                  cy="140"
                  r="85"
                  fill="none"
                  stroke={arc.color || "#00f0ff"}
                  strokeWidth="8"
                  opacity={index === currentIndex ? 1 : 0.45}
                  style={{ transition: "stroke 0.4s" }}
                />
              );
            }
            return (
              <path
                key={arc.id}
                d={describeArc(140, 140, 85, arc.startAngle, arc.endAngle)}
                fill="none"
                stroke={arc.color || "#00f0ff"}
                strokeWidth="8"
                strokeLinecap="round"
                opacity={index === currentIndex ? 1 : 0.4}
                className="task-arc"
                style={{ transition: "stroke 0.4s, opacity 0.3s" }}
              />
            );
          })
        ) : (
          <circle cx="140" cy="140" r="85" fill="none" stroke="#334155" strokeWidth="4" strokeDasharray="3, 3" />
        )}

        {/* Routine Overall Progress Pointer (Radius 85 ring pointer) */}
        {tasks.length > 0 && (
          <g transform={`rotate(${progressAngle} 140 140)`}>
            <circle
              cx="140"
              cy="55"
              r="6"
              fill="#ffffff"
              stroke="#00f0ff"
              strokeWidth="2"
              filter="url(#clock-glow)"
            />
          </g>
        )}

        {/* TIME HANDS (Hour, Minute, Smooth Second) */}
        {/* Hour Hand */}
        <line
          x1="140"
          y1="140"
          x2={polarToCartesian(140, 140, 60, hrAngle).x}
          y2={polarToCartesian(140, 140, 60, hrAngle).y}
          stroke="#94a3b8"
          strokeWidth="5"
          strokeLinecap="round"
        />

        {/* Minute Hand */}
        <line
          x1="140"
          y1="140"
          x2={polarToCartesian(140, 140, 95, minAngle).x}
          y2={polarToCartesian(140, 140, 95, minAngle).y}
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* Second Hand (Electric Pink sweep) */}
        <line
          x1="140"
          y1="140"
          x2={polarToCartesian(140, 140, 110, secAngle).x}
          y2={polarToCartesian(140, 140, 110, secAngle).y}
          stroke="#ff007a"
          strokeWidth="1.5"
          filter="url(#hand-glow)"
        />

        {/* Center Node */}
        <circle cx="140" cy="140" r="6.5" fill="#0f172a" stroke="#ff007a" strokeWidth="2" />
        <circle cx="140" cy="140" r="2.5" fill="#ffffff" />
      </svg>
      <div className="clock-digital-display">
        {time.toLocaleTimeString()}
      </div>
    </div>
  );
}

export default CircularClock;