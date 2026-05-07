import React, { useState, useEffect, useMemo } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickSound, playErrorSound, playSuccessSound } from '../utils/soundFX';

export default function BlankMode({ exercise, onComplete }) {
  const [blanks, setBlanks] = useState([]);
  const [userInputs, setUserInputs] = useState({});
  const [isCorrect, setIsCorrect] = useState(false);

  // Khởi tạo các ô trống dựa trên code gốc
  const parsedCode = useMemo(() => {
    // Regex tìm các từ khóa, biến, tên hàm...
    const wordRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g;
    let match;
    const words = [];
    while ((match = wordRegex.exec(exercise.code)) !== null) {
      words.push({ word: match[1], index: match.index });
    }

    // Chọn ngẫu nhiên 3 đến 5 từ để đục lỗ
    const numBlanks = Math.min(Math.floor(Math.random() * 3) + 3, words.length);
    const selectedWords = words.sort(() => 0.5 - Math.random()).slice(0, numBlanks);
    
    // Sort lại theo index để cắt chuỗi đúng
    selectedWords.sort((a, b) => a.index - b.index);
    setBlanks(selectedWords);
    
    const initialInputs = {};
    selectedWords.forEach((w, i) => { initialInputs[i] = ''; });
    setUserInputs(initialInputs);

    // Chặt chuỗi thành các phần (text tĩnh và ô trống)
    let parts = [];
    let lastIdx = 0;
    selectedWords.forEach((w, i) => {
      parts.push({ type: 'text', content: exercise.code.substring(lastIdx, w.index) });
      parts.push({ type: 'blank', id: i, answer: w.word });
      lastIdx = w.index + w.word.length;
    });
    parts.push({ type: 'text', content: exercise.code.substring(lastIdx) });

    return parts;
  }, [exercise.code]);

  useEffect(() => {
    // Kiểm tra xem tất cả ô trống đã điền đúng chưa
    if (blanks.length === 0) return;
    
    let allRight = true;
    for (let i = 0; i < blanks.length; i++) {
      if (userInputs[i] !== blanks[i].word) {
        allRight = false;
        break;
      }
    }

    if (allRight && !isCorrect) {
      setIsCorrect(true);
      playSuccessSound();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      window.dispatchEvent(new CustomEvent('companion_message', { detail: 'Tuyệt đỉnh! Trí nhớ của bạn như siêu máy tính vậy!' }));
    } else if (!allRight && isCorrect) {
      setIsCorrect(false);
    }
  }, [userInputs, blanks, isCorrect]);

  const handleChange = (id, val) => {
    const expected = blanks[id].word;
    
    // Play sound based on correctness of current typing
    if (expected.startsWith(val)) {
      playClickSound();
    } else {
      playErrorSound();
      window.dispatchEvent(new CustomEvent('companion_message', { detail: 'Ê điền sai rồi! Nhìn kỹ lại logic xem nào.' }));
    }

    setUserInputs(prev => ({ ...prev, [id]: val }));
  };

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <div className="mode-badge" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', margin: 0 }}>
          Điền Chỗ Trống (Memory)
        </div>
        {exercise.filePath && (
          <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
            📄 {exercise.filePath}
          </div>
        )}
      </div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{exercise.title}</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Đọc đoạn code dưới đây và điền vào chỗ trống những từ khóa bị thiếu.</p>

      <div className="code-display" style={{ marginBottom: '1.5rem', backgroundColor: '#1e1e1e', fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap', lineHeight: '2' }}>
        {parsedCode.map((part, idx) => {
          if (part.type === 'text') {
            return <span key={idx} style={{ color: '#d4d4d4' }}>{part.content}</span>;
          } else {
            const isFilledCorrectly = userInputs[part.id] === part.answer;
            const isTypingWrong = !part.answer.startsWith(userInputs[part.id]);
            
            return (
              <input
                key={idx}
                type="text"
                value={userInputs[part.id] || ''}
                onChange={(e) => handleChange(part.id, e.target.value)}
                disabled={isCorrect}
                style={{
                  width: `${Math.max(part.answer.length, 3)}ch`,
                  backgroundColor: isFilledCorrectly ? 'rgba(0, 255, 65, 0.2)' : (isTypingWrong && userInputs[part.id].length > 0 ? 'rgba(248, 81, 73, 0.4)' : '#0d1117'),
                  border: `1px solid ${isFilledCorrectly ? 'var(--success-color)' : (isTypingWrong && userInputs[part.id].length > 0 ? 'var(--error-color)' : 'var(--border-color)')}`,
                  color: isFilledCorrectly ? 'var(--success-color)' : 'white',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.9rem',
                  outline: 'none',
                  textAlign: 'center',
                  margin: '0 4px',
                  transition: 'all 0.2s'
                }}
              />
            );
          }
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isCorrect ? 'var(--success-color)' : 'var(--text-color)' }}>
          {isCorrect && <CheckCircle2 size={20} />}
          <span>
            {isCorrect 
              ? 'Tuyệt vời! Bạn nhớ code rất chuẩn xác.' 
              : `Điền vào ${blanks.length} chỗ trống để qua màn`}
          </span>
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
