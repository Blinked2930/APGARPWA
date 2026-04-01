import React from 'react';
import { useAppContext } from '../context/AppProvider';
import { Volume2, VolumeX, Bell } from 'lucide-react';

export const AudioToggle = () => {
  const { audioMode, toggleAudioMode } = useAppContext();

  const getConfig = () => {
    if (audioMode === 'VOICE') return {
      icon: <Volume2 size={28} strokeWidth={2.5} />,
      label: 'Voice',
      classes: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/40'
    };
    if (audioMode === 'CHIME') return {
      icon: <Bell size={28} strokeWidth={2.5} />,
      label: 'Chime',
      classes: 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800/50 hover:bg-sky-100 dark:hover:bg-sky-900/40'
    };
    return {
      icon: <VolumeX size={28} strokeWidth={2.5} />,
      label: 'Muted',
      classes: 'bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800'
    };
  };

  const config = getConfig();

  return (
    <button
      onClick={toggleAudioMode}
      className={`relative overflow-hidden group flex flex-col items-center justify-center p-2 sm:p-4 rounded-[2rem] sm:rounded-[2.5rem] shadow-sm active:scale-95 transition-all touch-manipulation border-2 outline-none h-full w-full ${config.classes}`}
    >
      <div className="mb-1">{config.icon}</div>
      <span className="text-[10px] sm:text-xs font-black tracking-wider uppercase">{config.label}</span>
    </button>
  );
};