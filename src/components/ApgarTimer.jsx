import React, { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../context/AppProvider';
import { Clock, Edit2, Plus, Clock3 } from 'lucide-react';

const StatusBadge = ({ interval, params, openApgarModal }) => {
    if (!params) return null;

    const isInProgress = params.inProgress;
    const isSkipped = params.skipped;

    return (
        <button
            onPointerDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openApgarModal(interval);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100/50 hover:bg-slate-200/50 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-xl transition-colors font-bold text-xs uppercase tracking-wider border border-slate-200 dark:border-slate-700 relative z-50"
        >
            {isInProgress ? <Clock3 size={14} className="text-amber-500" /> : isSkipped ? <Plus size={14} /> : <Edit2 size={14} />}
            {isInProgress ? 'Resume' : isSkipped ? 'Enter' : 'Edit'}
        </button>
    );
};

export const ApgarTimer = () => {
    const { bodyOutTimes, apgar1MinParams, apgar5MinParams, openApgarModal } = useAppContext();
    const [elapsed, setElapsed] = useState(0);
    const rafRef = useRef(null);

    useEffect(() => {
        if (bodyOutTimes.length === 0) {
            setElapsed(0);
            return;
        }

        const firstBodyOut = bodyOutTimes[0];

        const tick = () => {
            setElapsed(Date.now() - firstBodyOut);
            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [bodyOutTimes]);

    if (bodyOutTimes.length === 0) return null;

    // 1 Min tracker
    const target1 = 5 * 1000;
    const progress1 = Math.min((elapsed / target1) * 100, 100);
    const is1MinStarted = !!apgar1MinParams;

    // 5 Min tracker
    const target5 = 15 * 1000;
    const progress5 = Math.min((elapsed / target5) * 100, 100);
    const is5MinStarted = !!apgar5MinParams;

    const formatStatus = (targetMs, currentMs, params) => {
        if (!params) {
            const remaining = Math.max(0, Math.ceil((targetMs - currentMs) / 1000));
            const m = Math.floor(remaining / 60);
            const s = remaining % 60;
            return `in ${m}:${s.toString().padStart(2, '0')}`;
        }

        if (params.skipped) return 'Skipped';
        if (params.inProgress) return 'In Progress';
        return 'Completed';
    };

    const getTextColor = (params) => {
        if (!params) return 'text-slate-800 dark:text-slate-200';
        if (params.skipped) return 'text-slate-400';
        if (params.inProgress) return 'text-amber-500 dark:text-amber-400';
        return 'text-indigo-600 dark:text-indigo-400';
    };

    const getBarColor = (params) => {
        if (!params) return 'bg-slate-800 dark:bg-slate-400';
        if (params.skipped) return 'bg-slate-400';
        if (params.inProgress) return 'bg-amber-400';
        return 'bg-indigo-500';
    };

    return (
        <div className="w-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl shadow-slate-200/40 dark:shadow-none border border-white/50 dark:border-slate-700/50 flex flex-col gap-6 mt-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-400/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <h3 className="text-lg font-black flex items-center gap-2 text-slate-800 dark:text-slate-100 uppercase tracking-widest relative z-10">
                <Clock className="text-indigo-500" strokeWidth={3} size={20} />
                APGAR
            </h3>

            <div className="space-y-6 relative z-10">
                {/* 1 min row */}
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[0.65rem]">1-Minute</span>
                            <span className={`font-black text-xl tracking-tighter ${getTextColor(apgar1MinParams)}`}>
                                {formatStatus(target1, elapsed, apgar1MinParams)}
                            </span>
                        </div>
                        <StatusBadge interval={1} params={apgar1MinParams} openApgarModal={openApgarModal} />
                    </div>
                    <div className="h-4 w-full bg-slate-200/50 dark:bg-slate-900/50 rounded-full overflow-hidden flex relative border border-slate-200 dark:border-slate-800">
                        <div
                            className={`h-full rounded-full transition-all duration-300 ease-linear ${getBarColor(apgar1MinParams)}`}
                            style={{ width: `${progress1}%` }}
                        />
                    </div>
                </div>

                {/* 5 min row */}
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-[0.65rem]">5-Minute</span>
                            <span className={`font-black text-xl tracking-tighter ${getTextColor(apgar5MinParams)}`}>
                                {formatStatus(target5, elapsed, apgar5MinParams)}
                            </span>
                        </div>
                        <StatusBadge interval={5} params={apgar5MinParams} openApgarModal={openApgarModal} />
                    </div>
                    <div className="h-4 w-full bg-slate-200/50 dark:bg-slate-900/50 rounded-full overflow-hidden flex relative border border-slate-200 dark:border-slate-800">
                        <div
                            className={`h-full rounded-full transition-all duration-300 ease-linear ${getBarColor(apgar5MinParams)}`}
                            style={{ width: `${progress5}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};