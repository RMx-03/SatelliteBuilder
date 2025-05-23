// Lesson content for "Build Your Own Satellite"

export const lessonIntro = {
  title: "Build Your Own Satellite",
  introduction: "Hello, young space explorer! I'm Astro, your guide to the fascinating world of satellites. Today, we're going to learn about satellites and even design our own virtual satellite together!",
  welcomeMessage: "Are you ready for an exciting journey into space technology? Let's begin our adventure!"
};

export const lessonSections = [
  {
    id: 1,
    title: "What is a Satellite?",
    content: "A satellite is an object that orbits around a planet or a star. Satellites can be natural, like our Moon orbiting Earth, or artificial, which are the ones humans build and launch into space. Artificial satellites help us with communication, weather forecasting, navigation, and exploring our universe!",
    imageUrl: null
  },
  {
    id: 2,
    title: "Satellite Components",
    content: "Every satellite needs certain key parts to function in space. The main components include: 1) Power Source - usually solar panels that convert sunlight into electricity; 2) Communication System - antennas to send and receive signals; 3) Attitude Control - to keep the satellite pointing in the right direction; 4) Scientific Instruments - special tools to collect data or take pictures, depending on the satellite's mission.",
    imageUrl: null
  },
  {
    id: 3,
    title: "Satellite Orbits",
    content: "Satellites travel in paths called orbits around Earth. Low Earth Orbit or LEO satellites circle about 160 to 2,000 kilometers above Earth. They complete an orbit in just 90 minutes! Geostationary satellites orbit much higher—about 36,000 kilometers up—and move at the same speed Earth rotates, so they stay above the same spot on Earth all the time. These are great for communication and weather monitoring.",
    imageUrl: null
  },
  {
    id: 4,
    title: "Satellite Missions",
    content: "Satellites have different jobs or missions. Communication satellites help people talk to each other across the world and broadcast TV shows. Weather satellites take pictures of clouds and storms to help predict the weather. Navigation satellites, like GPS, help us find our way around. And scientific satellites, like space telescopes, help us study planets, stars, and galaxies!",
    imageUrl: null
  }
];

export const quizQuestions = [
  {
    id: 1,
    question: "What orbits around a planet or star?",
    options: [
      { id: "a", text: "A satellite" },
      { id: "b", text: "A spaceship" },
      { id: "c", text: "A meteor" },
      { id: "d", text: "A comet" }
    ],
    correctAnswer: "a",
    explanation: "A satellite is an object that orbits around a planet or star. It can be natural (like the Moon) or artificial (built by humans)."
  },
  {
    id: 2,
    question: "Which of these is NOT a main component of a satellite?",
    options: [
      { id: "a", text: "Power source" },
      { id: "b", text: "Communication system" },
      { id: "c", text: "Dining area" },
      { id: "d", text: "Scientific instruments" }
    ],
    correctAnswer: "c",
    explanation: "Satellites don't have dining areas! They need power sources, communication systems, attitude control, and scientific instruments to function."
  },
  {
    id: 3,
    question: "Which satellite orbit is the highest above Earth?",
    options: [
      { id: "a", text: "Low Earth Orbit (LEO)" },
      { id: "b", text: "Geostationary Orbit" },
      { id: "c", text: "Middle Earth Orbit" },
      { id: "d", text: "Polar Orbit" }
    ],
    correctAnswer: "b",
    explanation: "Geostationary satellites orbit about 36,000 kilometers above Earth, much higher than LEO satellites which orbit at 160-2,000 kilometers."
  },
  {
    id: 4,
    question: "What do weather satellites help us do?",
    options: [
      { id: "a", text: "Cook food" },
      { id: "b", text: "Predict the weather" },
      { id: "c", text: "Talk to aliens" },
      { id: "d", text: "Power our homes" }
    ],
    correctAnswer: "b",
    explanation: "Weather satellites take pictures of clouds and weather patterns to help meteorologists predict the weather."
  },
  {
    id: 5,
    question: "What helps satellites generate power in space?",
    options: [
      { id: "a", text: "Batteries only" },
      { id: "b", text: "Nuclear reactors" },
      { id: "c", text: "Solar panels" },
      { id: "d", text: "Rocket fuel" }
    ],
    correctAnswer: "c",
    explanation: "Most satellites use solar panels to convert sunlight into electricity, which powers all the satellite's systems."
  }
];

export const activityInstructions = {
  title: "Design Your Own Satellite",
  instructions: "Now it's your turn to be a satellite engineer! Think about what kind of satellite you want to build. Will it be for communication, weather monitoring, or maybe space exploration? Choose the components your satellite needs and place them in the correct positions. Remember to add solar panels for power, antennas for communication, and scientific instruments for your satellite's mission!"
};

export const badges = {
  completion: {
    id: "satellite-builder",
    name: "Satellite Builder",
    description: "Awarded for completing the Build Your Own Satellite lesson",
    imageUrl: null
  },
  excellence: {
    id: "space-ace",
    name: "Space Ace",
    description: "Awarded for answering all quiz questions correctly",
    imageUrl: null
  }
};

export const feedbackMessages = {
  excellent: "Wow! You're a real space genius! You've mastered satellite technology and are ready for advanced space missions!",
  good: "Great job! You've learned a lot about satellites. With a little more practice, you'll be a satellite expert in no time!",
  average: "Good effort! You've learned some important things about satellites. Keep exploring and learning more about space technology!",
  needsImprovement: "Thanks for trying! Satellites can be complex, but don't worry - you can review the lesson and try the quiz again to improve your knowledge."
}; 