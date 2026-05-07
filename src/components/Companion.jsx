import React, { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';

export default function Companion() {
  const [message, setMessage] = useState('Chào sếp! Bắt đầu code thôi nào.');
  const [isVisible, setIsVisible] = useState(true);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    const handleMessage = (e) => {
      setMessage(e.detail);
      setIsVisible(true);
      setIsBouncing(true);
      
      setTimeout(() => setIsBouncing(false), 500);

      // Tự động tắt bong bóng sau 4 giây nếu không có thông báo mới
      setTimeout(() => {
        setIsVisible(false);
      }, 4000);
    };

    window.addEventListener('companion_message', handleMessage);
    return () => window.removeEventListener('companion_message', handleMessage);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-end',
      zIndex: 1000,
      pointerEvents: 'none'
    }}>
      {/* Speech Bubble */}
      <div style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--primary-color)',
        padding: '0.75rem 1rem',
        borderRadius: '1rem',
        borderBottomRightRadius: '0.2rem',
        color: 'var(--primary-color)',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.85rem',
        maxWidth: '250px',
        marginBottom: '0.5rem',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 12px rgba(0,255,65,0.1)'
      }}>
        {message}
      </div>

      {/* Robot Icon */}
      <div style={{
        width: '50px',
        height: '50px',
        backgroundColor: 'var(--code-bg)',
        border: '2px solid var(--primary-color)',
        borderRadius: '50%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transform: isBouncing ? 'translateY(-10px)' : 'translateY(0)',
        transition: 'transform 0.2s',
        boxShadow: '0 0 10px rgba(0,255,65,0.2)'
      }}>
        <Bot size={24} color="var(--primary-color)" />
      </div>
    </div>
  );
}
