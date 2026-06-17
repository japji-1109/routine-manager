import React, { useRef } from "react";
import { PRESETS } from "../utils/presets";

function Header({ tasks = [], setTasks, onPresetLoad, activePresetName, setActivePresetName }) {
  const fileInputRef = useRef(null);

  const handleLoadPreset = (key) => {
    const confirmed =
      tasks.length === 0 ||
      window.confirm("Loading a preset will overwrite your current active matrix. Continue?");
    if (confirmed) {
      setTasks(JSON.parse(JSON.stringify(PRESETS[key])));
      setActivePresetName(key);
    }
  };

  const handleExport = () => {
    if (tasks.length === 0) {
      alert("There are no tasks in your Routine Matrix to export.");
      return;
    }
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify({ presetName: activePresetName, tasks }, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `routine_${activePresetName || "custom"}_matrix.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = (e) => {
    const fileReader = new FileReader();
    const file = e.target.files?.[0];
    if (!file) return;

    fileReader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        const importedTasks = Array.isArray(data) ? data : data.tasks;
        const presetName = data.presetName || "imported";

        if (Array.isArray(importedTasks)) {
          const validated = importedTasks.map((t) => ({
            id: t.id || Date.now() + Math.random(),
            title: t.title || "Untitled Task",
            duration: Number(t.duration) || 5,
            color: t.color || "#00f0ff",
            sound: t.sound || "chime",
            subtasks: Array.isArray(t.subtasks)
              ? t.subtasks.map((st) => ({
                  id: st.id || Date.now() + Math.random(),
                  text: st.text || "Step",
                  completed: !!st.completed,
                }))
              : [],
            completed: !!t.completed,
          }));
          setTasks(validated);
          setActivePresetName(presetName);
          alert("Routine Matrix successfully imported!");
        } else {
          alert("Invalid file format: could not locate task list.");
        }
      } catch (err) {
        alert("Failed to parse JSON file: " + err.message);
      }
    };
    fileReader.readAsText(file);
    e.target.value = ""; // Reset
  };

  return (
    <header className="dashboard-header">
      <div className="header-brand">
        <span className="brand-logo">⏰</span>
        <div>
          <h1>Routine Matrix</h1>
          <p className="brand-slogan">Programmable Visual Alarm & High-Precision Behavioral Chain</p>
        </div>
      </div>

      {/* Center Section: Presets */}
      <div className="preset-quickloader">
        <span className="preset-label">Templates:</span>
        <div className="preset-buttons">
          <button
            onClick={() => handleLoadPreset("morning")}
            className={`preset-btn morning ${activePresetName === "morning" ? "active" : ""}`}
          >
            ☀️ Morning Ritual
          </button>
          <button
            onClick={() => handleLoadPreset("evening")}
            className={`preset-btn evening ${activePresetName === "evening" ? "active" : ""}`}
          >
            🌙 Evening Wind-down
          </button>
          <button
            onClick={() => handleLoadPreset("focus")}
            className={`preset-btn focus ${activePresetName === "focus" ? "active" : ""}`}
          >
            ⚡ Focus Session
          </button>
        </div>
      </div>

      {/* Right Section: Sync Controls */}
      <div className="sync-controls">
        <button onClick={handleExport} className="sync-btn export-btn" title="Export Routine JSON">
          📤 Export
        </button>
        <button onClick={handleImportClick} className="sync-btn import-btn" title="Import Routine JSON">
          📥 Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: "none" }}
        />
      </div>
    </header>
  );
}

export default Header;