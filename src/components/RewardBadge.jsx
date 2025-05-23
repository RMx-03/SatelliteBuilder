import { useState, useEffect } from 'react';
import Avatar from './Avatar';

const RewardBadge = ({ score, satelliteName = "Explorer-1", onRetry }) => {
  const [showBadge, setShowBadge] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [imageError, setImageError] = useState(false);
  const passingScore = 3;
  const passed = score >= passingScore;
  
  useEffect(() => {
    // Show avatar 
    const avatarTimer = setTimeout(() => {
      setShowAvatar(true);
    }, 800);
    
    // Show badge 
    const badgeTimer = setTimeout(() => {
      setShowBadge(true);
      // Play celebration sound if passed
      if (passed) {
        const celebrationSound = new Audio('/celebration.mp3');
        celebrationSound.volume = 0.7;
        celebrationSound.play().catch(e => console.log('Audio play error:', e));
      }
    }, 2000);
    
    return () => {
      clearTimeout(avatarTimer);
      clearTimeout(badgeTimer);
    };
  }, [passed]);
  
  // Format date for certificate
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const badgeMessages = {
    success: `Congratulations! You've earned the Space Explorer Badge for your excellent knowledge about satellites. Your satellite "${satelliteName}" is ready for its mission!`,
    retry: `You've completed the satellite builder challenge, but there's still more to learn! Try the quiz again to earn your Space Explorer Badge. Your satellite "${satelliteName}" is almost ready for launch!`
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // SVG badge fallback
  const SvgBadge = () => (
    <svg width="160" height="160" viewBox="0 0 160 160" className="animate-float">
      {/* Outer ring */}
      <circle cx="80" cy="80" r="75" fill="#1A2570" stroke="#FF80AB" strokeWidth="4"/>
      
      {/* Inner ring */}
      <circle cx="80" cy="80" r="60" fill="#2A3990" stroke="#B39DDB" strokeWidth="2"/>
      
      {/* Stars */}
      <g fill="#FFEB3B">
        <polygon points="80,25 85,40 100,40 88,50 93,65 80,55 67,65 72,50 60,40 75,40" />
        <circle cx="45" cy="45" r="3"/>
        <circle cx="115" cy="45" r="3"/>
        <circle cx="45" cy="115" r="3"/>
        <circle cx="115" cy="115" r="3"/>
      </g>
      
      {/* Satellite icon */}
      <g fill="#90CAF9" stroke="#3D5AFE" strokeWidth="1">
        <rect x="70" y="70" width="20" height="15" rx="2"/>
        <rect x="60" y="75" width="8" height="5" rx="1"/>
        <rect x="92" y="75" width="8" height="5" rx="1"/>
        <line x1="80" y1="65" x2="80" y2="55" strokeWidth="2"/>
        <circle cx="80" cy="52" r="3" fill="#FFEB3B"/>
      </g>
      
      {/* Score */}
      <text x="80" y="105" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
        {score}/5
      </text>
      <text x="80" y="120" textAnchor="middle" fill="#B39DDB" fontSize="8">
        POINTS
      </text>
    </svg>
  );

  return (
    <div className="reward-badge-container">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-space-pink mb-2">
          {passed ? 'Mission Accomplished!' : 'Mission Status Update'}
        </h2>
        <p className="text-lg">
          {passed ? 'You have earned your Space Explorer Badge!' : 'Keep learning to earn your badge!'}
        </p>
      </div>
      
      {showAvatar && (
        <div className="avatar-message mb-8">
          <Avatar 
            text={passed ? badgeMessages.success : badgeMessages.retry} 
            autoPlay={true}
          />
        </div>
      )}
      
      <div className={`badge-display transition-all duration-1000 transform ${showBadge ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
        {passed ? (
          <div className="certificate-container bg-gradient-to-br from-space-blue to-space-purple p-1 rounded-lg shadow-xl">
            <div className="certificate bg-space-dark p-8 rounded-lg border-2 border-space-pink text-center">
              <div className="certificate-header mb-4">
                <h3 className="text-2xl font-bold text-space-pink">Space Explorer Certificate</h3>
                <div className="w-16 h-1 bg-space-pink mx-auto mt-2"></div>
              </div>
              
              <div className="certificate-stars flex justify-center space-x-4 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-300 text-2xl animate-pulse-slow" style={{ animationDelay: `${i * 0.2}s` }}>★</span>
                ))}
              </div>
              
              <div className="certificate-badge mb-4">
                <div className="relative w-48 h-48 mx-auto">
                  <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-pulse-slow"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="badge-inner relative">
                      {!imageError ? (
                        <img 
                          src="/space-badge.png" 
                          alt="Space Explorer Badge" 
                          className="w-40 h-40 animate-float"
                          onError={handleImageError}
                        />
                      ) : (
                        <SvgBadge />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="certificate-text mb-6">
                <p className="text-lg mb-2">This certifies that</p>
                <h4 className="text-xl font-bold mb-2 text-space-pink">
                  <span className="border-b-2 border-space-pink px-2">Space Cadet</span>
                </h4>
                <p className="text-lg mb-2">has successfully built</p>
                <h4 className="text-xl font-bold mb-4 text-space-pink">{satelliteName}</h4>
                <p className="text-sm text-space-purple">{formattedDate}</p>
              </div>
              
              <div className="certificate-footer">
                <p className="text-sm">Continue your space adventure!</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="retry-container text-center">
            <div className="retry-message bg-space-blue bg-opacity-40 p-6 rounded-lg border border-space-purple">
              <div className="text-6xl mb-4">🛰️</div>
              <h3 className="text-xl font-bold mb-4">{satelliteName} Needs More Testing</h3>
              <p className="mb-6">You scored {score} out of 5. You need at least {passingScore} points to earn your Space Explorer Badge.</p>
              <button 
                className="space-button animate-pulse-slow"
                onClick={onRetry}
              >
                Try Quiz Again
              </button>
            </div>
          </div>
        )}
      </div>
      
      {passed && (
        <div className="celebration-effects">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                backgroundColor: ['#FF5252', '#FFD740', '#64FFDA', '#448AFF', '#E040FB'][i % 5],
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${5 + Math.random() * 5}s`
              }}
            ></div>
          ))}
        </div>
      )}
      
      <style jsx>{`
        .shadow-text {
          text-shadow: 0 0 4px rgba(0,0,0,0.8);
        }
        
        @keyframes confetti-fall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        
        .confetti {
          position: fixed;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          animation: confetti-fall 5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default RewardBadge; 