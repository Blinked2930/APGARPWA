import React, { useState } from 'react';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { format } from "date-fns";
import { CalendarDays, CloudOff, Cloud, CheckCircle2, Trash2, AlertTriangle, Edit2, Info, Clock, RefreshCw, AlertCircle } from "lucide-react";
import { ApgarModal } from './ApgarModal';
import { useAppContext } from '../context/AppProvider';

// Extracted helper functions
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
    const options = { hour: 'numeric', minute: '2-digit', second: '2-digit' };
    if (tz) options.timeZone = tz;
    return new Date(ts).toLocaleTimeString('en-us', options);
  } catch (e) {
    return format(new Date(ts), "h:mm:ss a");
  }
};

const toDatetimeLocal = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const fromDatetimeLocal = (str) => {
  if (!str) return null;
  return new Date(str).getTime();
};

const EditSessionModal = ({ session, onClose, onSave }) => {
  const [headOut, setHeadOut] = useState(toDatetimeLocal(session.deliveryStartTime));
  const [bodyOut, setBodyOut] = useState(session.bodyOutTimes?.[0] ? toDatetimeLocal(session.bodyOutTimes[0]) : '');

  const handleSubmit = () => {
    const updatedSession = {
      ...session,
      deliveryStartTime: fromDatetimeLocal(headOut) || session.deliveryStartTime,
      bodyOutTimes: bodyOut ? [fromDatetimeLocal(bodyOut)] : []
    };
    onSave(updatedSession);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 max-w-sm w-full shadow-2xl relative overflow-hidden border border-slate-100 dark:border-slate-800">
        <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-6 flex items-center gap-2">
          <Clock className="text-indigo-500" /> Edit Times
        </h3>

        <div className="space-y-5 mb-8">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Head Out Time</label>
            <input
              type="datetime-local"
              value={headOut}
              onChange={(e) => setHeadOut(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-800 dark:text-slate-100 font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Body Out Time (Optional)</label>
            <input
              type="datetime-local"
              value={bodyOut}
              onChange={(e) => setBodyOut(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-slate-800 dark:text-slate-100 font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <button onClick={handleSubmit} className="w-full py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-black text-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-95 touch-manipulation">
            Save Changes
          </button>
          <button onClick={onClose} className="w-full py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold transition-all">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const SessionCard = ({ session, isOffline, index, localQueue, setLocalQueue, deleteSingleSession, setModalState, onEditScore, onFullEdit }) => {
  const [expanded, setExpanded] = useState(false);

  const dateObj = new Date(session.deliveryStartTime);
  const dateFormatted = format(dateObj, "MMM do, yyyy");
  const tz = session.recordedTimeZone;

  const headOutTime = formatTimeWithTz(session.deliveryStartTime, tz);
  const bodyOutMs = session.bodyOutTimes && session.bodyOutTimes.length > 0 ? session.bodyOutTimes[0] : null;
  const bodyOutTime = bodyOutMs ? formatTimeWithTz(bodyOutMs, tz) : null;
  const headToBodyDuration = bodyOutMs ? formatDuration(session.deliveryStartTime, bodyOutMs) : null;

  const handleDelete = () => {
    setModalState({
      isOpen: true,
      type: 'danger',
      title: 'Delete Record?',
      message: 'Are you sure you want to delete this specific birth record? This cannot be undone.',
      onConfirm: async () => {
        if (isOffline) {
          const newQueue = [...localQueue];
          newQueue.splice(index, 1);
          localStorage.setItem('offlineQueue', JSON.stringify(newQueue));
          setLocalQueue(newQueue);
        } else {
          if (deleteSingleSession && session._id) {
            await deleteSingleSession({ id: session._id });
          }
        }
      }
    });
  };

  const renderScores = (params, interval) => {
    if (!params || params.skipped || !params.scores) return null;
    const s = params.scores;
    return (
      <div className="flex flex-col gap-0.5 mt-3 w-full text-[11px] text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-800/80 p-3 rounded-xl shadow-inner border border-slate-100 dark:border-slate-700">
        <div className="flex justify-between w-full border-b border-slate-100 dark:border-slate-700/50 pb-0.5"><span>Color:</span><span className="font-black">{s.appearance ?? '-'}</span></div>
        <div className="flex justify-between w-full border-b border-slate-100 dark:border-slate-700/50 pb-0.5"><span>Pulse:</span><span className="font-black">{s.pulse ?? '-'}</span></div>
        <div className="flex justify-between w-full border-b border-slate-100 dark:border-slate-700/50 pb-0.5"><span>Grimace:</span><span className="font-black">{s.grimace ?? '-'}</span></div>
        <div className="flex justify-between w-full border-b border-slate-100 dark:border-slate-700/50 pb-0.5"><span>Tone:</span><span className="font-black">{s.activity ?? '-'}</span></div>
        <div className="flex justify-between w-full pt-0.5 mb-2"><span>Breathing:</span><span className="font-black">{s.respiration ?? '-'}</span></div>

        <button
          onClick={(e) => { e.stopPropagation(); onEditScore(interval, session, index, isOffline); }}
          className="mt-2 flex items-center justify-center gap-1.5 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors rounded-lg font-bold uppercase tracking-wider text-[10px]"
        >
          <Edit2 size={12} /> Edit {interval}-Min
        </button>
      </div>
    );
  };

  const formatScoreTitle = (params) => {
    if (!params) return '?';
    if (params.skipped) return 'Skipped';
    if (params.inProgress) return 'In Progress';
    return `${params.total ?? '?'}/10`;
  };

  return (
    <div className={`p-5 sm:p-6 rounded-[2rem] shadow-sm border-2 ${isOffline ? 'bg-amber-50/50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-800' : 'bg-white border-slate-100 dark:bg-slate-800 dark:border-slate-700'} mb-4 relative overflow-hidden group`}>
      {isOffline && (
        <div className="absolute top-0 right-0 bg-amber-200 dark:bg-amber-800 text-amber-800 dark:text-amber-200 text-[10px] font-bold px-3 py-1 rounded-bl-xl flex items-center gap-1 uppercase tracking-wider">
          <CloudOff size={12} /> Pending Sync
        </div>
      )}

      {/* Header Row */}
      <div className="flex justify-between items-center mb-6">
        <div className="font-black text-2xl text-slate-800 dark:text-slate-100">{dateFormatted}</div>
        <div className="flex gap-2">
          <button onClick={() => onFullEdit(session, index, isOffline)} className="p-2.5 bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 dark:bg-slate-900/50 dark:hover:bg-indigo-900/50 rounded-xl transition-colors border border-slate-100 dark:border-slate-700" title="Edit Times">
            <Edit2 size={18} />
          </button>
          <button onClick={handleDelete} className="p-2.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 dark:bg-slate-900/50 dark:hover:bg-rose-900/50 rounded-xl transition-colors border border-slate-100 dark:border-slate-700" title="Delete Session">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4 border-b border-slate-100 dark:border-slate-700/50 pb-6">
        <div>
          <div className="flex flex-col gap-1.5">
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

        <div className="text-left sm:text-right bg-slate-50 dark:bg-slate-900/30 p-3.5 rounded-2xl w-full sm:w-auto border border-slate-100 dark:border-slate-700">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Delivery</div>
          <div className="font-black text-emerald-600 dark:text-emerald-400 text-xl">
            {formatDuration(session.deliveryStartTime, session.apgar5MinParams?.timeCompleted)}
          </div>
        </div>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 flex flex-col justify-start items-center h-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-700 relative">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">1-Min Score</span>
          <span className={`text-3xl font-black ${session.apgar1MinParams?.inProgress ? 'text-amber-500' : session.apgar1MinParams?.skipped ? 'text-slate-400' : 'text-violet-600 dark:text-violet-400'}`}>
            {formatScoreTitle(session.apgar1MinParams)}
          </span>
          {!expanded && <span className="text-[9px] text-slate-400 mt-2 uppercase tracking-widest bg-slate-200/50 dark:bg-slate-800 px-2 py-1 rounded-full flex items-center gap-1"><Edit2 size={8} /> Tap to edit</span>}
          {expanded && renderScores(session.apgar1MinParams, 1)}
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 flex flex-col justify-start items-center h-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-700 relative">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">5-Min Score</span>
          <span className={`text-3xl font-black ${session.apgar5MinParams?.inProgress ? 'text-amber-500' : session.apgar5MinParams?.skipped ? 'text-slate-400' : 'text-sky-600 dark:text-sky-400'}`}>
            {formatScoreTitle(session.apgar5MinParams)}
          </span>
          {!expanded && <span className="text-[9px] text-slate-400 mt-2 uppercase tracking-widest bg-slate-200/50 dark:bg-slate-800 px-2 py-1 rounded-full flex items-center gap-1"><Edit2 size={8} /> Tap to edit</span>}
          {expanded && renderScores(session.apgar5MinParams, 5)}
        </div>
      </div>
    </div>
  );
};

export const HistoryTab = () => {
  const { syncError } = useAppContext();
  const cloudSessions = useQuery(api.sessions.getSessions) || [];
  const deleteAllSessions = useMutation(api.sessions.deleteAllSessions);
  const deleteSingleSession = api.sessions.deleteSession ? useMutation(api.sessions.deleteSession) : null;
  const updateSessionToCloud = api.sessions.updateSession ? useMutation(api.sessions.updateSession) : null;

  const [modalState, setModalState] = useState({ isOpen: false, type: '', title: '', message: '', onConfirm: null });

  // Modals for editing history
  const [editApgarModal, setEditApgarModal] = useState({ isOpen: false, interval: null, session: null, index: null, isOffline: false });
  const [fullEditModal, setFullEditModal] = useState({ isOpen: false, session: null, index: null, isOffline: false });

  const queueStr = localStorage.getItem('offlineQueue');
  const offlineSessions = queueStr ? JSON.parse(queueStr) : [];
  const [localQueue, setLocalQueue] = useState(offlineSessions);

  const handleDeleteAll = () => {
    setModalState({
      isOpen: true,
      type: 'danger',
      title: 'Clear History?',
      message: 'This will permanently delete all recorded birth sessions from this device and the cloud. This cannot be undone.',
      onConfirm: async () => {
        localStorage.removeItem('offlineQueue');
        setLocalQueue([]);
        if (cloudSessions.length > 0) {
          await deleteAllSessions();
        }
      }
    });
  };

  const executeModalConfirm = () => {
    if (modalState.onConfirm) modalState.onConfirm();
    setModalState({ isOpen: false });
  };

  const openHistoricalApgarEdit = (interval, session, index, isOffline) => {
    setEditApgarModal({ isOpen: true, interval, session, index, isOffline });
  };

  const openFullEdit = (session, index, isOffline) => {
    setFullEditModal({ isOpen: true, session, index, isOffline });
  };

  const handleHistoricalApgarSave = async (interval, scoreData) => {
    if (editApgarModal.isOffline) {
      const newQueue = [...localQueue];
      const sessionToUpdate = newQueue[editApgarModal.index];
      if (interval === 1) sessionToUpdate.apgar1MinParams = scoreData;
      else sessionToUpdate.apgar5MinParams = scoreData;
      localStorage.setItem('offlineQueue', JSON.stringify(newQueue));
      setLocalQueue(newQueue);
    } else {
      if (updateSessionToCloud && editApgarModal.session._id) {
        const payload = { id: editApgarModal.session._id };
        if (interval === 1) payload.apgar1MinParams = scoreData;
        else payload.apgar5MinParams = scoreData;
        await updateSessionToCloud(payload);
      }
    }
    setEditApgarModal({ isOpen: false });
  };

  const handleFullEditSave = async (updatedSession) => {
    if (fullEditModal.isOffline) {
      const newQueue = [...localQueue];
      newQueue[fullEditModal.index] = updatedSession;
      localStorage.setItem('offlineQueue', JSON.stringify(newQueue));
      setLocalQueue(newQueue);
    } else {
      if (updateSessionToCloud && updatedSession._id) {
        await updateSessionToCloud({
          id: updatedSession._id,
          deliveryStartTime: updatedSession.deliveryStartTime,
          bodyOutTimes: updatedSession.bodyOutTimes
        });
      }
    }
    setFullEditModal({ isOpen: false });
  };

  // Determine Sync Status
  const isSyncing = localQueue.length > 0;

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 pb-32">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white flex items-center gap-3">
          <CalendarDays className="text-indigo-500" size={32} />
          History
        </h2>
        <div className="flex items-center gap-3">

          {/* Dynamic Sync Badge */}
          {isSyncing ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400 px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-800/50">
              <RefreshCw size={14} className="animate-spin" /> Syncing...
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full border border-transparent">
              <Cloud size={14} className="text-emerald-500" /> Synced
            </div>
          )}

          {(cloudSessions.length > 0 || localQueue.length > 0) && (
            <button
              onClick={handleDeleteAll}
              className="bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400 p-2.5 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors border border-rose-100 dark:border-rose-900/50"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Database Error Debugger Readout */}
      {isSyncing && syncError && (
        <div className="mb-8 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/50 rounded-2xl flex items-start gap-3">
          <AlertCircle className="text-rose-500 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-rose-700 dark:text-rose-400 font-bold text-sm mb-1">Database Sync Error</h4>
            <p className="text-rose-600/80 dark:text-rose-400/80 text-xs font-mono">{syncError}</p>
          </div>
        </div>
      )}

      {modalState.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl relative overflow-hidden border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col items-center text-center gap-4 relative z-10">
              {modalState.type === 'danger' ? (
                <div className="bg-rose-100 dark:bg-rose-900/30 p-4 rounded-full text-rose-500 dark:text-rose-400 mb-2">
                  <AlertTriangle size={40} strokeWidth={2.5} />
                </div>
              ) : (
                <div className="bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-full text-indigo-500 dark:text-indigo-400 mb-2">
                  <Info size={40} strokeWidth={2.5} />
                </div>
              )}

              <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100">{modalState.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-4">{modalState.message}</p>

              <div className="flex flex-col gap-3 w-full">
                {modalState.type === 'danger' ? (
                  <>
                    <button onClick={executeModalConfirm} className="w-full py-4 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-lg shadow-lg shadow-rose-500/30 transition-all active:scale-95 touch-manipulation">
                      Yes, Delete
                    </button>
                    <button onClick={() => setModalState({ isOpen: false })} className="w-full py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold transition-all">
                      Cancel
                    </button>
                  </>
                ) : (
                  <button onClick={() => setModalState({ isOpen: false })} className="w-full py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-600 text-white font-black text-lg shadow-lg shadow-indigo-500/30 transition-all active:scale-95 touch-manipulation">
                    Got it
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Session Editor Modal */}
      {fullEditModal.isOpen && (
        <EditSessionModal
          session={fullEditModal.session}
          onClose={() => setFullEditModal({ isOpen: false })}
          onSave={handleFullEditSave}
        />
      )}

      {/* APGAR Specific Inline Editor */}
      {editApgarModal.isOpen && (
        <ApgarModal
          interval={editApgarModal.interval}
          historicalSession={editApgarModal.session}
          onHistoricalSave={handleHistoricalApgarSave}
          onClose={() => setEditApgarModal({ isOpen: false })}
        />
      )}

      {localQueue.length > 0 && (
        <div className="mb-6">
          {localQueue.map((s, i) => (
            <SessionCard
              key={`off-${i}`}
              session={s}
              isOffline={true}
              index={i}
              localQueue={localQueue}
              setLocalQueue={setLocalQueue}
              deleteSingleSession={deleteSingleSession}
              setModalState={setModalState}
              onEditScore={openHistoricalApgarEdit}
              onFullEdit={openFullEdit}
            />
          ))}
        </div>
      )}

      {cloudSessions.length === 0 && localQueue.length === 0 ? (
        <div className="text-center p-12 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border border-slate-100 dark:border-slate-800 mt-4">
          <CheckCircle2 size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="font-bold text-slate-500">No birth sessions recorded yet.</p>
        </div>
      ) : (
        <div>
          {cloudSessions.map((s, i) => (
            <SessionCard
              key={s._id || i}
              session={s}
              isOffline={false}
              index={i}
              localQueue={localQueue}
              setLocalQueue={setLocalQueue}
              deleteSingleSession={deleteSingleSession}
              setModalState={setModalState}
              onEditScore={openHistoricalApgarEdit}
              onFullEdit={openFullEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
};