import React, { useState, useEffect } from 'react';
import { Moon, Sun, Trophy, RefreshCw, Terminal, CheckCircle2, Menu, X } from 'lucide-react';
import InputStage from './components/InputStage';
import AnalysisStage from './components/AnalysisStage';
import TypingMode from './components/TypingMode';
import SortMode from './components/SortMode';
import QuizMode from './components/QuizMode';
import Companion from './components/Companion';
import BalloonGame from './components/BalloonGame';
import { analyzeCode } from './mock/analyzer';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [stage, setStage] = useState('input'); // input, analysis, gameplay, success
  const [levels, setLevels] = useState([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [completedLevels, setCompletedLevels] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const handleCodeSubmit = async (code) => {
    setStage('analysis');
    const generatedLevels = await analyzeCode(code);
    setLevels(generatedLevels);
    setCurrentLevelIndex(0);
    setCompletedLevels({});
    setStage('gameplay');
  };

  const handleLevelComplete = () => {
    setCompletedLevels({ ...completedLevels, [currentLevelIndex]: true });
    
    // Auto-advance if not the last one
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
    } else {
      // Check if all are completed
      const allDone = levels.every((_, idx) => completedLevels[idx] || idx === currentLevelIndex);
      if (allDone) {
        setStage('success');
      }
    }
  };

  const handleReset = () => {
    setStage('input');
    setLevels([]);
    setCurrentLevelIndex(0);
    setCompletedLevels({});
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const getModeIcon = (type) => {
    if (type === 'typing') return <Terminal size={16} />;
    if (type === 'quiz') return <CheckCircle2 size={16} />;
    return <RefreshCw size={16} />;
  };

  return (
    <div className="app-container" style={{ maxWidth: stage === 'gameplay' ? '1200px' : '1000px', display: 'flex', flexDirection: 'row', gap: '2rem' }}>
      <Companion />
      <BalloonGame />
      
      {/* Menu Sidebar (Chỉ hiện trong Gameplay) */}
      {stage === 'gameplay' && (
        <aside className="glass-card" style={{ width: '300px', flexShrink: 0, padding: '1.5rem', height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
            <Terminal size={24} />
            <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-mono)' }}>MENU BÀI TẬP</h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {levels.map((level, idx) => (
              <button
                key={level.id}
                onClick={() => setCurrentLevelIndex(idx)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  backgroundColor: currentLevelIndex === idx ? 'rgba(0, 255, 65, 0.1)' : 'transparent',
                  border: `1px solid ${currentLevelIndex === idx ? 'var(--primary-color)' : 'var(--border-color)'}`,
                  color: currentLevelIndex === idx ? 'var(--primary-color)' : 'var(--text-color)',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.9rem'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                  {getModeIcon(level.type)}
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {level.title}
                  </span>
                </div>
                {completedLevels[idx] && <CheckCircle2 size={16} color="var(--success-color)" />}
              </button>
            ))}
          </div>
          <button className="btn btn-outline" onClick={handleReset} style={{ width: '100%', marginTop: '2rem', borderColor: 'var(--error-color)', color: 'var(--error-color)' }}>
            Thoát / Đổi Code
          </button>
        </aside>
      )}

      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'var(--primary-color)', padding: '0.5rem', borderRadius: '0.5rem' }}>
              <Terminal size={24} color="black" />
            </div>
            <h1 className="title" style={{ fontSize: '1.5rem', margin: 0 }}>Hacker_CodeQuest</h1>
          </div>
          <button 
            onClick={toggleDarkMode} 
            className="btn btn-outline"
            style={{ padding: '0.5rem' }}
            aria-label="Chuyển đổi giao diện Sáng/Tối"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        <main style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
          {stage === 'input' && <InputStage onSubmit={handleCodeSubmit} />}
          
          {stage === 'analysis' && <AnalysisStage />}
          
          {stage === 'gameplay' && levels.length > 0 && (
            <div className="glass-card fade-in" style={{ flexGrow: 1 }}>
              <div style={{ marginBottom: '1rem', color: 'var(--text-muted)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
                {`> ĐANG THỰC THI CHƯƠNG TRÌNH: [${currentLevelIndex + 1}/${levels.length}]`}
              </div>

              {levels[currentLevelIndex].type === 'typing' && (
                <TypingMode 
                  exercise={levels[currentLevelIndex]} 
                  onComplete={handleLevelComplete} 
                />
              )}

              {levels[currentLevelIndex].type === 'quiz' && (
                <QuizMode 
                  exercise={levels[currentLevelIndex]} 
                  onComplete={handleLevelComplete} 
                />
              )}
              
              {levels[currentLevelIndex].type === 'sort' && (
                <SortMode 
                  exercise={levels[currentLevelIndex]} 
                  onComplete={handleLevelComplete} 
                />
              )}
            </div>
          )}

          {stage === 'success' && (
            <div className="glass-card fade-in success-message">
              <Trophy className="success-icon" style={{ width: '80px', height: '80px' }} />
              <h2 className="title" style={{ fontSize: '2.5rem' }}>SYSTEM.HACKED = TRUE;</h2>
              <p style={{ color: 'var(--text-color)', fontSize: '1.2rem', maxWidth: '500px', fontFamily: 'var(--font-mono)' }}>
                Bạn đã hoàn thành xuất sắc toàn bộ khóa huấn luyện. Trình độ code của bạn đã tăng lên một bậc!
              </p>
              <button className="btn btn-primary" onClick={handleReset} style={{ marginTop: '2rem', fontSize: '1.1rem' }}>
                <Terminal size={20} />
                INITIATE NEW_TARGET
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Footer / Corner Info */}
      <div style={{
        position: 'fixed',
        bottom: '15px',
        right: '15px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '5px',
        fontSize: '0.8rem',
        fontFamily: 'var(--font-mono)',
        color: 'var(--text-muted)',
        zIndex: 9999,
        backgroundColor: 'rgba(5, 5, 5, 0.8)',
        padding: '10px 15px',
        border: '1px solid var(--primary-color)',
        borderRight: '4px solid var(--primary-color)',
        boxShadow: '0 0 10px rgba(252, 226, 5, 0.2)'
      }}>
        <a href="https://github.com/ChipDragonz/APP-Luyen-code" target="_blank" rel="noreferrer" style={{ color: 'var(--primary-hover)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          Mã nguồn Github
        </a>
        <div style={{ color: 'var(--error-color)', fontWeight: 'bold', textShadow: '0 0 5px rgba(255,0,60,0.5)' }}>
          ☕ Donate: VCB 1024327360
        </div>
      </div>
    </div>
  );
}

export default App;
