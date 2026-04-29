import React, { useState, useEffect } from 'react';
import { AppProvider, useAppContext } from './context/AppProvider';
import { Stopwatch } from './components/Stopwatch';
import { MilestoneStrip } from './components/MilestoneStrip';
import { AudioToggle } from './components/AudioToggle';
import { BodyOutButton } from './components/BodyOutButton';
import { SummaryScreen } from './components/SummaryScreen';
import { ApgarOrchestrator } from './components/ApgarOrchestrator';
import { ApgarTimer } from './components/ApgarTimer';
import { HistoryTab } from './components/HistoryTab';
import { SettingsTab } from './components/SettingsTab';
import { InstallScreen } from './components/InstallScreen';
import { TutorialScreen } from './components/TutorialScreen';
import { UiTour } from './components/UiTour';
import { Clock, BookCopy, Settings as SettingsIcon, ChevronRight } from 'lucide-react';

const MainTimerView = () => {
  const { bodyOutTimes, apgar5MinParams, showMilestones } = useAppContext();
  return (
    <div className="w-full max-w-2xl flex flex-col items-center px-4 mx-auto shrink-0 relative z-20">
      {showMilestones && (
        <div className="w-full mb-6">
            <MilestoneStrip keys={['rom', 'crown']} />
        </div>
      )}
      
      <div className="mb-6 transform scale-105">
          <Stopwatch />
      </div>

      {!apgar5MinParams && (
        <div className="w-full flex flex-col gap-3 sm:gap-4">
          <div className="w-full grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-4">
            <div className="col-span-1 h-[5.5rem] sm:h-[6.5rem]"><AudioToggle /></div>
            <div className="col-span-3 sm:col-span-4 h-[5.5rem] sm:h-[6.5rem]"><BodyOutButton /></div>
          </div>
          {bodyOutTimes.length > 0 && <ApgarTimer />}
        </div>
      )}

      {showMilestones && (
        <div className="w-full mt-6">
            <MilestoneStrip keys={['firstCry', 'placenta']} />
        </div>
      )}
      
      {apgar5MinParams && <SummaryScreen />}
      <ApgarOrchestrator />
    </div>
  );
};

