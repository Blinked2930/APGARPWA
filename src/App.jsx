import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppProvider';
import { Stopwatch } from './components/Stopwatch';
import { AudioToggle } from './components/AudioToggle';
import { BodyOutButton } from './components/BodyOutButton';
import { SummaryScreen } from './components/SummaryScreen';
import { ApgarOrchestrator } from './components/ApgarOrchestrator';
import { ApgarTimer } from './components/ApgarTimer';
import { HistoryTab } from './components/HistoryTab';
import { Clock, BookCopy } from 'lucide-react';

const MainTimerView = () => {
  const { bodyOutTimes, apgar5MinParams } = useAppContext();

  // Hide active controls if 5-Min APGAR is completed.
  const isBirthFinished = !!apgar5MinParams;

  return (
    <div className="w-full max-w-2xl flex flex-col items-center gap-4 sm:gap-6 pb-24 px-4 sm:px-6">

      <Stopwatch />

      {!isBirthFinished && (
        <>
          <div className="w-full grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-4 mt-2">
            <div className="col-span-1 h-[7rem] sm:h-36">
              <AudioToggle />
            </div>
            <div className="col-span-3 sm:col-span-4 h-[7rem] sm:h-36">
              <BodyOutButton />
            </div>
          </div>
          {bodyOutTimes.length > 0 && <ApgarTimer />}
        </>
      )}

      {isBirthFinished && <SummaryScreen />}

      <ApgarOrchestrator />
    </div>
  );
};

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('timer'); // 'timer' or 'history'

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 font-sans flex flex-col items-center selection:bg-transparent transition-colors pt-4 sm:pt-6 bg-slate-50 dark:bg-slate-950 overflow-y-auto pb-[100px] relative">

      {/* Decorative ambient background glows */}
      <div className="fixed top-0 inset-x-0 h-48 sm:h-64 bg-indigo-500/5 dark:bg-indigo-500/10 blur-[100px] pointer-events-none"></div>

      {activeTab === 'timer' ? <MainTimerView /> : <HistoryTab />}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 inset-x-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-t border-slate-200/50 dark:border-white/5 p-4 pb-safe flex justify-center gap-4 z-40">
        <button
          onClick={() => setActiveTab('timer')}
          className={`flex-1 max-w-[200px] flex flex-col items-center justify-center p-3 rounded-2xl font-bold transition-all active:scale-95 touch-manipulation gap-1 ${activeTab === 'timer' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 shadow-sm border border-indigo-100 dark:border-indigo-500/20' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent'}`}
        >
          <Clock size={24} strokeWidth={2.5} />
          <span className="text-xs uppercase tracking-wider">Active</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 max-w-[200px] flex flex-col items-center justify-center p-3 rounded-2xl font-bold transition-all active:scale-95 touch-manipulation gap-1 ${activeTab === 'history' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 shadow-sm border border-indigo-100 dark:border-indigo-500/20' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent'}`}
        >
          <BookCopy size={24} strokeWidth={2.5} />
          <span className="text-xs uppercase tracking-wider">History</span>
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}