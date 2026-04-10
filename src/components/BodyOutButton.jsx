import React from 'react';
import { useAppContext } from '../context/AppProvider';
import { Check } from 'lucide-react';

export const BodyOutButton = () => {
  const { markBodyOut, bodyOutTimes } = useAppContext();
  const isRecorded = bodyOutTimes.length > 0;

  const handleClick = (e) => {
    e.preventDefault();
    if (!isRecorded) {
      markBodyOut();
    }
  };

  return (
    <div className="w-full h-full">
      <button
        onClick={handleClick}
        disabled={isRecorded}
        className={`w-full h-full relative overflow-hidden group py-4 rounded-[2rem] sm:rounded-[2.5rem] transition-all touch-manipulation flex flex-col items-center justify-center border-2
          ${isRecorded
            ? 'bg-slate-100/50 dark:bg-slate-800/40 text-emerald-500 dark:text-emerald-400 border-transparent cursor-default shadow-inner'
            : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 active:scale-95 shadow-sm'
          }
        `}
      >
        {isRecorded ? (
          <>
            <Check size={40} className="mb-2 opacity-80" strokeWidth={3} />
            <span className="text-xl sm:text-2xl font-black tracking-wide uppercase">Recorded</span>
          </>
        ) : (
          <span className="text-2xl sm:text-3xl font-black tracking-wide">BODY OUT</span>
        )}
      </button>
    </div>
  );
};