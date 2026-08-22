import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEasterEggs } from '../../context/EasterEggContext';
import EasterEggToast from './EasterEggToast';
import EasterEggModal from './EasterEggModal';

import { easterEggConfig } from './easterEggConfig';

const SpecialSequenceOverlay = ({ eggId, onComplete }) => {
  const [step, setStep] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const config = easterEggConfig[eggId];

  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const steps = config?.display?.steps || [];

  useEffect(() => {
    if (steps.length === 0) {
      onComplete();
      return;
    }

    const timers = [];
    steps.forEach((_, idx) => {
      if (idx === 0) return;
      const t = setTimeout(() => {
        setStep(idx);
      }, idx * 2800);
      timers.push(t);
    });

    const finalTimer = setTimeout(() => {
      onComplete();
    }, steps.length * 2800 + 1000);
    timers.push(finalTimer);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [steps, onComplete]);

  // Very slow background particles for the "Secret Egg" dim/slow dimension
  const slowParticles = Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    duration: Math.random() * 15 + 18,
    delay: Math.random() * -10,
  }));

  const isBetweenUs = eggId === 'between-us-secret';
  const isBirthdaySecret = eggId === 'birthday-secret';

  return (
    <div className="fixed inset-0 z-[100000] bg-slate-950/98 backdrop-blur-lg flex items-center justify-center text-center select-none overflow-hidden">
      {/* Floating particles background (skipped on reduced motion) */}
      {!reducedMotion && slowParticles.map(p => (
        <motion.div
          key={p.id}
          initial={{ y: 60, opacity: 0.05 }}
          animate={{ y: -60, opacity: [0.05, 0.35, 0.05] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'linear' }}
          className="absolute bg-purple-400 rounded-full"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
          }}
        />
      ))}

      <div className="relative z-10 max-w-md px-6">
        <AnimatePresence mode="wait">
          {steps.map((text, idx) => {
            if (idx !== step) return null;
            const isLast = idx === steps.length - 1;
            return (
              <motion.p
                key={idx}
                initial={{ opacity: 0, filter: 'blur(6px)', scale: isLast ? 0.96 : 1 }}
                animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                exit={{ opacity: 0, filter: 'blur(6px)', scale: isLast ? 0.96 : 1 }}
                transition={{ duration: isLast ? 1.1 : 0.9 }}
                className={
                  isLast
                    ? (isBetweenUs || isBirthdaySecret
                        ? "text-lg md:text-xl font-black text-rose-400 uppercase tracking-wide leading-relaxed"
                        : "text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 uppercase tracking-wide leading-relaxed")
                    : "text-base md:text-lg font-black text-white uppercase tracking-wider leading-relaxed"
                }
              >
                {text}
              </motion.p>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

const EasterEggManager = () => {
  const {
    activeModal,
    closeModal,
    toasts,
    removeToast,
    specialSequenceActive,
    setSpecialSequenceActive,
    isStupid
  } = useEasterEggs();

  // If not logged into the Stupid account, render absolutely nothing
  if (!isStupid) return null;

  return (
    <>
      {/* Toast Notification Container stack (top right) */}
      <div className="fixed top-24 right-6 z-[10000] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <EasterEggToast
              key={toast.id}
              toast={toast}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Modal Dialog celebrations */}
      <AnimatePresence>
        {activeModal && (
          <EasterEggModal
            config={activeModal}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>

      {/* Secret Egg sequence dimming dimension */}
      <AnimatePresence>
        {specialSequenceActive && (
          <SpecialSequenceOverlay
            eggId={specialSequenceActive}
            onComplete={() => setSpecialSequenceActive(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default EasterEggManager;
