import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, HelpCircle } from 'lucide-react';

const surprises = [
  "Stupid, you're doing better than you think. ❤️",
  "Okay now go complete your habits. 😂",
  "Idiot approves. ✅",
  "Keep going. I'm rooting for you. ❤️",
  "Why are you still reading this? Go finish your habits. 👀",
  "Go drink some water right now, Stupid. 💧",
  "Idiot is proud of you. Even if he doesn't say it. 🤫",
  "Stop scrolling and take a deep breath. 🧘‍♀️",
  "Mini Challenge: Complete 1 habit right now! ⚡",
  "Mini Challenge: Send Idiot a message saying 'annoy me'. 😂"
];

const StupidSurprise = () => {
  const [index, setIndex] = useState(-1);

  const getSurprise = () => {
    let next = Math.floor(Math.random() * surprises.length);
    if (next === index && surprises.length > 1) {
      next = (next + 1) % surprises.length;
    }
    setIndex(next);
  };

  const hasSurprise = index >= 0;

  return (
    <div 
      onClick={getSurprise}
      className="bg-white/40 dark:bg-slate-900/35 border border-purple-500/20 rounded-3xl p-5 shadow-premium dark:shadow-premium-dark backdrop-blur-md relative overflow-hidden group cursor-pointer hover:border-purple-500/40 hover:shadow-lg transition-all duration-300"
    >
      <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full filter blur-xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
      
      <div className="flex flex-col space-y-3 z-10 relative justify-between h-full min-h-[140px]">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-purple-100/50 dark:bg-purple-950/40 text-purple-650 dark:text-purple-400 rounded-lg">
            <HelpCircle className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Surprise
          </span>
        </div>

        <div className="flex flex-col justify-center flex-1">
          <h4 className="text-sm font-black text-slate-850 dark:text-slate-200 uppercase tracking-tight">
            ✨ Surprise Me
          </h4>

          <div className="mt-2 min-h-[44px] flex items-center">
            <AnimatePresence mode="wait">
              {hasSurprise ? (
                <motion.p
                  key={index}
                  initial={{ rotateX: 90, opacity: 0 }}
                  animate={{ rotateX: 0, opacity: 1 }}
                  exit={{ rotateX: -90, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="text-xs font-bold text-purple-650 dark:text-purple-300 italic"
                >
                  "{surprises[index]}"
                </motion.p>
              ) : (
                <p className="text-xs text-slate-505">
                  Tap to get a message or challenge from Idiot.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="text-[9px] font-extrabold text-purple-650 dark:text-purple-450 uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          <span>{hasSurprise ? "Tap again" : "Pick cards"}</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};

export default StupidSurprise;
export { surprises };
