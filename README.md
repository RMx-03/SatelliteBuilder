# Spacey Satellite Builder 🚀

An interactive, educational web application where children learn about satellites and space exploration through an engaging AI-driven learning experience with Nova, their animated space guide.

![Spacey Satellite Builder](https://via.placeholder.com/800x400?text=Spacey+Satellite+Builder)

## ✨ Features

### 🧑‍🚀 AI Avatar Guide (Nova)
- **Animated SVG avatar** with speaking animations and sound waves
- **Advanced female voice synthesis** with US/UK English prioritization  
- **Voice customization interface** with 8 different female voice options
- **Intelligent voice selection** that filters out non-English variants
- **Responsive speech controls** with play again and voice testing features

### 📸 Persistent Webcam Integration
- **Mission Control sidebar** that appears throughout the learning journey (steps 2-5)
- **Dual permission handling** for initial setup and lesson persistence
- **Immersive experience** where students see themselves as space explorers
- **Responsive webcam display** with mirrored feed and space-themed styling

### 🎓 6-Step Educational Journey
1. **Welcome Screen** - Introduction and webcam permission setup
2. **Ready Screen** - Manual "Start Journey" button to begin lessons
3. **Interactive Lesson** - Comprehensive satellite technology education
4. **Satellite Builder** - Drag-and-drop construction activity
5. **Knowledge Quiz** - 5-question assessment with instant feedback
6. **Reward Badge** - Achievement certificate with floating animations

### 🛰️ Interactive Satellite Building
- **Drag-and-drop functionality** using React DnD
- **5 satellite components**: Body, Solar Panels, Antenna, Camera, Power Supply
- **SVG-based parts** with fallback colored shapes for reliability
- **Assembly area** with realistic part positioning and animations
- **Progress tracking** with visual completion percentage
- **Satellite naming** system for personalization

### 🎯 Educational Content
- **Structured lesson sections** covering satellite basics, components, orbits, and missions
- **Visual learning** with SVG illustrations for each component
- **Interactive quiz system** with 5 multiple-choice questions
- **Immediate feedback** with explanations for correct and incorrect answers
- **Score tracking** and performance-based encouragement

### 🏅 Achievement System
- **Dynamic badge display** with SVG fallback system
- **Floating animation effects** for celebration
- **Personalized certificates** featuring the student's custom satellite name
- **Performance-based messaging** from Nova
- **Manual progression control** to prevent auto-advancement

## 🛠️ Technologies Used

- **React 19** with Vite for fast development and building
- **Tailwind CSS** for responsive, utility-first styling
- **React DnD** with HTML5 backend for drag-and-drop functionality
- **Web Speech API** for advanced text-to-speech with voice customization
- **SVG Graphics** for scalable, lightweight avatar and satellite components
- **React Webcam** for camera integration and stream management
- **Firebase** (configured) for optional authentication and progress tracking

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn package manager
- Modern browser with webcam and Web Speech API support

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/spacey-satellite-builder.git
cd spacey-satellite-builder
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

4. **Open your browser** and navigate to `http://localhost:5173`

## 📁 Project Structure

```
spacey-satellite-builder/
├── src/
│   ├── components/           # Reusable React components
│   │   ├── Avatar.jsx       # Animated speaking avatar with voice controls
│   │   ├── WebcamFeed.jsx   # Webcam integration and permission handling
│   │   ├── Lesson.jsx       # Interactive lesson component
│   │   ├── SatelliteBuilder.jsx # Drag-and-drop satellite assembly
│   │   ├── Quiz.jsx         # Knowledge assessment component
│   │   └── RewardBadge.jsx  # Achievement badge and certificate
│   ├── assets/              # Static assets
│   │   └── react.svg        # React logo
│   ├── App.jsx              # Main application with 6-step flow
│   ├── App.css              # Custom styles and animations
│   ├── index.css            # Global styles and Tailwind imports
│   ├── main.jsx             # Application entry point
│   └── firebaseConfig.js    # Firebase setup (optional)
├── public/                   # Public assets
│   ├── assets/              # Satellite component SVGs
│   │   ├── satellite-main.svg
│   │   ├── satellite-body.svg
│   │   ├── solar-panel.svg
│   │   ├── antenna.svg
│   │   ├── camera.svg
│   │   └── power-supply.svg
│   └── stars-bg.svg         # Space background
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.js          # Vite build configuration
└── package.json            # Dependencies and scripts
```

## 🎨 Design Features

### Responsive Layout
- **Desktop**: Side-by-side webcam sidebar with centered lesson content
- **Mobile**: Stacked layout with collapsible webcam section
- **Adaptive**: Content scales and reflows for all screen sizes

### Space Theme
- **Custom color palette**: Deep space blues, cosmic purples, and stellar pinks
- **Animated backgrounds**: Floating stars and cosmic effects
- **Immersive styling**: Glassmorphism effects and space-inspired UI elements

### Accessibility
- **Voice controls**: Complete keyboard and voice navigation support
- **Visual feedback**: Clear hover states and interaction indicators
- **Error handling**: Graceful fallbacks for missing assets or permissions

## 🎵 Audio Features

- **Background ambient music** (configurable volume)
- **Sound effects** for satellite part placement and quiz interactions
- **Voice synthesis** with optimized female voice selection
- **Audio fallbacks** for unsupported browsers or missing files

## 🔧 Configuration

### Voice Customization
The application automatically selects the best voice available but allows users to:
- Choose from up to 8 filtered female voice options
- Test voices before selection
- Prioritize US Female English as the default choice
- Exclude non-English or Indian English variants

## 🌐 Browser Compatibility

**Fully Supported:**
- Chrome (recommended) - Best voice synthesis support
- Edge - Full feature compatibility
- Firefox - Good performance with some voice limitations
- Safari - Basic functionality with limited voice options

**Requirements:**
- WebRTC support for webcam functionality
- Web Speech API for voice synthesis
- Modern ES6+ JavaScript support

## 🔮 Future Enhancements

- **Multi-language support** with voice synthesis in different languages
- **Advanced satellite missions** with more complex building challenges
- **Progress tracking** with Firebase integration
- **Social features** for sharing satellite designs
- **Augmented reality** overlay for satellite components

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

---

**Built with ❤️ for young space explorers everywhere** 🌟