const AppContent = () => {
  const [activeTab, setActiveTab] = useState('timer');
  const [flow, setFlow] = useState({ isStandalone: true, tutorialDone: true, settingsDone: true, uiTourStep: 0 });
  const [showBridge, setShowBridge] = useState(false);

  useEffect(() => {
    const standalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone || document.referrer.includes('android-app://');
    const tutorialDone = localStorage.getItem('tutorialCompleted') === 'true';
    const settingsDone = localStorage.getItem('settingsTutorialCompleted') === 'true';
    const uiTourDone = localStorage.getItem('uiTourCompleted') === 'true';

    setFlow({ 
        isStandalone: standalone, 
        tutorialDone, 
        settingsDone, 
        uiTourStep: (standalone && tutorialDone && settingsDone && !uiTourDone) ? 1 : 0 
    });
  }, []);

  const finishUiTour = () => {
    localStorage.setItem('uiTourCompleted', 'true');
    setFlow(prev => ({ ...prev, uiTourStep: 0 }));
    setActiveTab('timer');
  };

  if (!flow.isStandalone) return <InstallScreen onBypass={() => setFlow({ ...flow, isStandalone: true })} />;
  
  if (!flow.tutorialDone) return <TutorialScreen onComplete={() => {
    localStorage.setItem('tutorialCompleted', 'true');
    setFlow({ ...flow, tutorialDone: true });
    setShowBridge(true);
  }} />;

  if (showBridge) return (
    <div className="min-h-[100dvh] bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 bg-indigo-500/20 text-indigo-400 rounded-3xl flex items-center justify-center mb-8 animate-bounce">
            <SettingsIcon size={40} />
        </div>
        <h1 className="text-4xl font-black text-white mb-4">Almost Ready</h1>
        <p className="text-slate-400 text-lg mb-10 max-w-xs">Now let's quickly customize your BirthTimer settings to fit your workflow.</p>
        <button onClick={() => setShowBridge(false)} className="w-full max-w-xs py-5 rounded-2xl bg-indigo-600 text-white font-black text-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-indigo-500/20">
            Setup Settings <ChevronRight />
        </button>
    </div>
  );

  const isSettingsTour = !flow.settingsDone;
  const isUiTour = flow.uiTourStep > 0;
  const currentTab = isSettingsTour ? 'settings' : (isUiTour && flow.uiTourStep === 2 ? 'history' : activeTab);

  return (
    <div className="h-[100dvh] w-full text-slate-900 dark:text-slate-100 font-sans flex flex-col transition-colors bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
      
      {/* Added flex & flex-col here so the internal heights calculate correctly */}
      <div className="flex-1 w-full overflow-y-auto overflow-x-hidden z-10 relative flex flex-col">
        
        {/* Timer Tab: Perfectly centered with safe-area padding */}
        {currentTab === 'timer' && (
            <div className="flex-1 flex flex-col w-full justify-center items-center pb-[100px] pt-[max(env(safe-area-inset-top),2rem)] min-h-min">
                <MainTimerView />
            </div>
        )}
        
        {currentTab === 'history' && (
            <div className="flex-1 w-full pt-[max(env(safe-area-inset-top),2rem)] pb-[calc(110px+env(safe-area-inset-bottom))]">
                <HistoryTab />
            </div>
        )}
        
        {currentTab === 'settings' && (
            <div className="flex-1 w-full pt-[max(env(safe-area-inset-top),2rem)] pb-[calc(110px+env(safe-area-inset-bottom))]">
                <SettingsTab isWalkthrough={isSettingsTour} onCompleteWalkthrough={() => {
                    localStorage.setItem('settingsTutorialCompleted', 'true');
                    setFlow({ ...flow, settingsDone: true, uiTourStep: 1 });
                    setActiveTab('timer');
                }} />
            </div>
        )}
      </div>

      <UiTour 
        step={flow.uiTourStep} 
        onNext={() => setFlow({...flow, uiTourStep: flow.uiTourStep + 1})} 
        onFinish={finishUiTour} 
      />

      {/* Navigation Bar: Restored dark mode CSS & locked SVG sizes so they don't collapse into dots */}
      <div className={`absolute bottom-0 inset-x-0 h-[80px] bg-white/90 dark:bg-slate-950/90 backdrop-blur-2xl border-t border-slate-200/50 dark:border-white/5 p-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] flex justify-center gap-2 sm:gap-4 z-40 ${(isSettingsTour || isUiTour) ? 'pointer-events-none' : ''}`}>
        
        <button onClick={() => setActiveTab('timer')} className={`flex-1 max-w-[150px] flex flex-col items-center justify-center p-2 rounded-xl font-bold transition-all active:scale-95 touch-manipulation ${currentTab === 'timer' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 shadow-sm border border-indigo-100 dark:border-indigo-500/20' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent'}`}>
          <Clock className="w-[22px] h-[22px] mb-1 shrink-0" strokeWidth={2.5} />
          <span className="text-[10px] sm:text-xs uppercase tracking-wider">Active</span>
        </button>

        <button onClick={() => setActiveTab('history')} className={`flex-1 max-w-[150px] flex flex-col items-center justify-center p-2 rounded-xl font-bold transition-all active:scale-95 touch-manipulation ${currentTab === 'history' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 shadow-sm border border-indigo-100 dark:border-indigo-500/20' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent'}`}>
          <BookCopy className="w-[22px] h-[22px] mb-1 shrink-0" strokeWidth={2.5} />
          <span className="text-[10px] sm:text-xs uppercase tracking-wider">History</span>
        </button>

        <button onClick={() => setActiveTab('settings')} className={`flex-1 max-w-[150px] flex flex-col items-center justify-center p-2 rounded-xl font-bold transition-all active:scale-95 touch-manipulation ${currentTab === 'settings' ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 shadow-sm border border-indigo-100 dark:border-indigo-500/20' : 'text-slate-400 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent'}`}>
          <SettingsIcon className="w-[22px] h-[22px] mb-1 shrink-0" strokeWidth={2.5} />
          <span className="text-[10px] sm:text-xs uppercase tracking-wider">Settings</span>
        </button>

      </div>
    </div>
  );
};

export default function App() { return (<AppProvider><AppContent /></AppProvider>); }