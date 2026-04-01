import React, { useState } from 'react';
import { useAppContext } from '../context/AppProvider';
import { Palette, HeartPulse, SmilePlus, Activity, Wind, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
  { id: 'appearance', label: 'Color', icon: <Palette className="text-indigo-400" /> },
  { id: 'pulse', label: 'Heart Rate', icon: <HeartPulse className="text-indigo-400" /> },
  { id: 'grimace', label: 'Reflex', icon: <SmilePlus className="text-indigo-400" /> },
  { id: 'activity', label: 'Muscle Tone', icon: <Activity className="text-indigo-400" /> },
  { id: 'respiration', label: 'Breathing', icon: <Wind className="text-indigo-400" /> }
];

export const ApgarModal = ({ interval, onClose }) => {
  const { saveApgarScore } = useAppContext();
  const [scores, setScores] = useState({});

  const handleScore = (categoryId, value) => {
    setScores(prev => ({ ...prev, [categoryId]: value }));
  };

  const isComplete = CATEGORIES.every(c => scores[c.id] !== undefined);

  const handleSubmit = (e) => {
    e.stopPropagation();
    if (!isComplete) return;
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    saveApgarScore(interval, {
      scores,
      total,
      timeCompleted: Date.now()
    });
    onClose();
  };

  const handleSkip = () => {
    saveApgarScore(interval, {
      skipped: true,
      timeCompleted: Date.now()
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col justify-end p-2 sm:p-4 bg-slate-900/40 dark:bg-slate-950/60 backdrop-blur-sm transition-all"
      onClick={handleSkip}
    >
      <div 
        className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 w-full max-w-2xl mx-auto p-5 sm:p-8 border border-white/50 dark:border-slate-700 pointer-events-auto overflow-y-auto max-h-[85vh] mb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-6"></div>
        
        <div className="flex justify-between items-center mb-5 pb-3">
          <div className="w-12"></div> {/* Spacer for centering */}
          
          <h2 className="text-3xl font-black text-center text-slate-800 dark:text-white flex items-center justify-center gap-3 m-0">
            <span className="bg-indigo-100 text-indigo-600 dark:bg-indigo-900 absolute opacity-0"></span>
            <div className="h-14 w-14 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center rounded-2xl shadow-inner border border-indigo-100 dark:border-indigo-500/20">
              {interval}
            </div>
            Min APGAR
          </h2>
          
          <button 
             onClick={handleSkip} 
             className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all font-bold text-xs uppercase tracking-tighter"
          >
            Skip
          </button>
        </div>
        
        <div className="space-y-4 mb-8">
          {CATEGORIES.map(cat => (
            <div key={cat.id} className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 p-4 rounded-[2rem]">
              <div className="flex items-center gap-3">
                <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                  {cat.icon}
                </div>
                <span className="text-xl font-bold text-slate-700 dark:text-slate-300">
                  {cat.label}
                </span>
              </div>
              <div className="flex justify-between gap-2 lg:gap-3 w-full lg:w-auto">
                {[0, 1, 2].map(val => {
                  const isSelected = scores[cat.id] === val;
                  return (
                    <button
                      key={val}
                      onClick={(e) => { e.stopPropagation(); handleScore(cat.id, val); }}
                      className={`h-16 flex-1 lg:w-24 text-3xl font-black rounded-[1.5rem] transition-all active:scale-95 touch-manipulation
                        ${isSelected 
                          ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30 scale-105 border-transparent' 
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
          disabled={!isComplete}
          onClick={handleSubmit}
          className={`w-full py-6 rounded-[2rem] text-3xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 touch-manipulation
            ${isComplete 
              ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-xl shadow-indigo-500/20' 
              : 'bg-slate-100 dark:bg-slate-800/50 text-slate-400 cursor-not-allowed border border-slate-200 dark:border-slate-800'
            }`}
        >
          {isComplete && <CheckCircle2 size={32} />}
          SAVE SCORE
        </button>
      </div>
    </div>
  );
};
