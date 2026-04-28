import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppProvider';
import { Zap, Settings as SettingsIcon, CheckSquare, Bot, AlertTriangle } from 'lucide-react';

export const SettingsTab = ({ isWalkthrough, onCompleteWalkthrough }) => {
    const { visualFlash, toggleVisualFlash, showMilestones, toggleShowMilestones, robotDingEnabled, toggleRobotDing } = useAppContext();
    const [tourStep, setTourStep] = useState(isWalkthrough ? 1 : 0);
    
    const step1Ref = useRef(null);
    const step2Ref = useRef(null);
    const step3Ref = useRef(null);

    useEffect(() => {
        const refs = [null, step1Ref, step2Ref, step3Ref];
        if (tourStep > 0 && refs[tourStep]?.current) {
            refs[tourStep].current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [tourStep]);

    const nextStep = () => {
        if (tourStep === 3) {
            setTourStep(0);
            if (onCompleteWalkthrough) onCompleteWalkthrough();
        } else {
            setTourStep(tourStep + 1);
        }
    };

    const SettingRow = ({ id, icon: Icon, title, desc, active, onToggle, warning, tourActive, stepRef }) => (
        <div ref={stepRef} className={`relative transition-all duration-500 rounded-[2rem] p-6 sm:p-8 ${tourActive ? 'z-50 bg-white dark:bg-slate-900 shadow-2xl ring-4 ring-indigo-500' : (tourStep > 0 ? 'opacity-20 blur-sm' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700')}`}>
            <div className="flex items-center justify-between mb-6">
                <div className={`p-4 rounded-2xl ${active ? 'bg-indigo-50 text-indigo-500' : 'bg-slate-100 text-slate-400'}`}>
                    <Icon size={28} strokeWidth={2.5} />
                </div>
                <button onClick={onToggle} className={`relative inline-flex h-9 w-16 cursor-pointer rounded-full border-4 border-transparent transition-colors ${active ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                    <span className={`inline-block h-7 w-7 transform rounded-full bg-white shadow transition ${active ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
            </div>
            
            <h3 className="text-xl font-black mb-2">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-6">{desc}</p>
            
            {warning && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 p-4 rounded-2xl flex gap-3">
                    <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-400">{warning}</p>
                </div>
            )}

            {tourActive && (
                <button onClick={nextStep} className="mt-8 w-full py-4 rounded-xl bg-indigo-600 text-white font-black text-lg">
                    {tourStep === 3 ? "Finish Setup" : "Next Setting"}
                </button>
            )}
        </div>
    );

    return (
        <div className="w-full max-w-3xl mx-auto p-4 sm:p-8 pb-32">
            {tourStep > 0 && <div className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm" />}
            
            <div className="mb-10 flex items-center gap-4 px-4">
                <SettingsIcon className="text-slate-400" size={32} />
                <h2 className="text-4xl font-black tracking-tight">Settings</h2>
            </div>

            <div className="flex flex-col gap-6">
                <SettingRow 
                    stepRef={step1Ref}
                    icon={Zap} title="Visual Screen Flash" active={visualFlash} onToggle={toggleVisualFlash}
                    desc="Briefly flashes the entire screen indigo every 30 seconds. Perfect for keeping track of time in your peripheral vision while your hands are busy."
                    tourActive={tourStep === 1}
                />
                <SettingRow 
                    stepRef={step2Ref}
                    icon={Bot} title="Audio Fail-Safe" active={robotDingEnabled} onToggle={toggleRobotDing}
                    desc="Plays a synthetic voice saying 'ding' alongside the chime. This is the only way to hear prompts if your physical ringer switch is set to silent."
                    warning="HIGHLY RECOMMENDED: If you use the vibrate/silent switch, the normal musical chime will be blocked by your iPhone."
                    tourActive={tourStep === 2}
                />
                <SettingRow 
                    stepRef={step3Ref}
                    icon={CheckSquare} title="Milestone Trackers" active={showMilestones} onToggle={toggleShowMilestones}
                    desc="Enables the quick-tap buttons for logging ROM, Crowning, First Cry, and Placenta delivery times."
                    tourActive={tourStep === 3}
                />
            </div>
        </div>
    );
};