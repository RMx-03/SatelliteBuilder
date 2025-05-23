import { useState, useEffect } from 'react';
import './App.css';
import Avatar from './components/Avatar';
import WebcamFeed from './components/WebcamFeed';
import Lesson from './components/Lesson';
import SatelliteBuilder from './components/SatelliteBuilder';
import Quiz from './components/Quiz';
import RewardBadge from './components/RewardBadge';

function App() {
  // Step 0: Welcome and webcam permission
  // Step 1: Ready to start journey (with Start Journey button)
  // Step 2: Space science lesson
  // Step 3: Satellite builder activity
  // Step 4: Quiz
  // Step 5: Badge award
  const [step, setStep] = useState(0);
  const [webcamPermission, setWebcamPermission] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [satelliteName, setSatelliteName] = useState("");
  const [backgroundMusic] = useState(new Audio('/ambient-space.mp3'));
  
  useEffect(() => {
    // Handle background music
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    return () => {
      backgroundMusic.pause();
      backgroundMusic.currentTime = 0;
    };
  }, [backgroundMusic]);

  const startMusic = () => {
    backgroundMusic.play().catch(error => console.log("Audio playback error:", error));
  };
  
  // Initial webcam permission handler (only for steps 0 and 1)
  const handleInitialWebcamPermission = (granted) => {
    setWebcamPermission(granted);
    if (granted) {
      startMusic();
      if (step === 0) {
        setStep(1); // Move to ready screen only from welcome screen
      }
    }
  };

  // Sidebar webcam permission handler (for steps 2+, doesn't change step)
  const handleSidebarWebcamPermission = (granted) => {
    // Only update the permission state, don't change steps
    setWebcamPermission(granted);
  };

  const handleStartJourney = () => {
    setStep(2); // Now go to lesson
  };
  
  const handleQuizComplete = (score) => {
    setQuizScore(score);
    setStep(5); // Move to badge screen
  };
  
  const handleSatelliteNaming = (name) => {
    setSatelliteName(name);
  };

  return (
    <div className="App bg-space-dark min-h-screen text-white">
      {/* Only show header for welcome and ready screens */}
      {(step === 0 || step === 1) && (
        <header className="App-header text-center py-4">
          <h1 className="text-4xl font-bold text-space-pink mb-2">Spacey Satellite Builder</h1>
          <p className="text-xl text-space-purple mb-8">Build your own satellite and explore space!</p>
        </header>
      )}
      
      <main className={`${step >= 2 ? 'pt-8' : 'container mx-auto px-4'}`}>
        {step === 0 && (
          <div className="welcome-screen flex flex-col md:flex-row items-center justify-center gap-8 container mx-auto px-4">
            <div className="w-full md:w-1/2">
              <Avatar 
                text="Hi there, space explorer! I'm Nova, your guide to the stars. To begin our journey, can I use your camera so I can see you? This helps me guide you through building your very own satellite!" 
              />
            </div>
            <div className="w-full md:w-1/2">
              <WebcamFeed onPermission={handleInitialWebcamPermission} />
            </div>
          </div>
        )}
        
        {step === 1 && (
          <div className="ready-screen flex flex-col md:flex-row items-center justify-center gap-8 container mx-auto px-4">
            <div className="w-full md:w-1/2">
              <div className="mb-8">
                <WebcamFeed onPermission={handleInitialWebcamPermission} />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <Avatar 
                text="Perfect! I can see you now. Are you ready to start your amazing space adventure? We'll learn about satellites, build one together, and test your knowledge!"
              />
              <div className="mt-8 text-center">
                <button 
                  className="space-button text-2xl py-4 px-8 animate-pulse-slow"
                  onClick={handleStartJourney}
                >
                  🚀 Start Journey!
                </button>
              </div>
            </div>
          </div>
        )}
        
        {step === 2 && (
          <div className="lesson-screen-container min-h-screen">
            <div className="flex flex-col lg:flex-row h-full">
              {/* Webcam Sidebar */}
              <div className="lg:w-1/4 p-4">
                <div className="webcam-sidebar bg-space-blue bg-opacity-30 p-4 rounded-lg border border-space-purple h-fit">
                  <h3 className="text-lg font-bold mb-4 text-space-pink text-center">Mission Control</h3>
                  <WebcamFeed onPermission={handleSidebarWebcamPermission} />
                </div>
              </div>
              
              {/* Centered Lesson Content */}
              <div className="lg:w-3/4 flex items-center justify-center p-4">
                <div className="max-w-4xl w-full">
                  <Lesson onComplete={() => setStep(3)} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {step === 3 && (
          <div className="builder-screen-container min-h-screen">
            <div className="flex flex-col lg:flex-row h-full">
              {/* Webcam Sidebar */}
              <div className="lg:w-1/4 p-4">
                <div className="webcam-sidebar bg-space-blue bg-opacity-30 p-4 rounded-lg border border-space-purple h-fit">
                  <h3 className="text-lg font-bold mb-4 text-space-pink text-center">Mission Control</h3>
                  <WebcamFeed onPermission={handleSidebarWebcamPermission} />
                </div>
              </div>
              
              {/* Centered Builder Content */}
              <div className="lg:w-3/4 flex items-start justify-center p-4">
                <div className="max-w-6xl w-full">
                  <SatelliteBuilder 
                    onComplete={() => setStep(4)} 
                    onNameChange={handleSatelliteNaming} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {step === 4 && (
          <div className="quiz-screen-container min-h-screen">
            <div className="flex flex-col lg:flex-row h-full">
              {/* Webcam Sidebar */}
              <div className="lg:w-1/4 p-4">
                <div className="webcam-sidebar bg-space-blue bg-opacity-30 p-4 rounded-lg border border-space-purple h-fit">
                  <h3 className="text-lg font-bold mb-4 text-space-pink text-center">Mission Control</h3>
                  <WebcamFeed onPermission={handleSidebarWebcamPermission} />
                </div>
              </div>
              
              {/* Centered Quiz Content */}
              <div className="lg:w-3/4 flex items-center justify-center p-4">
                <div className="max-w-4xl w-full">
                  <Quiz onComplete={handleQuizComplete} />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {step === 5 && (
          <div className="reward-screen-container min-h-screen">
            <div className="flex flex-col lg:flex-row h-full">
              {/* Webcam Sidebar */}
              <div className="lg:w-1/4 p-4">
                <div className="webcam-sidebar bg-space-blue bg-opacity-30 p-4 rounded-lg border border-space-purple h-fit">
                  <h3 className="text-lg font-bold mb-4 text-space-pink text-center">Mission Control</h3>
                  <WebcamFeed onPermission={handleSidebarWebcamPermission} />
                </div>
              </div>
              
              {/* Centered Reward Content */}
              <div className="lg:w-3/4 flex items-center justify-center p-4">
                <div className="max-w-4xl w-full">
                  <RewardBadge 
                    score={quizScore} 
                    satelliteName={satelliteName} 
                    onRetry={() => setStep(4)} 
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Only show footer for welcome and ready screens */}
      {(step === 0 || step === 1) && (
        <footer className="text-center py-4 mt-12 text-sm">
          <p>© {new Date().getFullYear()} Spacey Satellite Builder - An interactive space learning experience</p>
        </footer>
      )}
    </div>
  );
}

export default App;
