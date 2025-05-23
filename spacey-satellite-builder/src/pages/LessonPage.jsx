import { useState, useEffect, useCallback, useRef } from 'react';
import Avatar from '../components/Avatar';
import WebcamCapture from '../components/WebcamCapture';
import Quiz from '../components/Quiz';
import Badge from '../components/Badge';
import { 
  lessonIntro, 
  lessonSections, 
  quizQuestions, 
  badges, 
  feedbackMessages 
} from '../utils/lessonContent';

const LessonPage = () => {
  const [currentStage, setCurrentStage] = useState('intro');
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [avatarText, setAvatarText] = useState(lessonIntro.introduction);
  const [quizResults, setQuizResults] = useState(null);
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [showNewBadge, setShowNewBadge] = useState(false);
  const [webcamGreeting, setWebcamGreeting] = useState("Hello space explorer! I can see you in your mission control room!");
  const [webcamKey, setWebcamKey] = useState(Date.now()); // Key to force remount if needed
  const [isSpeakingComplete, setIsSpeakingComplete] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionLock = useRef(false);
  const [introWorkflow, setIntroWorkflow] = useState({
    voiceOverComplete: false,
    readyForCameraAccess: false,
    cameraProcessed: false,
    readyToStart: false
  });

  // Debug helper function
  const logWithTimestamp = useCallback((message) => {
    const now = new Date();
    const timestamp = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`;
    console.log(`[${timestamp}] ${message}`);
  }, []);

  // Memoize the stage transition function
  const handleStageTransition = useCallback((newStage, sectionIndex = 0) => {
    logWithTimestamp(`Attempting transition from ${currentStage} to ${newStage}`);
    
    // Safety check to prevent multiple transitions in quick succession
    if (transitionLock.current) {
      logWithTimestamp("Transition locked - ignoring request");
      return;
    }
    
    // Lock transitions temporarily
    transitionLock.current = true;
    setIsTransitioning(true);
    
    // Reset speaking completion state for the new stage
    setIsSpeakingComplete(false);
    
    // Update stage
    logWithTimestamp(`Executing transition to ${newStage}`);
    setCurrentStage(newStage);
    
    // If moving to lesson, set section index
    if (newStage === 'lesson') {
      setCurrentSectionIndex(sectionIndex);
    }

    // Clear transitioning flag after a delay
    setTimeout(() => {
      setIsTransitioning(false);
      // Unlock transitions after a longer delay to ensure stability
      setTimeout(() => {
        transitionLock.current = false;
        logWithTimestamp("Transition lock released");
      }, 500);
    }, 100);
  }, [currentStage, logWithTimestamp]);

  useEffect(() => {
    // Update avatar text based on the current stage
    logWithTimestamp(`Updating avatar text for stage: ${currentStage}`);
    if (currentStage === 'intro') {
      setAvatarText(lessonIntro.introduction);
      setWebcamGreeting("Mission control activated! I can see you're ready for your space adventure!");
    } else if (currentStage === 'lesson') {
      setAvatarText(lessonSections[currentSectionIndex].content);
      
      // Update webcam greeting based on lesson progress
      if (currentSectionIndex === 0) {
        setWebcamGreeting("Look at you! You're learning about satellites already!");
      } else if (currentSectionIndex === lessonSections.length - 1) {
        setWebcamGreeting("You've learned so much! You're looking like a real astronaut now!");
      } else {
        // Random encouraging messages for middle sections
        const messages = [
          "You're doing great! Keep exploring space with me!",
          "I can see a future astronaut in my camera!",
          "Your space journey is going wonderfully!",
          "Keep up the good work, space cadet!"
        ];
        const randomIndex = Math.floor(Math.random() * messages.length);
        setWebcamGreeting(messages[randomIndex]);
      }
    } else if (currentStage === 'quiz-intro') {
      setAvatarText("Now let's see how much you've learned about satellites! I'll ask you 5 questions about what we just covered.");
      setWebcamGreeting("Time to test your space knowledge! I can see you're ready for the challenge!");
    } else if (currentStage === 'feedback') {
      // Set feedback message based on quiz score
      if (quizResults) {
        const scorePercentage = (quizResults.score / quizResults.totalQuestions) * 100;
        
        if (scorePercentage === 100) {
          setAvatarText(feedbackMessages.excellent);
          setWebcamGreeting("Wow! I can see a space genius on my screen! Fantastic job!");
        } else if (scorePercentage >= 80) {
          setAvatarText(feedbackMessages.good);
          setWebcamGreeting("Great work, space explorer! Your mission was a success!");
        } else if (scorePercentage >= 60) {
          setAvatarText(feedbackMessages.average);
          setWebcamGreeting("You're making progress on your space journey! Keep exploring!");
        } else {
          setAvatarText(feedbackMessages.needsImprovement);
          setWebcamGreeting("Every astronaut starts somewhere! Let's keep learning together!");
        }
      }
    }
  }, [currentStage, currentSectionIndex, quizResults, logWithTimestamp]);

  const handleSpeakingComplete = () => {
    logWithTimestamp(`Speaking complete for stage: ${currentStage}`);
    
    if (isTransitioning) {
      logWithTimestamp("Ignoring speaking complete during transition");
      return;
    }
    
    // Set speaking complete flag
    setIsSpeakingComplete(true);
    
    // If this is the intro stage, update workflow
    if (currentStage === 'intro') {
      logWithTimestamp("Intro voice over complete, ready to request camera access");
      setIntroWorkflow(prev => ({
        ...prev,
        voiceOverComplete: true,
        readyForCameraAccess: true
      }));
    }
  };
  
  const handleCameraPermissionGranted = useCallback(() => {
    logWithTimestamp("Camera permission granted or skipped");
    setCameraPermissionGranted(true);
    
    // Update workflow - camera is processed
    setIntroWorkflow(prev => ({
      ...prev,
      cameraProcessed: true,
      readyToStart: true
    }));
    
    // IMPORTANT: Do not transition to next stage here
    // We wait for user to click the Start Mission button
  }, [logWithTimestamp]);

  const handleCameraError = useCallback(() => {
    logWithTimestamp("Camera error detected");
    
    // Still update workflow to allow user to continue
    setIntroWorkflow(prev => ({
      ...prev,
      cameraProcessed: true,
      readyToStart: true
    }));
    
    // IMPORTANT: Do not transition to next stage here
  }, [logWithTimestamp]);
  
  const handleStartMission = () => {
    logWithTimestamp("Start Mission button clicked by user");
    handleStageTransition('lesson', 0);
  };
  
  const handleNextSection = () => {
    logWithTimestamp("Next section button clicked");
    if (currentSectionIndex < lessonSections.length - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
      setIsSpeakingComplete(false);
    } else {
      handleStageTransition('quiz-intro');
    }
  };
  
  const handleStartQuiz = () => {
    logWithTimestamp("Starting quiz - user clicked button");
    handleStageTransition('quiz');
  };

  const handleQuizComplete = (results) => {
    logWithTimestamp(`Quiz completed with score: ${results.score}/${results.totalQuestions}`);
    setQuizResults(results);
    handleStageTransition('feedback');
    
    // Award badges based on completion and score
    const newBadges = [];
    
    // Everyone gets the completion badge
    newBadges.push(badges.completion);
    
    // Perfect score gets the excellence badge
    if (results.score === results.totalQuestions) {
      newBadges.push(badges.excellence);
    }
    
    setEarnedBadges(newBadges);
    setShowNewBadge(true);
  };

  // Helper function for consistent placeholder image
  const renderSatelliteImage = () => {
    // If we're in the lesson stage, show a placeholder image for each lesson section
    // In a real app, you'd have actual images for each section
    return (
      <div className="satellite-image-container bg-slate-800 rounded-lg overflow-hidden h-64 mb-4">
        <div className="h-full flex items-center justify-center">
          {currentStage === 'lesson' && (
            <div className="text-center p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-space-accent mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <p className="text-blue-300 font-medium">Satellite Part {currentSectionIndex + 1}</p>
              <p className="text-sm text-slate-400 mt-1">
                {currentSectionIndex === 0 ? "Power System" : 
                 currentSectionIndex === 1 ? "Communication Antenna" :
                 currentSectionIndex === 2 ? "Attitude Control" : "Scientific Instruments"}
              </p>
            </div>
          )}
          
          {currentStage === 'intro' && (
            <div className="text-center p-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-space-accent mb-2 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <p className="text-blue-300 font-medium">Get Ready for Launch!</p>
              <p className="text-sm text-slate-400 mt-1">
                Your satellite building adventure awaits
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (currentStage) {
      case 'intro':
        return (
          <div className="lesson-content card p-6" style={{ minHeight: '560px' }}>
            <h2 className="text-2xl font-bold mb-4">{lessonIntro.title}</h2>
            
            <div className="mb-6">
              <p className="text-lg mb-4">{lessonIntro.welcomeMessage}</p>
              <p className="text-slate-300">
                During this lesson, you'll learn about satellites and their important parts.
                Follow along with Astro, your space guide, and get ready for an exciting journey!
              </p>
            </div>
            
            {/* Workflow progress indicator */}
            <div className="workflow-progress mb-6">
              <div className="flex items-center mb-3">
                <div className={`step-indicator ${introWorkflow.voiceOverComplete ? 'bg-green-500' : 'bg-slate-600'} w-6 h-6 rounded-full flex items-center justify-center mr-3`}>
                  {introWorkflow.voiceOverComplete ? '✓' : '1'}
                </div>
                <div className="step-label">
                  {introWorkflow.voiceOverComplete ? 'Introduction Complete!' : 'Listening to introduction...'}
                </div>
              </div>
              
              <div className="flex items-center mb-3">
                <div className={`step-indicator ${introWorkflow.cameraProcessed ? 'bg-green-500' : introWorkflow.readyForCameraAccess ? 'bg-blue-500 animate-pulse' : 'bg-slate-600'} w-6 h-6 rounded-full flex items-center justify-center mr-3`}>
                  {introWorkflow.cameraProcessed ? '✓' : '2'}
                </div>
                <div className="step-label">
                  {introWorkflow.cameraProcessed 
                    ? 'Camera setup complete!' 
                    : introWorkflow.readyForCameraAccess 
                    ? 'Setting up camera...'
                    : 'Preparing camera access...'}
                </div>
              </div>
              
              <div className="flex items-center">
                <div className={`step-indicator ${introWorkflow.readyToStart ? 'bg-space-accent animate-pulse' : 'bg-slate-600'} w-6 h-6 rounded-full flex items-center justify-center mr-3`}>
                  {introWorkflow.readyToStart ? '3' : '3'}
                </div>
                <div className="step-label">
                  {introWorkflow.readyToStart ? 'Ready to start your mission!' : 'Preparing your mission...'}
                </div>
              </div>
            </div>
            
            {/* Only show Start Mission button when ready for final step */}
            {introWorkflow.readyToStart && (
              <button 
                className="btn-primary mt-4 text-lg py-3 px-6 mx-auto block"
                onClick={handleStartMission}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Start Mission
              </button>
            )}
          </div>
        );
      
      case 'lesson':
        return (
          <div className="lesson-content card p-6" style={{ minHeight: '560px' }}>
            <h2 className="text-2xl font-bold mb-4">{lessonSections[currentSectionIndex].title}</h2>
            
            <div className="lesson-description mb-6">
              <p className="text-lg">{lessonSections[currentSectionIndex].content}</p>
            </div>
            
            <div className="progress-tracker mb-4">
              <div className="flex justify-between mb-2">
                <span>Progress:</span>
                <span>{currentSectionIndex + 1} / {lessonSections.length}</span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full">
                <div 
                  className="bg-space-accent h-2 rounded-full"
                  style={{ width: `${((currentSectionIndex + 1) / lessonSections.length) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <button 
              className="btn-primary mt-4"
              onClick={handleNextSection}
            >
              {currentSectionIndex < lessonSections.length - 1 
                ? "Next Section" 
                : "Take the Quiz"}
            </button>
          </div>
        );
      
      case 'quiz-intro':
        return (
          <div className="lesson-content card p-6" style={{ minHeight: '560px' }}>
            <h2 className="text-2xl font-bold mb-4">Get Ready for the Quiz!</h2>
            
            <div className="mb-6">
              <p className="text-lg mb-4">
                Now it's time to test your knowledge about satellites!
              </p>
              <p className="text-slate-300">
                You'll answer 5 questions about what you've learned. 
                Do your best and earn special badges for completing the quiz!
              </p>
            </div>
            
            <button 
              className="btn-primary mt-4"
              onClick={handleStartQuiz}
            >
              Start Quiz
            </button>
          </div>
        );
      
      case 'quiz':
        return (
          <div className="quiz-wrapper" style={{ minHeight: '560px' }}>
            <Quiz questions={quizQuestions} onComplete={handleQuizComplete} />
          </div>
        );
        
      case 'feedback':
        return (
          <div className="lesson-content card p-6" style={{ minHeight: '560px' }}>
            <h2 className="text-2xl font-bold mb-4">Your Results</h2>
            
            {quizResults && (
              <div className="results-summary mb-6">
                <p className="text-xl mb-2">
                  You scored {quizResults.score} out of {quizResults.totalQuestions}!
                </p>
                
                {showNewBadge && earnedBadges.length > 0 && (
                  <div className="earned-badges mt-4">
                    <h3 className="text-lg font-semibold mb-2">Badges Earned:</h3>
                    <div className="flex justify-center gap-6">
                      {earnedBadges.map((badge, index) => (
                        <Badge key={badge.id} badge={badge} animate={true} />
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mt-6">
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      handleStageTransition('intro');
                      setIsSpeakingComplete(false);
                      setQuizResults(null);
                      setIntroWorkflow({
                        voiceOverComplete: false,
                        readyForCameraAccess: false,
                        cameraProcessed: false,
                        readyToStart: false
                      });
                    }}
                  >
                    Start Over
                  </button>
                </div>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="lesson-page container mx-auto px-4 py-8 max-w-6xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column: Images and webcam */}
        <div className="order-2 md:order-1">
          <div className="left-column-content">
            {/* Satellite image or illustration */}
            {renderSatelliteImage()}
            
            {/* Webcam feed under the satellite image */}
            <div className="webcam-placement">
              {/* Pass the readyForCameraAccess state to WebcamCapture */}
              <WebcamCapture 
                avatarText={webcamGreeting} 
                onError={handleCameraError}
                onPermissionGranted={handleCameraPermissionGranted}
                requestCameraAccess={introWorkflow.readyForCameraAccess}
              />
            </div>
          </div>
        </div>
        
        {/* Right column: Avatar, title, and lesson content */}
        <div className="order-1 md:order-2">
          <div className="right-column-content space-y-6">
            <div className="space-tutor-container bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-slate-700/50 mb-4">
              <div className="text-center mb-2">
                <h3 className="text-xl font-bold text-space-accent">Mission Control</h3>
              </div>
              
              <Avatar 
                text={avatarText}
                onSpeakingComplete={handleSpeakingComplete}
              />
            </div>
            
            {renderContent()}
          </div>
        </div>
      </div>
      
      {/* Hidden state debugger - uncomment if needed */}
      {/* <div className="fixed bottom-0 right-0 bg-black/80 text-white text-xs p-2 max-w-xs overflow-auto" style={{maxHeight: '200px', zIndex: 9999}}>
        <p>Current Stage: {currentStage}</p>
        <p>Speaking Complete: {isSpeakingComplete ? 'Yes' : 'No'}</p>
        <p>Transitioning: {isTransitioning ? 'Yes' : 'No'}</p>
        <p>Workflow: {JSON.stringify(introWorkflow)}</p>
      </div> */}
    </div>
  );
};

export default LessonPage; 