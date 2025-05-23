import { useState, useEffect } from 'react';

const Badge = ({ badge, animate = false }) => {
  const [isAnimating, setIsAnimating] = useState(animate);
  
  useEffect(() => {
    if (animate) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [animate]);

  return (
    <div className="badge-container text-center">
      <div className={`badge mx-auto mb-2 ${isAnimating ? 'animate-pulse-slow' : ''}`}>
        <div className="badge-inner">
          {badge.imageUrl ? (
            <img src={badge.imageUrl} alt={badge.name} className="w-10 h-10" />
          ) : (
            <div className="w-10 h-10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-space-accent" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
      </div>
      <div className="badge-name font-bold text-sm">
        {badge.name}
      </div>
      <div className="badge-description text-xs text-slate-300 mt-1">
        {badge.description}
      </div>
    </div>
  );
};

export default Badge; 