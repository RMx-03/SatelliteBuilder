import { useEffect, useRef, useState } from 'react';

const WebcamFeed = ({ onPermission }) => {
  const videoRef = useRef(null);
  const [permissionStatus, setPermissionStatus] = useState('waiting'); // waiting, granted, denied
  const [isSupported, setIsSupported] = useState(true);
  const [stream, setStream] = useState(null);
  const [hasRequestedPermission, setHasRequestedPermission] = useState(false);
  
  useEffect(() => {
    // Check if getUserMedia is supported 
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setIsSupported(false);
      setPermissionStatus('denied');
      if (onPermission) {
        onPermission(false);
      }
      return;
    }

    // Don't request permission again if we already have a successful stream
    if (stream && permissionStatus === 'granted') {
      return;
    }

    // Don't request permission multiple times in quick succession
    if (hasRequestedPermission && permissionStatus === 'waiting') {
      return;
    }

    let currentStream = null;
    
    const setupWebcam = async () => {
      try {
        setHasRequestedPermission(true);
        
        // Request webcam with explicit constraints 
        currentStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user' 
          },
          audio: false
        });
        
        setStream(currentStream);
        
        if (videoRef.current) {
          videoRef.current.srcObject = currentStream;
          videoRef.current.onloadedmetadata = () => {
            try {
              videoRef.current.play().catch(e => {
                console.error("Video play failed:", e);
              });
            } catch (err) {
              console.error("Error playing video:", err);
            }
          };
        }
        
        setPermissionStatus('granted');
        if (onPermission) {
          onPermission(true);
        }
      } catch (error) {
        console.error('Error accessing webcam:', error);
        setPermissionStatus('denied');
        if (onPermission) {
          onPermission(false);
        }
      }
    };

    // Only setup webcam if we haven't already requested permission or if we need to retry
    if (!hasRequestedPermission || permissionStatus === 'denied') {
      // Slight delay to ensure component is fully mounted
      const timer = setTimeout(() => {
        setupWebcam();
      }, 300);
      
      return () => clearTimeout(timer);
    }
    
  }, [onPermission, stream, permissionStatus, hasRequestedPermission]);

  // Cleanup stream when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Draw a simulated camera feed (placeholder) when real camera isn't working
  const simulateCamera = () => {
    if (!videoRef.current || permissionStatus !== 'granted') {
      return;
    }

    const ctx = videoRef.current.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1A2151'; // Space blue
    ctx.fillRect(0, 0, videoRef.current.width, videoRef.current.height);

    // Draw stars
    ctx.fillStyle = 'white';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * videoRef.current.width;
      const y = Math.random() * videoRef.current.height;
      const radius = Math.random() * 2;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw simulated "user"
    ctx.fillStyle = '#FFD8BE'; // Skin color
    ctx.beginPath();
    ctx.arc(videoRef.current.width / 2, videoRef.current.height / 2, 50, 0, Math.PI * 2);
    ctx.fill();

    // Draw face features
    ctx.fillStyle = 'black';
    // Left eye
    ctx.beginPath();
    ctx.arc(videoRef.current.width / 2 - 20, videoRef.current.height / 2 - 10, 5, 0, Math.PI * 2);
    ctx.fill();
    // Right eye
    ctx.beginPath();
    ctx.arc(videoRef.current.width / 2 + 20, videoRef.current.height / 2 - 10, 5, 0, Math.PI * 2);
    ctx.fill();
    // Smile
    ctx.beginPath();
    ctx.arc(videoRef.current.width / 2, videoRef.current.height / 2 + 10, 25, 0.1 * Math.PI, 0.9 * Math.PI);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 3;
    ctx.stroke();

    requestAnimationFrame(simulateCamera);
  };

  return (
    <div className="webcam-container">
      <div className="relative rounded-xl overflow-hidden border-4 border-space-purple shadow-xl" style={{ minHeight: '240px' }}>
        {!isSupported && (
          <div className="absolute inset-0 flex items-center justify-center bg-space-dark p-4">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="mt-4 text-yellow-300">Camera not supported</p>
              <p className="mt-2 text-sm">Your browser doesn't support webcam access</p>
            </div>
          </div>
        )}
        
        {permissionStatus === 'waiting' && isSupported && (
          <div className="absolute inset-0 flex items-center justify-center bg-space-dark">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-space-pink mx-auto"></div>
              <p className="mt-4 text-space-pink">Requesting camera access...</p>
            </div>
          </div>
        )}
        
        {permissionStatus === 'denied' && isSupported && (
          <div className="absolute inset-0 flex items-center justify-center bg-space-dark p-4">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="mt-4 text-red-400">Camera access denied</p>
              <p className="mt-2 text-sm">Please allow camera access in your browser settings</p>
              <button 
                onClick={() => {
                  setHasRequestedPermission(false);
                  setPermissionStatus('waiting');
                  window.location.reload();
                }} 
                className="mt-4 space-button text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {isSupported && (
          <video 
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-auto ${permissionStatus !== 'granted' ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
          ></video>
        )}
        
        {permissionStatus === 'granted' && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-space-blue to-transparent p-2 text-center">
            <p className="text-white text-xs">📹 Live Feed</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebcamFeed; 