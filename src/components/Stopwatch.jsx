import React, { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../context/AppProvider';
import { Play } from 'lucide-react';

export const Stopwatch = () => {
  const { deliveryStartTime, bodyOutTimes, apgar5MinParams, audioMode, playChime, speakTime, startDelivery } = useAppContext();
  const [elapsed, setElapsed] = useState(0);
  const rafRef = useRef(null);
  const lastIntervalRef = useRef(0);

  useEffect(() => {
    if (!deliveryStartTime) {
      setElapsed(0);
      lastIntervalRef.current = 0;
      return;
    }

    const tick = () => {
      const now = apgar5MinParams ? apgar5MinParams.timeCompleted : Date.now();
      const diff = now - deliveryStartTime;
      setElapsed(diff);

      if (apgar5MinParams) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        return;
      }

      const currentSeconds = Math.floor(diff / 1000);
      // check every 30s only during 'labor' phase before Body Out
      if (bodyOutTimes.length === 0 && currentSeconds > 0 && currentSeconds % 30 === 0 && currentSeconds !== lastIntervalRef.current) {
        lastIntervalRef.current = currentSeconds;

        if (audioMode === 'VOICE') {
          speakTime(currentSeconds);
        } else if (audioMode === 'CHIME') {
          playChime();
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [deliveryStartTime, apgar5MinParams, bodyOutTimes, audioMode, playChime, speakTime]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-2 w-full">
      <div className="text-[6.5rem] sm:text-[9rem] font-black tracking-tighter mb-1 leading-none text-slate-800 dark:text-white drop-shadow-sm">
        {formatTime(elapsed)}
      </div>
      <div className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-6">Total Delivery Time</div>
      {!deliveryStartTime && (
        <button
          onClick={startDelivery}
          className="flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white text-2xl font-black py-6 px-12 w-full max-w-sm rounded-[2.5rem] shadow-xl shadow-emerald-500/20 transition-all active:scale-95 touch-manipulation border border-white/20 mb-6"
        >
          <Play fill="currentColor" size={28} />
          HEAD OUT
        </button>
      )}
    </div>
  );
};
