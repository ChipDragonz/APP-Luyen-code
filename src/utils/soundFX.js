// Khởi tạo AudioContext (chỉ chạy khi user tương tác lần đầu để tránh bị trình duyệt block)
let audioCtx;

const initAudio = () => {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

// Tạo một bộ tạo tiếng ồn trắng (white noise) để giả lập tiếng "lạch cạch" của phím cơ
const createNoiseBuffer = () => {
  const bufferSize = audioCtx.sampleRate * 0.05; // 50ms
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
};

// Âm thanh gõ phím đúng (Click clack)
export const playClickSound = () => {
  initAudio();
  
  // Oscillator cho tiếng click trầm
  const osc = audioCtx.createOscillator();
  const oscGain = audioCtx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(150 + Math.random() * 50, audioCtx.currentTime); 
  
  oscGain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  oscGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.03);
  
  osc.connect(oscGain);
  oscGain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.03);

  // Noise cho tiếng lạch cạch
  const noiseSource = audioCtx.createBufferSource();
  noiseSource.buffer = createNoiseBuffer();
  
  const noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = 'highpass';
  noiseFilter.frequency.value = 1000;
  
  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.1, audioCtx.currentTime);
  noiseGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.02);
  
  noiseSource.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(audioCtx.destination);
  noiseSource.start();
};

// Âm thanh gõ sai (Error Beep)
export const playErrorSound = () => {
  initAudio();
  
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(120, audioCtx.currentTime); 
  
  gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15); 
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  osc.start();
  osc.stop(audioCtx.currentTime + 0.15);
};

// Âm thanh hoàn thành (Level Up)
export const playSuccessSound = () => {
  initAudio();
  
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  const startTime = audioCtx.currentTime;
  
  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = freq;
    
    gainNode.gain.setValueAtTime(0, startTime + i * 0.1);
    gainNode.gain.linearRampToValueAtTime(0.1, startTime + i * 0.1 + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.1 + 0.3);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(startTime + i * 0.1);
    osc.stop(startTime + i * 0.1 + 0.3);
  });
};

// Hiệu ứng hạt sao băng rơi
export const spawnStar = () => {
  const star = document.createElement('div');
  
  star.style.position = 'fixed';
  star.style.width = '3px'; // Dày hơn
  star.style.height = `${80 + Math.random() * 40}px`;
  star.style.background = 'linear-gradient(to bottom, transparent, #00ff41, #ffffff)'; // Sáng hơn
  star.style.filter = 'drop-shadow(0 0 10px #00ff41) drop-shadow(0 0 20px #00ff41)'; // Viền sáng rực rỡ
  star.style.borderRadius = '3px';
  star.style.pointerEvents = 'none';
  star.style.zIndex = '10'; // Nổi lên trên
  
  const startX = Math.random() * window.innerWidth;
  const startY = -150; 
  
  star.style.left = `${startX}px`;
  star.style.top = `${startY}px`;
  
  const angle = 20 + Math.random() * 15;
  star.style.transform = `rotate(${angle}deg)`;
  
  document.body.appendChild(star);
  
  const duration = 1200 + Math.random() * 1000; // Rơi chậm lại (1.2s - 2.2s)
  const distanceX = -(window.innerHeight + 300) * Math.tan(angle * Math.PI / 180);
  
  star.animate([
    { transform: `translate(0, 0) rotate(${angle}deg)`, opacity: 1 },
    { transform: `translate(${distanceX}px, ${window.innerHeight + 300}px) rotate(${angle}deg)`, opacity: 0 }
  ], {
    duration: duration,
    easing: 'linear',
    fill: 'forwards'
  });
  
  setTimeout(() => {
    star.remove();
  }, duration);
};

// Âm thanh bóng nổ (Pop)
export const playPopSound = () => {
  initAudio();
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  osc.type = 'sine';
  osc.frequency.setValueAtTime(800, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
  
  gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.1);
};
