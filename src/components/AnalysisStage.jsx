import React, { useState, useEffect } from 'react';
import { Cpu } from 'lucide-react';

export default function AnalysisStage() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', textAlign: 'center' }}>
      <div className="loader"></div>
      <Cpu size={48} color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
      <h2 style={{ marginBottom: '0.5rem' }}>Analyzing AI Syntactics</h2>
      <p style={{ color: 'var(--border-color)' }}>Generating personalized exercises based on your code{dots}</p>
    </div>
  );
}
