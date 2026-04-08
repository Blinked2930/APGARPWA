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
    // FIX: Using flex-1, h-full, and justify-center to dynamically squeeze into 1 screen
    <div className="w-full max-w-2xl h-full flex flex-col items-center justify-center gap-2 sm:gap-4 px-2 sm:px-4 mx-auto pb-4">

      <Stopwatch />

      {!isBirthFinished && (
        <div className="w-full flex flex-col gap-2 sm:gap-4 mt-2">
          <div className="w-full grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-4">
            <div className="col-span-1 h-[5rem] sm:h-[6.5rem]">
              <AudioToggle />
            </div>
            <div className="col-span-3 sm:col-span-4 h-[5rem] sm:h-[6.5rem]">
              <BodyOutButton />
            </div>
          </div>
          {bodyOutTimes.length > 0 && <ApgarTimer />}
        </div>
      )}

      {isBirthFinished && <SummaryScreen />}

      <ApgarOrchestrator />
    </div>
  );
};

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('timer');

  return (
    // FIX: Strict h-[100dvh] and overflow-hidden locks the viewport from scrolling at the root
    <div className="h-[100dvh] w-full text-slate-900 dark:text-slate-100 font-sans flex flex-col selection:bg-transparent transition-colors bg-slate-50 dark:bg-slate-950 overflow-hidden relative">

      {/* Decorative ambient background glows */}
      <div className="absolute top-0 inset-x-0 h-48 sm:h-64 bg-indigo-500/5 dark:bg-indigo-500/10 blur-[100px] pointer-events-none"></div>

      {/* Main Content Area (Scrolls ONLY if History Tab is open) */}
      <div className={`flex-1 w-full flex flex-col pt-[max(env(safe-area-inset-top),1rem)] pb-[85px] ${activeTab === 'history' ? 'overflow-y-auto' : 'overflow-hidden'}`}>
        {activeTab === 'timer' ? <MainTimerView /> : <HistoryTab />}
      </div>

      {/* Bottom Navigation (Fixed absolutely inside the 100dvh container) */}
      <div className="absolute bottom-0 inset-x-0 h-[80px] bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-t border-slate-200/50 dark:border-white/5 p-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] flex justify-center gap-4 z-40">
        <button
          onClick={() => setActiveTab('timer')}
          className={`flex-1 max-w-[200px] flex flex-col items-center justify-center p-2 rounded-xl font-bold transition-all active:scale-95 touch-manipulation gap-1 ${activeTab === 'timer' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 shadow-sm border border-indigo-100 dark:border-indigo-500/20' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent'}`}
        >
          <Clock size={22} strokeWidth={2.5} />
          <span className="text-[10px] sm:text-xs uppercase tracking-wider">Active</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 max-w-[200px] flex flex-col items-center justify-center p-2 rounded-xl font-bold transition-all active:scale-95 touch-manipulation gap-1 ${activeTab === 'history' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 shadow-sm border border-indigo-100 dark:border-indigo-500/20' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent'}`}
        >
          <BookCopy size={22} strokeWidth={2.5} />
          <span className="text-[10px] sm:text-xs uppercase tracking-wider">History</span>
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