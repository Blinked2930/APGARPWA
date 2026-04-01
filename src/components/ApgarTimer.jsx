import React, { useEffect, useState, useRef } from 'react';
import { useAppContext } from '../context/AppProvider';
import { Clock } from 'lucide-react';

export const ApgarTimer = () => {
    const { bodyOutTimes, apgar1MinParams, apgar5MinParams } = useAppContext();
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
    const target1 = 60 * 1000;
    const progress1 = Math.min((elapsed / target1) * 100, 100);
    const is1MinDone = apgar1MinParams;

    // 5 Min tracker
    const target5 = 300 * 1000;
    const progress5 = Math.min((elapsed / target5) * 100, 100);
    const is5MinDone = apgar5MinParams;

    const formatCountdown = (targetMs, currentMs, isDone) => {
        if (isDone) return 'Completed';
        const remaining = Math.max(0, Math.ceil((targetMs - currentMs) / 1000));
        const m = Math.floor(remaining / 60);
        const s = remaining % 60;
        return `in ${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="w-full bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 flex flex-col gap-6 mt-4">
            <h3 className="text-xl font-bold flex items-center gap-2 text-slate-800 dark:text-slate-100">
                <Clock className="text-violet-500" strokeWidth={2.5} /> 
                APGAR Countdown
            </h3>
            
            <div className="space-y-5">
                {/* 1 min row */}
                <div className="flex flex-col gap-2 relative">
                    <div className="flex justify-between items-end">
                        <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-sm text-sm">1-Minute</span>
                        <span className={`font-black text-xl tracking-tighter ${is1MinDone ? 'text-emerald-500' : 'text-violet-500'}`}>
                            {formatCountdown(target1, elapsed, is1MinDone)}
                        </span>
                    </div>
                    <div className="h-5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner flex relative">
                        <div 
                           className={`h-full rounded-full transition-all duration-300 ease-linear ${is1MinDone ? 'bg-gradient-to-r from-emerald-400 to-green-500' : (progress1 > 80 ? 'bg-gradient-to-r from-orange-400 to-rose-500' : 'bg-gradient-to-r from-violet-400 to-purple-500')}`}
                           style={{ width: `${progress1}%` }}
                        />
                    </div>
                </div>

                {/* 5 min row */}
                <div className="flex flex-col gap-2 relative">
                    <div className="flex justify-between items-end">
                        <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-sm text-sm">5-Minute</span>
                        <span className={`font-black text-xl tracking-tighter ${is5MinDone ? 'text-emerald-500' : 'text-blue-500'}`}>
                            {formatCountdown(target5, elapsed, is5MinDone)}
                        </span>
                    </div>
                    <div className="h-5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner flex relative">
                        <div 
                           className={`h-full rounded-full transition-all duration-300 ease-linear ${is5MinDone ? 'bg-gradient-to-r from-emerald-400 to-green-500' : 'bg-gradient-to-r from-cyan-400 to-blue-500'}`}
                           style={{ width: `${progress5}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
