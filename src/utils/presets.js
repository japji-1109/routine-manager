export const PRESETS = {
  morning: [
    {
      id: "m1",
      title: "Rise & Hydrate",
      duration: 2,
      color: "#ff007a", // Hygiene
      sound: "synth",
      completed: false,
      subtasks: [
        { id: "m1_1", text: "Drink 500ml water", completed: false },
        { id: "m1_2", text: "Open blinds for sunlight", completed: false },
      ],
    },
    {
      id: "m2",
      title: "Zen Mindfulness Meditation",
      duration: 10,
      color: "#bd00ff", // Mindset
      sound: "bowl",
      completed: false,
      subtasks: [
        { id: "m2_1", text: "Sit in cross-legged posture", completed: false },
        { id: "m2_2", text: "Focus on nasal breathing", completed: false },
        { id: "m2_3", text: "Acknowledge and release thoughts", completed: false },
      ],
    },
    {
      id: "m3",
      title: "Full Body Yoga Stretch",
      duration: 8,
      color: "#00ff66", // Physical
      sound: "chime",
      completed: false,
      subtasks: [
        { id: "m3_1", text: "Sun Salutations (3 reps)", completed: false },
        { id: "m3_2", text: "Hamstring stretch", completed: false },
        { id: "m3_3", text: "Child's pose deep breaths", completed: false },
      ],
    },
    {
      id: "m4",
      title: "Nutrition & Planning",
      duration: 15,
      color: "#ffb800", // Nutrition
      sound: "pulse",
      completed: false,
      subtasks: [
        { id: "m4_1", text: "Prepare high-protein breakfast", completed: false },
        { id: "m4_2", text: "Review today's top 3 goals", completed: false },
      ],
    },
  ],
  evening: [
    {
      id: "e1",
      title: "Digital Sunset Review",
      duration: 5,
      color: "#00f0ff", // Focus/Work
      sound: "synth",
      completed: false,
      subtasks: [
        { id: "e1_1", text: "Turn off work computer", completed: false },
        { id: "e1_2", text: "Put phone on charging dock across room", completed: false },
      ],
    },
    {
      id: "e2",
      title: "Reflection Journaling",
      duration: 10,
      color: "#bd00ff", // Mindset
      sound: "bowl",
      completed: false,
      subtasks: [
        { id: "e2_1", text: "Write 3 wins of the day", completed: false },
        { id: "e2_2", text: "Write 1 lesson learned", completed: false },
      ],
    },
    {
      id: "e3",
      title: "Hygiene & Preparation",
      duration: 12,
      color: "#ff007a", // Hygiene
      sound: "chime",
      completed: false,
      subtasks: [
        { id: "e3_1", text: "Floss & brush teeth", completed: false },
        { id: "e3_2", text: "Lay out clothes for tomorrow", completed: false },
      ],
    },
    {
      id: "e4",
      title: "Breathing & Reading",
      duration: 15,
      color: "#3b82f6", // Rest
      sound: "bowl",
      completed: false,
      subtasks: [
        { id: "e4_1", text: "Read 5 pages of fiction", completed: false },
        { id: "e4_2", text: "Perform 4-7-8 breathing (4 cycles)", completed: false },
      ],
    },
  ],
  focus: [
    {
      id: "f1",
      title: "Desk Setup & Clearing",
      duration: 3,
      color: "#3b82f6", // Rest/Prep
      sound: "synth",
      completed: false,
      subtasks: [
        { id: "f1_1", text: "Clear coffee cups and clutter", completed: false },
        { id: "f1_2", text: "Fill water bottle", completed: false },
        { id: "f1_3", text: "Launch focus mode apps", completed: false },
      ],
    },
    {
      id: "f2",
      title: "Pomodoro Focus Block",
      duration: 25,
      color: "#00f0ff", // Focus
      sound: "bowl",
      completed: false,
      subtasks: [
        { id: "f2_1", text: "Write primary task outline", completed: false },
        { id: "f2_2", text: "Work on task without tabs/phone", completed: false },
      ],
    },
    {
      id: "f3",
      title: "Active Stretch Recovery",
      duration: 5,
      color: "#00ff66", // Physical
      sound: "chime",
      completed: false,
      subtasks: [
        { id: "f3_1", text: "Stand up and walk around", completed: false },
        { id: "f3_2", text: "Roll shoulders & stretch neck", completed: false },
      ],
    },
  ],
};
