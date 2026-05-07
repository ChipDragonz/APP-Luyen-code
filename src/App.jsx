import React, { useState, useEffect } from 'react';
import { Moon, Sun, Trophy, RefreshCw, Terminal, CheckCircle2, ChevronRight, Menu, X } from 'lucide-react';
import InputStage from './components/InputStage';
import AnalysisStage from './components/AnalysisStage';
import TypingMode from './components/TypingMode';
import SortMode from './components/SortMode';
import QuizMode from './components/QuizMode';
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
              <div style={{ marginBottom: '1rem', color: 'var(--primary-color)', fontSize: '0.875rem', fontFamily: 'var(--font-mono)' }}>
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
    </div>
  );
}

export default App;
