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

        const buffer = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start(0);

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
        // 1. Play the "Robot Ding" (Bypasses Mute Switch)
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Clear any pending speech
            const utterance = new SpeechSynthesisUtterance('ding');
            utterance.volume = 1;
            utterance.rate = 0.9; // Slower, more natural speed
            utterance.pitch = 0.9; // Lower, calmer pitch
            window.speechSynthesis.speak(utterance);
        }

        // 2. Play the "Pretty Ding" (Respects Mute Switch)
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContext();
        }
        
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        // Delay the Web Audio API by 150ms to let the Text-To-Speech engine catch up
        const startTime = ctx.currentTime + 0.15;

        const frequencies = [523.25, 659.25, 783.99]; 

        frequencies.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.value = freq;

          // Use the delayed startTime instead of ctx.currentTime
          gainNode.gain.setValueAtTime(0, startTime);
          gainNode.gain.linearRampToValueAtTime(0.15, startTime + 0.1 + (i * 0.05)); 
          gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 2.5 + (i * 0.2));

          osc.connect(gainNode);
          gainNode.connect(ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 3.0);
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

        text = text.replace(/APGAR/g, "Apgar");

        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.volume = 1;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    } catch(e) {
        console.error("Speech failed", e);
    }
  }, []);

  return { initAudio, playChime, speakTime };
}