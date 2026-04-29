import React from 'react';
import { ArrowDown } from 'lucide-react';

export const UiTour = ({ step, onNext, onFinish }) => {
    if (step === 0) return null;

    const tourData = {
        1: {
            title: "Active Timer",
            desc: "This is where you'll spend your time during a delivery.",
            btn: "Next",
            arrowClass: "mr-[66%]"
        },
        2: {
            title: "Birth History",
            desc: "Review all your past records and timestamps here.",
            btn: "Next",
            arrowClass: "" 
        },
        3: {
            title: "Access Settings Again",
            desc: "You can always adjust your audio and visual preferences right here.",
            btn: "Start Using App",
            arrowClass: "ml-[66%]" 
        }
    };

    const currentData = tourData[step];

    return (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex flex-col justify-end p-6 pb-32 transition-opacity duration-300">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] shadow-2xl animate-in slide-in-from-bottom-4">
                <h3 className="text-xl font-black mb-2 tracking-tight text-slate-900 dark:text-white">{currentData.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-6 leading-relaxed">
                    {currentData.desc}
                </p>
                <button 
                    onClick={step === 3 ? onFinish : onNext} 
                    className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
                >
                    {currentData.btn}
                </button>
            </div>
            <div className={`flex justify-center mt-4 text-white animate-bounce ${currentData.arrowClass}`}>
                <ArrowDown size={40} strokeWidth={3} />
            </div>
        </div>
    );
};