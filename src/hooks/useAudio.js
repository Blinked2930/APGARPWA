import { useRef, useCallback } from 'react';

export function useAudio() {
  const audioCtxRef = useRef(null);

  // CRITICAL: This must be fired during a direct user click to bypass iOS/Android auto-play policies
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    if ('speechSynthesis' in window) {
      // Trigger a silent utterance to unlock speech synth
      const utterance = new SpeechSynthesisUtterance('');
      utterance.volume = 0;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const playChime = useCallback(() => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const frequencies = [523.25, 659.25, 783.99]; // C Major chord

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1 + (i * 0.05));
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5 + (i * 0.2));

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 3.0);
    });
  }, []);

  const speakTime = useCallback((seconds, customText = null) => {
    if (!('speechSynthesis' in window)) return;

    let text = customText;

    if (!text) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      text = '';
      if (mins > 0) text += `${mins} minute${mins > 1 ? 's' : ''} `;
      if (secs > 0) text += `${secs} seconds`;
      if (text === '') text = 'Started';
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1;
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  }, []);

  return { initAudio, playChime, speakTime };
}