function Controls({
  running,
  setRunning,
  setCurrentIndex,
}) {
  return (
    <div>
      <button onClick={() => setRunning(true)}>
        Start
      </button>

      <button onClick={() => setRunning(false)}>
        Pause
      </button>

      <button onClick={() => setCurrentIndex(0)}>
        Reset
      </button>
    </div>
  );
}

export default Controls;