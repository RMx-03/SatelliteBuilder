import { useState } from 'react';
import Avatar from './Avatar';

const Lesson = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const lessonSlides = [
    {
      title: "What is a Satellite?",
      content: "A satellite is a moon, planet or machine that orbits a planet or star. Satellites help us in many ways, like predicting weather, taking pictures of Earth, and helping people navigate.",
      image: "/assets/satellite-main.svg"
    },
    {
      title: "Solar Panels",
      content: "Solar panels are like wings that collect energy from the sun. They convert sunlight into electricity to power all the equipment on the satellite. Without solar panels, satellites wouldn't have energy to work!",
      image: "/assets/solar-panel.svg"
    },
    {
      title: "Antenna",
      content: "The antenna is like the satellite's ears and mouth. It receives signals from Earth and sends information back. This lets the satellite talk to people on Earth and share what it discovers in space.",
      image: "/assets/antenna.svg"
    },
    {
      title: "Camera",
      content: "Satellites use special cameras to take pictures of Earth, other planets, or even distant stars and galaxies. These pictures help scientists learn about weather, forests, oceans, and even discover new things in space!",
      image: "/assets/camera.svg"
    },
    {
      title: "Power Supply",
      content: "The power supply is like the satellite's heart. It stores energy collected by the solar panels and distributes it to all the parts of the satellite when they need it. It makes sure everything has the power to work properly.",
      image: "/assets/power-supply.svg"
    },
    {
      title: "Satellite Body",
      content: "The satellite body, or bus, is the main structure that holds all the parts together. It protects the delicate instruments inside from the harsh conditions of space, like extreme temperatures and space debris.",
      image: "/assets/satellite-body.svg"
    }
  ];

  // Function to generate a fallback image using canvas
  const generateFallbackImage = (title) => {
    const colors = {
      "What is a Satellite?": "#3490dc",
      "Solar Panels": "#f6ad55", 
      "Antenna": "#fc8181",
      "Camera": "#68d391",
      "Power Supply": "#a3bffa",
      "Satellite Body": "#9f7aea"
    };

    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = colors[title] || "#718096";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Text
    ctx.fillStyle = "#ffffff";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText(title, canvas.width/2, canvas.height/2);
    
    return canvas.toDataURL();
  };

  const handleNext = () => {
    if (currentSlide < lessonSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    // Generate a colored placeholder image with text
    e.target.src = generateFallbackImage(lessonSlides[currentSlide].title);
  };

  const currentLesson = lessonSlides[currentSlide];

  return (
    <div className="lesson-container">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-space-pink mb-2">Space Science Lesson</h2>
        <p className="text-lg">Learn about satellites and how they work</p>
        <div className="mt-4 flex justify-center">
          <span className="text-sm text-space-purple">
            Slide {currentSlide + 1} of {lessonSlides.length}
          </span>
        </div>
      </div>

      <div className="lesson-card flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 p-4">
          <img 
            src={currentLesson.image} 
            alt={currentLesson.title} 
            className="max-w-full h-auto rounded-lg animate-float shadow-lg"
            onError={handleImageError}
          />
        </div>
        
        <div className="md:w-1/2 p-4">
          <h3 className="text-2xl font-bold mb-4 text-space-pink">{currentLesson.title}</h3>
          
          <Avatar 
            text={currentLesson.content} 
            autoPlay={true}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <button 
          className={`space-button ${currentSlide === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleBack}
          disabled={currentSlide === 0}
        >
          ← Back
        </button>
        
        <button 
          className="space-button"
          onClick={handleNext}
        >
          {currentSlide === lessonSlides.length - 1 ? 'Build Your Satellite →' : 'Next →'}
        </button>
      </div>
    </div>
  );
};

export default Lesson; 