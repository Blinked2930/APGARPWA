import React from 'react';
import { useAppContext } from '../context/AppProvider';
import { Volume2, VolumeX, Bell } from 'lucide-react';

export const AudioToggle = () => {
  const { audioMode, toggleAudioMode } = useAppContext();

  const getConfig = () => {
    if (audioMode === 'VOICE') return {
      icon: <Volume2 size={32} strokeWidth={2.5}/>,
      label: 'Voice',
      classes: 'bg-indigo-600/90 hover:bg-indigo-600 shadow-indigo-500/20 backdrop-blur-md'
    };
    if (audioMode === 'CHIME') return {
      icon: <Bell size={32} strokeWidth={2.5}/>,
      label: 'Chime',
      classes: 'bg-cyan-600/90 hover:bg-cyan-600 shadow-cyan-500/20 backdrop-blur-md'
    };
    return {
      icon: <VolumeX size={32} strokeWidth={2.5}/>,
      label: 'Muted',
      classes: 'bg-slate-600/90 hover:bg-slate-600 shadow-slate-500/20 backdrop-blur-md'
    };
  };

  const config = getConfig();

  return (
    <button 
      onClick={toggleAudioMode}
      className={`relative overflow-hidden group flex flex-col items-center justify-center p-3 sm:p-4 rounded-[2.5rem] shadow-xl text-white active:scale-95 transition-all touch-manipulation border border-white/20 outline-none h-full w-full ${config.classes}`}
    >
      <div className="absolute inset-0 bg-white/20 opacity-0 group-active:opacity-100 transition-opacity"></div>
      <div className="mb-1 drop-shadow-md">{config.icon}</div>
      <span className="text-sm font-black tracking-wider drop-shadow-sm uppercase">{config.label}</span>
    </button>
  );
};
