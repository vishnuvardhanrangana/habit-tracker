import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle } from 'lucide-react';
import stupidConfig from './stupidConfig';

const TeleportMessage = () => {
  const [index, setIndex] = useState(-1);
  const [showSubtext, setShowSubtext] = useState(false);

  const triggerTeleport = () => {
    const list = stupidConfig.teleportMessages;
    let nextIdx = Math.floor(Math.random() * list.length);
    // Ensure we don't pick the same index consecutively if possible
    if (nextIdx === index && list.length > 1) {
      nextIdx = (nextIdx + 1) % list.length;
    }
    setIndex(nextIdx);
    setShowSubtext(false);
    setTimeout(() => {
      setShowSubtext(true);
    }, 1500);
  };

  const hasMessage = index >= 0;
  const currentMessage = hasMessage ? stupidConfig.teleportMessages[index] : "";

  return (
    <div 
      onClick={triggerTeleport}
      className="bg-white/40 dark:bg-slate-900/35 border border-purple-500/20 rounded-3xl p-5 shadow-premium dark:shadow-premium-dark backdrop-blur-md relative overflow-hidden group cursor-pointer hover:border-purple-500/40 hover:shadow-lg transition-all duration-300"
    >
      <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full filter blur-xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
      
      <div className="flex flex-col space-y-3 z-10 relative justify-between h-full min-h-[140px]">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-purple-100/50 dark:bg-purple-950/40 text-purple-650 dark:text-purple-400 rounded-lg">
            <MessageCircle className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Teleport
          </span>
        </div>

        <div className="flex flex-col justify-center flex-1">
          <h4 className="text-sm font-black text-slate-850 dark:text-slate-200 uppercase tracking-tight">
            If Idiot could teleport right now... 👀
          </h4>
          
          <div className="mt-2 min-h-[48px]">
            <AnimatePresence mode="wait">
              {hasMessage ? (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-1"
                >
                  <p className="text-xs font-bold text-purple-650 dark:text-purple-300 italic">
                    "{currentMessage}"
                  </p>
                  
                  {showSubtext && (
                    <motion.p
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-[10px] font-black text-pink-650 dark:text-pink-400 mt-1 uppercase tracking-wider"
                    >
                      He's lying. 😭
                    </motion.p>
                  )}
                </motion.div>
              ) : (
                <p className="text-xs text-slate-500">
                  Tap to find out what he would do.
                </p>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="text-[9px] font-extrabold text-purple-650 dark:text-purple-450 uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          <span>{hasMessage ? "Tap again" : "Reveal surprise"}</span>
          <span>⚡</span>
        </div>
      </div>
    </div>
  );
};

export default TeleportMessage;
