import React, { useState, useEffect, useRef, useMemo } from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickSound, playErrorSound, playSuccessSound } from '../utils/soundFX';

export default function TypingMode({ exercise, onComplete }) {
  const [userInput, setUserInput] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [mistakes, setMistakes] = useState(0);
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
    setStartTime(null);
    setEndTime(null);
    setMistakes(0);
  }, [exercise]);

  useEffect(() => {
    if (userInput === exercise.code && exercise.code.length > 0) {
      setIsCorrect(true);
      setEndTime(Date.now());
      playSuccessSound();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00ff41', '#00cc33', '#ffffff']
      });

      // Calculate stats to trigger Companion
      const timeSec = (Date.now() - startTime) / 1000 || 1;
      const wpm = Math.round((exercise.code.length / 5) / (timeSec / 60));
      const acc = Math.max(0, Math.round(((exercise.code.length - mistakes) / exercise.code.length) * 100));
      
      let rank = 'C';
      if (wpm > 80 && acc > 95) rank = 'S';
      else if (wpm > 50 && acc > 90) rank = 'A';
      else if (wpm > 30 && acc > 80) rank = 'B';

      if (rank === 'S') window.dispatchEvent(new CustomEvent('companion_message', { detail: 'Tuyệt vời! Rank S luôn, múa phím như hacker phim điện ảnh!' }));
      else if (rank === 'A') window.dispatchEvent(new CustomEvent('companion_message', { detail: 'Khá lắm! Cố xíu nữa là lên Rank S rồi.' }));
      else window.dispatchEvent(new CustomEvent('companion_message', { detail: `Bạn đạt Rank ${rank}. Hãy gõ nhanh và chuẩn hơn nữa nhé!` }));
      
    } else {
      setIsCorrect(false);
    }
  }, [userInput, exercise.code]);

  const handleChange = (e) => {
    const newVal = e.target.value;
    if (!startTime) setStartTime(Date.now());
    
    // Play sound based on input correctness
    if (newVal.length > userInput.length) {
      const lastCharIdx = newVal.length - 1;
      if (newVal[lastCharIdx] === exercise.code[lastCharIdx]) {
        playClickSound();
      } else {
        playErrorSound();
        setMistakes(m => m + 1);
        if (Math.random() > 0.7) {
          window.dispatchEvent(new CustomEvent('companion_message', { detail: 'Ái chà, gõ nhầm rồi kìa sếp!' }));
        }
      }
    } else if (newVal.length < userInput.length) {
      playClickSound(); // Backspace sound
    }

    setUserInput(newVal);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = userInput.substring(0, start) + '    ' + userInput.substring(end);
      setUserInput(newValue);
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  // Trình phân tích cú pháp siêu nhẹ (Lexer) để tô màu như VS Code
  const coloredCode = useMemo(() => {
    const chars = [];
    const code = exercise.code;
    let i = 0;
    
    const isKeyword = (w) => /^(module|struct|fun|public|entry|mut|const|use|let|return|if|else|while|for|match|break|continue|as|has|key|store|drop|copy|true|false|import|export|default|class|function)$/.test(w);

    while (i < code.length) {
      if (code[i] === '"' || code[i] === "'") {
        const quote = code[i];
        chars.push({ char: code[i], syntaxColor: '#ce9178' });
        i++;
        while (i < code.length && code[i] !== quote) {
          chars.push({ char: code[i], syntaxColor: '#ce9178' });
          i++;
        }
        if (i < code.length) {
          chars.push({ char: code[i], syntaxColor: '#ce9178' });
          i++;
        }
        continue;
      }
      
      if (/\d/.test(code[i])) {
        chars.push({ char: code[i], syntaxColor: '#b5cea8' });
        i++;
        while (i < code.length && /\d/.test(code[i])) {
          chars.push({ char: code[i], syntaxColor: '#b5cea8' });
          i++;
        }
        continue;
      }

      if (/[a-zA-Z_]/.test(code[i])) {
        let word = '';
        while (i < code.length && /[a-zA-Z0-9_]/.test(code[i])) {
          word += code[i];
          i++;
        }
        
        let syntaxColor = '#9cdcfe'; // Variable / Default text
        if (isKeyword(word)) syntaxColor = '#569cd6'; // Blue for keywords
        else if (i < code.length && code[i] === '(') syntaxColor = '#dcdcaa'; // Yellow for functions
        else if (/^[A-Z]/.test(word) || ['Self', 'UID', 'String', 'TxContext'].includes(word)) syntaxColor = '#4ec9b0'; // Teal for Types/Structs

        for (let j = 0; j < word.length; j++) {
          chars.push({ char: word[j], syntaxColor });
        }
        continue;
      }

      if (/[{}\[\]()<>.,;:!+\-*\/=%&|]/.test(code[i])) {
        chars.push({ char: code[i], syntaxColor: '#d4d4d4' });
        i++;
        continue;
      }

      chars.push({ char: code[i], syntaxColor: '#d4d4d4' });
      i++;
    }
    return chars;
  }, [exercise.code]);

  const stats = useMemo(() => {
    if (!startTime || !endTime) return null;
    const timeSec = (endTime - startTime) / 1000 || 1;
    const wpm = Math.round((exercise.code.length / 5) / (timeSec / 60));
    const acc = Math.max(0, Math.round(((exercise.code.length - mistakes) / exercise.code.length) * 100));
    let rank = 'C';
    let rankColor = '#8b949e';
    if (wpm > 80 && acc > 95) { rank = 'S'; rankColor = '#eab308'; } // Vàng
    else if (wpm > 50 && acc > 90) { rank = 'A'; rankColor = '#a855f7'; } // Tím
    else if (wpm > 30 && acc > 80) { rank = 'B'; rankColor = '#3b82f6'; } // Xanh dương

    return { wpm, acc, rank, rankColor };
  }, [startTime, endTime, mistakes, exercise.code.length]);

  return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="mode-badge" style={{ margin: 0 }}>Luyện gõ Code</div>
          {exercise.filePath && (
            <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.8rem', fontFamily: 'var(--font-mono)' }}>
              📄 {exercise.filePath}
            </div>
          )}
        </div>
        
        {/* Live WPM Indicator (thô) */}
        {startTime && !isCorrect && (
           <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Lỗi: <span style={{ color: mistakes > 0 ? 'var(--error-color)' : 'var(--text-muted)' }}>{mistakes}</span>
           </div>
        )}
      </div>
      <h3 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{exercise.title}</h3>
      <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{exercise.instruction}</p>

      <div style={{ backgroundColor: 'rgba(0, 255, 65, 0.05)', borderLeft: '4px solid var(--primary-color)', padding: '1rem', marginBottom: '1.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-color)' }}>
        <strong style={{ color: 'var(--primary-color)' }}>[GIẢI THÍCH]:</strong> {exercise.description}
      </div>

      <div className="code-display" style={{ marginBottom: '1rem', position: 'relative', backgroundColor: '#1e1e1e' }}>
        <pre style={{ margin: 0, fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
          {coloredCode.map((item, index) => {
            const { char, syntaxColor } = item;
            let displayColor = syntaxColor;
            let backgroundColor = 'transparent';
            let opacity = 1; 

            if (index < userInput.length) {
              if (userInput[index] === char) {
                displayColor = syntaxColor; 
                opacity = 0.6;
              } else {
                displayColor = 'white';
                backgroundColor = '#f85149'; 
                opacity = 1;
              }
            } else if (index > userInput.length) {
              displayColor = syntaxColor;
              opacity = 1;
            }

            if (index === userInput.length && !isCorrect) {
              backgroundColor = 'rgba(255, 255, 255, 0.3)';
              opacity = 1;
            }

            return (
              <span key={index} style={{ color: displayColor, backgroundColor, opacity, transition: 'all 0.1s' }}>
                {char === '\n' ? '↵\n' : char}
              </span>
            );
          })}
        </pre>
      </div>

      <textarea
        ref={textareaRef}
        className="input-area"
        style={{ minHeight: '150px', marginBottom: '0', borderColor: isCorrect ? 'var(--success-color)' : 'var(--border-color)', backgroundColor: '#1e1e1e' }}
        value={userInput}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Bắt đầu gõ code tại đây..."
        spellCheck="false"
        disabled={isCorrect}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: isCorrect ? 'var(--success-color)' : 'var(--text-color)' }}>
          {isCorrect ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', animation: 'scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>
               <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                 <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>RANK</span>
                 <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: stats.rankColor, textShadow: `0 0 10px ${stats.rankColor}88` }}>{stats.rank}</span>
               </div>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                 <span style={{ fontSize: '0.9rem' }}>Tốc độ: <strong>{stats.wpm} WPM</strong></span>
                 <span style={{ fontSize: '0.9rem' }}>Độ chính xác: <strong>{stats.acc}%</strong></span>
               </div>
            </div>
          ) : (
            <span>Đã gõ: {userInput.length} / {exercise.code.length} ký tự</span>
          )}
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
