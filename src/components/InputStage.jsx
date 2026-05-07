import React, { useState } from 'react';
import { Play, Code2 } from 'lucide-react';

export default function InputStage({ onSubmit }) {
  const [code, setCode] = useState('');

  const handleSubmit = () => {
    if (code.trim()) {
      onSubmit(code);
    }
  };

  return (
    <div className="glass-card fade-in">
      <div className="header">
        <div>
          <h2 className="title">Mini-Game Luyện Code</h2>
          <p style={{ color: 'var(--border-color)', marginTop: '0.5rem' }}>Dán đoạn code của bạn vào đây để tạo các bài tập tương tác.</p>
        </div>
        <Code2 size={32} color="var(--primary-color)" />
      </div>

      <textarea
        className="input-area"
        placeholder="Dán code của bạn vào đây... (ví dụ: Move, JavaScript, Python, C++)"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck="false"
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          className="btn btn-primary" 
          onClick={handleSubmit}
          disabled={!code.trim()}
        >
          <Play size={18} />
          Tạo Bài Tập
        </button>
      </div>
    </div>
  );
}
