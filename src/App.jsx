import React, { useState, useEffect } from 'react';
import { Moon, Sun, Trophy, RefreshCw } from 'lucide-react';
import InputStage from './components/InputStage';
import AnalysisStage from './components/AnalysisStage';
import TypingMode from './components/TypingMode';
import SortMode from './components/SortMode';
import { analyzeCode } from './mock/analyzer';

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [stage, setStage] = useState('input'); // input, analysis, gameplay, success
  const [levels, setLevels] = useState([]);
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);

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
    setStage('gameplay');
  };

  const handleLevelComplete = () => {
    if (currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
    } else {
      setStage('success');
    }
  };

  const handleReset = () => {
    setStage('input');
    setLevels([]);
    setCurrentLevelIndex(0);
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className="app-container">
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--primary-color)', padding: '0.5rem', borderRadius: '0.5rem' }}>
            <Trophy size={24} color="white" />
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>CodeQuest</h1>
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
          <div className="glass-card fade-in">
            <div className="level-indicator">
              {levels.map((_, index) => (
                <div 
                  key={index} 
                  className={`level-dot ${index === currentLevelIndex ? 'active' : ''} ${index < currentLevelIndex ? 'completed' : ''}`}
                />
              ))}
            </div>
            
            <div style={{ marginBottom: '1rem', color: 'var(--border-color)', fontSize: '0.875rem' }}>
              Màn {currentLevelIndex + 1} / {levels.length}
            </div>

            {levels[currentLevelIndex].type === 'typing' && (
              <TypingMode 
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
            <Trophy className="success-icon" />
            <h2 className="title" style={{ fontSize: '2rem' }}>Chinh Phục Thành Công!</h2>
            <p style={{ color: 'var(--border-color)', fontSize: '1.1rem', maxWidth: '400px' }}>
              Bạn đã hoàn thành xuất sắc tất cả các bài tập cho đoạn code này.
            </p>
            <button className="btn btn-primary" onClick={handleReset} style={{ marginTop: '1.5rem' }}>
              <RefreshCw size={18} />
              Thực hành với đoạn code khác
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
