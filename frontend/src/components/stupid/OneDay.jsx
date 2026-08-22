import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ChevronRight, X } from 'lucide-react';

const OneDay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(0);

  const startSequence = () => {
    setIsOpen(true);
    setStep(0);
  };

  const nextStep = () => {
    const totalSteps = 4;
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setIsOpen(false);
      setStep(0);
    }
  };

  const messages = [
    "One day, this won't be a countdown.",
    "It won't be a message.",
    "It won't be a screen.",
    "It'll just be us sitting together again."
  ];

  return (
    <>
      {/* Interactive Card */}
      <div 
        onClick={startSequence}
        className="bg-white/40 dark:bg-slate-900/35 border border-purple-500/20 rounded-3xl p-5 shadow-premium dark:shadow-premium-dark backdrop-blur-md relative overflow-hidden group cursor-pointer hover:border-purple-500/40 hover:shadow-lg transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-pink-500/5 rounded-full filter blur-xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
        
        <div className="flex flex-col space-y-3 z-10 relative justify-between h-full min-h-[140px]">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-pink-100/50 dark:bg-pink-950/40 text-pink-650 dark:text-pink-400 rounded-lg">
              <Heart className="w-4 h-4 fill-pink-600/10" />
            </div>
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              One Day
            </span>
          </div>

          <div>
            <h4 className="text-sm font-black text-slate-850 dark:text-slate-200 uppercase tracking-tight">
              🌅 One Day
            </h4>
            <p className="text-[10px] text-slate-500 mt-1">
              "One day, this won't be a screen..."
            </p>
          </div>

          <div className="text-[9px] font-extrabold text-pink-650 dark:text-pink-450 uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Read note</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Fullscreen Cinematic Sequence */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/98 select-none"
            onClick={nextStep}
          >
            {/* Main stage content */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 text-center max-w-xl">
              <AnimatePresence mode="wait">
                {step < 4 ? (
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-4"
                  >
                    <h3 className="text-2xl md:text-3xl font-black text-white leading-snug">
                      {messages[step]}
                    </h3>
                  </motion.div>
                ) : (
                  <motion.div
                    key="final"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="space-y-3"
                  >
                    <h4 className="text-sm font-extrabold text-purple-400 uppercase tracking-widest">
                      Until then...
                    </h4>
                    <div className="space-y-1.5 text-2xl md:text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-rose-455">
                      <p>Keep going.</p>
                      <p>Keep smiling.</p>
                      <p>Keep being Stupid. 😂❤️</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Tap prompt */}
            <div className="py-8 text-slate-500 text-xs font-semibold animate-pulse">
              Tap anywhere to advance
            </div>

            {/* Exit/Close trigger */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
                setStep(0);
              }}
              className="absolute top-6 right-6 p-3 bg-slate-900/60 hover:bg-slate-900 border border-purple-500/20 text-slate-350 hover:text-white rounded-full backdrop-blur-sm transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default OneDay;
