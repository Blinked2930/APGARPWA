import React, { useState } from 'react';
import { Smartphone, Apple, Share, PlusSquare, MoreVertical, MoreHorizontal, X, Check } from 'lucide-react';

export const InstallScreen = ({ onBypass }) => {
    const [device, setDevice] = useState(null); // null | 'ios' | 'android'

    return (
        <div className="min-h-[100dvh] w-full bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-900 dark:text-slate-100 relative">
            
            {!device ? (
                <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-xl border-2 border-slate-100 dark:border-slate-800 text-center animate-in fade-in duration-300">
                    <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-inner">
                        <Smartphone size={40} strokeWidth={2} />
                    </div>
                    
                    <h1 className="text-3xl font-black tracking-tight mb-2">
                        Install Protocol
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
                        To ensure maximum reliability offline and during deliveries, this tool must be installed directly to your device.
                    </p>

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
                </div>
            ) : (
                <div className="w-full max-w-sm bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 shadow-2xl rounded-[2.5rem] p-6 sm:p-8 relative animate-in slide-in-from-bottom-4 duration-300">
                    <button 
                        onClick={() => setDevice(null)}
                        className="absolute top-5 right-5 w-8 h-8 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-400 active:scale-95 transition-colors border border-slate-100 dark:border-slate-700"
                    >
                        <X size={16} />
                    </button>
                    
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
                        {device === 'ios' ? 'iOS Installation' : 'Android Installation'}
                    </h2>
                    
                    {device === 'ios' ? (
                        <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-6">
                            Must be in Safari Browser
                        </p>
                    ) : (
                        <p className="text-[10px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-6">
                            Must be in Chrome Browser
                        </p>
                    )}

                    <div className="space-y-6 text-slate-600 dark:text-slate-300 text-sm font-medium mb-8">
                        {device === 'ios' ? (
                            <>
                                <div className="flex items-start gap-4">
                                    <MoreHorizontal size={20} className="text-indigo-500 shrink-0 mt-0.5" />
                                    <p className="leading-snug">
                                        Tap the <strong className="text-slate-900 dark:text-white">3-dot menu</strong> in the bottom right corner.
                                    </p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Share size={20} className="text-indigo-500 shrink-0 mt-0.5" />
                                    <p className="leading-snug">
                                        Tap the <strong className="text-slate-900 dark:text-white">Share icon</strong>.
                                    </p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <PlusSquare size={20} className="text-indigo-500 shrink-0 mt-0.5" />
                                    <p className="leading-snug">
                                        Scroll down and tap <strong className="text-slate-900 dark:text-white">Add to Home Screen</strong>.
                                    </p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Check size={20} className="text-indigo-500 shrink-0 mt-0.5" />
                                    <p className="leading-snug">
                                        Tap <strong className="text-slate-900 dark:text-white">Add</strong> in the top right corner.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-start gap-4">
                                    <MoreVertical size={20} className="text-indigo-500 shrink-0 mt-0.5" />
                                    <p className="leading-snug">
                                        Tap the <strong className="text-slate-900 dark:text-white">3-dot menu</strong> in the top right corner.
                                    </p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <PlusSquare size={20} className="text-indigo-500 shrink-0 mt-0.5" />
                                    <p className="leading-snug">
                                        Scroll down and tap <strong className="text-slate-900 dark:text-white">Add to Home screen</strong>.
                                    </p>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Check size={20} className="text-indigo-500 shrink-0 mt-0.5" />
                                    <p className="leading-snug">
                                        Tap <strong className="text-slate-900 dark:text-white">Install</strong> on the popup.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>

                    <button 
                        onClick={() => setDevice(null)}
                        className="w-full py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-2xl font-black uppercase tracking-widest text-[11px] active:scale-[0.98] transition-all"
                    >
                        Back
                    </button>
                </div>
            )}

            <button 
                onClick={onBypass}
                className="mt-8 text-[11px] font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 underline underline-offset-4 uppercase tracking-widest transition-colors"
            >
                Continue in browser (Not Recommended)
            </button>
        </div>
    );
};