import { useState, useEffect } from "react";
import Header from "./components/Header";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import CircularClock from "./components/CircularClock";
import CircularTimer from "./components/CircularTimer";
import ControlPanel from "./components/ControlPanel";
import Analytics from "./components/Analytics";
import { useTimer } from "./hooks/useTimer";
import { PRESETS } from "./utils/presets";

import "./styles/App.css";

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("routineTasks");
    // Seed with morning preset if localStorage is empty
    return savedTasks ? JSON.parse(savedTasks) : JSON.parse(JSON.stringify(PRESETS.morning));
  });

  const [activePresetName, setActivePresetName] = useState(() => {
    const savedPresetName = localStorage.getItem("activePresetName");
    return savedPresetName || "morning";
  });

  // Save tasks and preset name to localStorage
  useEffect(() => {
    localStorage.setItem("routineTasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("activePresetName", activePresetName);
  }, [activePresetName]);

  // High precision timer hook orchestration
  const {
    currentIndex,
    running,
    secondsLeft,
    speedMultiplier,
    setSpeedMultiplier,
    sessionLogs,
    taskProgress,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTask,
    prevTask,
  } = useTimer(tasks, setTasks);

  // Update specific task in matrix
  const updateTask = (taskId, updatedTask) => {
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)));
  };

  // Toggle sub-task item directly (used from the circular timer nodes and card checklists)
  const toggleSubtask = (taskId, subtaskId) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSubtasks = (t.subtasks || []).map((sub) =>
            sub.id === subtaskId ? { ...sub, completed: !sub.completed } : sub
          );
          return { ...t, subtasks: updatedSubtasks };
        }
        return t;
      })
    );
  };

  return (
    <div className="app-container">
      {/* Upper navigation header */}
      <Header
        tasks={tasks}
        setTasks={setTasks}
        activePresetName={activePresetName}
        setActivePresetName={setActivePresetName}
      />

      <div className="dashboard">
        {/* Left Side: Routine Matrix Sequence */}
        <div className="sidebar-matrix">
          <TaskList
            tasks={tasks}
            setTasks={setTasks}
            currentIndex={currentIndex}
            updateTask={updateTask}
          />
          <TaskForm tasks={tasks} setTasks={setTasks} />
        </div>

        {/* Right Side: Active Orchestrator Display */}
        <div className="main-content">
          <div className="hud-card visualizers-card">
            <div className="visualizers-flex">
              {/* Dynamic SVG Wall Clock */}
              <div className="visualizer-wrapper border-right">
                <span className="visualizer-label">SOLAR POSITION CLOCK</span>
                <CircularClock
                  tasks={tasks}
                  currentIndex={currentIndex}
                  secondsLeft={secondsLeft}
                />
              </div>

              {/* Glowing SVG Countdown Timer */}
              <div className="visualizer-wrapper">
                <span className="visualizer-label">BEHAVIOR COUNTDOWN TIMER</span>
                <CircularTimer
                  tasks={tasks}
                  currentIndex={currentIndex}
                  secondsLeft={secondsLeft}
                  taskProgress={taskProgress}
                  toggleSubtask={toggleSubtask}
                />
              </div>
            </div>

            {/* Controller interface */}
            <ControlPanel
              running={running}
              startTimer={startTimer}
              pauseTimer={pauseTimer}
              resetTimer={resetTimer}
              skipTask={skipTask}
              prevTask={prevTask}
              speedMultiplier={speedMultiplier}
              setSpeedMultiplier={setSpeedMultiplier}
              currentIndex={currentIndex}
              totalTasks={tasks.length}
            />
          </div>

          {/* Analytics & Metrics metrics visualizer */}
          <div className="hud-card analytics-card">
            <Analytics
              tasks={tasks}
              currentIndex={currentIndex}
              sessionLogs={sessionLogs}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;