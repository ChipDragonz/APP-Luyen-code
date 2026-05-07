import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { playPopSound } from '../utils/soundFX';

export default function BalloonGame() {
  const [balloonCap, setBalloonCap] = useState(30);
  const [balloonLetters, setBalloonLetters] = useState([]);
  const [popEffect, setPopEffect] = useState(false);
  const balloonRef = useRef(null);

  useEffect(() => {
    setBalloonCap(Math.floor(Math.random() * 30) + 30);
  }, []);

  useEffect(() => {
    const handleTypedChar = (e) => {
      const typedChar = e.detail;
      if (typedChar.trim() !== '') {
        setBalloonLetters(prev => {
          const next = [...prev, {
            id: Date.now() + Math.random(),
            char: typedChar,
            bottom: (15 + Math.random() * 60) + '%', 
            left: (15 + Math.random() * 60) + '%',
            rotate: Math.random() * 360
          }];
          
          if (next.length >= balloonCap) {
            setTimeout(() => {
              setPopEffect(true);
              playPopSound();
              if (balloonRef.current) {
                const rect = balloonRef.current.getBoundingClientRect();
                confetti({
                  particleCount: 70,
                  spread: 100,
                  origin: { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight }
                });
              }
              setTimeout(() => {
                setBalloonCap(Math.floor(Math.random() * 30) + 30);
                setBalloonLetters([]);
                setPopEffect(false);
              }, 300);
            }, 50);
          }
          return next;
        });
      }
    };

    window.addEventListener('typed_char', handleTypedChar);
    return () => window.removeEventListener('typed_char', handleTypedChar);
  }, [balloonCap]); // Cần depend vào balloonCap để có thể đọc được giới hạn mới nhất

  return (
    <div style={{
      position: 'fixed',
      right: '6rem',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      zIndex: 9999,
      pointerEvents: 'none'
    }}>
      <div 
        ref={balloonRef}
        style={{
          width: `${60 + (balloonLetters.length * 3)}px`,
          height: `${80 + (balloonLetters.length * 3.5)}px`,
          backgroundColor: popEffect ? 'transparent' : 'var(--primary-color)',
          borderRadius: '50% 50% 50% 50% / 40% 40% 60% 60%',
          boxShadow: popEffect ? 'none' : 'inset -10px -10px 20px rgba(0,0,0,0.5), 0 0 15px var(--primary-color)',
          transition: 'all 0.1s ease-out',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          paddingBottom: '0.5rem',
          overflow: 'hidden',
          opacity: popEffect ? 0 : 0.9,
          transform: `scale(${popEffect ? 1.5 : 1}) translateY(${popEffect ? '-20px' : '0'})`
        }}
      >
        {balloonLetters.map((item) => (
          <span key={item.id} style={{ 
            position: 'absolute', 
            bottom: item.bottom, 
            left: item.left, 
            color: '#0a0a0a', 
            fontWeight: 'bold',
            fontFamily: 'var(--font-mono)',
            fontSize: '1.2rem',
            transform: `rotate(${item.rotate}deg)`,
            transition: 'none'
          }}>{item.char}</span>
        ))}
      </div>
      <div style={{
        width: '2px',
        height: '50px',
        backgroundColor: 'rgba(255,255,255,0.5)',
        opacity: popEffect ? 0 : 1,
        transition: 'all 0.2s'
      }}></div>
    </div>
  );
}
