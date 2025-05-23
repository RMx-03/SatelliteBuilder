import { useState, useEffect, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Avatar from './Avatar';

// Define the satellite parts
const satelliteParts = [
  { id: 'body', name: 'Satellite Body', image: '/assets/satellite-body.svg', placed: false },
  { id: 'solar', name: 'Solar Panels', image: '/assets/solar-panel.svg', placed: false },
  { id: 'antenna', name: 'Antenna', image: '/assets/antenna.svg', placed: false },
  { id: 'camera', name: 'Camera', image: '/assets/camera.svg', placed: false },
  { id: 'power', name: 'Power Supply', image: '/assets/power-supply.svg', placed: false }
];

// drag and drop with itemTypes constant
const ItemTypes = {
  SATELLITE_PART: 'satellite-part'
};

// Draggable satellite part component
const DraggablePart = ({ part, isPlaced }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.SATELLITE_PART,
    item: { id: part.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: !isPlaced
  }));
  
  // Fallback image when the actual image fails to load
  const handleImageError = (e) => {
    e.target.onerror = null;
    // Render colored shapes as fallbacks
    const colors = {
      'body': '#3490dc',
      'solar': '#f6ad55',
      'antenna': '#fc8181',
      'camera': '#68d391',
      'power': '#a3bffa'
    };
    
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = colors[part.id] || '#cbd5e0';
    
    // Draw different shapes for different parts
    switch(part.id) {
      case 'body':
        ctx.beginPath();
        ctx.rect(20, 20, 60, 60);
        ctx.fill();
        break;
      case 'solar':
        ctx.beginPath();
        ctx.rect(10, 40, 80, 20);
        ctx.fill();
        break;
      case 'antenna':
        ctx.beginPath();
        ctx.moveTo(50, 10);
        ctx.lineTo(30, 90);
        ctx.lineTo(70, 90);
        ctx.closePath();
        ctx.fill();
        break;
      case 'camera':
        ctx.beginPath();
        ctx.arc(50, 50, 30, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'power':
        ctx.beginPath();
        ctx.moveTo(20, 20);
        ctx.lineTo(80, 20);
        ctx.lineTo(80, 80);
        ctx.lineTo(20, 80);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 5;
        ctx.moveTo(35, 40);
        ctx.lineTo(65, 60);
        ctx.stroke();
        break;
      default:
        ctx.beginPath();
        ctx.rect(20, 20, 60, 60);
        ctx.fill();
    }
    
    e.target.src = canvas.toDataURL();
  };
  
  return (
    <div 
      ref={drag}
      className={`satellite-part ${isPlaced ? 'opacity-50 cursor-not-allowed' : 'cursor-move hover:scale-105'}`}
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        border: '2px solid #6B4E71',
        padding: '8px',
        marginBottom: '8px',
        borderRadius: '8px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        transition: 'all 0.3s ease'
      }}
      data-testid={`draggable-part-${part.id}`}
    >
      <img 
        src={part.image} 
        alt={part.name} 
        className="w-24 h-24 object-contain"
        onError={handleImageError} 
      />
      <p className="text-center mt-2">{part.name}</p>
    </div>
  );
};

