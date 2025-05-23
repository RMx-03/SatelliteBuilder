import { useEffect, useState, useRef } from 'react';

// space avatar
const AvatarSvg = ({ isSpeaking }) => (
  <div className={`relative w-64 h-64 ${isSpeaking ? 'animate-pulse-slow' : ''}`}>
    <svg
      viewBox="0 0 200 200"
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Space background with stars */}
      <circle cx="100" cy="100" r="85" fill="#2A3990" />
      <circle cx="100" cy="100" r="75" fill="#1A2570" />
      
      {/* Stars in background */}
      <circle cx="60" cy="50" r="2" fill="white" />
      <circle cx="140" cy="40" r="3" fill="white" />
      <circle cx="40" cy="120" r="1.5" fill="white" />
      <circle cx="150" cy="130" r="2" fill="white" />
      <circle cx="170" cy="70" r="1" fill="white" />
      <circle cx="30" cy="80" r="1" fill="#FFC2D1" />
      <circle cx="120" cy="160" r="1.5" fill="#FFC2D1" />
      
      {/* Helmet visor */}
      <ellipse
        cx="100"
        cy="95"
        rx="60"
        ry="65"
        fill="#64B5F6"
        fillOpacity="0.7"
        stroke="#90CAF9"
        strokeWidth="2"
      />
      
      {/* Reflection on helmet */}
      <ellipse
        cx="80"
        cy="60"
        rx="25"
        ry="15"
        fill="white"
        fillOpacity="0.2"
        transform="rotate(-20 80 60)"
      />
      
      {/* alien face */}
      <circle cx="100" cy="95" r="40" fill="#90CAF9" />
      
      {/* Big eyes */}
      <g className={isSpeaking ? 'animate-bounce' : ''}>
        {/* Left eye */}
        <circle cx="85" cy="85" r="10" fill="white" />
        <circle cx="85" cy="85" r="6" fill="#3D5AFE" />
        <circle cx="85" cy="85" r="3" fill="black" />
        <circle cx="82" cy="82" r="3" fill="white" opacity="0.7" />
        
        {/* Right eye */}
        <circle cx="115" cy="85" r="10" fill="white" />
        <circle cx="115" cy="85" r="6" fill="#3D5AFE" />
        <circle cx="115" cy="85" r="3" fill="black" />
        <circle cx="112" cy="82" r="3" fill="white" opacity="0.7" />
      </g>
      
      {/* cheeks */}
      <circle cx="75" cy="100" r="6" fill="#FF80AB" fillOpacity="0.6" />
      <circle cx="125" cy="100" r="6" fill="#FF80AB" fillOpacity="0.6" />
      
      {/* smile/mouth */}
      <path
        d={isSpeaking 
          ? "M85,110 Q100,125 115,110 Q100,120 85,110" // Speaking mouth
          : "M85,110 Q100,120 115,110" // Regular smile
        }
        stroke="#3949AB"
        strokeWidth="3"
        fill={isSpeaking ? "#3949AB" : "none"}
        strokeLinecap="round"
      />
      
      {/* Helmet rim */}
      <circle cx="100" cy="100" r="75" stroke="#7E57C2" strokeWidth="6" fill="none" />
      <circle cx="100" cy="100" r="80" stroke="#B39DDB" strokeWidth="3" fill="none" />
      
      {/* antenna with star */}
      <line x1="100" y1="25" x2="100" y2="5" stroke="#FF80AB" strokeWidth="4" strokeLinecap="round" />
      
      {/* Star on antenna */}
      <path
        d="M100,0 L102,5 L107,5 L103,8 L105,13 L100,10 L95,13 L97,8 L93,5 L98,5 Z"
        fill="#FFEB3B"
        stroke="#FFA000"
        strokeWidth="0.5"
      />
      
      {/* space decorations on helmet */}
      <circle cx="135" cy="110" r="8" fill="#7E57C2" fillOpacity="0.6" />
      <circle cx="135" cy="110" r="4" fill="#B39DDB" />
      
      <circle cx="65" cy="110" r="8" fill="#7E57C2" fillOpacity="0.6" />
      <circle cx="65" cy="110" r="4" fill="#B39DDB" />
      
      {/* Sound waves when speaking */}
      {isSpeaking && (
        <>
          <path
            d="M130,95 Q140,85 140,95 Q140,105 150,95"
            stroke="#FF80AB"
            strokeWidth="2.5"
            fill="none"
            className="animate-pulse-slow"
            strokeLinecap="round"
          />
          <path
            d="M130,95 Q150,75 160,95 Q170,115 180,95"
            stroke="#FF80AB"
            strokeWidth="2"
            fill="none"
            className="animate-pulse-slow"
            style={{ animationDelay: '0.2s' }}
            strokeLinecap="round"
          />
          <path
            d="M130,95 Q160,65 170,95 Q180,125 190,95"
            stroke="#FF80AB"
            strokeWidth="1.5"
            fill="none"
            className="animate-pulse-slow"
            style={{ animationDelay: '0.4s' }}
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  </div>
);

const Avatar = ({ text, autoPlay = true }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentText, setCurrentText] = useState("");
  const speechSynthRef = useRef(null);
  const [voicesLoaded, setVoicesLoaded] = useState(false);
  const [hasTriedSpeaking, setHasTriedSpeaking] = useState(false);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState(0);
  const [showVoiceSelector, setShowVoiceSelector] = useState(false);
  
  useEffect(() => {
    // Initialize speech synthesis
    speechSynthRef.current = window.speechSynthesis;
    
    const loadVoices = () => {
      if (speechSynthRef.current) {
        const voices = speechSynthRef.current.getVoices();
        console.log('Available voices:', voices.length);
        if (voices.length > 0) {
          // Filter 
          const suitableVoices = voices.filter(voice => {
            const name = voice.name.toLowerCase();
            const lang = voice.lang.toLowerCase();
            
            // Exclude 
            if (name.includes('indian') || name.includes('india') || 
                lang.includes('in') || lang.includes('indian')) {
              return false;
            }
            
            // include 
            const isUSOrUKEnglish = (
              lang.startsWith('en-us') || 
              lang.startsWith('en-gb') || 
              lang.startsWith('en-') && (lang.includes('us') || lang.includes('gb') || lang.includes('uk'))
            ) || (
              // Fallback for voices that might not have specific regional codes
              lang.startsWith('en') && !lang.includes('in') && !lang.includes('au') && !lang.includes('ca') && !lang.includes('za')
            );
            
            if (!isUSOrUKEnglish) {
              return false;
            }
            
            // Include suitable voices
            return (
              name.includes('female') ||
              name.includes('zira') || name.includes('hazel') || 
              name.includes('susan') || name.includes('karen') ||
              name.includes('serena') || name.includes('allison') ||
              name.includes('ava') || name.includes('victoria') ||
              name.includes('samantha') || name.includes('alice') ||
              name.includes('emily') || name.includes('sarah') ||
              name.includes('cortana') || name.includes('siri') ||
              isUSOrUKEnglish // Include all US/UK English voices as options
            );
          });
          
          // Sort voices 
          const sortedVoices = suitableVoices.sort((a, b) => {
            const aName = a.name.toLowerCase();
            const bName = b.name.toLowerCase();
            const aLang = a.lang.toLowerCase();
            const bLang = b.lang.toLowerCase();
            
            // Highest priority
            const aIsUSFemale = (aLang.includes('us') || aLang.startsWith('en-us')) && aName.includes('female');
            const bIsUSFemale = (bLang.includes('us') || bLang.startsWith('en-us')) && bName.includes('female');
            
            if (aIsUSFemale && !bIsUSFemale) return -1;
            if (!aIsUSFemale && bIsUSFemale) return 1;
            
            // Second priority
            const aIsUS = aLang.includes('us') || aLang.startsWith('en-us');
            const bIsUS = bLang.includes('us') || bLang.startsWith('en-us');
            
            if (aIsUS && !bIsUS) return -1;
            if (!aIsUS && bIsUS) return 1;
            
            // Third priority
            const aIsFemale = aName.includes('female');
            const bIsFemale = bName.includes('female');
            
            if (aIsFemale && !bIsFemale) return -1;
            if (!aIsFemale && bIsFemale) return 1;
            
            return 0;
          });
          
          setAvailableVoices(sortedVoices);
          setVoicesLoaded(true);
        }
      }
    };
    
    // Check if voices are available or need to wait
    if (speechSynthRef.current) {
      loadVoices();
      
      // Add event listener for when voices are loaded 
      speechSynthesis.addEventListener('voiceschanged', loadVoices);
    }
    
    // Clean up function
    return () => {
      if (speechSynthRef.current) {
        speechSynthRef.current.cancel();
      }
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);
  
  useEffect(() => {
    if (text && autoPlay && voicesLoaded && !hasTriedSpeaking) {
      // Small delay to ensure component is fully rendered
      const timer = setTimeout(() => {
        speak(text);
        setHasTriedSpeaking(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
    setCurrentText(text);
  }, [text, autoPlay, voicesLoaded, hasTriedSpeaking]);

  // Reset hasTriedSpeaking when text changes
  useEffect(() => {
    setHasTriedSpeaking(false);
  }, [text]);
  
  const speak = (textToSpeak, useSelectedVoice = false) => {
    if (!speechSynthRef.current || !textToSpeak) {
      console.log("Speech synthesis not available or no text provided");
      return;
    }
    
    try {
      // Cancel any ongoing speech
      speechSynthRef.current.cancel();
      
      // Small delay to ensure cancel completes
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        
        // Get available voices
        const voices = speechSynthRef.current.getVoices();
        console.log('Voices available for speech:', voices.length);
        
        let selectedVoice = null;
        
        // Use manually selected voice if user has chosen one
        if (useSelectedVoice && availableVoices.length > 0 && selectedVoiceIndex < availableVoices.length) {
          selectedVoice = availableVoices[selectedVoiceIndex];
          console.log('Using user-selected voice:', selectedVoice.name);
        } else {
          
          
          // Priority 1
          selectedVoice = voices.find(voice => {
            const name = voice.name.toLowerCase();
            const lang = voice.lang.toLowerCase();
            return (lang.includes('us') || lang.startsWith('en-us')) && 
                   name.includes('female') &&
                   !name.includes('indian') && !name.includes('india');
          });
          
          if (selectedVoice) {
            console.log('Found US Female English voice:', selectedVoice.name);
          } else {
            // Priority 2
            selectedVoice = voices.find(voice => {
              const name = voice.name.toLowerCase();
              const lang = voice.lang.toLowerCase();
              return (lang.includes('gb') || lang.includes('uk') || lang.startsWith('en-gb')) && 
                     name.includes('female') &&
                     !name.includes('indian') && !name.includes('india');
            });
            
            if (selectedVoice) {
              console.log('Found UK Female English voice:', selectedVoice.name);
            }
          }
          
          // Priority 3
          if (!selectedVoice) {
            const premiumUSUKFemaleVoices = [
              'Google US English Female',
              'Google UK English Female', 
              'Microsoft Zira - English (United States)',
              'Microsoft Hazel - English (Great Britain)',
              'Apple Samantha',
              'Samantha',
              'Victoria',
              'Allison',
              'Ava',
              'Serena',
              'Karen'
            ];
            
            for (let voiceName of premiumUSUKFemaleVoices) {
              selectedVoice = voices.find(voice => {
                const name = voice.name.toLowerCase();
                const lang = voice.lang.toLowerCase();
                return name.includes(voiceName.toLowerCase()) &&
                       !name.includes('indian') && !name.includes('india') &&
                       !lang.includes('in') && !lang.includes('indian');
              });
              if (selectedVoice) {
                console.log('Found premium US/UK female voice:', selectedVoice.name);
                break;
              }
            }
          }
          
          // Priority 4
          if (!selectedVoice) {
            selectedVoice = voices.find(voice => {
              const name = voice.name.toLowerCase();
              const lang = voice.lang.toLowerCase();
              return name.includes('female') && 
                     (lang.startsWith('en-us') || lang.startsWith('en-gb') || 
                      lang.includes('us') || lang.includes('gb') || lang.includes('uk')) &&
                     !name.includes('indian') && !name.includes('india') &&
                     !lang.includes('in') && !lang.includes('indian');
            });
            if (selectedVoice) {
              console.log('Found US/UK female voice:', selectedVoice.name);
            }
          }
          
          // Priority 5
          if (!selectedVoice) {
            const likelyUSUKFemaleVoices = voices.filter(voice => {
              const name = voice.name.toLowerCase();
              const lang = voice.lang.toLowerCase();
              
              
              const isUSOrUK = lang.startsWith('en-us') || lang.startsWith('en-gb') || 
                             lang.includes('us') || lang.includes('gb') || lang.includes('uk') ||
                             (lang.startsWith('en') && !lang.includes('in') && !lang.includes('au') && !lang.includes('ca') && !lang.includes('za'));
              
              if (!isUSOrUK) return false;
              
              
              if (name.includes('indian') || name.includes('india') || 
                  lang.includes('in') || lang.includes('indian')) {
                return false;
              }
              
              return (
                name.includes('zira') || name.includes('hazel') || 
                name.includes('susan') || name.includes('karen') ||
                name.includes('serena') || name.includes('allison') ||
                name.includes('ava') || name.includes('victoria') ||
                name.includes('samantha') || name.includes('alice') ||
                name.includes('emily') || name.includes('sarah')
              );
            });
            
            if (likelyUSUKFemaleVoices.length > 0) {
              selectedVoice = likelyUSUKFemaleVoices[0];
              console.log('Found likely US/UK female voice:', selectedVoice.name);
            }
          }
          
          // Priority 6
          if (!selectedVoice) {
            selectedVoice = voices.find(voice => {
              const lang = voice.lang.toLowerCase();
              const name = voice.name.toLowerCase();
              return (lang.startsWith('en-us') || lang.startsWith('en-gb') || 
                     lang.includes('us') || lang.includes('gb') || lang.includes('uk')) &&
                     !name.includes('indian') && !name.includes('india') &&
                     !lang.includes('in') && !lang.includes('indian');
            });
            if (selectedVoice) {
              console.log('Using US/UK English fallback voice:', selectedVoice.name);
            }
          }
          
          // Priority 7
          if (!selectedVoice) {
            selectedVoice = voices.find(voice => {
              const lang = voice.lang.toLowerCase();
              const name = voice.name.toLowerCase();
              return lang.startsWith('en') && 
                     !name.includes('indian') && !name.includes('india') &&
                     !lang.includes('in') && !lang.includes('indian') &&
                     !lang.includes('au') && !lang.includes('ca') && !lang.includes('za');
            });
            if (selectedVoice) {
              console.log('Using English fallback voice (non-Indian):', selectedVoice.name);
            }
          }
          
          // Priority 8
          if (!selectedVoice && voices.length > 0) {
            selectedVoice = voices[0];
            console.log('Using first available voice:', selectedVoice.name);
          }
        }
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
        }
        
        // Optimized speech parameters 
        utterance.pitch = 1.0;   // Natural pitch, not too high
        utterance.rate = 0.85;   // Slower, more relaxed pace
        utterance.volume = 0.8;  // Gentle volume
        
        // Additional adjustments for different voice types
        if (selectedVoice) {
          const voiceName = selectedVoice.name.toLowerCase();
          
          // Fine-tune for specific voice types
          if (voiceName.includes('google')) {
            utterance.pitch = 0.9;  // Google voices sound better with slightly lower pitch
            utterance.rate = 0.9;
          } else if (voiceName.includes('microsoft')) {
            utterance.pitch = 1.1;  // Microsoft voices need slightly higher pitch
            utterance.rate = 0.8;
          } else if (voiceName.includes('apple') || voiceName.includes('samantha')) {
            utterance.pitch = 0.95; // Apple voices are naturally well-balanced
            utterance.rate = 0.85;
          }
        }
        
        utterance.onstart = () => {
          console.log("Speech started with voice:", selectedVoice?.name || 'default');
          setIsSpeaking(true);
        };
        
        utterance.onend = () => {
          console.log("Speech ended");
          setIsSpeaking(false);
        };
        
        utterance.onerror = (event) => {
          console.error("Speech error:", event);
          setIsSpeaking(false);
        };
        
        utterance.onpause = () => {
          console.log("Speech paused");
          setIsSpeaking(false);
        };
        
        utterance.onresume = () => {
          console.log("Speech resumed");
          setIsSpeaking(true);
        };
        
        try {
          speechSynthRef.current.speak(utterance);
        } catch (speakError) {
          console.error("Error calling speak:", speakError);
          setIsSpeaking(false);
        }
      }, 100);
      
    } catch (error) {
      console.error("Error in speech synthesis:", error);
      setIsSpeaking(false);
    }
  };
  
  const testVoice = (voiceIndex) => {
    setSelectedVoiceIndex(voiceIndex);
    speak("Hello! I'm Nova, your space guide. How does my voice sound?", true);
  };

  const startMouthAnimation = () => {
    // Visual indicator for speech already handled by isSpeaking state
  };

  return (
    <div className="avatar-container flex flex-col items-center">
      <div 
        className="avatar-animation-container relative mb-4"
      >
        <div className="absolute inset-0 bg-space-blue rounded-full opacity-20"></div>
        <AvatarSvg isSpeaking={isSpeaking} />
        {isSpeaking && (
          <div className="absolute bottom-8 left-0 right-0 mx-auto w-16 h-4">
            <div className="flex justify-center items-end h-full space-x-1">
              <div className="w-1 bg-space-pink rounded-full animate-bounce h-2"></div>
              <div className="w-1 bg-space-pink rounded-full animate-bounce h-3" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 bg-space-pink rounded-full animate-bounce h-4" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 bg-space-pink rounded-full animate-bounce h-1" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-1 bg-space-pink rounded-full animate-bounce h-2" style={{ animationDelay: '0.15s' }}></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="speech-bubble bg-white bg-opacity-10 p-4 rounded-xl border border-space-purple shadow-lg">
        <p className="text-lg">{currentText}</p>
        
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {!isSpeaking && voicesLoaded && (
            <button 
              className="text-space-pink hover:text-white text-sm flex items-center transition-colors duration-200"
              onClick={() => speak(currentText, true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
              </svg>
              Play Again
            </button>
          )}
          
          {availableVoices.length > 1 && (
            <button
              className="text-space-purple hover:text-space-pink text-sm flex items-center transition-colors duration-200"
              onClick={() => setShowVoiceSelector(!showVoiceSelector)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              {showVoiceSelector ? 'Hide Voices' : 'Change Voice'}
            </button>
          )}
        </div>
        
        {showVoiceSelector && availableVoices.length > 1 && (
          <div className="mt-4 p-3 bg-space-blue bg-opacity-30 rounded-lg border border-space-purple">
            <p className="text-sm text-space-pink mb-3 text-center">Choose Nova's Voice:</p>
            <div className="max-h-32 overflow-y-auto space-y-2">
              {availableVoices.slice(0, 8).map((voice, index) => (
                <div key={index} className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="voice"
                      checked={selectedVoiceIndex === index}
                      onChange={() => setSelectedVoiceIndex(index)}
                      className="mr-2 text-space-pink"
                    />
                    <span className="text-sm text-white truncate max-w-40">
                      {voice.name.replace(/Microsoft|Apple|Google/g, '').trim()}
                    </span>
                  </label>
                  <button
                    onClick={() => testVoice(index)}
                    className="ml-2 px-2 py-1 text-xs bg-space-pink text-white rounded hover:bg-opacity-80 transition-colors"
                    disabled={isSpeaking}
                  >
                    Test
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!voicesLoaded && (
          <p className="mt-2 text-xs text-space-purple">Loading speech system...</p>
        )}
      </div>
    </div>
  );
};

export default Avatar; 