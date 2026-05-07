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
      <h2 style={{ marginBottom: '0.5rem' }}>Trí tuệ nhân tạo đang phân tích</h2>
      <p style={{ color: 'var(--text-muted)' }}>Đang tạo các bài tập cá nhân hóa dựa trên code của bạn{dots}</p>
    </div>
  );
}
