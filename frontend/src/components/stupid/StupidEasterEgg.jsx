import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Sparkles, X, Heart } from 'lucide-react';
import stupidConfig from './stupidConfig';

const SparkleItem = ({ delay }) => {
  const x = Math.random() * 200 - 100;
  const y = Math.random() * -120 - 40;
  return (
    <motion.div
      initial={{ x: 0, y: 10, opacity: 1, scale: 0.5 }}
      animate={{ x, y, opacity: 0, scale: [0.5, 1.2, 0.2] }}
      transition={{ duration: 1.5, delay, ease: 'easeOut', repeat: Infinity }}
      className="absolute w-1.5 h-1.5 rounded-full bg-purple-400"
    />
  );
};

const StupidEasterEgg = ({ isOpen, onClose }) => {
  const [showAchievement, setShowAchievement] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    // Check localStorage for unlock persistence
    const hasUnlocked = localStorage.getItem('stupid_secret_unlocked');
    if (!hasUnlocked) {
      localStorage.setItem('stupid_secret_unlocked', 'true');
      setShowAchievement(true);
      
      // Auto-hide achievement after 3.5s to show secret room letter
      const timer = setTimeout(() => {
        setShowAchievement(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md">
        
        {/* Achievement Unlock Popup */}
        {showAchievement ? (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-slate-900 border border-purple-500/30 rounded-3xl p-8 max-w-sm text-center shadow-2xl relative overflow-hidden"
          >
            {/* Soft pink/purple background glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-pink-500/10" />
            
            {/* Sparkles */}
            {Array.from({ length: 12 }).map((_, i) => (
              <SparkleItem key={i} delay={i * 0.15} />
            ))}

            <div className="relative z-10 space-y-4">
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-2xl flex items-center justify-center mx-auto"
              >
                <Award className="w-8 h-8" />
              </motion.div>

              <div>
                <span className="text-[10px] font-black text-purple-450 uppercase tracking-widest animate-pulse">
                  Achievement Unlocked!
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {stupidConfig.secretAchievement.title}
                </h3>
                <p className="text-xs text-slate-400 mt-2 font-medium">
                  {stupidConfig.secretAchievement.description}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          /* The Secret Room Content */
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-slate-900/50 border border-purple-500/25 rounded-3xl p-6 md:p-8 max-w-lg w-full mx-4 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col max-h-[85vh]"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none" />

            {/* Header controls */}
            <div className="flex items-center justify-between pb-4 border-b border-purple-500/10">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-purple-450 animate-spin" style={{ animationDuration: '6s' }} />
                <h3 className="text-base font-black text-white tracking-wide uppercase">
                  {stupidConfig.secretRoomContent.title}
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body Scrollable */}
            <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-1 text-slate-300 text-sm leading-relaxed font-semibold">
              <p className="text-pink-500 font-extrabold italic">
                "{stupidConfig.secretRoomContent.intro}"
              </p>

              {stupidConfig.secretRoomContent.letter.map((para, idx) => (
                <p key={idx} className={idx === 0 ? "font-black text-purple-300 text-base" : ""}>
                  {para}
                </p>
              ))}
            </div>

            {/* Bottom Footer block */}
            <div className="pt-4 border-t border-purple-500/10 flex items-center justify-between">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Idiot ❤️ Stupid
              </span>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gradient-to-r from-purple-650 to-indigo-650 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer border-0"
              >
                Close Room
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default StupidEasterEgg;
export { SparkleItem };
