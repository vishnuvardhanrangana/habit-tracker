import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const Sparkle = ({ angle, delay }) => {
  const distance = Math.random() * 80 + 40;
  const x = Math.cos((angle * Math.PI) / 180) * distance;
  const y = Math.sin((angle * Math.PI) / 180) * distance;

  return (
    <motion.div
      initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
      animate={{ x, y, opacity: 0, scale: [0.5, 1.2, 0.2] }}
      transition={{ duration: 1.2, delay, ease: 'easeOut' }}
      className="absolute w-2 h-2 rounded-full bg-pink-400"
    />
  );
};

const SendAHug = () => {
  const [isSending, setIsSending] = useState(false);
  const [animationStage, setAnimationStage] = useState(0); // 0: initial, 1: traveling, 2: merged/burst, 3: secondary text

  const triggerHug = () => {
    setIsSending(true);
    setAnimationStage(1);

    // Timeline timers
    const t1 = setTimeout(() => setAnimationStage(2), 1600); // merge collision
    const t2 = setTimeout(() => setAnimationStage(3), 3200); // second caption
    const t3 = setTimeout(() => {
      setIsSending(false);
      setAnimationStage(0);
    }, 5500); // end/reset

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  };

  return (
    <>
      <div 
        onClick={triggerHug}
        className="bg-white/40 dark:bg-slate-900/35 border border-purple-500/20 rounded-3xl p-5 shadow-premium dark:shadow-premium-dark backdrop-blur-md relative overflow-hidden group cursor-pointer hover:border-purple-500/40 hover:shadow-lg transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-full filter blur-xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
        
        <div className="flex flex-col space-y-3 z-10 relative h-full justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-rose-50 dark:bg-rose-955/20 text-rose-650 dark:text-rose-400 rounded-lg">
              <Heart className="w-4 h-4 fill-rose-600/10" />
            </div>
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-505 uppercase tracking-widest">
              Affection
            </span>
          </div>

          <div>
            <h4 className="text-sm font-black text-slate-850 dark:text-slate-200 uppercase tracking-tight">
              🫂 Send a Hug
            </h4>
            <p className="text-[10px] text-slate-500 mt-1">
              Send a warm embrace across the wires.
            </p>
          </div>

          <div className="text-[9px] font-extrabold text-rose-650 dark:text-rose-450 uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Tap to send</span>
            <span>❤️</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isSending && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm"
          >
            <div className="relative w-full max-w-lg h-80 flex flex-col items-center justify-center overflow-hidden">
              
              {/* Traveling stage */}
              {animationStage === 1 && (
                <>
                  {/* Left particle cluster traveling to center */}
                  <motion.div
                    initial={{ x: -250, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                    className="absolute flex items-center justify-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-purple-550 filter blur-[4px] shadow-lg shadow-purple-500/50" />
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-purple-400 opacity-60 animate-ping"
                        style={{
                          left: `${Math.random() * 40 - 20}px`,
                          top: `${Math.random() * 40 - 20}px`,
                          animationDelay: `${Math.random() * 0.5}s`
                        }}
                      />
                    ))}
                  </motion.div>

                  {/* Right particle cluster traveling to center */}
                  <motion.div
                    initial={{ x: 250, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 1.5, ease: 'easeInOut' }}
                    className="absolute flex items-center justify-center"
                  >
                    <div className="w-8 h-8 rounded-full bg-pink-500 filter blur-[4px] shadow-lg shadow-pink-500/50" />
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-pink-300 opacity-60 animate-ping"
                        style={{
                          left: `${Math.random() * 40 - 20}px`,
                          top: `${Math.random() * 40 - 20}px`,
                          animationDelay: `${Math.random() * 0.5}s`
                        }}
                      />
                    ))}
                  </motion.div>
                </>
              )}

              {/* Merged stage */}
              {animationStage >= 2 && (
                <div className="relative flex flex-col items-center justify-center space-y-6">
                  
                  {/* Colliding/Burst effect */}
                  {animationStage === 2 && (
                    <div className="absolute flex items-center justify-center pointer-events-none">
                      {Array.from({ length: 24 }).map((_, idx) => (
                        <Sparkle key={idx} angle={idx * 15} delay={Math.random() * 0.2} />
                      ))}
                    </div>
                  )}

                  {/* Expanding Heart */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: [1, 1.25, 1], opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 15 }}
                    className="w-20 h-20 bg-gradient-to-tr from-rose-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl shadow-rose-500/40 relative z-10"
                  >
                    <Heart className="w-10 h-10 text-white fill-white animate-pulse" />
                  </motion.div>

                  {/* Caption transitions */}
                  <div className="text-center min-h-[50px] z-10">
                    <AnimatePresence mode="wait">
                      {animationStage === 2 ? (
                        <motion.h3
                          key="text-stage2"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-450 via-pink-400 to-purple-400 tracking-tight"
                        >
                          Hug delivered. ❤️
                        </motion.h3>
                      ) : (
                        <motion.h3
                          key="text-stage3"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-lg font-black text-slate-300"
                        >
                          Distance can't stop this one.
                        </motion.h3>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default SendAHug;
