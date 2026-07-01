import React from 'react';
import { ShieldCheck, CreditCard, Lock } from 'lucide-react';

export const PaywallScreen = ({ onBypass }) => {
    return (
        <div className="min-h-[100dvh] w-full bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-900 dark:text-slate-100">
            <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border-2 border-slate-100 dark:border-slate-800 text-center animate-in fade-in zoom-in-95 duration-300">
                
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-inner">
                    <Lock size={40} strokeWidth={2.5} />
                </div>
                
                <h2 className="text-3xl font-black mb-3 tracking-tight">Unlock BirthTimer</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-8 leading-relaxed">
                    Subscribe to secure your clinical data locally and access unlimited APGAR intervals.
                </p>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 mb-8 text-left border border-slate-100 dark:border-slate-700/50">
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3 font-bold text-slate-700 dark:text-slate-300">
                            <ShieldCheck className="text-emerald-500" size={24} /> Zero-Cloud Privacy
                        </li>
                        <li className="flex items-center gap-3 font-bold text-slate-700 dark:text-slate-300">
                            <ShieldCheck className="text-emerald-500" size={24} /> Unlimited History Vault
                        </li>
                    </ul>
                </div>

                <button className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg flex justify-center items-center gap-2 transition-all active:scale-95 mb-6 shadow-lg shadow-indigo-500/20">
                    <CreditCard size={22} /> Subscribe for $5/mo
                </button>

                {/* Secret Bypass for you during development! */}
                <button onClick={onBypass} className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-black tracking-widest uppercase underline underline-offset-4 transition-colors">
                    Developer Bypass
                </button>
            </div>
        </div>
    );
};