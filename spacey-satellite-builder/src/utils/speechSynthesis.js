/**
 * Speech Synthesis utility functions
 */

// Check if speech synthesis is supported
export const isSpeechSynthesisSupported = () => {
  return 'speechSynthesis' in window;
};

// Get available voices
export const getVoices = () => {
  return window.speechSynthesis.getVoices();
};

// Get a specific voice by name or a default one
export const getPreferredVoice = (preferredName = null) => {
  const voices = getVoices();
  
  // No preference, find a good default (prefer female voices for the tutor)
  if (!preferredName) {
    // Try to find a female English voice
    const femaleVoice = voices.find(voice => 
      voice.name.includes('Female') && 
      (voice.lang.startsWith('en-') || voice.lang === 'en')
    );
    
    if (femaleVoice) return femaleVoice;
    
    // Otherwise find any English voice
    const englishVoice = voices.find(voice => 
      voice.lang.startsWith('en-') || voice.lang === 'en'
    );
    
    if (englishVoice) return englishVoice;
  } else {
    // Try to find the preferred voice
    const preferredVoice = voices.find(voice => 
      voice.name.includes(preferredName)
    );
    
    if (preferredVoice) return preferredVoice;
  }
  
  // Fall back to the first available voice if no match
  return voices[0];
};

// Speak text with specified options
export const speak = (text, options = {}) => {
  if (!isSpeechSynthesisSupported()) {
    console.error('Speech synthesis is not supported in this browser.');
    return false;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Create a new utterance
  const utterance = new SpeechSynthesisUtterance(text);

  // If voices aren't loaded yet, wait for them
  if (window.speechSynthesis.getVoices().length === 0) {
    window.speechSynthesis.onvoiceschanged = () => {
      if (options.voice) {
        utterance.voice = options.voice;
      } else {
        utterance.voice = getPreferredVoice();
      }
      window.speechSynthesis.speak(utterance);
    };
  } else {
    // Apply options if provided
    if (options.voice) utterance.voice = options.voice;
    else utterance.voice = getPreferredVoice();
  }

  if (options.rate) utterance.rate = options.rate;
  if (options.pitch) utterance.pitch = options.pitch;
  if (options.volume) utterance.volume = options.volume;
  if (options.lang) utterance.lang = options.lang;

  // Add event handlers if provided
  if (options.onstart) utterance.onstart = options.onstart;
  if (options.onend) utterance.onend = options.onend;
  if (options.onerror) utterance.onerror = options.onerror;
  if (options.onpause) utterance.onpause = options.onpause;
  if (options.onresume) utterance.onresume = options.onresume;
  if (options.onboundary) utterance.onboundary = options.onboundary;

  // Add a timeout to handle Firefox issue where onend is not triggered
  const timeoutDuration = (text.length / 5) * 1000 + 5000; // Rough estimate of time needed
  const timeoutId = setTimeout(() => {
    if (options.onend) options.onend();
  }, timeoutDuration);

  // Clear timeout when speech actually ends
  utterance.onend = (event) => {
    clearTimeout(timeoutId);
    if (options.onend) options.onend(event);
  };

  // Speak
  window.speechSynthesis.speak(utterance);

  return utterance;
};

// Stop speaking
export const stopSpeaking = () => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
    return true;
  }
  return false;
};

// Pause speaking
export const pauseSpeaking = () => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.pause();
    return true;
  }
  return false;
};

// Resume speaking
export const resumeSpeaking = () => {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.resume();
    return true;
  }
  return false;
}; 