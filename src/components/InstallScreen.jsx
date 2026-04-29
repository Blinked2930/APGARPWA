import React, { useState } from 'react';
import { Smartphone, Apple, Share, PlusSquare, MoreVertical, MoreHorizontal, ExternalLink, Check } from 'lucide-react';

export const InstallScreen = ({ onBypass }) => {
    const [device, setDevice] = useState(null);

    return (
        <div className="min-h-[100dvh] w-full bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-900 dark:text-slate-100">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl border-2 border-slate-100 dark:border-slate-800 text-center">
                
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-inner">
                    <Smartphone size={40} strokeWidth={2} />
                </div>
                
                <h1 className="text-3xl font-black tracking-tight mb-2">Install App</h1>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                    To ensure reliability offline and during deliveries, this tool must be installed to your home screen.
                </p>

                {!device ? (
                    <div className="flex flex-col gap-4">
                        <button 
                            onClick={() => setDevice('ios')}
                            className="w-full py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95"
                        >
                            <Apple size={24} /> I have an iPhone
                        </button>
                        <button 
                            onClick={() => setDevice('android')}
                            className="w-full py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95"
                        >
                            <Smartphone size={24} /> I have an Android
                        </button>
                    </div>
                ) : (
                    <div className="text-left bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                        {device === 'ios' ? (
                            <>
                                <h3 className="font-black text-lg mb-4 text-center">iOS Installation</h3>
                                <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-4 text-center">Must be in Safari Browser</p>
                                <ol className="space-y-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                                    <li className="flex items-start gap-3">
                                        <MoreHorizontal size={20} className="text-indigo-500 shrink-0 mt-0.5" /> 
                                        <span className="leading-snug">Tap the <b>3-dot menu</b> in the bottom right corner of Safari.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Share size={20} className="text-indigo-500 shrink-0 mt-0.5" /> 
                                        <span className="leading-snug">Tap the <b>Share</b> icon.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <PlusSquare size={20} className="text-indigo-500 shrink-0 mt-0.5" /> 
                                        <span className="leading-snug">Scroll down and tap <b>Add to Home Screen</b>.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check size={20} className="text-indigo-500 shrink-0 mt-0.5" /> 
                                        <span className="leading-snug">Tap <b>Add</b> in the top right corner.</span>
                                    </li>
                                </ol>
                            </>
                        ) : (
                            <>
                                <h3 className="font-black text-lg mb-4 text-center">Android Installation</h3>
                                <ol className="space-y-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                                    <li className="flex items-start gap-3">
                                        <MoreVertical size={20} className="text-indigo-500 shrink-0 mt-0.5" /> 
                                        <span className="leading-snug">Tap the <b>3-dot menu</b> in the top right of Chrome.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <PlusSquare size={20} className="text-indigo-500 shrink-0 mt-0.5" /> 
                                        <span className="leading-snug">Tap <b>Install App</b> or <b>Add to Home screen</b>.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <ExternalLink size={20} className="text-indigo-500 shrink-0 mt-0.5" /> 
                                        <span className="leading-snug">Open <b>BirthTimer</b> from your home screen.</span>
                                    </li>
                                </ol>
                            </>
                        )}
                        <button 
                            onClick={() => setDevice(null)}
                            className="mt-6 w-full py-3 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-slate-600 dark:text-slate-300 font-bold text-sm"
                        >
                            Back
                        </button>
                    </div>
                )}
            </div>

            <button 
                onClick={onBypass}
                className="mt-8 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline underline-offset-4"
            >
                Continue in browser (Not Recommended)
            </button>
        </div>
    );
};