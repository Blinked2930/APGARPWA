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

            <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[2rem] p-5 sm:p-6 shadow-sm flex flex-col gap-6">
                
                {/* Visual Flash Toggle */}
                <div className="flex justify-between items-start gap-3 w-full">
                    <div className="flex gap-3 sm:gap-4 flex-1">
                        <div className={`p-3 rounded-2xl shrink-0 ${visualFlash ? 'bg-indigo-50 text-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-slate-50 text-slate-400 dark:bg-slate-900/50'}`}>
                            <Zap size={22} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col pt-0.5">
                            <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 mb-1">Visual Screen Flash</h3>
                            <p className="text-[13px] sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed pr-2">
                                Briefly flashes the screen every 30 seconds as a visual backup to the audio cues.
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={toggleVisualFlash}
                        className={`shrink-0 mt-1 relative inline-flex h-8 w-14 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${visualFlash ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                        <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${visualFlash ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>

                <div className="w-full h-px bg-slate-100 dark:bg-slate-700/50"></div>

                {/* Robot Voice Fail-Safe Toggle */}
                <div className="flex justify-between items-start gap-3 w-full">
                    <div className="flex gap-3 sm:gap-4 flex-1">
                        <div className={`p-3 rounded-2xl shrink-0 ${robotDingEnabled ? 'bg-amber-50 text-amber-500 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-slate-50 text-slate-400 dark:bg-slate-900/50'}`}>
                            <Bot size={22} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col pt-0.5 pr-2">
                            <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 mb-1">Audio Fail-Safe</h3>
                            <p className="text-[13px] sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
                                Plays a synthesized voice saying "ding" alongside the musical chime. This guarantees a sound plays even if the phone's physical mute switch is turned on.
                            </p>
                            
                            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/60 rounded-xl p-3 w-full">
                                <p className="text-[11px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1.5 mb-1.5">
                                    <AlertTriangle size={14} strokeWidth={3} /> Highly Recommended
                                </p>
                                <p className="text-[11px] font-semibold text-amber-700/80 dark:text-amber-500/80 leading-relaxed">
                                    If you keep your phone on vibrate or silent during births, the normal chime WILL NOT work. Keep this enabled!
                                </p>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={toggleRobotDing}
                        className={`shrink-0 mt-1 relative inline-flex h-8 w-14 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${robotDingEnabled ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                        <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${robotDingEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>

                <div className="w-full h-px bg-slate-100 dark:bg-slate-700/50"></div>

                {/* Milestone Strips Toggle */}
                <div className="flex justify-between items-start gap-3 w-full">
                    <div className="flex gap-3 sm:gap-4 flex-1">
                        <div className={`p-3 rounded-2xl shrink-0 ${showMilestones ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-50 text-slate-400 dark:bg-slate-900/50'}`}>
                            <CheckSquare size={22} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col pt-0.5">
                            <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100 mb-1">Milestone Trackers</h3>
                            <p className="text-[13px] sm:text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed pr-2">
                                Show quick-tap buttons to log the exact times for ROM, Crown, First Cry, and Placenta.
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={toggleShowMilestones}
                        className={`shrink-0 mt-1 relative inline-flex h-8 w-14 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${showMilestones ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                        <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${showMilestones ? 'translate-x-6' : 'translate-x-0'}`} />
                    </button>
                </div>

            </div>
        </div>
    );
};