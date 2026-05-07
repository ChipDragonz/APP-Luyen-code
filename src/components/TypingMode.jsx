import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function TypingMode({ exercise, onComplete }) {
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const textareaRef = useRef(null);

  // Focus textarea when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [exercise]);

  // Reset input when exercise changes
  useEffect(() => {
    setUserInput('');
    setIsCorrect(false);
  }, [exercise]);

  useEffect(() => {
    if (userInput === exercise.code) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  }, [userInput, exercise.code]);

  const handleChange = (e) => {
    setUserInput(e.target.value);
  };

  // Hàm hỗ trợ ngăn chặn phím Tab làm mất focus và thay thế bằng khoảng trắng
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      // Chèn 4 khoảng trắng
      const newValue = userInput.substring(0, start) + '    ' + userInput.substring(end);
      setUserInput(newValue);
      // Đặt lại con trỏ
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  return (
    <div className="fade-in">
      <div className="mode-badge">Luyện gõ Code</div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{exercise.title}</h3>
      <p style={{ color: 'var(--border-color)', marginBottom: '1.5rem' }}>{exercise.instruction}</p>

      {/* Hiển thị code gốc với màu sắc thể hiện đúng/sai */}
      <div className="code-display" style={{ marginBottom: '1rem', position: 'relative' }}>
        <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {exercise.code.split('').map((char, index) => {
            let color = 'var(--text-color)';
            let backgroundColor = 'transparent';
            let opacity = 0.5; // Chưa gõ

            if (index < userInput.length) {
              opacity = 1;
              if (userInput[index] === char) {
                color = 'var(--success-color)'; // Đúng
              } else {
                color = 'white';
                backgroundColor = 'var(--error-color)'; // Sai
              }
            }

            // Highlight con trỏ hiện tại
            if (index === userInput.length && !isCorrect) {
              backgroundColor = 'rgba(59, 130, 246, 0.3)';
            }

            return (
              <span key={index} style={{ color, backgroundColor, opacity, transition: 'all 0.1s' }}>
                {char === '\n' ? (
                  // Ký tự xuống dòng cũng cần hiển thị màu nền nếu gõ sai hoặc đang ở vị trí con trỏ
                  <span style={{ display: 'inline-block', width: '10px', height: '1em', verticalAlign: 'bottom' }}>
                    {'\n'}
                  </span>
                ) : char}
              </span>
            );
          })}
        </pre>
      </div>

      {/* Vùng nhập liệu */}
      <textarea
        ref={textareaRef}
        className="input-area"
        style={{ minHeight: '150px', marginBottom: '0', borderColor: isCorrect ? 'var(--success-color)' : 'var(--border-color)' }}
        value={userInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Bắt đầu gõ code tại đây..."
        spellCheck="false"
        disabled={isCorrect}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isCorrect ? 'var(--success-color)' : 'var(--text-color)' }}>
          {isCorrect && <CheckCircle2 size={20} />}
          <span>
            {isCorrect 
              ? 'Hoàn hảo! Bạn gõ chính xác 100%.' 
              : `Đã gõ: ${userInput.length} / ${exercise.code.length} ký tự`}
          </span>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={onComplete}
          disabled={!isCorrect}
        >
          Hàm Tiếp Theo
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
