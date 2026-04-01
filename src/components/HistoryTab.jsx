import React, { useState } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { format } from "date-fns";
import { CalendarDays, CloudOff, Cloud, CheckCircle2, Trash2, AlertTriangle } from "lucide-react";

export const HistoryTab = () => {
  const cloudSessions = useQuery(api.sessions.getSessions) || [];
  const deleteAllSessions = useMutation(api.sessions.deleteAllSessions);
  const [showConfirm, setShowConfirm] = useState(false);

  // Also get the offline queue from localStorage
  const queueStr = localStorage.getItem('offlineQueue');
  const offlineSessions = queueStr ? JSON.parse(queueStr) : [];
  const [localQueue, setLocalQueue] = useState(offlineSessions);

  const handleDeleteAll = async () => {
    // Delete offline
    localStorage.removeItem('offlineQueue');
    setLocalQueue([]);
    
    // Delete cloud
    if (cloudSessions.length > 0) {
      await deleteAllSessions();
    }
    
    setShowConfirm(false);
  };

  const formatDuration = (start, end) => {
    if (!start || !end) return 'N/A';
    const totalSecs = Math.floor((end - start) / 1000);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}m ${s}s`;
  };

  const getTimezoneBadge = (tz) => {
    try {
      const options = { timeZoneName: 'short' };
      if (tz) options.timeZone = tz;
      const formatted = new Date().toLocaleTimeString('en-us', options).split(' ').pop();
      return <span className="text-[10px] bg-slate-200/50 dark:bg-slate-700 text-slate-500 rounded px-1 ml-1">{formatted}</span>;
    } catch (e) {
      return null;
    }
  };

  const formatTimeWithTz = (ts, tz) => {
    if (!ts) return '';
    try {
      const options = { hour: 'numeric', minute: '2-digit' };
      if (tz) options.timeZone = tz;
      return new Date(ts).toLocaleTimeString('en-us', options);
    } catch(e) {
      return format(new Date(ts), "h:mm a");
    }
  };

  const SessionCard = ({ session, isOffline }) => {
    const [expanded, setExpanded] = useState(false);
    const dateObj = new Date(session.deliveryStartTime);
    const dateFormatted = format(dateObj, "MMM do, yyyy");
    const tz = session.recordedTimeZone;

    // Head Out specific tracking
    const headOutTime = formatTimeWithTz(session.deliveryStartTime, tz);

    // Body Out tracking
    const bodyOutMs = session.bodyOutTimes && session.bodyOutTimes.length > 0 ? session.bodyOutTimes[0] : null;
    const bodyOutTime = bodyOutMs ? formatTimeWithTz(bodyOutMs, tz) : null;
    const headToBodyDuration = bodyOutMs ? formatDuration(session.deliveryStartTime, bodyOutMs) : null;

    const renderScores = (params) => {
      if (!params || params.skipped || !params.scores) return null;
      const s = params.scores;
      return (
        <div className="flex flex-col gap-0.5 mt-2 w-full text-[10px] text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 p-2 rounded-xl">
          <div className="flex justify-between w-full"><span>Color:</span><span className="font-bold">{s.appearance}</span></div>
          <div className="flex justify-between w-full"><span>Pulse:</span><span className="font-bold">{s.pulse}</span></div>
          <div className="flex justify-between w-full"><span>Grimace:</span><span className="font-bold">{s.grimace}</span></div>
          <div className="flex justify-between w-full"><span>Tone:</span><span className="font-bold">{s.activity}</span></div>
          <div className="flex justify-between w-full"><span>Breathing:</span><span className="font-bold">{s.respiration}</span></div>
        </div>
      );
    };

    return (
      <div className={`p-5 rounded-3xl shadow-sm border-2 ${isOffline ? 'bg-amber-50/50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800' : 'bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700'} mb-4 relative overflow-hidden`}>
        {isOffline && (
          <div className="absolute top-0 right-0 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1 uppercase tracking-wider">
            <CloudOff size={12} /> Pending Sync
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 mt-2 gap-4">
          <div>
            <div className="font-black text-xl text-slate-800 dark:text-slate-100">{dateFormatted}</div>

            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest w-20">Head Out:</span>
                <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center">
                  {headOutTime} {getTimezoneBadge(tz)}
                </span>
              </div>
              {bodyOutTime && (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest w-20">Body Out:</span>
                  <span className="text-slate-700 dark:text-slate-300 font-semibold flex items-center gap-2">
                    <span className="flex items-center">{bodyOutTime} {getTimezoneBadge(tz)}</span>
                    <span className="bg-rose-100 dark:bg-rose-900/30 text-rose-500 text-[10px] px-2 py-0.5 rounded-md">
                      +{headToBodyDuration}
                    </span>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="text-left sm:text-right bg-slate-50 dark:bg-slate-900/30 p-3 rounded-2xl w-full sm:w-auto">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Delivery</div>
            <div className="font-black text-emerald-600 dark:text-emerald-400 text-lg">
              {formatDuration(session.deliveryStartTime, session.apgar5MinParams?.timeCompleted)}
            </div>
          </div>
        </div>

        <div 
          className="grid grid-cols-2 gap-3 cursor-pointer" 
          onClick={() => setExpanded(!expanded)}
          title="Click to toggle full APGAR scores"
        >
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 flex flex-col justify-start items-center h-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">1-Min Score</span>
            <span className="text-2xl font-black text-violet-600 dark:text-violet-400">
              {session.apgar1MinParams?.skipped ? 'Skipped' : `${session.apgar1MinParams?.total ?? '?'}/10`}
            </span>
            {expanded && renderScores(session.apgar1MinParams)}
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 flex flex-col justify-start items-center h-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">5-Min Score</span>
            <span className="text-2xl font-black text-sky-600 dark:text-sky-400">
              {session.apgar5MinParams?.skipped ? 'Skipped' : `${session.apgar5MinParams?.total ?? '?'}/10`}
            </span>
            {expanded && renderScores(session.apgar5MinParams)}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 pb-32">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
          <CalendarDays className="text-indigo-500" size={32} />
          History
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
            <Cloud size={14} className="text-emerald-500" /> Synced
          </div>
          {(cloudSessions.length > 0 || localQueue.length > 0) && (
            <button 
              onClick={() => setShowConfirm(true)}
              className="bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 p-2 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="flex flex-col items-center text-center gap-4 relative z-10">
              <div className="bg-rose-100 dark:bg-rose-900/30 p-4 rounded-full text-rose-500 dark:text-rose-400 mb-2">
                <AlertTriangle size={40} strokeWidth={2.5} />
              </div>
              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">Clear History?</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-4">
                This will permanently delete all recorded birth sessions from this device and the cloud. This cannot be undone.
              </p>
              
              <div className="flex flex-col gap-3 w-full">
                <button 
                  onClick={handleDeleteAll}
                  className="w-full py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-lg shadow-lg shadow-rose-500/30 transition-all active:scale-95 touch-manipulation"
                >
                  Yes, Delete All
                </button>
                <button 
                  onClick={() => setShowConfirm(false)}
                  className="w-full py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {localQueue.length > 0 && (
        <div className="mb-6">
          {localQueue.map((s, i) => <SessionCard key={`off-${i}`} session={s} isOffline={true} />)}
        </div>
      )}

      {cloudSessions.length === 0 && localQueue.length === 0 ? (
        <div className="text-center p-12 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border border-slate-100 dark:border-slate-800 mt-4">
          <CheckCircle2 size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="font-bold text-slate-500">No birth sessions recorded yet.</p>
        </div>
      ) : (
        <div>
          {cloudSessions.map((s, i) => <SessionCard key={s._id || i} session={s} isOffline={false} />)}
        </div>
      )}
    </div>
  );
};
