import React from 'react';
import { useAppContext } from '../context/AppProvider';
import { Volume2, VolumeX, Bell } from 'lucide-react';

export const AudioToggle = () => {
  const { audioMode, toggleAudioMode } = useAppContext();

  const getIcon = () => {
    if (audioMode === 'VOICE') return <Volume2 size={32} className="text-violet-500" strokeWidth={2.5}/>;
    if (audioMode === 'CHIME') return <Bell size={32} className="text-amber-500" strokeWidth={2.5}/>;
    return <VolumeX size={32} className="text-slate-400" strokeWidth={2.5}/>;
  };

  const getLabel = () => {
    if (audioMode === 'VOICE') return 'Voice';
    if (audioMode === 'CHIME') return 'Chime';
    return 'Muted';
  };

  const getBgClass = () => {
    if (audioMode === 'VOICE') return 'bg-violet-50 dark:bg-violet-900/20 border-violet-100 dark:border-violet-800/50';
    if (audioMode === 'CHIME') return 'bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800/50';
    return 'bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700';
  };

  return (
    <button 
      onClick={toggleAudioMode}
      className={`flex flex-col items-center justify-center p-3 sm:p-4 rounded-[2rem] shadow-md border-2 active:scale-95 transition-all outline-none h-full w-full ${getBgClass()}`}
    >
      <div className="mb-2 bg-white dark:bg-slate-800 p-2 sm:p-3 rounded-2xl shadow-sm">{getIcon()}</div>
      <span className="text-xs sm:text-sm font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider">{getLabel()}</span>
    </button>
  );
};
