import { useState, useEffect } from 'react';

const Quiz = ({ questions, onComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  
  const currentQuestion = questions[currentQuestionIndex];
  
  useEffect(() => {
    // Reset explanation when question changes
    setShowExplanation(false);
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerId
    });
  };

  const handleNextQuestion = () => {
    // Check if answer is correct before moving on
    const isCorrect = selectedAnswers[currentQuestion.id] === currentQuestion.correctAnswer;
    
    // If the answer is correct, increment the score
    if (isCorrect && !showExplanation) {
      setScore(prevScore => prevScore + 1);
    }
    
    // If explanation is showing, move to next question
    if (showExplanation) {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setShowExplanation(false);
      } else {
        // If it's the last question, show the final results
        setShowResults(true);
        
        // Pass score to parent component
        if (onComplete) {
          onComplete({
            score,
            totalQuestions: questions.length,
            answers: selectedAnswers
          });
        }
      }
    } else {
      // Show explanation first
      setShowExplanation(true);
    }
  };

  const isAnswerSelected = (questionId) => {
    return selectedAnswers[questionId] !== undefined;
  };

  const isCorrectAnswer = (questionId, answerId) => {
    const question = questions.find(q => q.id === questionId);
    return question.correctAnswer === answerId;
  };

  const getAnswerClass = (questionId, answerId) => {
    if (!showExplanation) {
      return selectedAnswers[questionId] === answerId ? 'selected' : '';
    } else {
      if (isCorrectAnswer(questionId, answerId)) {
        return 'bg-green-600 text-white';
      } else if (selectedAnswers[questionId] === answerId) {
        return 'bg-red-600 text-white';
      } else {
        return 'opacity-60';
      }
    }
  };

  if (showResults) {
    return (
      <div className="quiz-results card p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <div className="score text-6xl font-bold my-6">
          {score} / {questions.length}
        </div>
        <p className="mb-4">
          {score === questions.length 
            ? "Perfect score! You're a satellite expert!" 
            : `You got ${score} out of ${questions.length} questions correct.`}
        </p>
        
        <div className="mt-6">
          <button 
            className="btn-primary"
            onClick={() => {
              // Reset quiz state if they want to try again
              setCurrentQuestionIndex(0);
              setSelectedAnswers({});
              setShowResults(false);
              setScore(0);
              setShowExplanation(false);
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container card p-6">
      <div className="quiz-header flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Question {currentQuestionIndex + 1} of {questions.length}</h3>
        <div className="score-display">
          Score: {score}
        </div>
      </div>
      
      <div className="question-card mb-6">
        <h4 className="text-lg mb-4">{currentQuestion.question}</h4>
        
        <div className="options-list space-y-3">
          {currentQuestion.options.map(option => (
            <div 
              key={option.id}
              className={`quiz-option ${getAnswerClass(currentQuestion.id, option.id)}`}
              onClick={() => !showExplanation && handleAnswerSelect(currentQuestion.id, option.id)}
            >
              <span className="option-label font-bold mr-2">{option.id.toUpperCase()}.</span>
              {option.text}
            </div>
          ))}
        </div>
        
        {showExplanation && (
          <div className="explanation mt-4 p-4 bg-slate-700 rounded-lg">
            <h5 className="font-semibold mb-2">Explanation:</h5>
            <p>{currentQuestion.explanation}</p>
          </div>
        )}
      </div>
      
      <div className="quiz-footer flex justify-between">
        <button 
          className="btn-primary"
          disabled={!isAnswerSelected(currentQuestion.id)}
          onClick={handleNextQuestion}
        >
          {showExplanation 
            ? currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results" 
            : "Check Answer"}
        </button>
        
        <div className="progress-indicator">
          {Array.from({ length: questions.length }).map((_, idx) => (
            <span 
              key={idx} 
              className={`inline-block w-3 h-3 rounded-full mx-1 ${
                idx < currentQuestionIndex 
                  ? "bg-space-accent" 
                  : idx === currentQuestionIndex 
                    ? "bg-white" 
                    : "bg-slate-600"
              }`}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quiz; 