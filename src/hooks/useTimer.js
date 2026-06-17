import { useState, useEffect, useRef } from "react";
import { playChime } from "../utils/audioSynth";

export function useTimer(tasks, setTasks) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [sessionLogs, setSessionLogs] = useState([]);

  // Store variables in refs to access them inside the Web Worker event handler without re-binding
  const stateRef = useRef({
    tasks,
    currentIndex,
    running,
    speedMultiplier,
    accumulatedTimeMs: 0,
    lastResetTimeMs: null,
  });

  // Keep stateRef in sync with React state changes
  useEffect(() => {
    stateRef.current.tasks = tasks;
    stateRef.current.currentIndex = currentIndex;
    stateRef.current.running = running;
    stateRef.current.speedMultiplier = speedMultiplier;
  }, [tasks, currentIndex, running, speedMultiplier]);

  // Set secondsLeft when task or index changes
  useEffect(() => {
    const activeTask = tasks[currentIndex];
    if (activeTask) {
      setSecondsLeft(activeTask.duration * 60);
      stateRef.current.accumulatedTimeMs = 0;
      if (running) {
        stateRef.current.lastResetTimeMs = performance.now();
      } else {
        stateRef.current.lastResetTimeMs = null;
      }
    } else {
      setSecondsLeft(0);
    }
  }, [currentIndex, tasks]);

  // Web Worker creation and management
  const workerRef = useRef(null);

  useEffect(() => {
    // Inline Web Worker code
    const workerCode = `
      let intervalId = null;
      self.onmessage = function(e) {
        if (e.data.action === "start") {
          if (intervalId) clearInterval(intervalId);
          intervalId = setInterval(() => {
            self.postMessage({ type: "tick" });
          }, 25); // high frequency 40 ticks/sec
        } else if (e.data.action === "stop") {
          if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
        }
      };
    `;

    const blob = new Blob([workerCode], { type: "application/javascript" });
    const workerUrl = URL.createObjectURL(blob);
    const worker = new Worker(workerUrl);

    worker.onmessage = (e) => {
      if (e.data.type === "tick") {
        handleTick();
      }
    };

    workerRef.current = worker;

    return () => {
      worker.postMessage({ action: "stop" });
      worker.terminate();
      URL.revokeObjectURL(workerUrl);
    };
  }, []);

  // Start/stop the worker depending on the running state
  useEffect(() => {
    if (workerRef.current) {
      if (running) {
        stateRef.current.lastResetTimeMs = performance.now();
        workerRef.current.postMessage({ action: "start" });
      } else {
        workerRef.current.postMessage({ action: "stop" });
        stateRef.current.lastResetTimeMs = null;
      }
    }
  }, [running]);

  const handleTick = () => {
    const {
      tasks: currentTasks,
      currentIndex: index,
      running: isRunning,
      speedMultiplier: multiplier,
      accumulatedTimeMs,
      lastResetTimeMs,
    } = stateRef.current;

    if (!isRunning || !currentTasks[index]) return;

    const activeTask = currentTasks[index];
    const taskDurationMs = activeTask.duration * 60 * 1000;
    const now = performance.now();

    if (stateRef.current.lastResetTimeMs === null) {
      stateRef.current.lastResetTimeMs = now;
      return;
    }

    const deltaRealTime = now - lastResetTimeMs;
    const deltaSimulatedTime = deltaRealTime * multiplier;
    const totalTimeSpentMs = accumulatedTimeMs + deltaSimulatedTime;

    stateRef.current.accumulatedTimeMs = totalTimeSpentMs;
    stateRef.current.lastResetTimeMs = now;

    const secondsRemaining = Math.max(0, Math.ceil((taskDurationMs - totalTimeSpentMs) / 1000));
    setSecondsLeft(secondsRemaining);

    // If task has completed
    if (totalTimeSpentMs >= taskDurationMs) {
      // Play task chime
      playChime(activeTask.sound || "chime");

      // Log completion
      const logEntry = {
        id: Date.now(),
        taskTitle: activeTask.title,
        duration: activeTask.duration,
        timeCompleted: new Date().toLocaleTimeString(),
      };
      setSessionLogs((prev) => [logEntry, ...prev]);

      // Complete current task in status
      setTasks((prevTasks) =>
        prevTasks.map((t, idx) => (idx === index ? { ...t, completed: true } : t))
      );

      // Transition to next task or finish routine
      if (index < currentTasks.length - 1) {
        stateRef.current.accumulatedTimeMs = 0;
        stateRef.current.lastResetTimeMs = performance.now();
        setCurrentIndex(index + 1);
      } else {
        setRunning(false);
        // Play final completion chime (Zen bowl plays long decay)
        setTimeout(() => {
          playChime("bowl");
        }, 300);
      }
    }
  };

  const startTimer = () => {
    if (tasks.length === 0) return;
    setRunning(true);
  };

  const pauseTimer = () => {
    setRunning(false);
  };

  const resetTimer = () => {
    setRunning(false);
    setCurrentIndex(0);
    setTasks((prevTasks) => prevTasks.map((t) => ({ ...t, completed: false })));
    stateRef.current.accumulatedTimeMs = 0;
    stateRef.current.lastResetTimeMs = null;
    const activeTask = tasks[0];
    if (activeTask) {
      setSecondsLeft(activeTask.duration * 60);
    }
  };

  const skipTask = () => {
    const { tasks: currentTasks, currentIndex: index } = stateRef.current;
    if (index < currentTasks.length - 1) {
      // Log skipped as completed
      const activeTask = currentTasks[index];
      const logEntry = {
        id: Date.now(),
        taskTitle: `${activeTask.title} (Skipped)`,
        duration: activeTask.duration,
        timeCompleted: new Date().toLocaleTimeString(),
      };
      setSessionLogs((prev) => [logEntry, ...prev]);

      setTasks((prevTasks) =>
        prevTasks.map((t, idx) => (idx === index ? { ...t, completed: true } : t))
      );

      stateRef.current.accumulatedTimeMs = 0;
      stateRef.current.lastResetTimeMs = running ? performance.now() : null;
      setCurrentIndex(index + 1);
    } else {
      // Last task skip -> complete
      setTasks((prevTasks) =>
        prevTasks.map((t, idx) => (idx === index ? { ...t, completed: true } : t))
      );
      setRunning(false);
      playChime("bowl");
    }
  };

  const prevTask = () => {
    const { currentIndex: index } = stateRef.current;
    if (index > 0) {
      stateRef.current.accumulatedTimeMs = 0;
      stateRef.current.lastResetTimeMs = running ? performance.now() : null;
      
      // Un-complete the previous task
      setTasks((prevTasks) =>
        prevTasks.map((t, idx) => (idx === index - 1 ? { ...t, completed: false } : t))
      );
      
      setCurrentIndex(index - 1);
    }
  };

  // Calculate task progress percentage
  const activeTask = tasks[currentIndex];
  const totalSeconds = activeTask ? activeTask.duration * 60 : 1;
  const taskProgress = activeTask
    ? Math.min(100, Math.max(0, ((totalSeconds - secondsLeft) / totalSeconds) * 100))
    : 0;

  return {
    currentIndex,
    setCurrentIndex,
    running,
    setRunning,
    secondsLeft,
    speedMultiplier,
    setSpeedMultiplier,
    sessionLogs,
    setSessionLogs,
    taskProgress,
    startTimer,
    pauseTimer,
    resetTimer,
    skipTask,
    prevTask,
  };
}
