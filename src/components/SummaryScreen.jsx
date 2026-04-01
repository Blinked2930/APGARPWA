import React from 'react';
import { useAppContext } from '../context/AppProvider';
import { FileText, RefreshCcw } from 'lucide-react';

export const SummaryScreen = () => {
    const { deliveryStartTime, bodyOutTimes, apgar1MinParams, apgar5MinParams, stopDelivery } = useAppContext();

    if (!deliveryStartTime) return null;

    const formatTimestamp = (ts) => {
        if (!ts) return 'N/A';
        const d = new Date(ts);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const formatDuration = (ms) => {
        if (!ms) return 'N/A';
        const totalSecs = Math.floor(ms / 1000);
        const m = Math.floor(totalSecs / 60);
        const s = totalSecs % 60;
        return `${m}m ${s}s`;
    };

    return (
        <div className="w-full mt-8 p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border-2 border-slate-100 dark:border-slate-700 overflow-hidden">
            <h3 className="text-2xl font-black mb-6 flex items-center justify-center gap-2 text-slate-800 dark:text-slate-100">
                <FileText className="text-sky-500" strokeWidth={2.5}/> Birth Summary
            </h3>
            
            <div className="space-y-4 text-lg">
                <div className="flex flex-col sm:flex-row justify-between bg-slate-50 dark:bg-slate-700/50 p-5 rounded-2xl items-start sm:items-center">
                    <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-xs mb-1 sm:mb-0">Timer Started</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatTimestamp(deliveryStartTime)}</span>
                </div>
                
                {bodyOutTimes.map((ts, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row justify-between bg-rose-50 dark:bg-rose-900/10 p-5 rounded-2xl text-rose-600 dark:text-rose-400 items-start sm:items-center">
                        <span className="font-bold flex items-center gap-2 uppercase tracking-wider text-xs mb-2 sm:mb-0">
                            Baby Out {idx > 0 ? `(${idx + 1})` : ''}
                        </span>
                        <span className="font-black flex flex-wrap gap-3 sm:justify-end text-[1.1rem]">
                            <span className="bg-rose-100 dark:bg-rose-900/40 px-3 rounded-lg text-rose-500">+{formatDuration(ts - deliveryStartTime)}</span>
                            <span>{formatTimestamp(ts)}</span>
                        </span>
                    </div>
                ))}

                {apgar1MinParams && (
                    <div className="flex flex-col sm:flex-row justify-between bg-violet-50 dark:bg-violet-900/10 p-5 rounded-2xl items-start sm:items-center">
                        <span className="font-bold text-violet-800 dark:text-violet-300 uppercase tracking-wider text-xs mb-4 sm:mb-0">1-Min APGAR</span>
                        <div className="text-left sm:text-right">
                            <div className="font-black text-3xl text-violet-600 dark:text-violet-400 mb-1">Score: {apgar1MinParams.total}/10</div>
                            <div className="text-sm text-violet-500/70 dark:text-violet-300/60 font-medium">Logged at: {formatTimestamp(apgar1MinParams.timeCompleted)}</div>
                        </div>
                    </div>
                )}

                {apgar5MinParams && (
                    <div className="flex flex-col sm:flex-row justify-between bg-sky-50 dark:bg-sky-900/10 p-5 rounded-2xl items-start sm:items-center">
                        <span className="font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider text-xs mb-4 sm:mb-0">5-Min APGAR</span>
                        <div className="text-left sm:text-right">
                            <div className="font-black text-3xl text-sky-600 dark:text-sky-400 mb-1">Score: {apgar5MinParams.total}/10</div>
                            <div className="text-sm text-sky-500/70 dark:text-sky-300/60 font-medium">Logged at: {formatTimestamp(apgar5MinParams.timeCompleted)}</div>
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 font-semibold">
                <button 
                  onClick={stopDelivery}
                  className="w-full py-5 text-lg text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition-all flex items-center justify-center gap-2 active:scale-95 touch-manipulation font-bold"
                >
                  <RefreshCcw size={20} />
                  RESET EVERYTHING
                </button>
            </div>
        </div>
    );
};
