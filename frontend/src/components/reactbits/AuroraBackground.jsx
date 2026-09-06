import React from 'react';
import { motion } from 'framer-motion';

/**
 * AuroraBackground (React Bits inspired)
 * Deep emotional red atmosphere: deep red → dark crimson → slightly darker red.
 * Heavy, warm, melancholic, intimate (love + sadness + longing).
 */
const AuroraBackground = ({ children, className = '' }) => {
  return (
    <div
      className={`relative min-h-screen bg-gradient-to-b from-[#1c0509] via-[#120205] to-[#0a0103] overflow-hidden text-rose-50 ${className}`}
    >
      {/* Deep Dark Crimson Aurora Blobs Layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        {/* Deep wine crimson mist */}
        <motion.div
          animate={{
            x: ['-4%', '5%', '-4%'],
            y: ['-3%', '7%', '-3%'],
            scale: [1, 1.07, 1],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-[15%] -left-[10%] w-[70vw] h-[70vw] max-w-[850px] max-h-[850px] rounded-full bg-gradient-to-br from-[#4c0519]/35 via-[#2b040e]/25 to-transparent blur-[140px]"
        />

        {/* Dark ruby melancholic glow */}
        <motion.div
          animate={{
            x: ['6%', '-5%', '6%'],
            y: ['4%', '-7%', '4%'],
            scale: [1.06, 0.95, 1.06],
          }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute top-[20%] -right-[15%] w-[65vw] h-[65vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-bl from-[#500717]/30 via-[#35040f]/20 to-transparent blur-[150px]"
        />

        {/* Deep burgundy ember */}
        <motion.div
          animate={{
            x: ['-5%', '5%', '-5%'],
            y: ['8%', '-4%', '8%'],
            scale: [0.96, 1.06, 0.96],
          }}
          transition={{
            duration: 36,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
          className="absolute -bottom-[20%] left-[15%] w-[60vw] h-[60vw] max-w-[750px] max-h-[750px] rounded-full bg-gradient-to-tr from-[#3b030d]/35 via-[#220207]/25 to-transparent blur-[160px]"
        />

        {/* Soft dark vignette to ensure text readability and prevent bright borders */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,#0a0103_85%)] opacity-75" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default AuroraBackground;
