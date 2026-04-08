import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppProvider';
import { Palette, HeartPulse, SmilePlus, Activity, Wind, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
  { id: 'appearance', label: 'Color', icon: <Palette className="text-indigo-400 w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'pulse', label: 'Heart Rate', icon: <HeartPulse className="text-indigo-400 w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'grimace', label: 'Reflex', icon: <SmilePlus className="text-indigo-400 w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'activity', label: 'Muscle Tone', icon: <Activity className="text-indigo-400 w-4 h-4 sm:w-5 sm:h-5" /> },
  { id: 'respiration', label: 'Breathing', icon: <Wind className="text-indigo-400 w-4 h-4 sm:w-5 sm:h-5" /> }
];

export const ApgarModal = ({ interval, onClose, historicalSession, onHistoricalSave }) => {
  const { saveApgarScore, apgar1MinParams, apgar5MinParams } = useAppContext();

  const existingParams = historicalSession
    ? (interval === 1 ? historicalSession.apgar1MinParams : historicalSession.apgar5MinParams)
    : (interval === 1 ? apgar1MinParams : apgar5MinParams);

  const initialScores = (existingParams && existingParams.scores) ? existingParams.scores : {};

  const [scores, setScores] = useState(initialScores);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCanClose(true), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleScore = (categoryId, value) => {
    setScores(prev => ({ ...prev, [categoryId]: value }));
  };

  const isComplete = CATEGORIES.every(c => scores[c.id] !== undefined);
  const isStarted = Object.keys(scores).length > 0;

  const handleSubmit = (e) => {
    if (e) e.stopPropagation();

    let scorePayload = {};

    if (isComplete) {
      const total = Object.values(scores).reduce((a, b) => a + b, 0);
      scorePayload = { scores, total, timeCompleted: Date.now(), inProgress: false };
    } else if (isStarted) {
      scorePayload = { scores, inProgress: true, timeCompleted: Date.now() };
    } else {
      scorePayload = { skipped: true, timeCompleted: Date.now(), inProgress: false };
    }

    if (onHistoricalSave) {
      onHistoricalSave(interval, scorePayload);
    } else {
      saveApgarScore(interval, scorePayload);
    }
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && canClose) {
      handleSubmit();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col justify-center items-center p-2 sm:p-4 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-[4px] transition-all"
      onClick={handleBackdropClick}
    >
      {/* FIX: Massively compressed padding, margins, and max-height */}
      <div
        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[1.5rem] shadow-2xl shadow-indigo-500/10 w-full max-w-xl mx-auto p-3 sm:p-5 border border-white/50 dark:border-slate-700 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100 dark:border-slate-800/50">
          <div className="w-8"></div>
          <h2 className="text-xl sm:text-2xl font-black text-center text-slate-800 dark:text-white flex items-center justify-center gap-2 m-0">
            <div className="h-8 w-8 sm:h-10 sm:w-10 text-base sm:text-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center rounded-lg shadow-inner border border-indigo-100 dark:border-indigo-500/20">
              {interval}
            </div>
            Min APGAR
          </h2>
          <button
            onClick={() => { if (canClose) handleSubmit(); }}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all font-bold text-[9px] uppercase tracking-tighter"
          >
            ✕
          </button>
        </div>

        <div className="space-y-1.5 sm:space-y-2 mb-4">
          {CATEGORIES.map(cat => (
            // FIX: Forced horizontal row layout so it never stacks vertically on small screens
            <div key={cat.id} className="flex flex-row items-center justify-between gap-2 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 p-2 sm:p-2.5 rounded-xl sm:rounded-2xl">
              <div className="flex items-center gap-2">
                <div className="bg-white dark:bg-slate-800 p-1.5 sm:p-2 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                  {cat.icon}
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 w-16 sm:w-24 leading-tight">
                  {cat.label}
                </span>
              </div>
              <div className="flex gap-1.5 sm:gap-2 w-[55%] sm:w-[60%]">
                {[0, 1, 2].map(val => {
                  const isSelected = scores[cat.id] === val;
                  return (
                    <button
                      key={val}
                      onClick={(e) => { e.stopPropagation(); handleScore(cat.id, val); }}
                      className={`h-9 sm:h-10 flex-1 text-base sm:text-lg font-black rounded-lg sm:rounded-xl transition-all active:scale-95 touch-manipulation
                        ${isSelected
                          ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-[1.02] border-transparent'
                          : 'bg-white dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700'
                        }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className={`w-full py-3 sm:py-4 rounded-xl text-sm sm:text-base font-black flex items-center justify-center gap-2 transition-all active:scale-95 touch-manipulation
            ${isComplete
              ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/20'
              : (isStarted ? 'bg-amber-400 hover:bg-amber-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500')
            }`}
        >
          {isComplete ? (
            <><CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> COMPLETE & SAVE</>
          ) : isStarted ? (
            'SAVE IN PROGRESS'
          ) : (
            'SKIP FOR NOW'
          )}
        </button>
      </div>
    </div>
  );
};