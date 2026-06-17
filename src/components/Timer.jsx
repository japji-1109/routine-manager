import { useState, useEffect } from "react";

function Timer({
  tasks,
  currentIndex,
  setCurrentIndex,
  running,
  setRunning,
}) {
  const [secondsLeft, setSecondsLeft] =
    useState(0);

  useEffect(() => {
    if (tasks[currentIndex]) {
      setSecondsLeft(
        tasks[currentIndex].duration * 60
      );
    }
  }, [currentIndex, tasks]);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          if (
            currentIndex <
            tasks.length - 1
          ) {
            setCurrentIndex(
              currentIndex + 1
            );
          } else {
            setRunning(false);
            alert(
              "Routine Completed!"
            );
          }

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () =>
      clearInterval(interval);
  }, [running, currentIndex]);

  return (
    <div>
      <h1>
        {Math.floor(secondsLeft / 60)}:
        {String(
          secondsLeft % 60
        ).padStart(2, "0")}
      </h1>
    </div>
  );
}

export default Timer;