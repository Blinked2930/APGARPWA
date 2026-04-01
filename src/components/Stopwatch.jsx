import React, { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../context/AppProvider';
import { Play, RotateCcw, AlertTriangle } from 'lucide-react';

export const Stopwatch = () => {
  const { deliveryStartTime, bodyOutTimes, apgar5MinParams, audioMode, playChime, speakTime, startDelivery, stopDelivery } = useAppContext();
  const [elapsed, setElapsed] = useState(0);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const lastMilestoneRef = useRef(0);

  useEffect(() => {
    if (!deliveryStartTime) {
      setElapsed(0);
      lastMilestoneRef.current = 0;
      return;
    }

    // Swapped to setInterval because requestAnimationFrame pauses entirely when screen dims
    const interval = setInterval(() => {
      const now = apgar5MinParams ? apgar5MinParams.timeCompleted : Date.now();
      const diff = now - deliveryStartTime;
      setElapsed(diff);

      if (apgar5MinParams) return;

      // Head Out specific logic (only run before Body Out is marked)
      if (bodyOutTimes.length === 0) {
        const current30sBlock = Math.floor(diff / 30000);
        if (current30sBlock > 0 && current30sBlock > lastMilestoneRef.current) {
          lastMilestoneRef.current = current30sBlock;
          const announceSeconds = current30sBlock * 30;

          if (audioMode === 'VOICE') speakTime(announceSeconds);
          else if (audioMode === 'CHIME') playChime();
        }
      }
    }, 250); // Checking 4 times a second is highly resilient

    return () => clearInterval(interval);
  }, [deliveryStartTime, apgar5MinParams, bodyOutTimes.length, audioMode, playChime, speakTime]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center py-2 w-full relative mt-2 sm:mt-4">
      <div className="text-[5.5rem] sm:text-[8rem] font-black tracking-tighter mb-1 leading-none text-slate-800 dark:text-white drop-shadow-sm font-mono origin-center">
        {formatTime(elapsed)}
      </div>
      <div className="text-slate-400 font-bold uppercase tracking-widest text-[10px] sm:text-sm mb-6 flex items-center gap-2">
        <span className="w-6 sm:w-8 h-px bg-slate-200 dark:bg-slate-700"></span>
        Total Delivery Time
        <span className="w-6 sm:w-8 h-px bg-slate-200 dark:bg-slate-700"></span>
      </div>

      {!deliveryStartTime && (
        <button
          onClick={startDelivery}
          className="relative overflow-hidden group flex items-center justify-center gap-3 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-2xl font-black py-5 sm:py-6 px-10 sm:px-12 w-full max-w-sm rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border-2 border-indigo-200 dark:border-indigo-800/50 transition-all active:scale-95 touch-manipulation mb-4 sm:mb-6"
        >
          <Play fill="currentColor" size={28} />
          <span className="tracking-wide">HEAD OUT</span>
        </button>
      )}

      {deliveryStartTime && !apgar5MinParams && (
        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center gap-2 px-4 py-2 text-rose-500 bg-rose-50 dark:bg-rose-900/10 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-full font-bold text-xs uppercase tracking-widest transition-colors mb-4"
        >
          <RotateCcw size={14} /> Cancel / Reset Timer
        </button>
      )}

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl relative overflow-hidden">
            <div className="flex flex-col items-center text-center gap-4 relative z-10">
              <div className="bg-rose-100 dark:bg-rose-900/30 p-4 rounded-full text-rose-500 dark:text-rose-400 mb-2">
                <AlertTriangle size={40} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">Reset Timer?</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-4">
                This will instantly cancel the current timer and clear all active data.
              </p>

              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={() => {
                    stopDelivery();
                    setShowResetConfirm(false);
                  }}
                  className="w-full py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-lg shadow-lg shadow-rose-500/30 transition-all active:scale-95 touch-manipulation"
                >
                  Yes, Reset Timer
                </button>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold transition-all"
                >
                  Keep Running
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};