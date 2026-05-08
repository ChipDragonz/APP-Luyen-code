import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';

export default function QuizMode({ exercise, onComplete }) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const handleSelect = (option) => {
    if (isCorrect) return; // Nếu đã đúng thì không cho chọn lại
    setSelectedOption(option);
    if (option === exercise.answer) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div className="mode-badge" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', margin: 0 }}>
          Hỏi & Đáp (Quiz)
        </div>
        {exercise.filePath && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
            📄 {exercise.filePath}
          </div>
        )}
      </div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{exercise.title}</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{exercise.instruction}</p>

      {/* Hiển thị code gốc mờ mờ làm ngữ cảnh */}
      <div className="code-display" style={{ marginBottom: '1.5rem', opacity: 0.7, maxHeight: '150px', overflowY: 'auto' }}>
        <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap', fontSize: '0.85rem' }}>
          {exercise.code}
        </pre>
      </div>

      <div style={{ backgroundColor: 'var(--card-bg)', padding: '1.5rem', borderRadius: '0.5rem', border: '1px solid var(--primary-color)' }}>
        <div style={{ 
          fontSize: '1.1rem', 
          marginBottom: '1rem', 
          color: 'var(--text-color)',
          whiteSpace: 'pre-wrap', 
          fontFamily: exercise.quizType === 'missing_code' ? 'var(--font-mono)' : 'inherit',
          backgroundColor: exercise.quizType === 'missing_code' ? 'rgba(0,0,0,0.3)' : 'transparent',
          padding: exercise.quizType === 'missing_code' ? '1rem' : '0',
          borderRadius: '0.25rem'
        }}>
          {exercise.question}
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {exercise.options.map((option, idx) => {
            let btnStyle = { textAlign: 'left', justifyContent: 'flex-start', padding: '1rem', height: 'auto', whiteSpace: 'normal', lineHeight: '1.4' };
            let btnClass = 'btn btn-outline';
            
            if (selectedOption === option) {
              if (option === exercise.answer) {
                btnStyle.backgroundColor = 'var(--success-color)';
                btnStyle.color = 'black';
                btnStyle.borderColor = 'var(--success-color)';
              } else {
                btnStyle.backgroundColor = 'var(--error-color)';
                btnStyle.color = 'white';
                btnStyle.borderColor = 'var(--error-color)';
              }
            } else if (isCorrect && option === exercise.answer) {
              // Highlight câu đúng nếu người dùng đã chọn đúng
              btnStyle.borderColor = 'var(--success-color)';
              btnStyle.boxShadow = '0 0 5px var(--success-color)';
            }

            return (
              <button 
                key={idx} 
                className={btnClass} 
                style={btnStyle}
                onClick={() => handleSelect(option)}
                disabled={isCorrect}
              >
                <span style={{ fontWeight: 'bold', marginRight: '0.5rem' }}>{String.fromCharCode(65 + idx)}.</span>
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isCorrect ? 'var(--success-color)' : (isCorrect === false ? 'var(--error-color)' : 'var(--text-color)') }}>
          {isCorrect === true && <><CheckCircle2 size={20} /><span>Chính xác! Bạn thật xuất sắc.</span></>}
          {isCorrect === false && <><XCircle size={20} /><span>Sai rồi, hãy chọn lại nhé!</span></>}
          {isCorrect === null && <span>Hãy chọn một đáp án.</span>}
        </div>
        <button 
          className="btn btn-primary" 
          onClick={onComplete}
          disabled={!isCorrect}
        >
          Tiếp Tục
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
