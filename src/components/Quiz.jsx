import { useState } from 'react';
import Avatar from './Avatar';

const Quiz = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  
  const questions = [
    {
      question: "What do solar panels on a satellite do?",
      options: [
        "Send messages to Earth",
        "Take pictures of stars",
        "Collect energy from the Sun",
        "Protect the satellite from space junk"
      ],
      correctAnswer: 2,
      explanation: "Solar panels on satellites collect energy from sunlight and convert it into electricity, providing power for all the satellite's equipment."
    },
    {
      question: "What is the main job of a satellite's antenna?",
      options: [
        "To communicate with Earth by sending and receiving signals",
        "To take pictures of Earth",
        "To collect solar energy",
        "To propel the satellite through space"
      ],
      correctAnswer: 0,
      explanation: "The antenna is used for communication, allowing the satellite to send data back to Earth and receive instructions."
    },
    {
      question: "Why do satellites need cameras?",
      options: [
        "To look for aliens",
        "For video calls with astronauts",
        "To take selfies in space",
        "To observe Earth, planets, or stars"
      ],
      correctAnswer: 3,
      explanation: "Satellites use cameras to observe and collect data about Earth, other planets, stars and galaxies, helping scientists learn more about our universe."
    },
    {
      question: "What does the satellite body (or bus) do?",
      options: [
        "It carries passengers to space",
        "It holds all the parts together and protects them",
        "It helps the satellite move faster",
        "It makes the satellite invisible"
      ],
      correctAnswer: 1,
      explanation: "The satellite body (or bus) is the main structure that holds all the components together and protects the delicate instruments from harsh space conditions."
    },
    {
      question: "Why do satellites orbit Earth instead of staying in one spot?",
      options: [
        "To avoid space debris",
        "To use less fuel",
        "To cover more area and stay in motion using gravity",
        "Because they're afraid of aliens"
      ],
      correctAnswer: 2,
      explanation: "Satellites orbit Earth to stay in motion using gravity, which keeps them from falling back to Earth. This also allows them to cover and observe more area as they travel around the planet."
    }
  ];

  const handleAnswerSelect = (answerIndex) => {
    if (isAnswered) return; // Prevent changing answer after submission
    
    setSelectedAnswer(answerIndex);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return; // Must select an answer

    setIsAnswered(true);
    
    // Check if answer is correct
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      // Play success sound
      const successSound = new Audio('/correct-answer.mp3');
      successSound.play().catch(e => console.log('Audio play error:', e));
    } else {
      // Play incorrect sound
      const incorrectSound = new Audio('/wrong-answer.mp3');
      incorrectSound.play().catch(e => console.log('Audio play error:', e));
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Quiz is complete
      setShowCompletion(true);
      // Remove auto-advance - user will click button to proceed
    }
  };

  const handleProceedToCertificate = () => {
    onComplete(score);
  };

  return (
    <div className="quiz-container">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-space-pink mb-2">Space Quiz Challenge</h2>
        <p className="text-lg">Test your satellite knowledge!</p>
      </div>

      {!showCompletion ? (
        <div className="lesson-card">
          <div className="quiz-progress mb-6">
            <div className="flex justify-between items-center mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>Score: {score}/{currentQuestion}</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full">
              <div 
                className="h-2 bg-space-pink rounded-full transition-all duration-500"
                style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="question-container">
            <h3 className="text-xl font-bold mb-4">{questions[currentQuestion].question}</h3>

            <div className="options-container space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <div 
                  key={index}
                  className={`option p-3 rounded-lg cursor-pointer border-2 transition-all
                    ${selectedAnswer === index ? 'border-white bg-space-blue' : 'border-space-purple bg-transparent hover:bg-space-blue hover:bg-opacity-30'}
                    ${isAnswered && index === questions[currentQuestion].correctAnswer ? 'border-green-500 bg-green-500 bg-opacity-20' : ''}
                    ${isAnswered && index === selectedAnswer && index !== questions[currentQuestion].correctAnswer ? 'border-red-500 bg-red-500 bg-opacity-20' : ''}
                  `}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className="flex items-start">
                    <span className="w-6 h-6 rounded-full border-2 border-space-purple flex items-center justify-center mr-3">
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span>{option}</span>
                  </div>
                </div>
              ))}
            </div>

            {isAnswered && (
              <div className="explanation mt-6 p-4 bg-space-blue bg-opacity-30 rounded-lg border border-space-purple">
                <h4 className="font-bold mb-2">
                  {selectedAnswer === questions[currentQuestion].correctAnswer 
                    ? '✅ Correct!' 
                    : '❌ Not quite right'}
                </h4>
                <p>{questions[currentQuestion].explanation}</p>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              {!isAnswered ? (
                <button 
                  className={`space-button ${selectedAnswer === null ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={handleSubmit}
                  disabled={selectedAnswer === null}
                >
                  Submit Answer
                </button>
              ) : (
                <button 
                  className="space-button"
                  onClick={handleNext}
                >
                  {currentQuestion < questions.length - 1 ? 'Next Question' : 'See Results'}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="completion-screen text-center">
          <div className="mb-8">
            <Avatar 
              text={`Great job completing the quiz! You got ${score} out of ${questions.length} questions correct. ${
                score >= 3 
                ? "That's excellent! You've learned a lot about satellites!" 
                : "Keep learning about satellites and try again soon!"
              }`}
              autoPlay={true}
            />
          </div>
          
          <div className="animate-bounce text-4xl mb-4">🚀</div>
          <h3 className="text-2xl font-bold text-space-pink mb-2">
            Quiz Complete!
          </h3>
          <p className="text-xl mb-4">Final Score: {score}/{questions.length}</p>
          
          <div className="mt-8">
            <button 
              className="space-button text-xl py-3 px-6 animate-pulse-slow"
              onClick={handleProceedToCertificate}
            >
              {score >= 3 ? '🎉 Get My Space Badge!' : '📊 See Results'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz; 