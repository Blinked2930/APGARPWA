import React from 'react';
import { useAppContext } from '../context/AppProvider';

export const MilestoneStrip = () => {
    const { milestones, toggleMilestone } = useAppContext();

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

    return (
        <div className="w-full flex flex-wrap justify-center gap-2 mt-2 mb-2 px-1">
            {buttons.map(btn => {
                const isRecorded = !!milestones[btn.id];
                return (
                    <button
                        key={btn.id}
                        onClick={() => toggleMilestone(btn.id)}
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
    );
};