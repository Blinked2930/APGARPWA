import React from 'react';
import { useAppContext } from '../context/AppProvider';
import { Baby, Check } from 'lucide-react';

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
        className={`w-full h-full relative overflow-hidden group py-4 rounded-[2.5rem] shadow-xl transition-all touch-manipulation flex flex-col items-center justify-center border border-white/20
          ${isRecorded 
            ? 'bg-slate-200/50 dark:bg-slate-800/40 text-emerald-600 dark:text-emerald-400 shadow-none cursor-default border-none backdrop-blur-md' 
            : 'bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/30 active:scale-95'
          }
        `}
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-active:opacity-100 transition-opacity"></div>
        {isRecorded ? (
          <>
             <Check size={48} className="mb-2 opacity-80" strokeWidth={3}/>
             <span className="text-2xl font-black tracking-wide drop-shadow-sm uppercase">Recorded</span>
          </>
        ) : (
          <>
             <Baby size={52} className="mb-1 opacity-95 drop-shadow-md" strokeWidth={2.5}/>
             <span className="text-3xl font-black tracking-wide drop-shadow-sm">BODY OUT</span>
          </>
        )}
      </button>
    </div>
  );
};
