import React, { useState, useEffect, useRef, useMemo } from 'react';
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

  return (
    <div className="fade-in">
      <div className="mode-badge">Luyện gõ Code</div>
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
            let opacity = 0.5; // Chưa gõ

            if (index < userInput.length) {
              opacity = 1;
              if (userInput[index] === char) {
                // Nếu gõ đúng, sáng lên với màu syntax của VS Code
                displayColor = syntaxColor; 
              } else {
                displayColor = 'white';
                backgroundColor = '#f85149'; // Sai
              }
            } else if (index > userInput.length) {
              // Làm tối màu syntax đi nếu chưa gõ tới để tập trung vào chỗ con trỏ
              displayColor = syntaxColor;
              opacity = 0.4;
            }

            // Highlight con trỏ hiện tại
            if (index === userInput.length && !isCorrect) {
              backgroundColor = 'rgba(255, 255, 255, 0.2)';
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
