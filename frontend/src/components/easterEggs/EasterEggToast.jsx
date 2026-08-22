import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trophy, X } from 'lucide-react';

const EasterEggToast = ({ toast, onClose }) => {
  const { display } = toast;
  
  // Detect prefers-reduced-motion
  const [reducedMotion, setReducedMotion] = React.useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const listener = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Auto-dismiss after 5.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div
      initial={reducedMotion ? { opacity: 0 } : { x: 300, opacity: 0, scale: 0.95 }}
      animate={reducedMotion ? { opacity: 1 } : { x: 0, opacity: 1, scale: 1 }}
      exit={reducedMotion ? { opacity: 0 } : { x: 300, opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="bg-slate-950/90 dark:bg-slate-900/95 border border-purple-500/30 rounded-2xl p-4 shadow-2xl backdrop-blur-md flex items-start gap-3 w-full pointer-events-auto max-w-[340px] relative overflow-hidden select-none"
    >
      {/* Soft gradient backing */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent pointer-events-none" />
      
      {/* Icon */}
      <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl flex-shrink-0 animate-pulse">
        {toast.eggId === 'logo-click' ? (
          <Trophy className="w-5 h-5" />
        ) : (
          <Sparkles className="w-5 h-5" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1">
        <span className="text-[9px] font-black text-purple-400 uppercase tracking-widest block">
          Easter Egg Unlocked!
        </span>
        <h4 className="text-xs font-black text-white tracking-tight uppercase">
          {display.title || toast.name}
        </h4>
        {display.subtitle && (
          <p className="text-[10px] font-bold text-slate-300">
            {display.subtitle}
          </p>
        )}
        <p className="text-[10px] font-medium text-slate-400 italic">
          "{display.text}"
        </p>
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="text-slate-500 hover:text-white transition-colors p-1 hover:bg-slate-800/50 rounded-lg cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Ambient glow particles (hidden in reduced motion) */}
      {!reducedMotion && (
        <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-purple-500/10 rounded-full filter blur-md pointer-events-none" />
      )}
    </motion.div>
  );
};

export default EasterEggToast;
