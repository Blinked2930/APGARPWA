import React from 'react';
import { useAppContext } from '../context/AppProvider';
import { Zap, Settings as SettingsIcon, CheckSquare, Bot, AlertTriangle } from 'lucide-react';

export const SettingsTab = () => {
    const { visualFlash, toggleVisualFlash, showMilestones, toggleShowMilestones, robotDingEnabled, toggleRobotDing } = useAppContext();

    return (
        <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 pb-32">
            <div className="mb-6 sm:mb-8 flex items-center gap-3">
                <SettingsIcon className="text-slate-400" size={28} />
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
                    Settings
                </h2>
            </div>

            <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[2rem] p-6 shadow-sm">
                
                {/* Visual Flash Toggle */}
                <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl mt-1 ${visualFlash ? 'bg-indigo-50 text-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-slate-50 text-slate-400 dark:bg-slate-900/50'}`}>
                            <Zap size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-1">Visual Screen Flash</h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-[250px] sm:max-w-none">
                                Briefly flashes the screen every 30 seconds as a visual backup to the audio cues.
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={toggleVisualFlash}
                        className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${visualFlash ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                        <span 
                            className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${visualFlash ? 'translate-x-6' : 'translate-x-0'}`} 
                        />
                    </button>
                </div>

                <div className="w-full border-b border-slate-100 dark:border-slate-700/50 my-6"></div>

                {/* Robot Voice Fail-Safe Toggle */}
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl mt-1 ${robotDingEnabled ? 'bg-amber-50 text-amber-500 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-slate-50 text-slate-400 dark:bg-slate-900/50'}`}>
                            <Bot size={24} />
                        </div>
                        <div className="pr-4">
                            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-1">Audio Fail-Safe</h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-3">
                                Plays a synthesized voice saying "ding" alongside the musical chime. This guarantees a sound plays even if the phone's physical mute switch is turned on.
                            </p>
                            
                            {/* NEW: Bright Warning Box */}
                            <div className="bg-amber-100 dark:bg-amber-900/40 border border-amber-200 dark:border-amber-800 rounded-xl p-3 inline-block">
                                <p className="text-xs font-black text-amber-700 dark:text-amber-400 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                                    <AlertTriangle size={14} strokeWidth={3} /> Highly Recommended
                                </p>
                                <p className="text-[11px] font-bold text-amber-600 dark:text-amber-500/90 leading-tight">
                                    If you keep your phone on vibrate or silent during births, the normal chime WILL NOT work. Keep this enabled!
                                </p>
                            </div>

                        </div>
                    </div>

                    <button 
                        onClick={toggleRobotDing}
                        className={`mt-2 relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${robotDingEnabled ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                        <span 
                            className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${robotDingEnabled ? 'translate-x-6' : 'translate-x-0'}`} 
                        />
                    </button>
                </div>

                <div className="w-full border-b border-slate-100 dark:border-slate-700/50 my-6"></div>

                {/* Milestone Strips Toggle */}
                <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-xl mt-1 ${showMilestones ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-50 text-slate-400 dark:bg-slate-900/50'}`}>
                            <CheckSquare size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-1">Milestone Trackers</h3>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-[250px] sm:max-w-none">
                                Show quick-tap buttons to log the exact times for ROM, Crown, First Cry, and Placenta.
                            </p>
                        </div>
                    </div>

                    <button 
                        onClick={toggleShowMilestones}
                        className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${showMilestones ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                        <span 
                            className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${showMilestones ? 'translate-x-6' : 'translate-x-0'}`} 
                        />
                    </button>
                </div>

            </div>
        </div>
    );
};