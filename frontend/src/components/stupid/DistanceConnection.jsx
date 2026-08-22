import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Globe } from 'lucide-react';
import stupidConfig from './stupidConfig';

const DistanceConnection = () => {
  const idiotLoc = stupidConfig.idiotLocation || "Here";
  const stupidLoc = stupidConfig.stupidLocation || "Somewhere out there";

  return (
    <div className="bg-white/40 dark:bg-slate-900/35 border border-purple-500/20 rounded-3xl p-5 shadow-premium dark:shadow-premium-dark backdrop-blur-md relative overflow-hidden group">
      {/* Decorative pulse background */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-full filter blur-xl pointer-events-none group-hover:scale-110 transition-transform duration-500" />

      <div className="flex flex-col space-y-4 z-10 relative h-full">
        {/* Header */}
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-purple-100/50 dark:bg-purple-950/40 text-purple-650 dark:text-purple-400 rounded-lg">
            <Globe className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Geography
          </span>
        </div>

        <div>
          <h4 className="text-sm font-black text-slate-850 dark:text-slate-200 uppercase tracking-tight">
            🌍 Miles Apart
          </h4>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Different places. Same little world.
          </p>
        </div>

        {/* Visual Connector SVG */}
        <div className="flex items-center justify-center py-2 select-none">
          <div className="flex flex-col items-center justify-center w-full max-w-[200px] relative">
            
            {/* Top Node: Idiot */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 tracking-wider uppercase">
                IDIOT
              </span>
              <span className="text-[9px] font-bold text-slate-450 dark:text-slate-500">
                ({idiotLoc})
              </span>
              <div className="w-2.5 h-2.5 bg-purple-500 rounded-full border-2 border-white dark:border-slate-900 mt-1 shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
            </div>

            {/* Connecting Vertical SVG Line */}
            <div className="h-16 w-8 relative flex items-center justify-center my-0.5">
              <svg className="h-full w-full" viewBox="0 0 32 64" fill="none">
                {/* Connector Line */}
                <line 
                  x1="16" y1="0" x2="16" y2="64" 
                  stroke="url(#lineGrad)" 
                  strokeWidth="2" 
                  strokeDasharray="4 4"
                />
                
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Pulsing heart in the center */}
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute flex items-center justify-center bg-white dark:bg-slate-950 p-1 rounded-full border border-purple-500/10 shadow-sm"
              >
                <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
              </motion.div>

              {/* Particle sliding down the connector line */}
              <motion.div
                animate={{ y: [-32, 32], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                className="absolute w-1.5 h-1.5 rounded-full bg-purple-400 filter blur-[0.5px] shadow-[0_0_4px_#a78bfa]"
                style={{ left: 'calc(50% - 3px)' }}
              />
            </div>

            {/* Bottom Node: Stupid */}
            <div className="flex flex-col items-center">
              <div className="w-2.5 h-2.5 bg-pink-500 rounded-full border-2 border-white dark:border-slate-900 mb-1 shadow-[0_0_8px_rgba(236,72,153,0.8)]" />
              <span className="text-[10px] font-black text-pink-650 dark:text-pink-400 tracking-wider uppercase">
                STUPID
              </span>
              <span className="text-[9px] font-bold text-slate-455 dark:text-slate-500">
                ({stupidLoc})
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DistanceConnection;
