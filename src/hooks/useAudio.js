import { useRef, useCallback } from 'react';

export function useAudio() {
  const audioCtxRef = useRef(null);

  const playChime = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5); 

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1);
  }, []);

  const speakTime = useCallback((seconds) => {
    if (!('speechSynthesis' in window)) return;
    
    let text = '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    if (mins > 0) {
      text += `${mins} minute${mins > 1 ? 's' : ''} `;
    }
    if (secs > 0) {
      text += `${secs} seconds`;
    }
    
    if (text === '') text = 'Started';

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  }, []);

  return { playChime, speakTime };
}
