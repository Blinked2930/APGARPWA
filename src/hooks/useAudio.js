import { useRef, useCallback } from 'react';

export function useAudio() {
  const audioCtxRef = useRef(null);

  const initAudio = useCallback(() => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContext();
        }
        
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // THE FIX: Play a 1-millisecond silent sound.
        // This tricks iOS Safari into permanently unlocking the Web Audio API 
        // so it allows our chimes to play during setIntervals later on.
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        gainNode.gain.value = 0; // 100% silent
        osc.connect(gainNode);
        gainNode.connect(ctx.destination);
        osc.start(0);
        osc.stop(ctx.currentTime + 0.001);

        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance('');
            utterance.volume = 0;
            window.speechSynthesis.speak(utterance);
        }
    } catch (e) {
        console.error("Audio init failed", e);
    }
  }, []);

  const playChime = useCallback(() => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContext();
        }
        
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const frequencies = [523.25, 659.25, 783.99]; 

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
    } catch (e) {
        console.error("Chime failed", e);
    }
  }, []);

  const speakTime = useCallback((seconds, customText = null) => {
    try {
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

        // Phonetic fix: Replace "APGAR" with "Apgar" and adjust spelling if needed
        // Browsers usually read capitalized acronyms like "A.P.G.A.R." 
        // We use lowercase with a capitalized first letter to trigger word-pronunciation.
        text = text.replace(/APGAR/g, "Apgar");

        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.volume = 1;
        utterance.rate = 0.9; // Slightly slower for clarity
        window.speechSynthesis.speak(utterance);
    } catch(e) {
        console.error("Speech failed", e);
    }
  }, []);

  return { initAudio, playChime, speakTime };
}