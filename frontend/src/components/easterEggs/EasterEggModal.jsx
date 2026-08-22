import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Flame, Award, Cake, Sparkles, X, Milestone } from 'lucide-react';

const ParticleItem = ({ type, delay }) => {
  const x = Math.random() * 260 - 130;
  const y = Math.random() * -240 - 60;
  const rotate = Math.random() * 360;
  const scale = Math.random() * 0.5 + 0.6;
  const duration = Math.random() * 1.5 + 1.8;

  const confettiColors = ['#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
  const color = type === 'confetti' ? confettiColors[Math.floor(Math.random() * confettiColors.length)] : undefined;

  return (
    <motion.div
      initial={{ x: 0, y: 20, opacity: 1, scale: 0.2, rotate: 0 }}
      animate={{ x, y, opacity: [1, 1, 0], scale: [0.2, scale, 0.1], rotate }}
      transition={{ duration, delay, ease: 'easeOut', repeat: Infinity }}
      className="absolute pointer-events-none select-none"
      style={{
        color: type === 'heart' ? '#f43f5e' : type === 'sparkle' ? '#f59e0b' : undefined,
        backgroundColor: type === 'confetti' ? color : undefined,
        width: type === 'confetti' ? '8px' : 'auto',
        height: type === 'confetti' ? '8px' : 'auto',
        borderRadius: type === 'confetti' ? (Math.random() > 0.5 ? '50%' : '0px') : undefined,
        fontSize: type === 'heart' ? '14px' : type === 'sparkle' ? '12px' : undefined,
      }}
    >
      {type === 'heart' && '❤️'}
      {type === 'sparkle' && '✨'}
    </motion.div>
  );
};

const EasterEggModal = ({ config, onClose }) => {
  const { id, display } = config;
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const listener = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Set visual properties based on Easter egg ID
  const getThemeProps = () => {
    switch (id) {
      case 'may-6-memory':
        return {
          icon: <Heart className="w-8 h-8 fill-rose-500/10 text-rose-500" />,
          particleType: 'heart',
          particleCount: 16,
          bgColor: 'from-rose-500/10 to-transparent',
          borderColor: 'border-rose-500/20',
          btnColor: 'from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700',
          pulseIcon: true,
        };
      case 'perfect-day':
        return {
          icon: <Sparkles className="w-8 h-8 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />,
          particleType: 'sparkle',
          particleCount: 20,
          bgColor: 'from-amber-500/10 to-transparent',
          borderColor: 'border-amber-500/25',
          btnColor: 'from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700',
          pulseIcon: false,
        };
      case 'streak-7':
      case 'streak-30':
        return {
          icon: id === 'streak-7' ? (
            <Flame className="w-8 h-8 text-orange-500 fill-orange-500/10" />
          ) : (
            <Award className="w-8 h-8 text-purple-400 fill-purple-400/10" />
          ),
          particleType: 'confetti',
          particleCount: 25,
          bgColor: 'from-orange-500/10 to-purple-500/10',
          borderColor: 'border-orange-500/20',
          btnColor: id === 'streak-7' ? 'from-orange-600 to-red-600' : 'from-purple-650 to-indigo-650',
          pulseIcon: true,
        };
      case 'birthday':
        return {
          icon: <Cake className="w-8 h-8 text-pink-500" />,
          particleType: 'confetti',
          particleCount: 30,
          bgColor: 'from-pink-500/15 to-transparent',
          borderColor: 'border-pink-500/20',
          btnColor: 'from-pink-600 to-rose-600',
          pulseIcon: true,
        };
      case 'long-distance':
        return {
          icon: <Heart className="w-8 h-8 text-purple-400 fill-purple-400/10 animate-pulse" />,
          particleType: 'sparkle',
          particleCount: 16,
          bgColor: 'from-purple-500/10 to-transparent',
          borderColor: 'border-purple-500/20',
          btnColor: 'from-purple-600 to-indigo-600',
          pulseIcon: false,
        };
      default:
        return {
          icon: <Sparkles className="w-8 h-8 text-purple-400" />,
          particleType: 'sparkle',
          particleCount: 12,
          bgColor: 'from-purple-500/10 to-transparent',
          borderColor: 'border-purple-500/20',
          btnColor: 'from-purple-650 to-indigo-650',
          pulseIcon: false,
        };
    }
  };

  const theme = getThemeProps();

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 dark:bg-slate-950/95 backdrop-blur-md p-4"
        onClick={onClose}
      >
        <motion.div
          initial={reducedMotion ? { opacity: 0, scale: 0.95 } : { scale: 0.85, opacity: 0, y: 15 }}
          animate={reducedMotion ? { opacity: 1, scale: 1 } : { scale: 1, opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { scale: 0.9, opacity: 0, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 26 }}
          onClick={(e) => e.stopPropagation()}
          className={`bg-slate-900 border ${theme.borderColor} rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden flex flex-col items-center select-none`}
        >
          {/* Ambient visual gradient */}
          <div className={`absolute inset-0 bg-gradient-to-tr ${theme.bgColor} pointer-events-none`} />

          {/* Particles (hidden in reduced motion) */}
          {!reducedMotion && Array.from({ length: theme.particleCount }).map((_, i) => (
            <ParticleItem key={i} type={theme.particleType} delay={i * 0.1} />
          ))}

          {/* Icon Header */}
          <motion.div
            animate={!reducedMotion && theme.pulseIcon ? { y: [0, -6, 0] } : {}}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className={`w-16 h-16 bg-slate-950/50 rounded-2xl flex items-center justify-center shadow-inner relative z-10 border ${theme.borderColor}`}
          >
            {theme.icon}
          </motion.div>

          {/* Title & Body */}
          <div className="relative z-10 mt-6 space-y-3">
            <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest animate-pulse">
              Secret Unlocked
            </span>
            <h3 className="text-xl font-black text-white mt-1 uppercase tracking-tight leading-snug">
              {display.title}
            </h3>
            {display.subtitle && (
              <p className="text-xs font-bold text-slate-300 italic">
                "{display.subtitle}"
              </p>
            )}
            <p className="text-xs text-slate-400 mt-2 font-semibold leading-relaxed">
              {display.text}
            </p>
          </div>

          {/* Footer close control */}
          <button
            onClick={onClose}
            className={`relative z-10 mt-8 w-full py-3 bg-gradient-to-r ${theme.btnColor} text-white rounded-xl text-xs font-bold shadow-md cursor-pointer border-0 transition-transform active:scale-98`}
          >
            Close Celebration
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EasterEggModal;
