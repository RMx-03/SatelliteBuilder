import { useState, useEffect, useRef } from 'react';
import { speak } from '../utils/speechSynthesis';

const WebcamCapture = ({ 
  avatarText = "Hello space explorer! I can see you now!", 
  onError, 
  onPermissionGranted,
  requestCameraAccess = false 
}) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState('waiting'); // 'waiting', 'pending', 'granted', 'denied'
  const [errorMessage, setErrorMessage] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [debugInfo, setDebugInfo] = useState('Waiting for voice over to complete...');
  const [skipCamera, setSkipCamera] = useState(false);
  const greetingSpoken = useRef(false);

  // Only request camera access when triggered from parent
  useEffect(() => {
    if (requestCameraAccess && permissionStatus === 'waiting') {
      setPermissionStatus('pending');
      setDebugInfo('Voice over completed, requesting camera access...');
      startCameraAccess();
    }
  }, [requestCameraAccess]);

  const startCameraAccess = async () => {
    let mounted = true;
    
    try {
      setDebugInfo('Requesting camera access...');
      console.log("Requesting camera access...");
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 320 },
          height: { ideal: 320 },
          facingMode: 'user'
        },
        audio: false 
      });
      
      // Only update state if component is still mounted
      if (mounted) {
        setDebugInfo('Camera access granted, stream received');
        console.log("Camera access granted");
        setStream(mediaStream);
        setPermissionStatus('granted');
        
        // First notify permission granted (without speaking yet)
        if (onPermissionGranted) {
          console.log("Calling permission granted callback");
          onPermissionGranted();
        }
        
        // We'll speak the greeting in a separate effect to avoid timing issues
      }
      
    } catch (err) {
      console.error('Error accessing camera:', err);
      setDebugInfo(`Camera error: ${err.name} - ${err.message}`);
      if (mounted) {
        setPermissionStatus('denied');
        
        if (err.name === 'NotAllowedError') {
          setErrorMessage('Camera access denied. You can still continue the lesson without camera access.');
        } else if (err.name === 'NotFoundError') {
          setErrorMessage('No camera found. You can continue your space adventure without a camera.');
        } else {
          setErrorMessage('Unable to access your camera. Is it being used by another app?');
        }
        
        // Call onError callback if provided
        if (onError) {
          onError(err);
        }
      }
    }
    
    // Clean up function
    return () => {
      mounted = false;
      if (stream) {
        console.log("Stopping camera tracks");
        stream.getTracks().forEach(track => track.stop());
      }
    };
  };

  const handleSkipCamera = () => {
    setSkipCamera(true);
    setPermissionStatus('skipped');
    setDebugInfo('Camera access skipped by user');
    
    // Notify parent that user wants to proceed without camera
    if (onPermissionGranted) {
      onPermissionGranted();
    }
  };

  // Handle avatar text changes and delayed greeting separately
  useEffect(() => {
    // Only handle camera greeting after permission is granted
    // and we haven't spoken the greeting yet
    if (permissionStatus === 'granted' && !greetingSpoken.current && stream) {
      console.log("Speaking camera greeting");
      greetingSpoken.current = true;
      
      // Slight delay to ensure permission callback is processed first
      setTimeout(() => {
        speak(avatarText, {
          rate: 1.0,
          pitch: 1.1,
          // No callbacks to avoid interfering with main workflow
        });
      }, 500);
    }
  }, [permissionStatus, avatarText, stream]);

  // Update greeting message without speaking when it changes after initial greeting
  useEffect(() => {
    if (permissionStatus === 'granted' && greetingSpoken.current && stream) {
      console.log("Webcam greeting updated (not spoken):", avatarText);
      // We don't speak again when the greeting changes to avoid interfering with lesson flow
    }
  }, [avatarText, permissionStatus, stream]);

  // Set video srcObject when stream is available
  useEffect(() => {
    if (videoRef.current && stream) {
      setDebugInfo('Setting video stream to video element');
      console.log("Setting video stream");
      videoRef.current.srcObject = stream;
      
      // Make sure video plays
      videoRef.current.play().catch(err => {
        setDebugInfo(`Error playing video: ${err.message}`);
        console.error("Error playing video:", err);
        // Call onError callback if provided
        if (onError) {
          onError(err);
        }
      });
    }
  }, [stream, onError]);

  // Add visibility detection to pause/resume video when tab is inactive
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
      setDebugInfo(`Visibility changed: ${!document.hidden ? 'visible' : 'hidden'}`);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Handle visibility changes for video playback
  useEffect(() => {
    if (videoRef.current && stream) {
      if (isVisible) {
        setDebugInfo('Tab visible - attempting to play video');
        videoRef.current.play().catch(err => {
          console.error("Error resuming video:", err);
          setDebugInfo(`Error resuming video: ${err.message}`);
          if (onError) {
            onError(err);
          }
        });
      } else {
        videoRef.current.pause();
        setDebugInfo('Tab hidden - paused video');
      }
    }
  }, [isVisible, stream, onError]);

  return (
    <div className="webcam-container card p-4">
      <h3 className="text-lg font-semibold mb-3 text-center text-blue-300">
        Your Space Explorer Cam
      </h3>
      
      {permissionStatus === 'waiting' && (
        <div className="webcam-placeholder flex flex-col items-center justify-center h-64 bg-slate-800 rounded-full overflow-hidden">
          <div className="text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-space-accent mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" />
            </svg>
            <p className="text-blue-200">Waiting for introduction to complete...</p>
            <p className="text-xs text-slate-400 mt-2">Camera access will be requested after the introduction</p>
          </div>
        </div>
      )}
      
      {permissionStatus === 'pending' && (
        <div className="webcam-placeholder flex flex-col items-center justify-center h-64 bg-slate-800 rounded-full overflow-hidden animate-pulse">
          <div className="text-center p-4">
            <div className="animate-spin mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto text-space-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-blue-200">Preparing your space camera...</p>
          </div>
        </div>
      )}
      
      {permissionStatus === 'granted' && (
        <div className="webcam-display-container relative mx-auto w-full" style={{ height: '280px' }}>
          {/* Debug overlay - always visible to help with troubleshooting */}
          <div className="absolute top-0 right-0 bg-black/70 text-white text-xs p-1 z-10">
            Status: {debugInfo}
          </div>
          
          {/* Animated ring around the webcam */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-glow p-1">
            {/* Video container */}
            <div className="rounded-full overflow-hidden h-full w-full bg-slate-900 flex items-center justify-center">
              <video 
                ref={videoRef}
                autoPlay 
                playsInline
                muted
                className="absolute inset-0 min-h-full min-w-full object-cover rounded-full transform scale-x-[-1]" 
                style={{ 
                  display: 'block',
                  width: '100%', 
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center center' 
                }}
                onCanPlay={(e) => {
                  setDebugInfo("Video ready to play");
                  console.log("Video can play now");
                  // Ensure video is playing when it can play
                  e.target.play().catch(err => {
                    console.error('Error playing video:', err);
                    setDebugInfo(`Play error: ${err.message}`);
                    if (onError) {
                      onError(err);
                    }
                  });
                }}
                onError={(e) => {
                  console.error("Video element error:", e);
                  setDebugInfo(`Video error: ${e.target.error?.message || 'unknown'}`);
                  if (onError) {
                    onError(e);
                  }
                }}
              />
              
              {/* Message overlay at the bottom */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-space-blue/80 to-transparent p-2 text-center">
                <p className="text-sm font-medium text-white">
                  Mission Camera Active!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {permissionStatus === 'skipped' && (
        <div className="webcam-skipped bg-blue-900/30 p-6 rounded-full text-center flex flex-col items-center justify-center h-64">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg mb-3 text-blue-200">Continuing without camera access</p>
          <p className="text-sm text-slate-300">You can still enjoy the full space adventure!</p>
        </div>
      )}
      
      {permissionStatus === 'denied' && (
        <div className="webcam-error bg-red-900/50 p-6 rounded-full text-center flex flex-col items-center justify-center h-64">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-lg mb-3 text-red-200">{errorMessage}</p>
          <div className="flex gap-3">
            <button 
              className="btn-primary bg-blue-600 hover:bg-blue-500"
              onClick={handleSkipCamera}
            >
              Continue Without Camera
            </button>
            <button 
              className="btn-primary bg-green-600 hover:bg-green-500"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      )}
      
      {/* Friendly message below the webcam */}
      <p className="text-center mt-4 text-sm text-slate-300">
        {permissionStatus === 'waiting' 
          ? "Listen to the introduction first!" 
          : permissionStatus === 'pending'
          ? "Requesting camera access..." 
          : permissionStatus === 'granted'
          ? "I can see you! We're ready to explore the cosmos together!" 
          : permissionStatus === 'skipped'
          ? "No camera? No problem! Let's explore space anyway!"
          : "Allow camera access so we can build satellites together!"}
      </p>
    </div>
  );
};

export default WebcamCapture; 