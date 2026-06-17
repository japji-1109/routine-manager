# 🕐 Routine Manager

> **A Programmable Interactive Visual Alarm & Routine Matrix** — a high-precision, browser-based routine orchestrator with synthetic audio chimes, animated SVG visualizers, drag-and-drop task management, and full LocalStorage persistence.

---

## ✨ Features

### 🎯 Core Routine Engine
- **High-Precision Timer** — Powered by an inline **Web Worker** running at 40 ticks/sec (`performance.now()` look-ahead clock loop) to prevent timer drift from tab throttling
- **Speed Multiplier** — Run routines at 1×, 2×, 4×, or 8× speed for testing or rapid review
- **Session Logging** — Automatically logs every completed or skipped task with a timestamp
- **Skip / Prev Navigation** — Jump forward or back between tasks mid-session without losing routine state

### 🔊 Synthetic Audio Chimes (Web Audio API)
Custom-synthesized sounds with no audio files required:

| Sound | Description |
|-------|-------------|
| `chime` | Glass arpeggio — C Major 7th chord (C4→E4→G4→B4→C5) |
| `bowl` | Zen singing bowl — deep resonant tone with metallic LFO beating |
| `synth` | FM electronic pluck — bright A4 with modulated decay |
| `pulse` | 3-pulse warning alarm — square wave rapid burst |

### 🖥️ Dual SVG Visualizers
- **Solar Position Clock** — A dynamic analog clock face that maps each routine task as a colored arc segment across the dial, showing time allocation at a glance
- **Behavior Countdown Timer** — A glowing circular countdown that displays subtask checkboxes as interactive nodes around the ring, which can be ticked off during the active task

### 📋 Routine Matrix
- **Drag-and-Drop Reordering** — Powered by `@dnd-kit` for smooth, accessible task reordering
- **Nested Sub-tasks** — Each task supports a checklist of granular sub-steps, toggleable from both the task card and the countdown timer ring
- **Per-task Customization** — Assign a color, duration (in minutes), and chime sound to each task
- **Inline Editing** — Edit task titles and properties directly in the task card

### 📊 Analytics Panel
- Real-time session progress visualization
- Completed vs. remaining task breakdown
- Session log with task titles and completion timestamps

### 💾 Persistence
- All tasks and the active preset name are **auto-saved to `localStorage`** — your routine survives page refreshes

---

## 🗂️ Preset Routines

Three built-in routine templates are included:

| Preset | Tasks | Total Time |
|--------|-------|-----------|
| **Morning** | Rise & Hydrate → Meditation → Yoga → Nutrition & Planning | ~35 min |
| **Evening** | Digital Sunset → Journaling → Hygiene → Breathing & Reading | ~42 min |
| **Focus** | Desk Setup → Pomodoro Block → Active Recovery | ~33 min |

The app seeds **Morning** as the default routine on first load.

---

## 🏗️ Project Structure

```
RoutineManager/
├── public/
├── src/
│   ├── components/
│   │   ├── Analytics.jsx       # Session metrics & completion log
│   │   ├── CircularClock.jsx   # SVG analog clock with task arc segments
│   │   ├── CircularTimer.jsx   # SVG countdown timer with subtask nodes
│   │   ├── ControlPanel.jsx    # Play / Pause / Reset / Skip / Speed controls
│   │   ├── Header.jsx          # Top nav with preset switcher
│   │   ├── TaskCard.jsx        # Individual task card with inline editing
│   │   ├── TaskForm.jsx        # Add new task form
│   │   └── TaskList.jsx        # Drag-and-drop sortable task list
│   ├── hooks/
│   │   └── useTimer.js         # High-precision Web Worker timer hook
│   ├── styles/
│   │   └── App.css             # Main application styles
│   ├── utils/
│   │   ├── audioSynth.js       # Web Audio API chime synthesizer
│   │   └── presets.js          # Built-in Morning / Evening / Focus presets
│   ├── App.jsx                 # Root component & state orchestration
│   ├── index.css               # Global resets & CSS variables
│   └── main.jsx                # React entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd RoutineManager

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack

| Technology | Role |
|------------|------|
| **React 19** | UI framework |
| **Vite 8** | Build tool & dev server |
| **Web Audio API** | Synthetic chime engine (no audio files) |
| **Web Workers** | High-precision background timer loop |
| **@dnd-kit** | Accessible drag-and-drop |
| **SVG** | Animated clock and countdown visualizers |
| **localStorage** | Client-side persistence |
| **Vanilla CSS** | Styling (no CSS framework) |

---

## ⚙️ How the Timer Works

The `useTimer` hook runs a **Web Worker** that fires a `tick` message every **25ms** (40 Hz). On each tick:

1. `performance.now()` captures the true elapsed wall-clock time since the last tick
2. The delta is multiplied by the current `speedMultiplier`
3. Accumulated simulated time is compared against the task's total duration
4. When a task completes, the appropriate chime plays, a session log entry is recorded, and the index advances automatically

This approach is **immune to browser tab throttling**, which normally degrades `setInterval` accuracy to ~1-second resolution when the tab is not focused.

---

## 🎨 Customizing Tasks

Each task supports:
- **Title** — name of the routine block
- **Duration** — time in minutes
- **Color** — hex color used in the clock arcs and task card accents
- **Sound** — one of `chime`, `bowl`, `synth`, or `pulse`
- **Subtasks** — nested checklist items

---

## 📄 License

MIT — free to use and modify.
