import React from 'react';
import { useAppContext } from '../context/AppProvider';
import { FileText, Edit2, CheckCircle2 } from 'lucide-react'; // Updated Icon

export const SummaryScreen = () => {
    const { recordedTimeZone, deliveryStartTime, bodyOutTimes, apgar1MinParams, apgar5MinParams, milestones, stopDelivery, openApgarModal } = useAppContext();

    if (!deliveryStartTime) return null;

    const formatTimestamp = (ts) => {
        if (!ts) return '';
        const d = new Date(ts);
        const options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        if (recordedTimeZone) options.timeZone = recordedTimeZone;
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

    const getScoreTitle = (params) => {
        if (params.skipped) return 'Skipped';
        if (params.inProgress) return 'In Progress';
        return `${params.total}/10`;
    };

    const getColorClass1 = (params) => params.skipped ? 'text-slate-400' : params.inProgress ? 'text-amber-500 dark:text-amber-400' : 'text-violet-600 dark:text-violet-400';
    const getColorClass5 = (params) => params.skipped ? 'text-slate-400' : params.inProgress ? 'text-amber-500 dark:text-amber-400' : 'text-sky-600 dark:text-sky-400';

    const MilestoneRow = ({ label, ts, icon }) => {
        if (!ts) return null;
        return (
            <div className="flex flex-col sm:flex-row justify-between bg-emerald-50 dark:bg-emerald-900/10 p-4 sm:p-5 rounded-2xl items-start sm:items-center">
                <span className="font-bold flex items-center gap-2 text-emerald-700 dark:text-emerald-400 uppercase tracking-wider text-xs mb-1 sm:mb-0">
                    <span className="text-base">{icon}</span> {label}
                </span>
                <span className="font-bold text-slate-900 dark:text-white flex items-center">
                    {formatTimestamp(ts)} <TimeZoneBadge />
                </span>
            </div>
        );
    };

    const renderDetailedScores = (params) => {
        if (!params || params.skipped || !params.scores) return null;
        const s = params.scores;
        return (
            <div className="flex flex-col gap-2 mt-5 w-full text-sm text-slate-700 dark:text-slate-200 bg-white/50 dark:bg-slate-900/40 p-4 rounded-2xl border border-white/40 dark:border-slate-700/50 shadow-sm">
                <div className="flex justify-between w-full border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5"><span className="text-slate-500">Color:</span><span className="font-black text-base">{s.appearance ?? '-'}</span></div>
                <div className="flex justify-between w-full border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5"><span className="text-slate-500">Heart Rate:</span><span className="font-black text-base">{s.pulse ?? '-'}</span></div>
                <div className="flex justify-between w-full border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5"><span className="text-slate-500">Reflex:</span><span className="font-black text-base">{s.grimace ?? '-'}</span></div>
                <div className="flex justify-between w-full border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5"><span className="text-slate-500">Tone:</span><span className="font-black text-base">{s.activity ?? '-'}</span></div>
                <div className="flex justify-between w-full pt-1.5"><span className="text-slate-500">Breathing:</span><span className="font-black text-base">{s.respiration ?? '-'}</span></div>
            </div>
        );
    };

    return (
        <div className="w-full mt-8 p-6 sm:p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border-2 border-slate-100 dark:border-slate-700 overflow-hidden relative z-10">
            <h3 className="text-2xl font-black mb-6 flex items-center justify-center gap-2 text-slate-800 dark:text-slate-100">
                <FileText className="text-sky-500" strokeWidth={2.5} /> Birth Summary
            </h3>

            <div className="space-y-4 text-lg">
                <MilestoneRow label="ROM (Membranes Ruptured)" ts={milestones.rom} icon="💧" />
                <MilestoneRow label="Crowning" ts={milestones.crown} icon="👑" />

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

                <MilestoneRow label="First Cry" ts={milestones.firstCry} icon="🗣️" />
                <MilestoneRow label="Placenta Delivered" ts={milestones.placenta} icon="🩸" />

                {apgar1MinParams && (
                    <div className="flex flex-col bg-violet-50 dark:bg-violet-900/10 p-5 sm:p-6 rounded-3xl relative">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
                            <span className="font-bold text-violet-800 dark:text-violet-300 uppercase tracking-wider text-xs mb-4 sm:mb-0">1-Min APGAR</span>
                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                <div className="text-left sm:text-right">
                                    <div className={`font-black text-5xl sm:text-6xl mb-1 tracking-tight ${getColorClass1(apgar1MinParams)}`}>{getScoreTitle(apgar1MinParams)}</div>
                                    <div className="text-xs sm:text-sm text-violet-500/70 font-medium flex items-center justify-start sm:justify-end">
                                        Logged: {formatTimestamp(apgar1MinParams.timeCompleted)}
                                    </div>
                                </div>
                                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); openApgarModal(1); }} className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-violet-600 transition-colors self-start sm:self-center"><Edit2 size={20} /></button>
                            </div>
                        </div>
                        {renderDetailedScores(apgar1MinParams)}
                    </div>
                )}

                {apgar5MinParams && (
                    <div className="flex flex-col bg-sky-50 dark:bg-sky-900/10 p-5 sm:p-6 rounded-3xl relative">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full">
                            <span className="font-bold text-sky-800 dark:text-sky-300 uppercase tracking-wider text-xs mb-4 sm:mb-0">5-Min APGAR</span>
                            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                                <div className="text-left sm:text-right">
                                    <div className={`font-black text-5xl sm:text-6xl mb-1 tracking-tight ${getColorClass5(apgar5MinParams)}`}>{getScoreTitle(apgar5MinParams)}</div>
                                    <div className="text-xs sm:text-sm text-sky-500/70 font-medium flex items-center justify-start sm:justify-end">
                                        Logged: {formatTimestamp(apgar5MinParams.timeCompleted)}
                                    </div>
                                </div>
                                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); openApgarModal(5); }} className="p-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-sky-600 transition-colors self-start sm:self-center"><Edit2 size={20} /></button>
                            </div>
                        </div>
                        {renderDetailedScores(apgar5MinParams)}
                    </div>
                )}
            </div>

            {/* FIX: This button now passes 'true' to stopDelivery to force the sync to Convex! */}
            <button
                onClick={() => stopDelivery(true)}
                className="mt-8 w-full py-5 rounded-[2rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xl flex justify-center items-center gap-3 transition-all active:scale-95 touch-manipulation shadow-xl shadow-indigo-500/20"
            >
                <CheckCircle2 size={26} /> SAVE TO HISTORY & FINISH
            </button>
        </div>
    );
};