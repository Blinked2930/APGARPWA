import { useRef, useCallback } from 'react';

export function useAudio() {
  const audioCtxRef = useRef(null);

  const playChime = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    // A soothing major chord (C5, E5, G5) instead of a harsh sweep
    const frequencies = [523.25, 659.25, 783.99];

    frequencies.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine'; // Softest waveform
      osc.frequency.value = freq;

      // Slow attack, long soothing release
      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.1 + (i * 0.05));
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5 + (i * 0.2));

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 3.0);
    });
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