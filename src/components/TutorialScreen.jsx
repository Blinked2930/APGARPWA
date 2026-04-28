import React, { useState } from 'react';
import { ShieldAlert, BookOpen, Clock, CheckCircle2 } from 'lucide-react';

export const TutorialScreen = ({ onComplete }) => {
    const [step, setStep] = useState(1);

    const completeTutorial = () => {
        localStorage.setItem('tutorialCompleted', 'true');
        onComplete();
    };

    return (
        <div className="min-h-[100dvh] w-full bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-900 dark:text-slate-100 relative overflow-hidden">
            
            {/* Ambient Background */}
            <div className="absolute top-0 inset-x-0 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none z-0"></div>

            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 relative z-10 flex flex-col h-[500px]">
                
                {step === 1 && (
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 rounded-2xl flex items-center justify-center mb-6">
                            <Clock size={32} />
                        </div>
                        <h2 className="text-3xl font-black mb-3">Welcome to BirthTimer</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed flex-1">
                            A completely offline, distraction-free tool designed to help you track APGAR intervals and delivery milestones in real-time.
                        </p>
                        <button onClick={() => setStep(2)} className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg transition-all active:scale-95 shadow-lg shadow-indigo-500/20">
                            Next
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                            <BookOpen size={32} />
                        </div>
                        <h2 className="text-3xl font-black mb-3">Ephemeral Data</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-4">
                            This app operates strictly as a local scratchpad. It <b>never</b> connects to the cloud. 
                        </p>
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 flex-1">
                            All records are stored directly on this physical device. If you clear your browser data or delete the app, the history is permanently destroyed.
                        </div>
                        <button onClick={() => setStep(3)} className="w-full py-4 mt-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg transition-all active:scale-95 shadow-lg shadow-indigo-500/20">
                            Next
                        </button>
                    </div>
                )}

                {step === 3 && (
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-2xl flex items-center justify-center mb-6 shrink-0">
                            <ShieldAlert size={32} />
                        </div>
                        <h2 className="text-2xl font-black mb-3">Terms & Medical Disclaimer</h2>
                        <div className="flex-1 overflow-y-auto pr-2 mb-4 text-sm text-slate-500 dark:text-slate-400 space-y-3 font-medium">
                            <p>By using this application, you acknowledge and agree to the following:</p>
                            <ul className="list-disc pl-4 space-y-2 text-rose-600/80 dark:text-rose-400/80 font-bold">
                                <li>This is a temporal logging tool, NOT a diagnostic medical device.</li>
                                <li>This application does not provide medical advice, diagnosis, or treatment.</li>
                                <li>You assume full responsibility for all medical decisions, timing verifications, and official hospital charting.</li>
                            </ul>
                        </div>
                        <button onClick={completeTutorial} className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg transition-all active:scale-95 flex justify-center items-center gap-2 shadow-lg shadow-indigo-500/20 shrink-0">
                            <CheckCircle2 size={24} /> I Agree & Understand
                        </button>
                    </div>
                )}

                {/* Dots indicator */}
                <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step === i ? 'w-6 bg-indigo-500' : 'w-1.5 bg-slate-200 dark:bg-slate-700'}`} />
                    ))}
                </div>

            </div>
        </div>
    );
};