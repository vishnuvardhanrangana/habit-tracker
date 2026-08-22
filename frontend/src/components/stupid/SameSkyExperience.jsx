import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, X } from 'lucide-react';
import Antigravity from '../Antigravity';

const SameSkyExperience = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState(0);

  // Auto staggered progression for the card teaser text
  useEffect(() => {
    if (isOpen) return;
    setStage(0);
    const t1 = setTimeout(() => setStage(1), 1800);
    const t2 = setTimeout(() => setStage(2), 3600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isOpen]);

  return (
    <>
      {/* Interactive Card */}
      <div 
        onClick={() => setIsOpen(true)}
        className="bg-white/40 dark:bg-slate-900/35 border border-purple-500/20 rounded-3xl p-5 shadow-premium dark:shadow-premium-dark backdrop-blur-md relative overflow-hidden group cursor-pointer hover:border-purple-500/40 hover:shadow-lg transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full filter blur-xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />
        
        <div className="flex flex-col space-y-3 z-10 relative h-full justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-purple-100/50 dark:bg-purple-950/40 text-purple-650 dark:text-purple-400 rounded-lg">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Universe
            </span>
          </div>

          <div className="min-h-[60px] flex flex-col justify-center">
            <h4 className="text-sm font-black text-slate-850 dark:text-slate-200 uppercase tracking-tight">
              🌌 Same Sky
            </h4>
            <div className="text-xs font-bold text-slate-500 mt-1 h-8 relative">
              {stage === 0 && (
                <motion.span 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="absolute left-0 top-0 text-slate-500"
                >
                  You're far away...
                </motion.span>
              )}
              {stage === 1 && (
                <motion.span 
                  initial={{ opacity: 0, y: 5 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="absolute left-0 top-0 text-purple-500 italic"
                >
                  ...but look up.
                </motion.span>
              )}
              {stage === 2 && (
                <motion.span 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="absolute left-0 top-0 text-purple-600 dark:text-purple-300 font-extrabold"
                >
                  We're still under the same sky.
                </motion.span>
              )}
            </div>
          </div>

          <div className="text-[9px] font-extrabold text-purple-650 dark:text-purple-450 uppercase tracking-wider flex items-center gap-1 group-hover:translate-x-1 transition-transform">
            <span>Look up</span>
            <Eye className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Fullscreen Cinematic Sky Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-md">
          {/* Calm drifting particles background */}
          <Antigravity
            count={180}
            magnetRadius={5}
            ringRadius={6}
            waveSpeed={0.12}
            waveAmplitude={0.8}
            particleSize={1.2}
            lerpSpeed={0.03}
            color="#a78bfa"
            autoAnimate
            particleVariance={0.8}
            rotationSpeed={0.03}
            depthFactor={1.2}
            pulseSpeed={1.0}
            particleShape="circle"
            fieldStrength={4}
          />

          {/* Random tiny glowing stars */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
            {Array.from({ length: 40 }).map((_, i) => (
              <div 
                key={i} 
                className="absolute w-1 h-1 bg-white rounded-full animate-ping"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${3 + Math.random() * 5}s`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              />
            ))}
          </div>

          {/* Center visual label */}
          <div className="relative z-10 text-center px-6 max-w-md select-none space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-purple-450 via-pink-400 to-indigo-400 filter drop-shadow-[0_0_12px_rgba(167,139,250,0.3)]">
                IDIOT ❤️ STUPID
              </h2>
              <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mt-3" />
            </div>

            <div className="space-y-1.5">
              <p className="text-base font-bold text-slate-300">
                Different places.
              </p>
              <p className="text-lg font-black text-purple-300 italic tracking-wider">
                Same sky.
              </p>
            </div>
            
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Whenever you feel lonely or far away, look up at the stars. I'm looking at them too.
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 p-3 bg-slate-900/60 hover:bg-slate-900 border border-purple-500/20 text-slate-350 hover:text-white rounded-full backdrop-blur-sm transition-all cursor-pointer z-20"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  );
};

export default SameSkyExperience;
