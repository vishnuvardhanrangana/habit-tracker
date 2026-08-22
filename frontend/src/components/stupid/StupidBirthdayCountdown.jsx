import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Calendar, Sparkles, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getNextBirthday, isBirthdayToday } from '../../utils/birthdayHelper';

// Interactive floating bubble confetti for birthday surprise
const BirthdayConfetti = () => {
  const colors = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
  const particles = Array.from({ length: 60 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100 - 50, // width offset
    y: Math.random() * -300 - 100, // rise high
    size: Math.random() * 10 + 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 1.5,
    rotate: Math.random() * 360,
    duration: Math.random() * 2.5 + 2.5
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-25">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 150, x: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: p.y,
            x: p.x,
            rotate: p.rotate + 360
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
            repeat: Infinity
          }}
          className="absolute left-[50%] bottom-[10%] rounded-sm"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            marginLeft: -p.size / 2
          }}
        />
      ))}
    </div>
  );
};

const Digit = ({ value, label }) => (
  <div className="flex flex-col items-center px-2.5 py-2.5 bg-slate-950/40 dark:bg-slate-900/60 border border-purple-500/10 rounded-2xl min-w-[56px] md:min-w-[64px]">
    <motion.span
      key={value}
      initial={{ y: 8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -8, opacity: 0 }}
      className="text-lg md:text-xl font-black text-purple-650 dark:text-purple-300 font-mono tracking-tight"
    >
      {String(value).padStart(2, '0')}
    </motion.span>
    <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500 mt-1">
      {label}
    </span>
  </div>
);

const StupidBirthdayCountdown = ({ onBirthdayStateChange = () => {} }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isBirthday, setIsBirthday] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const target = getNextBirthday();
      
      // Check if today is Sept 28
      const isTodaySept28 = now.getMonth() === 8 && now.getDate() === 28;
      setIsBirthday(isTodaySept28);
      onBirthdayStateChange(isTodaySept28);

      if (isTodaySept28) {
        return;
      }

      const diff = target - now;
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60)
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [onBirthdayStateChange]);

  return (
    <Link to="/birthday" className="block max-w-sm w-full mx-auto group">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative overflow-hidden bg-white/40 dark:bg-slate-900/35 border border-purple-500/20 group-hover:border-purple-500/40 rounded-3xl p-5 md:p-6 shadow-premium dark:shadow-premium-dark backdrop-blur-md transition-all duration-300 cursor-pointer"
      >
        {/* Decorative gradient border effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-pink-500/0 to-indigo-500/10 pointer-events-none" />

        {isBirthday && <BirthdayConfetti />}

        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          {/* Header section */}
          <div className="flex items-center gap-2">
            {isBirthday ? (
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="p-2 bg-gradient-to-tr from-pink-500 to-rose-500 text-white rounded-xl shadow-lg"
              >
                <Gift className="w-5 h-5" />
              </motion.div>
            ) : (
              <div className="p-2 bg-purple-100 dark:bg-purple-950/40 text-purple-650 dark:text-purple-400 rounded-xl">
                <Calendar className="w-5 h-5" />
              </div>
            )}
            <h3 className="font-extrabold text-sm tracking-wide text-slate-850 dark:text-slate-200 uppercase">
              {isBirthday ? "IT'S PARTY TIME! 🎂" : "Surprise Countdown"}
            </h3>
          </div>

          {/* Dynamic quote based on days remaining */}
          <div className="text-xs font-black text-purple-650 dark:text-purple-400 max-w-xs animate-pulse">
            {isBirthday ? (
              <span>HAPPY BIRTHDAY STUPID! 🥳🎂🎉</span>
            ) : timeLeft.days === 1 ? (
              <span>TOMORROW IS THE BIG DAY! 🎂🎁</span>
            ) : timeLeft.days <= 3 ? (
              <span>Only {timeLeft.days} days left! The secret is hard to hide. 🤫</span>
            ) : timeLeft.days <= 5 ? (
              <span>BRO... {timeLeft.days} DAYS LEFT! 😭🎁</span>
            ) : timeLeft.days <= 10 ? (
              <span>{timeLeft.days} days to go! Prep is underway... 👀</span>
            ) : (
              <span>Something special is getting closer. 🎁</span>
            )}
          </div>

          {/* Counter digits */}
          {!isBirthday ? (
            <div className="flex items-center justify-center gap-1.5 md:gap-2">
              <Digit value={timeLeft.days} label="Days" />
              <span className="font-bold text-slate-400">:</span>
              <Digit value={timeLeft.hours} label="Hrs" />
              <span className="font-bold text-slate-400">:</span>
              <Digit value={timeLeft.minutes} label="Min" />
              <span className="font-bold text-slate-400">:</span>
              <Digit value={timeLeft.seconds} label="Sec" />
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: [0.95, 1.05, 0.95] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="py-4 px-6 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-indigo-600/20 border border-purple-500/30 rounded-2xl flex flex-col items-center"
            >
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 animate-bounce">
                HAPPY BIRTHDAY!
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mt-1">
                From Idiot with love ❤️
              </span>
            </motion.div>
          )}

          {/* Click helper hint */}
          <div className="text-[9px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
            <span>Click to enter event</span>
            <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default StupidBirthdayCountdown;
export { getNextBirthday };
