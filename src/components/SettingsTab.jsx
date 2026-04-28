import React from 'react';
import { useAppContext } from '../context/AppProvider';
import { Zap, Settings as SettingsIcon } from 'lucide-react';

export const SettingsTab = () => {
    const { visualFlash, toggleVisualFlash } = useAppContext();

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
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-[250px]">
                                Briefly flashes the screen every 30 seconds as a visual backup to the audio cues.
                            </p>
                        </div>
                    </div>

                    {/* Custom Toggle Switch */}
                    <button 
                        onClick={toggleVisualFlash}
                        className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${visualFlash ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                        <span 
                            className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${visualFlash ? 'translate-x-6' : 'translate-x-0'}`} 
                        />
                    </button>
                </div>

            </div>
        </div>
    );
};