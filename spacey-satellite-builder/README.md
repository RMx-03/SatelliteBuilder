# Spacey Satellite Builder

An interactive, educational web application for children to learn about satellites and space exploration through an engaging AI-driven learning experience.

![Spacey Satellite Builder](https://via.placeholder.com/800x400?text=Spacey+Satellite+Builder)

## Features

- **Animated Avatar Tutor**: An astronaut guide that provides spoken explanations using Web Speech API
- **Webcam Integration**: Captures and displays the student's video feed for an immersive experience
- **Interactive Lesson**: Comprehensive 2-3 minute lesson about satellite technology and space exploration
- **Quiz System**: 5-question quiz to test knowledge retention with dynamic feedback
- **Progress Tracking**: Visual progress indicators through the lesson sections
- **Badge Rewards**: Achievement badges awarded for lesson completion and quiz performance
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- **React.js**: Frontend framework for building the user interface
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Web Speech API**: For text-to-speech functionality
- **Lottie**: For the animated avatar
- **React Webcam**: For webcam integration

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/spacey-satellite-builder.git
cd spacey-satellite-builder
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173` or the URL shown in your terminal

## Project Structure

```
spacey-satellite-builder/
├── src/
│   ├── assets/              # Static assets and animations
│   ├── components/          # Reusable UI components
│   │   ├── Avatar.jsx       # Animated speaking avatar
│   │   ├── WebcamCapture.jsx # Webcam integration
│   │   ├── Quiz.jsx         # Quiz component
│   │   └── Badge.jsx        # Badge display component
│   ├── pages/               # Page components
│   │   └── LessonPage.jsx   # Main lesson page
│   ├── utils/               # Utility functions
│   │   ├── speechSynthesis.js # Speech synthesis utilities
│   │   └── lessonContent.js   # Lesson and quiz content
│   ├── App.jsx              # Main application component
│   ├── App.css              # Application styles
│   ├── index.css            # Global styles including Tailwind
│   └── main.jsx             # Application entry point
├── public/                  # Public assets
├── tailwind.config.js       # Tailwind CSS configuration
└── package.json             # Dependencies and scripts
```

## Lesson Content

The application provides a comprehensive lesson on satellite technology, covering:

1. **What is a Satellite?** - Basic introduction to natural and artificial satellites
2. **Satellite Components** - Key parts required for satellites to function in space
3. **Satellite Orbits** - Different orbits and their purposes
4. **Satellite Missions** - Various applications of satellites in modern society

After the lesson, students take a 5-question quiz to test their knowledge.

## Browser Compatibility

The application works best in modern browsers that support the Web Speech API and webcam access:
- Chrome (recommended)
- Edge
- Firefox
- Safari

## License

MIT

## Acknowledgments

- Built as an educational project for teaching children about space technology
- Animated avatar inspired by space exploration programs
- Quiz content developed with educational standards in mind 