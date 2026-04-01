import React, { useState } from 'react';
import { useAppContext } from '../context/AppProvider';
import { Baby } from 'lucide-react';

export const BodyOutButton = () => {
  const { markBodyOut } = useAppContext();
  const [pops, setPops] = useState([]);

  const handleClick = (e) => {
    e.preventDefault();
    markBodyOut();
    
    // Add a new pop to the array for the animation
    const newId = Date.now();
    setPops(prev => [...prev, newId]);
    
    // Remove it after the animation completes
    setTimeout(() => {
      setPops(prev => prev.filter(id => id !== newId));
    }, 1500);
  };

  return (
    <div className="relative w-full">
      {pops.map(id => (
        <div key={id} className="absolute inset-x-0 -top-16 flex justify-center animate-float-up pointer-events-none z-10">
          <div className="bg-white/95 backdrop-blur-sm text-pink-600 font-bold px-6 py-2 rounded-full shadow-xl border border-pink-100 flex items-center gap-2">
            <span>✨</span> +1 Lap Saved!
          </div>
        </div>
      ))}
      
      <button 
        onClick={handleClick}
        className="w-full relative overflow-hidden group bg-gradient-to-br from-rose-400 to-pink-500 hover:from-rose-500 hover:to-pink-600 text-white py-12 rounded-[2.5rem] shadow-xl shadow-pink-500/30 transition-all active:animate-pop touch-manipulation flex flex-col items-center justify-center border border-white/20"
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-active:opacity-100 transition-opacity"></div>
        <Baby size={56} className="mb-2 opacity-95 drop-shadow-md" strokeWidth={2.5}/>
        <span className="text-4xl font-black tracking-wide drop-shadow-sm">BODY OUT</span>
      </button>
    </div>
  );
};
