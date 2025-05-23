import { useState, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import defaultAvatarAnimation from '../assets/defaultAvatarAnimation.json';
import { speak, stopSpeaking } from '../utils/speechSynthesis';

const Avatar = ({ text, onSpeakingComplete, autoSpeak = true }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const avatarRef = useRef(null);
  const [currentText, setCurrentText] = useState('');
  const hasCalledCompletionRef = useRef(false);

  useEffect(() => {
    // Reset the completion callback flag when text changes
    hasCalledCompletionRef.current = false;
    
    // When text changes, update current text
    if (text && text.trim() !== '') {
      setCurrentText(text);
      
      // Auto speak if enabled
      if (autoSpeak) {
        handleSpeak(text);
      }
    }
    
    // Clean up speech when component unmounts
    return () => {
      stopSpeaking();
    };
  }, [text, autoSpeak]);

  const handleSpeak = (textToSpeak) => {
    if (textToSpeak && textToSpeak.trim() !== '') {
      setIsSpeaking(true);
      // Reset the completion flag when starting to speak
      hasCalledCompletionRef.current = false;
      
      speak(textToSpeak, {
        rate: 1.0,
        pitch: 1.0,
        onstart: () => {
          setIsSpeaking(true);
          // Start animation 
          if (avatarRef.current) {
            avatarRef.current.play();
          }
        },
        onend: () => {
          console.log("Speech ended, calling onSpeakingComplete");
          setIsSpeaking(false);
          // Pause animation
          if (avatarRef.current) {
            avatarRef.current.pause();
          }
          if (onSpeakingComplete && !hasCalledCompletionRef.current) {
            hasCalledCompletionRef.current = true;
            onSpeakingComplete();
          }
        },
        onerror: (e) => {
          console.error("Speech error:", e);
          setIsSpeaking(false);
          if (avatarRef.current) {
            avatarRef.current.pause();
          }
          // We don't call onSpeakingComplete on error
        }
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`avatar-container ${isSpeaking ? 'speaking' : ''}`}>
        <Lottie
          animationData={defaultAvatarAnimation}
          loop={isSpeaking}
          autoplay={false}
          ref={avatarRef}
          className="w-72 h-72"
        />
      </div>
      
      {currentText && (
        <div className="speech-bubble card mt-4 max-w-md">
          <p className="text-lg">{currentText}</p>
          
          {!isSpeaking && (
            <button 
              className="btn-primary mt-2"
              onClick={() => handleSpeak(currentText)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
              Play Again
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Avatar; 