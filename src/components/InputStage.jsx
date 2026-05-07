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
          <h2 className="title">Code Mastery Mini-Game</h2>
          <p style={{ color: 'var(--border-color)', marginTop: '0.5rem' }}>Paste your code below to generate interactive learning exercises.</p>
        </div>
        <Code2 size={32} color="var(--primary-color)" />
      </div>

      <textarea
        className="input-area"
        placeholder="Paste your code here... (e.g. JavaScript, Python, React components)"
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
          Generate Exercise
        </button>
      </div>
    </div>
  );
}
