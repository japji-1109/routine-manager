import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import TaskCard from "./TaskCard";

function TaskList({
  tasks = [],
  setTasks,
  currentIndex = 0,
  updateTask,
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Prevent accidental drags when clicking input fields
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);
      setTasks(arrayMove(tasks, oldIndex, newIndex));
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const totalRoutineDuration = tasks.reduce((sum, t) => sum + t.duration, 0);

  return (
    <div className="task-list-v2">
      <div className="task-list-header">
        <div>
          <h3>Routine Matrix</h3>
          <p className="list-subtitle">Arrange your sequence of time-blocked behaviors</p>
        </div>
        <div className="total-duration-badge">
          ⏳ {totalRoutineDuration.toFixed(1)} mins
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="9" y1="9" x2="15" y2="9" />
            <line x1="9" y1="13" x2="15" y2="13" />
            <line x1="9" y1="17" x2="13" y2="17" />
          </svg>
          <p>No behaviors added yet.</p>
          <span className="empty-subtext">Use the form below to add routine tasks.</span>
        </div>
      ) : (
        <div className="timeline-connector-wrapper">
          {/* Vertical timeline connector line */}
          <div className="timeline-connector-line" />
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={tasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="task-cards-list">
                {tasks.map((task, index) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    index={index}
                    currentIndex={currentIndex}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}

export default TaskList;