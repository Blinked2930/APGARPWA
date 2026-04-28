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

  const playChime = useCallback((useRobotDing = true) => {
    try {
        // 1. Play the "Robot Ding" ONLY if enabled in settings
        if (useRobotDing && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel(); 
            const utterance = new SpeechSynthesisUtterance('ding');
            
            const voices = window.speechSynthesis.getVoices();
            const deepVoice = voices.find(v => v.name.includes('Daniel') || v.name.includes('Alex') || v.name.includes('Male') || v.name.includes('Guy'));
            if (deepVoice) {
                utterance.voice = deepVoice;
            }

            utterance.volume = 1;
            utterance.rate = 0.5; 
            utterance.pitch = 0.2; 
            window.speechSynthesis.speak(utterance);
        }

        // 2. Play the "Pretty Ding" 
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        
        if (!audioCtxRef.current) {
          audioCtxRef.current = new AudioContext();
        }
        
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const startTime = ctx.currentTime + 0.15;
        const frequencies = [523.25, 659.25, 783.99]; 

        frequencies.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gainNode = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.value = freq;

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