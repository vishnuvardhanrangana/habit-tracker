import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Calendar } from 'lucide-react';
import stupidConfig from './stupidConfig';

const Digit = ({ value, label }) => (
  <div className="flex flex-col items-center px-2 py-2 bg-slate-950/40 dark:bg-slate-900/60 border border-purple-500/10 rounded-xl min-w-[48px]">
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ y: 8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -8, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="text-base font-black text-purple-600 dark:text-purple-300 font-mono"
      >
        {String(value).padStart(2, '0')}
      </motion.span>
    </AnimatePresence>
    <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 mt-1">
      {label}
    </span>
  </div>
);

const TimeSinceMeeting = () => {
  const [elapsed, setElapsed] = useState(null);

  useEffect(() => {
    const lastDateStr = stupidConfig.lastMeetingDate;
    if (!lastDateStr) return;

    const startDate = new Date(lastDateStr);
    
    const updateTime = () => {
      const now = new Date();
      const diff = now - startDate;
      if (diff < 0) {
        setElapsed(null);
        return;
      }

      setElapsed({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/40 dark:bg-slate-900/35 border border-purple-500/20 rounded-3xl p-5 shadow-premium dark:shadow-premium-dark backdrop-blur-md relative overflow-hidden group">
      {/* Decorative pulse background */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full filter blur-xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />

      <div className="flex flex-col space-y-3 z-10 relative">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-purple-105/50 dark:bg-purple-950/40 text-purple-650 dark:text-purple-450 rounded-lg">
            <Heart className="w-4 h-4 fill-purple-600/10" />
          </div>
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Days Apart
          </span>
        </div>

        <div>
          <h4 className="text-sm font-black text-slate-855 dark:text-slate-200 uppercase tracking-tight">
            Since Idiot Last Saw Stupid ❤️
          </h4>
          <p className="text-[10px] font-bold text-purple-650 dark:text-purple-400 mt-0.5">
            "Yeah... Idiot has been counting. 🥹"
          </p>
        </div>

        {stupidConfig.lastMeetingDate && elapsed ? (
          <div className="flex items-center gap-1.5 pt-1">
            <Digit value={elapsed.days} label="Days" />
            <span className="font-bold text-slate-405 font-mono">:</span>
            <Digit value={elapsed.hours} label="Hours" />
            <span className="font-bold text-slate-405 font-mono">:</span>
            <Digit value={elapsed.minutes} label="Min" />
            <span className="font-bold text-slate-405 font-mono">:</span>
            <Digit value={elapsed.seconds} label="Sec" />
          </div>
        ) : (
          <div className="py-2.5 px-3 bg-slate-950/40 dark:bg-slate-950/50 border border-purple-500/10 rounded-2xl text-center text-xs font-semibold text-slate-400">
            Waiting for date input... 💜
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeSinceMeeting;
