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

            {/* Hardened fixed-height container (h-[550px]) with justify-between forces buttons to the bottom */}
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 pb-14 shadow-2xl border border-slate-100 dark:border-slate-800 relative z-10 flex flex-col justify-between h-[550px]">
                
                {/* Top Content Area */}
                <div className="w-full">
                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 rounded-2xl flex items-center justify-center mb-6">
                                <Clock size={32} />
                            </div>
                            <h2 className="text-3xl font-black mb-3">Welcome to BirthTimer</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                A completely offline, distraction-free tool designed to help you track APGAR intervals and delivery milestones in real-time.
                            </p>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="w-16 h-16 bg-sky-100 dark:bg-sky-900/30 text-sky-500 rounded-2xl flex items-center justify-center mb-6">
                                <Play size={32} fill="currentColor" />
                            </div>
                            <h2 className="text-3xl font-black mb-3">Track Every Moment</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                Use the quick-tap milestone buttons to log ROM, Crowning, First Cry, and Placenta delivery. Start the Head Out and Body Out timers to instantly track the progression of the delivery.
                            </p>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-2xl flex items-center justify-center mb-6">
                                <Activity size={32} />
                            </div>
                            <h2 className="text-3xl font-black mb-3">Automated Prompts</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                Once the 'Body Out' timer is started, the app automatically tracks your 1-minute and 5-minute APGAR intervals. It will prompt you with voice announcements, chimes, and screen flashes when it's time to log the scores.
                            </p>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 rounded-2xl flex items-center justify-center mb-6">
                                <BookOpen size={32} />
                            </div>
                            <h2 className="text-3xl font-black mb-3">Ephemeral Data</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-4">
                                This app operates strictly as a local scratchpad. It <b>never</b> connects to the cloud, guaranteeing <b>complete privacy</b> for you and your patients.
                            </p>
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl text-[13px] font-medium text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                                All records are stored directly on this physical device. If you clear your browser data or delete the app, the history is permanently destroyed.
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-500 rounded-2xl flex items-center justify-center mb-4">
                                <ShieldAlert size={32} />
                            </div>
                            <h2 className="text-2xl font-black mb-3">Terms & Medical Disclaimer</h2>
                            <div className="text-[13px] sm:text-sm text-slate-500 dark:text-slate-400 space-y-3 font-medium">
                                <p>By using this application, you acknowledge and agree to the following:</p>
                                <ul className="list-disc pl-6 ml-2 space-y-2 text-rose-600/80 dark:text-rose-400/80 font-bold">
                                    <li>This is a temporal logging tool, NOT a diagnostic medical device.</li>
                                    <li>This application does not provide medical advice, diagnosis, or treatment.</li>
                                    <li>You assume full responsibility for all medical decisions, timing verifications, and official hospital charting.</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Navigation Buttons (Guaranteed to stick to the bottom) */}
                <div className="w-full flex items-center gap-3 relative z-20">
                    {step > 1 && (
                        <button 
                            onClick={() => setStep(step - 1)} 
                            className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold transition-all active:scale-95 shrink-0 shadow-sm"
                            aria-label="Go Back"
                        >
                            <ChevronLeft size={24} strokeWidth={2.5} className="-ml-0.5" />
                        </button>
                    )}
                    
                    {step < totalSteps ? (
                        <button 
                            onClick={() => setStep(step + 1)} 
                            className="flex-1 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                        >
                            Next
                        </button>
                    ) : (
                        <button 
                            onClick={completeTutorial} 
                            className="flex-1 h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg transition-all active:scale-95 flex justify-center items-center gap-2 shadow-lg shadow-indigo-500/20"
                        >
                            <CheckCircle2 size={22} /> I Agree
                        </button>
                    )}
                </div>

                {/* Dots indicator */}
                <div className="absolute bottom-5 inset-x-0 flex justify-center gap-2 pointer-events-none">
                    {Array.from({ length: totalSteps }).map((_, idx) => (
                        <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${step === idx + 1 ? 'w-6 bg-indigo-500' : 'w-1.5 bg-slate-200 dark:bg-slate-700'}`} />
                    ))}
                </div>

            </div>
        </div>
    );
};