// Drop target for the satellite assembly area
const AssemblyArea = ({ placedParts, onDrop }) => {
  // drop functionality using useCallback
  const handleDrop = useCallback((item) => {
    onDrop(item.id);
  }, [onDrop]);
  
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.SATELLITE_PART,
    drop: (item) => handleDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    })
  }), [handleDrop]);

  // Helper function to get part position styles
  const getPartStyle = (partId) => {
    switch (partId) {
      case 'body':
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 };
      case 'solar':
        return { top: '50%', left: '20%', transform: 'translate(-50%, -50%) rotate(-15deg)', zIndex: 2 };
      case 'antenna':
        return { top: '20%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 3 };
      case 'camera':
        return { top: '50%', right: '20%', transform: 'translate(50%, -50%) rotate(15deg)', zIndex: 2 };
      case 'power':
        return { bottom: '20%', left: '50%', transform: 'translate(-50%, 50%)', zIndex: 3 };
      default:
        return { display: 'none' };
    }
  };
  
  return (
    <div 
      ref={drop} 
      className={`assembly-area relative bg-space-blue bg-opacity-30 rounded-full w-96 h-96 mx-auto border-4 ${isOver ? 'border-green-400 border-dashed' : 'border-space-purple'}`}
      style={{ 
        minHeight: '24rem',
        minWidth: '24rem',
        boxShadow: '0 0 20px rgba(26, 33, 81, 0.5)',
        transition: 'all 0.3s ease'
      }}
      data-testid="assembly-area"
    >
      {placedParts.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-lg text-white opacity-70">Drag parts here to build your satellite</p>
        </div>
      )}
      
      {satelliteParts.map(part => {
        const isPlaced = placedParts.includes(part.id);
        if (isPlaced) {
          return (
            <div 
              key={part.id}
              className="absolute w-24 h-24 transition-all duration-500 ease-out"
              style={getPartStyle(part.id)}
              data-testid={`placed-part-${part.id}`}
            >
              <img 
                src={part.image} 
                alt={part.name} 
                className="w-full h-full object-contain animate-pulse-slow"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `/assets/${part.id}.svg`;
                }}
              />
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

const SatelliteBuilder = ({ onComplete, onNameChange }) => {
  const [parts, setParts] = useState(satelliteParts);
  const [placedParts, setPlacedParts] = useState([]);
  const [satelliteName, setSatelliteName] = useState('');
  const [allPartsPlaced, setAllPartsPlaced] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (placedParts.length === satelliteParts.length) {
      setAllPartsPlaced(true);
      setTimeout(() => {
        setShowCelebration(true);
        // play sound
        try {
          const successSound = new Audio('/assets/success-sound.mp3');
          successSound.volume = 0.5;
          successSound.play().catch(e => console.log('Audio play error:', e));
        } catch (e) {
          console.log('Audio creation error:', e);
        }
      }, 1000);
    }
  }, [placedParts]);

  const handleDrop = useCallback((partId) => {
    console.log("Part dropped:", partId);
    if (!placedParts.includes(partId)) {
      // Add part to placed parts
      setPlacedParts(prev => [...prev, partId]);
      
      // Update parts to mark this one as placed
      setParts(prev => prev.map(part => 
        part.id === partId ? { ...part, placed: true } : part
      ));
      
      // play sound with fallback
      try {
        const placeSound = new Audio('/assets/place-sound.mp3');
        placeSound.volume = 0.5;
        placeSound.play().catch(e => console.log('Audio play error:', e));
      } catch (e) {
        console.log('Audio creation error:', e);
      }
    }
  }, [placedParts]);

  const handleNameChange = (e) => {
    const name = e.target.value;
    setSatelliteName(name);
    if (onNameChange) {
      onNameChange(name);
    }
  };

  const handleComplete = () => {
    if (satelliteName.trim() === '') {
      alert('Please name your satellite before launching!');
      return;
    }
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="satellite-builder-container">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-space-pink mb-2">Build Your Satellite</h2>
          <p className="text-lg">Drag and drop the parts to build your own satellite</p>
        </div>
        
        <div className="mb-8">
          <Avatar 
            text={showCelebration ? 
              "Amazing job! Your satellite is complete and ready for launch! What would you like to name it?" :
              "Now it's your turn to build a satellite! Drag each part to the assembly area. Start with the satellite body as the base, then add the other components."}
            autoPlay={!showCelebration}
          />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4 mb-4">
            <div className="parts-bin bg-space-blue bg-opacity-30 p-4 rounded-lg border border-space-purple" style={{minHeight: "400px"}}>
              <h3 className="text-xl font-bold mb-4 text-space-pink">Satellite Parts</h3>
              <div className="flex flex-wrap lg:flex-col justify-center">
                {parts.map(part => (
                  <DraggablePart 
                    key={part.id} 
                    part={part} 
                    isPlaced={placedParts.includes(part.id)} 
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 mb-4">
            <AssemblyArea 
              placedParts={placedParts}
              onDrop={handleDrop}
            />
            
            {showCelebration && (
              <div className="celebration mt-8 text-center">
                <div className="fireworks mb-4 relative h-20">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i}
                      className="firework absolute"
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`,
                        backgroundColor: ['#FF5252', '#FFD740', '#64FFDA', '#448AFF', '#E040FB'][i % 5],
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        animation: 'firework 2s ease-out infinite'
                      }}
                    ></div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Name your satellite"
                    value={satelliteName}
                    onChange={handleNameChange}
                    className="px-4 py-2 rounded-full border-2 border-space-purple bg-space-dark text-white text-center"
                    maxLength={20}
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="lg:w-1/4 text-center flex flex-col items-center justify-center">
            <div className="progress-tracker bg-space-blue bg-opacity-30 p-4 rounded-lg border border-space-purple w-full">
              <h3 className="text-xl font-bold mb-4 text-space-pink">Mission Progress</h3>
              <div className="progress-bar mb-4 bg-gray-700 rounded-full h-4">
                <div 
                  className="bg-space-pink rounded-full h-4 transition-all duration-1000 ease-out"
                  style={{ width: `${(placedParts.length / satelliteParts.length) * 100}%` }}
                ></div>
              </div>
              <p>{placedParts.length} of {satelliteParts.length} parts assembled</p>
            </div>
            
            {showCelebration && (
              <button
                onClick={handleComplete}
                className="mt-8 space-button animate-pulse-slow"
                disabled={satelliteName.trim() === ''}
                style={{
                  opacity: satelliteName.trim() === '' ? 0.5 : 1,
                  cursor: satelliteName.trim() === '' ? 'not-allowed' : 'pointer'
                }}
              >
                Launch Satellite & Continue →
              </button>
            )}
          </div>
        </div>
        
        <style jsx>{`
          @keyframes firework {
            0% { transform: translate(0, 0); width: 5px; height: 5px; opacity: 1; }
            50% { width: 15px; height: 15px; opacity: 0.8; }
            100% { width: 5px; height: 5px; transform: translate(var(--x), var(--y)); opacity: 0; }
          }
          
          .firework {
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            --x: ${Math.random() > 0.5 ? '' : '-'}${Math.floor(Math.random() * 100)}px;
            --y: ${Math.random() > 0.5 ? '' : '-'}${Math.floor(Math.random() * 100)}px;
          }
        `}</style>
      </div>
    </DndProvider>
  );
};

export default SatelliteBuilder; 