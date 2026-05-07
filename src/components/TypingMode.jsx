import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function TypingMode({ exercise, onComplete }) {
  const [inputs, setInputs] = useState({});
  const [isAllCorrect, setIsAllCorrect] = useState(false);

  useEffect(() => {
    // Check if all inputs match their answers exactly
    let correct = true;
    for (let i = 0; i < exercise.snippet.length; i++) {
      const part = exercise.snippet[i];
      if (part.type === 'input') {
        if (inputs[i] !== part.answer) {
          correct = false;
          break;
        }
      }
    }
    setIsAllCorrect(correct);
  }, [inputs, exercise]);

  const handleInputChange = (index, value) => {
    setInputs({ ...inputs, [index]: value });
  };

  const getStatusClass = (index, answer) => {
    if (!inputs[index]) return '';
    return inputs[index] === answer ? 'correct' : 'incorrect';
  };

  return (
    <div className="fade-in">
      <div className="mode-badge">Mode 1: Recall & Type</div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{exercise.title}</h3>
      <p style={{ color: 'var(--border-color)', marginBottom: '1.5rem' }}>{exercise.instruction}</p>

      <div className="code-display">
        {exercise.snippet.map((part, index) => {
          if (part.type === 'text') {
            return <span key={index}>{part.content}</span>;
          }
          if (part.type === 'input') {
            return (
              <input
                key={index}
                type="text"
                className={`code-input ${getStatusClass(index, part.answer)}`}
                placeholder={part.placeholder}
                value={inputs[index] || ''}
                onChange={(e) => handleInputChange(index, e.target.value)}
                style={{ width: `${Math.max(part.answer.length * 10, 60)}px` }}
              />
            );
          }
          return null;
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isAllCorrect ? 'var(--success-color)' : 'var(--text-color)' }}>
          {isAllCorrect && <CheckCircle2 size={20} />}
          <span>{isAllCorrect ? 'Perfect! You can proceed.' : 'Fill all blanks correctly to proceed.'}</span>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={onComplete}
          disabled={!isAllCorrect}
        >
          Next Challenge
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
