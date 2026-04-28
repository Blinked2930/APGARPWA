import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppProvider';
import { Zap, Settings as SettingsIcon, CheckSquare, Bot, AlertTriangle } from 'lucide-react';

export const SettingsTab = ({ isWalkthrough, onCompleteWalkthrough }) => {
    const { visualFlash, toggleVisualFlash, showMilestones, toggleShowMilestones, robotDingEnabled, toggleRobotDing } = useAppContext();
    
    // 0 means no tour. 1, 2, 3 correspond to the settings steps.
    const [tourStep, setTourStep] = useState(isWalkthrough ? 1 : 0);

    // Keep state synced if it changes externally
    useEffect(() => {
        if (isWalkthrough && tourStep === 0) setTourStep(1);
    }, [isWalkthrough]);

    const nextStep = () => {
        if (tourStep === 3) {
            setTourStep(0);
            if (onCompleteWalkthrough) onCompleteWalkthrough();
        } else {
            setTourStep(tourStep + 1);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 pb-32 pt-12 sm:pt-6 relative">
            
            {/* Walkthrough Dark Overlay Background */}
            {tourStep > 0 && (
                <div className="fixed inset-0 z-40 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm transition-opacity duration-500 pointer-events-none"></div>
            )}

            <div className={`mb-8 flex items-center gap-3 px-2 transition-all duration-500 ${tourStep > 0 ? 'opacity-30 blur-[2px]' : ''}`}>
                <SettingsIcon className="text-slate-400" size={32} />
                <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
                    Settings
                </h2>
            </div>

            <div className={`bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2.5rem] p-6 sm:p-8 shadow-xl flex flex-col gap-8 transition-all duration-500 ${tourStep > 0 ? 'z-50 relative ring-4 ring-indigo-500/20' : 'relative z-10'}`}>
                
                {/* Visual Flash Toggle */}
                <div className={`relative transition-all duration-500 rounded-3xl ${tourStep === 1 ? 'z-20 scale-[1.02] bg-slate-50 dark:bg-slate-900/50 p-4 -m-4 ring-2 ring-indigo-500/30 shadow-xl' : (tourStep > 0 ? 'opacity-30 blur-[2px] pointer-events-none' : '')}`}>
                    <div className="flex justify-between items-start gap-4 w-full">
                        <div className="flex items-start gap-4 flex-1">
                            <div className={`p-3.5 rounded-2xl shrink-0 ${visualFlash ? 'bg-indigo-50 text-indigo-500 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-slate-50 text-slate-400 dark:bg-slate-900/50'}`}>
                                <Zap size={24} strokeWidth={2.5} />
                            </div>
                            <div className="pt-1 flex-1">
                                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-1.5">Visual Screen Flash</h3>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed pr-2">
                                    Briefly flashes the screen every 30 seconds as a visual backup to the audio cues.
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={toggleVisualFlash}
                            className={`mt-2 shrink-0 relative inline-flex h-8 w-14 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${visualFlash ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                        >
                            <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${visualFlash ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                    {/* Tooltip 1 */}
                    {tourStep === 1 && (
                        <div className="mt-5 bg-indigo-600 text-white rounded-2xl p-5 shadow-xl animate-in slide-in-from-top-2">
                            <p className="text-sm font-medium mb-4 leading-relaxed">
                                We recommend keeping this enabled. A bright flash every 30 seconds helps you track time in your peripheral vision without needing to stare at the screen.
                            </p>
                            <button onClick={nextStep} className="w-full py-3 rounded-xl bg-white text-indigo-600 font-black text-sm transition-all active:scale-95 shadow-sm">Got it, Next</button>
                        </div>
                    )}
                </div>

                <div className={`w-full h-px bg-slate-100 dark:bg-slate-700/50 transition-opacity duration-500 ${tourStep > 0 ? 'opacity-30' : ''}`}></div>

                {/* Robot Voice Fail-Safe Toggle */}
                <div className={`relative transition-all duration-500 rounded-3xl ${tourStep === 2 ? 'z-20 scale-[1.02] bg-slate-50 dark:bg-slate-900/50 p-4 -m-4 ring-2 ring-indigo-500/30 shadow-xl' : (tourStep > 0 ? 'opacity-30 blur-[2px] pointer-events-none' : '')}`}>
                    <div className="flex justify-between items-start gap-4 w-full">
                        <div className="flex items-start gap-4 flex-1">
                            <div className={`p-3.5 rounded-2xl shrink-0 ${robotDingEnabled ? 'bg-amber-50 text-amber-500 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-slate-50 text-slate-400 dark:bg-slate-900/50'}`}>
                                <Bot size={24} strokeWidth={2.5} />
                            </div>
                            <div className="pt-1 flex-1">
                                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-1.5">Audio Fail-Safe</h3>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed mb-4 pr-2">
                                    Plays a synthesized voice saying "ding" alongside the musical chime. This guarantees a sound plays even if the phone's physical mute switch is turned on.
                                </p>
                                
                                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-800/60 rounded-2xl p-4 w-full">
                                    <p className="text-xs font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                                        <AlertTriangle size={16} strokeWidth={3} /> Highly Recommended
                                    </p>
                                    <p className="text-xs font-semibold text-amber-700/80 dark:text-amber-500/80 leading-relaxed">
                                        If you keep your phone on vibrate or silent during births, the normal chime WILL NOT work. Keep this enabled!
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={toggleRobotDing}
                            className={`mt-2 shrink-0 relative inline-flex h-8 w-14 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${robotDingEnabled ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                        >
                            <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${robotDingEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                    {/* Tooltip 2 */}
                    {tourStep === 2 && (
                        <div className="mt-5 bg-indigo-600 text-white rounded-2xl p-5 shadow-xl animate-in slide-in-from-top-2">
                            <p className="text-sm font-medium mb-4 leading-relaxed">
                                Crucial setting! iPhones block normal web audio when switched to vibrate/silent mode. This synthetic voice acts as a fail-safe to guarantee you hear the 1 and 5-minute APGAR prompts.
                            </p>
                            <button onClick={nextStep} className="w-full py-3 rounded-xl bg-white text-indigo-600 font-black text-sm transition-all active:scale-95 shadow-sm">Got it, Next</button>
                        </div>
                    )}
                </div>

                <div className={`w-full h-px bg-slate-100 dark:bg-slate-700/50 transition-opacity duration-500 ${tourStep > 0 ? 'opacity-30' : ''}`}></div>

                {/* Milestone Strips Toggle */}
                <div className={`relative transition-all duration-500 rounded-3xl ${tourStep === 3 ? 'z-20 scale-[1.02] bg-slate-50 dark:bg-slate-900/50 p-4 -m-4 ring-2 ring-indigo-500/30 shadow-xl' : (tourStep > 0 ? 'opacity-30 blur-[2px] pointer-events-none' : '')}`}>
                    <div className="flex justify-between items-start gap-4 w-full">
                        <div className="flex items-start gap-4 flex-1">
                            <div className={`p-3.5 rounded-2xl shrink-0 ${showMilestones ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-slate-50 text-slate-400 dark:bg-slate-900/50'}`}>
                                <CheckSquare size={24} strokeWidth={2.5} />
                            </div>
                            <div className="pt-1 flex-1">
                                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-1.5">Milestone Trackers</h3>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 leading-relaxed pr-2">
                                    Show quick-tap buttons to log the exact times for ROM, Crown, First Cry, and Placenta.
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={toggleShowMilestones}
                            className={`mt-2 shrink-0 relative inline-flex h-8 w-14 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${showMilestones ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                        >
                            <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${showMilestones ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                    {/* Tooltip 3 */}
                    {tourStep === 3 && (
                        <div className="mt-5 bg-indigo-600 text-white rounded-2xl p-5 shadow-xl animate-in slide-in-from-top-2">
                            <p className="text-sm font-medium mb-4 leading-relaxed">
                                Customize your workspace. Keep these enabled to show quick-tap timestamp buttons at the top and bottom of your active screen.
                            </p>
                            <button onClick={nextStep} className="w-full py-3 rounded-xl bg-white text-indigo-600 font-black text-sm transition-all active:scale-95 shadow-sm">
                                Finish & Start Timer
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};