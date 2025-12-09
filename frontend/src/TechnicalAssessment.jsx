import './app.css';
import { useState, useEffect } from 'react';
import { getQuestionsForAssessment } from './AssessmentData';

export default function TechnicalAssessment({ onComplete, userSelections, onClose }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const fetched = getQuestionsForAssessment(userSelections, 10);
    setQuestions(fetched);
  }, [userSelections]);

  useEffect(() => {
    if (timeLeft > 0 && !showResults) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResults) {
      handleFinish();
    }
  }, [timeLeft, showResults]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (index) => {
    setSelectedOption(index);
    const correct = questions[currentQuestion]?.correct;
    if (index === correct) setScore((p) => p + 1);
    else setIncorrect((p) => p + 1);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion((p) => p + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else handleFinish();
  };

  const handleFinish = () => {
    setShowResults(true);
    onComplete && onComplete(score, questions.length);
  };

  const handleQuitEarly = () => {
    if (window.confirm('End quiz early?')) handleFinish();
  };

  if (!questions.length)
    return (
      <div className="wrap" style={{ textAlign: 'center', padding: '60px' }}>
        <h2>Loading personalized assessment...</h2>
        <p>Generating questions based on your roadmap...</p>
      </div>
    );

  const q = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    const percent = (score / questions.length) * 100;
    return (
      <div className="wrap" style={{ textAlign: 'center', padding: '60px 20px' }}>
        <h1>🎯 Assessment Complete!</h1>
        <h2 style={{ marginTop: '10px' }}>
          Score: {score}/{questions.length}
        </h2>
        <p
          style={{
            fontSize: '1.4rem',
            color: percent >= 60 ? 'var(--ok)' : 'var(--warn)',
            fontWeight: 600,
          }}
        >
          {percent.toFixed(1)}%
        </p>
        <p style={{ fontSize: '1.05rem' }}>
          {percent >= 80
            ? 'Excellent! You’re strong in these topics.'
            : percent >= 60
            ? 'Good job! You have a solid foundation.'
            : 'Keep learning — you’re improving!'}
        </p>
        <div style={{ marginTop: '25px' }}>
          <button className="btn primary" onClick={onClose}>
            ← Back to Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap" style={{ textAlign: 'center', padding: '40px 20px' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px',
          padding: '0 20px',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', textAlign: 'left' }}>Quick Assessment</h1>
        <div
          style={{
            background: 'var(--card)',
            padding: '8px 14px',
            borderRadius: '10px',
            border: '1px solid var(--brand)',
            fontSize: '1rem',
          }}
        >
          ⏰ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Progress Bar */}
      <div
        style={{
          height: '8px',
          background: 'var(--bg)',
          borderRadius: '4px',
          marginBottom: '25px',
          overflow: 'hidden',
          width: '90%',
          marginInline: 'auto',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, var(--brand), var(--ok))',
            transition: 'width 0.3s ease',
          }}
        />
      </div>

     {/* Question capsule */}
<div
  style={{
    display: 'flex',
    justifyContent: 'center',
    margin: '35px 0 25px 0',
  }}
>
  <div
    style={{
      border: '1.8px solid rgba(255,255,255,0.6)',
      borderRadius: '40px',
      padding: '14px 35px',
      fontSize: '1.25rem',
      fontWeight: 600,
      color: 'var(--text)',
      textAlign: 'center',
      background: 'rgba(255,255,255,0.03)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 0 10px rgba(255,255,255,0.1)',
      whiteSpace: 'nowrap',
      maxWidth: '85%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    }}
  >
    {q.question}
  </div>
</div>

{/* Options with glowing borders */}
<div
  style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '18px',
    marginBottom: '35px',
  }}
>
  {q.options.map((opt, i) => {
    const isCorrect = selectedOption === i && i === q.correct;
    const isWrong = selectedOption === i && i !== q.correct;

    return (
      <button
        key={i}
        onClick={() => selectedOption === null && handleAnswer(i)}
        disabled={selectedOption !== null}
        style={{
          width: '70%',
          borderRadius: '40px',
          padding: '14px 25px',
          fontSize: '1.05rem',
          fontWeight: 500,
          border: `1.8px solid ${
            isCorrect
              ? 'var(--ok)'
              : isWrong
              ? 'var(--danger)'
              : 'rgba(255,255,255,0.6)'
          }`,
          color: isCorrect || isWrong ? '#fff' : 'var(--text)',
          background: isCorrect
            ? 'var(--ok)'
            : isWrong
            ? 'var(--danger)'
            : 'rgba(255,255,255,0.03)',
          textAlign: 'center',
          cursor: selectedOption === null ? 'pointer' : 'default',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          transition: 'all 0.25s ease',
          boxShadow:
            isCorrect || isWrong
              ? isCorrect
                ? '0 0 14px rgba(0,255,120,0.4)'
                : '0 0 14px rgba(255,80,80,0.4)'
              : '0 0 10px rgba(255,255,255,0.1)',
        }}
        onMouseEnter={(e) => {
          if (selectedOption === null)
            e.currentTarget.style.boxShadow =
              '0 0 20px rgba(255,255,255,0.35)';
        }}
        onMouseLeave={(e) => {
          if (selectedOption === null)
            e.currentTarget.style.boxShadow =
              '0 0 10px rgba(255,255,255,0.1)';
        }}
      >
        {String.fromCharCode(65 + i)}. {opt}
      </button>
    );
  })}
</div>



      {/* Explanation */}
      {showExplanation && (
        <div
          style={{
            background: 'var(--bg)',
            border: '1px solid var(--brand)',
            borderRadius: '10px',
            padding: '14px',
            margin: '15px auto',
            maxWidth: '80%',
            fontSize: '1rem',
            color: 'var(--muted)',
          }}
        >
          <strong>
            {selectedOption === q.correct ? '✅ Correct!' : '❌ Incorrect'}
          </strong>
          <p style={{ marginTop: '6px' }}>{q.explanation}</p>
        </div>
      )}

      {/* Stats */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '25px',
          marginTop: '25px',
          fontSize: '1.05rem',
          fontWeight: 500,
        }}
      >
        <span style={{ color: 'var(--ok)' }}>✅ {score} Correct</span>
        <span style={{ color: 'var(--danger)' }}>❌ {incorrect} Wrong</span>
        <span style={{ color: 'var(--muted)' }}>
          🧮 {score + incorrect}/{questions.length}
        </span>
      </div>

      {/* Buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          marginTop: '30px',
          flexWrap: 'wrap',
        }}
      >
        <button className="btn ghost" onClick={onClose}>
          ← Back
        </button>
        <button className="btn warn" onClick={handleQuitEarly}>
          End Quiz
        </button>
        <button
          className="btn primary"
          onClick={handleNext}
          disabled={selectedOption === null}
        >
          {currentQuestion + 1 === questions.length ? 'Finish' : 'Next →'}
        </button>
      </div>
    </div>
  );
}
