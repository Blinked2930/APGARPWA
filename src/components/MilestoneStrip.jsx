import React, { useState } from 'react';
import { useAppContext } from '../context/AppProvider';
import { AlertTriangle } from 'lucide-react';

export const MilestoneStrip = () => {
    const { milestones, toggleMilestone } = useAppContext();
    const [confirmModal, setConfirmModal] = useState({ isOpen: false, btn: null });

    const buttons = [
        { id: 'rom', label: 'ROM', icon: '💧' },
        { id: 'crown', label: 'Crown', icon: '👑' },
        { id: 'firstCry', label: 'First Cry', icon: '🗣️' },
        { id: 'placenta', label: 'Placenta', icon: '🩸' }
    ];

    const formatTime = (ts) => {
        const d = new Date(ts);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const handleToggle = (btn) => {
        const isRecorded = !!milestones[btn.id];
        
        if (isRecorded) {
            // Open the custom modal instead of the native window.confirm
            setConfirmModal({ isOpen: true, btn });
        } else {
            // If it's empty, just record it immediately
            toggleMilestone(btn.id);
        }
    };

    const executeClear = () => {
        if (confirmModal.btn) {
            toggleMilestone(confirmModal.btn.id);
        }
        setConfirmModal({ isOpen: false, btn: null });
    };

    return (
        <>
            <div className="w-full flex flex-wrap justify-center gap-2 mt-2 mb-2 px-1">
                {buttons.map(btn => {
                    const isRecorded = !!milestones[btn.id];
                    return (
                        <button
                            key={btn.id}
                            onClick={() => handleToggle(btn)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 touch-manipulation border ${
                                isRecorded 
                                ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 shadow-sm'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                            }`}
                        >
                            <span>{btn.icon}</span>
                            <span>{btn.label}</span>
                            {isRecorded && (
                                <span className="ml-1 px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 rounded text-xs opacity-90">
                                    {formatTime(milestones[btn.id])}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Custom Confirmation Modal */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 sm:p-8 max-w-sm w-full shadow-2xl relative overflow-hidden border border-slate-100 dark:border-slate-800">
                        <div className="flex flex-col items-center text-center gap-3 sm:gap-4 relative z-10">
                            
                            <div className="bg-rose-100 dark:bg-rose-900/30 p-3 sm:p-4 rounded-full text-rose-500 dark:text-rose-400 mb-2">
                                <AlertTriangle size={32} strokeWidth={2.5} />
                            </div>

                            <h3 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100">
                                Clear {confirmModal.btn?.label}?
                            </h3>
                            
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-2 sm:mb-4">
                                Are you sure you want to remove the recorded time for this milestone?
                            </p>

                            <div className="flex flex-col gap-2.5 w-full">
                                <button 
                                    onClick={executeClear} 
                                    className="w-full py-3.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-base shadow-lg shadow-rose-500/30 transition-all active:scale-95 touch-manipulation"
                                >
                                    Yes, Clear it
                                </button>
                                <button 
                                    onClick={() => setConfirmModal({ isOpen: false, btn: null })} 
                                    className="w-full py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                            
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};