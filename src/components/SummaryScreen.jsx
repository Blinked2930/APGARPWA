import React from 'react';
import { useAppContext } from '../context/AppProvider';
import { FileText, RotateCcw, Edit2 } from 'lucide-react';

export const SummaryScreen = () => {
    const { recordedTimeZone, deliveryStartTime, bodyOutTimes, apgar1MinParams, apgar5MinParams, stopDelivery, openApgarModal } = useAppContext();

    if (!deliveryStartTime) return null;

    const formatTimestamp = (ts) => {
        if (!ts) return '';
        const d = new Date(ts);
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        if (recordedTimeZone) {
            options.timeZone = recordedTimeZone;
        }
        return d.toLocaleTimeString([], options);
    };

    const TimeZoneBadge = () => {
        let formatted = '';
        try {
            const options = { timeZoneName: 'short' };
            if (recordedTimeZone) options.timeZone = recordedTimeZone;
            formatted = new Date().toLocaleTimeString('en-us', options).split(' ').pop();
        } catch (e) {
            formatted = new Date().toLocaleTimeString('en-us', { timeZoneName: 'short' }).split(' ').pop();
        }
        return <span className="ml-2 text-xs bg-slate-100 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 rounded px-2 py-0.5 font-bold tracking-wider">{formatted}</span>;
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
                <FileText className="text-sky-500" strokeWidth={2.5} /> Birth Summary
            </h3>

            <div className="space-y-4 text-lg">
                <div className="flex flex-col sm:flex-row justify-between bg-slate-50 dark:bg-slate-700/50 p-5 rounded-2xl items-start sm:items-center">
                    <span className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider text-xs mb-1 sm:mb-0">Head Out Logged</span>
                    <span className="font-bold text-slate-900 dark:text-white flex items-center">
                      {formatTimestamp(deliveryStartTime)} <TimeZoneBadge />
                    </span>
                </div>

                {bodyOutTimes.map((ts, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row justify-between bg-rose-50 dark:bg-rose-900/10 p-5 rounded-2xl text-rose-600 dark:text-rose-400 items-start sm:items-center">
                        <span className="font-bold flex items-center gap-2 uppercase tracking-wider text-xs mb-2 sm:mb-0">
                            Baby Out {idx > 0 ? `(${idx + 1})` : ''}
                        </span>
                        <span className="font-black flex flex-wrap items-center gap-3 sm:justify-end text-[1.1rem]">
                            <span className="bg-rose-100 dark:bg-rose-900/40 px-3 rounded-lg text-rose-500">+{formatDuration(ts - deliveryStartTime)}</span>
                            <span className="flex items-center">{formatTimestamp(ts)} <TimeZoneBadge /></span>
                        </span>
                    </div>
                ))}

                {apgar1MinParams && (
                    <div className="flex flex-col sm:flex-row justify-between bg-violet-50 dark:bg-violet-900/10 p-5 rounded-2xl items-start sm:items-center relative">
                        <span className="font-bold text-violet-800 dark:text-violet-300 uppercase tracking-wider text-xs mb-4 sm:mb-0">1-Min APGAR</span>
                        <div className="text-left sm:text-right flex items-center gap-4">
                            <div>
                                <div className="font-black text-3xl text-violet-600 dark:text-violet-400 mb-1">
                                    {apgar1MinParams.skipped ? 'Skipped' : `Score: ${apgar1MinParams.total}/10`}
                                </div>
                                <div className="text-sm text-violet-500/70 dark:text-violet-300/60 font-medium flex items-center">
                                    Logged at: {formatTimestamp(apgar1MinParams.timeCompleted)} <TimeZoneBadge />
                                </div>
                            </div>
                            <button 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); openApgarModal(1); }}
                                className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                            >
                                <Edit2 size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {apgar5MinParams && (
                    <div className="flex flex-col sm:flex-row justify-between bg-sky-50 dark:bg-sky-900/10 p-5 rounded-2xl items-start sm:items-center relative">
                        <span className="font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider text-xs mb-4 sm:mb-0">5-Min APGAR</span>
                        <div className="text-left sm:text-right flex items-center gap-4">
                            <div>
                                <div className="font-black text-3xl text-sky-600 dark:text-sky-400 mb-1">
                                    {apgar5MinParams.skipped ? 'Skipped' : `Score: ${apgar5MinParams.total}/10`}
                                </div>
                                <div className="text-sm text-sky-500/70 dark:text-sky-300/60 font-medium flex items-center">
                                    Logged at: {formatTimestamp(apgar5MinParams.timeCompleted)} <TimeZoneBadge />
                                </div>
                            </div>
                            <button 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); openApgarModal(5); }}
                                className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
                            >
                                <Edit2 size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={stopDelivery}
                className="mt-8 w-full py-5 rounded-[2rem] bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 font-black text-xl flex justify-center items-center gap-2 transition-all active:scale-95 touch-manipulation border border-slate-200 dark:border-slate-600 shadow-sm"
            >
                <RotateCcw size={24} /> Let's Go Again
            </button>
        </div>
    );
};
