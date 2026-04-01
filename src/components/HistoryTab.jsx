import React from 'react';
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { format } from "date-fns";
import { CalendarDays, CloudOff, Cloud, CheckCircle2 } from "lucide-react";

export const HistoryTab = () => {
  const cloudSessions = useQuery(api.sessions.getSessions) || [];
  
  // Also get the offline queue from localStorage
  const queueStr = localStorage.getItem('offlineQueue');
  const offlineSessions = queueStr ? JSON.parse(queueStr) : [];

  const formatDuration = (start, end) => {
    if (!start || !end) return 'N/A';
    const totalSecs = Math.floor((end - start) / 1000);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m}m ${s}s`;
  };

  const SessionCard = ({ session, isOffline }) => {
    const dateObj = new Date(session.deliveryStartTime);
    const dateFormatted = format(dateObj, "MMM do, yyyy");
    const timeFormatted = format(dateObj, "h:mm a");
    
    return (
      <div className={`p-5 rounded-3xl shadow-sm border-2 ${isOffline ? 'bg-amber-50/50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800' : 'bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700'} mb-4 relative overflow-hidden`}>
        {isOffline && (
          <div className="absolute top-0 right-0 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1 uppercase tracking-wider">
            <CloudOff size={12} /> Pending Sync
          </div>
        )}
        
        <div className="flex justify-between items-start mb-4 mt-2">
          <div>
            <div className="font-black text-xl text-slate-800 dark:text-slate-100">{dateFormatted}</div>
            <div className="text-slate-500 font-medium text-sm">{timeFormatted}</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Time</div>
            <div className="font-black text-emerald-600 dark:text-emerald-400 text-lg">
              {formatDuration(session.deliveryStartTime, session.apgar5MinParams?.timeCompleted)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 flex flex-col justify-center items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">1-Min Score</span>
            <span className="text-2xl font-black text-violet-600 dark:text-violet-400">
               {session.apgar1MinParams?.total}/10
            </span>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-3 flex flex-col justify-center items-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">5-Min Score</span>
            <span className="text-2xl font-black text-sky-600 dark:text-sky-400">
               {session.apgar5MinParams?.total}/10
            </span>
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
         <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
           <Cloud size={14} className="text-emerald-500" /> Synced
         </div>
       </div>

       {offlineSessions.length > 0 && (
         <div className="mb-6">
           {offlineSessions.map((s, i) => <SessionCard key={`off-${i}`} session={s} isOffline={true} />)}
         </div>
       )}

       {cloudSessions.length === 0 && offlineSessions.length === 0 ? (
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
