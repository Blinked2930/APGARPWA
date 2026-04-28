import React, { useState } from 'react';
import { ShieldAlert, BookOpen, Clock, CheckCircle2, Play, Activity, ChevronLeft } from 'lucide-react';

export const TutorialScreen = ({ onComplete }) => {
    const [step, setStep] = useState(1);
    const totalSteps = 5;

    const completeTutorial = () => {
        localStorage.setItem('tutorialCompleted', 'true');
        onComplete();
    };

    return (
        <div className="min-h-[100dvh] w-full bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-900 dark:text-slate-100 relative overflow-hidden">
            
            <div className="absolute top-0 inset-x-0 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none z-0"></div>

            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 pb-12 shadow-2xl border border-slate-100 dark:border-slate-800 relative z-10 flex flex-col min-h-[520px]">
                
                {/* NEW: Sleek, Circular Back Button */}
                {step > 1 && (
                    <button 
                        onClick={() => setStep(step - 1)} 
                        className="absolute top-6 left-6 w-10 h-10 flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-full transition-all active:scale-95 z-20 shadow-sm"
                        aria-label="Go Back"
                    >
                        <ChevronLeft size={22} strokeWidth={3} className="-ml-0.5" />
                    </button>
                )}

                <div className={`flex flex-col h-full ${step > 1 ? 'mt-10' : ''}`}>
                    {step === 1 && (
                        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 rounded-2xl flex items-center justify-center mb-6 shrink-0">
                                <Clock size={32} />
                            </div>
                            <h2 className="text-3xl font-black mb-3">Welcome to BirthTimer</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed flex-1">
                                A completely offline, distraction-free tool designed to help you track APGAR intervals and delivery milestones in real-time.
                            </p>
                            <button onClick={() => setStep(2)} className="mt-auto w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg transition-all active:scale-95 shadow-lg shadow-indigo-500/20 shrink-0">
                                Next
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 text-sky-500 rounded-2xl flex items-center justify-center mb-6 shrink-0">
                                <Play size={32} fill="currentColor" />
                            </div>
                            <h2 className="text-3xl font-black mb-3">Track Every Moment</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed flex-1">
                                Use the quick-tap milestone buttons to log ROM, Crowning, First Cry, and Placenta delivery. Start the Head Out and Body Out timers to instantly track the progression of the delivery.
                            </p>
                            <button onClick={() => setStep(3)} className="mt-auto w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg transition-all active:scale-95 shadow-lg shadow-indigo-500/20 shrink-0">
                                Next
                            </button>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-2xl flex items-center justify-center mb-6 shrink-0">
                                <Activity size={32} />
                            </div>
                            <h2 className="text-3xl font-black mb-3">Automated Prompts</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed flex-1">
                                Once the 'Body Out' timer is started, the app automatically tracks your 1-minute and 5-minute APGAR intervals. It will prompt you with voice announcements, chimes, and screen flashes when it's time to log the scores.
                            </p>
                            <button onClick={() => setStep(4)} className="mt-auto w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg transition-all active:scale-95 shadow-lg shadow-indigo-500/20 shrink-0">
                                Next
                            </button>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-2xl flex items-center justify-center mb-6 shrink-0">
                                <BookOpen size={32} />
                            </div>
                            <h2 className="text-3xl font-black mb-3">Ephemeral Data</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-4">
                                This app operates strictly as a local scratchpad. It <b>never</b> connects to the cloud, guaranteeing <b>complete privacy</b> for you and your patients.
                            </p>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700 flex-1">
                                All records are stored directly on this physical device. If you clear your browser data or delete the app, the history is permanently destroyed.
                            </div>
                            <button onClick={() => setStep(5)} className="mt-auto w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg transition-all active:scale-95 shadow-lg shadow-indigo-500/20 shrink-0">
                                Next
                            </button>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-2xl flex items-center justify-center mb-4 shrink-0">
                                <ShieldAlert size={32} />
                            </div>
                            <h2 className="text-2xl font-black mb-3">Terms & Medical Disclaimer</h2>
                            <div className="flex-1 overflow-y-auto pr-2 mb-4 text-[13px] sm:text-sm text-slate-500 dark:text-slate-400 space-y-3 font-medium">
                                <p>By using this application, you acknowledge and agree to the following:</p>
                                <ul className="list-disc pl-6 ml-2 space-y-2 text-rose-600/80 dark:text-rose-400/80 font-bold">
                                    <li>This is a temporal logging tool, NOT a diagnostic medical device.</li>
                                    <li>This application does not provide medical advice, diagnosis, or treatment.</li>
                                    <li>You assume full responsibility for all medical decisions, timing verifications, and official hospital charting.</li>
                                </ul>
                            </div>
                            <button onClick={completeTutorial} className="mt-auto w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg transition-all active:scale-95 flex justify-center items-center gap-2 shadow-lg shadow-indigo-500/20 shrink-0">
                                <CheckCircle2 size={24} /> I Agree & Understand
                            </button>
                        </div>
                    )}
                </div>

                {/* Dots indicator */}
                <div className="absolute bottom-5 inset-x-0 flex justify-center gap-2">
                    {Array.from({ length: totalSteps }).map((_, idx) => (
                        <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${step === idx + 1 ? 'w-6 bg-indigo-500' : 'w-1.5 bg-slate-200 dark:bg-slate-700'}`} />
                    ))}
                </div>

            </div>
        </div>
    );
};