import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Calendar, Gift, Sparkles, AlertCircle, ArrowDown, ChevronRight, HelpCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEasterEggs } from '../context/EasterEggContext';
import { getNextBirthday, isBirthdayToday, getBirthdayCountdownDetails } from '../utils/birthdayHelper';

// Predefined wishes cards
const birthdayWishes = [
  "I hope you laugh a lot this year.",
  "I hope you find things that make you genuinely happy.",
  "I hope you achieve the things you've been working toward.",
  "I hope you have people around you who make life lighter.",
  "And I hope we get to make more memories someday."
];

// Single Confetti Burst Particle helper
const ConfettiParticle = ({ x, color, delay, duration }) => {
  return (
    <motion.div
      initial={{ y: -20, x: 0, opacity: 1, scale: Math.random() * 0.4 + 0.6, rotate: 0 }}
      animate={{
        y: '80vh',
        x: x,
        opacity: [1, 1, 0],
        rotate: 720
      }}
      transition={{
        duration,
        delay,
        ease: 'easeOut'
      }}
      className="absolute rounded-sm pointer-events-none select-none z-30"
      style={{
        width: 10,
        height: 10,
        backgroundColor: color
      }}
    />
  );
};

// Rolling Animated Digit
const RollingDigit = ({ char }) => {
  const isNumber = !isNaN(parseInt(char, 10));
  if (!isNumber) {
    return <span className="mx-1 text-slate-400 font-bold">{char}</span>;
  }
  return (
    <div className="relative overflow-hidden h-9 w-6 flex items-center justify-center bg-slate-950/30 border border-purple-500/10 rounded-lg shadow-inner mx-0.5">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={char}
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -15, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="absolute font-mono font-black text-xl text-rose-500 dark:text-rose-455"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

const BirthdayExperience = () => {
  const { user } = useAuth();
  const { unlockEgg } = useEasterEggs();

  const [showMainContent, setShowMainContent] = useState(false);
  const [introStep, setIntroStep] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Live Timer states
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isToday, setIsToday] = useState(false);

  // Interactive cake states
  const [candlesLit, setCandlesLit] = useState(false);
  const [wishState, setWishState] = useState('unlit'); // unlit, lit, wishing, done
  const [showConfetti, setShowConfetti] = useState(false);

  // Floating Heart state
  const [heartState, setHeartState] = useState('idle'); // idle, expanding, text1, text2, text3, shrinking
  const [heartText, setHeartText] = useState('');

  // Confetti particles list state
  const [confettiBurst, setConfettiBurst] = useState([]);

  // Detect user motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const listener = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Centralized Live Countdown Setup
  useEffect(() => {
    const updateTime = () => {
      const todayVal = isBirthdayToday();
      setIsToday(todayVal);

      if (todayVal) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const now = new Date();
      const target = getNextBirthday();
      const diffMs = target - now;

      if (diffMs <= 0) {
        setIsToday(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diffMs / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diffMs / (1000 * 60)) % 60),
        seconds: Math.floor((diffMs / 1000) % 60)
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Cinematic Intro Steps
  useEffect(() => {
    if (showMainContent) return;

    // Session-check to prevent replaying intro repeatedly if already seen
    const seen = sessionStorage.getItem('stupid_birthday_intro_seen');
    if (seen) {
      setShowMainContent(true);
      if (isToday) {
        triggerConfettiShower();
      }
      return;
    }

    if (isToday) {
      // Birthday day mode reveals
      // 0: HAPPY BIRTHDAY, STUPID ❤️ (0s)
      // 1: Today isn't just another day (3.5s)
      // 2: It's your day (6.5s)
      // 3: and I'm really glad you exist (9.5s)
      // End: transition to main content (13s)
      const t1 = setTimeout(() => setIntroStep(1), 3200);
      const t2 = setTimeout(() => setIntroStep(2), 6200);
      const t3 = setTimeout(() => setIntroStep(3), 9200);
      const t4 = setTimeout(() => {
        sessionStorage.setItem('stupid_birthday_intro_seen', 'true');
        setShowMainContent(true);
        triggerConfettiShower();
      }, 12500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    } else {
      // Standard Countdown mode reveals
      // 0: Seed appears (0s)
      // 1: "Wait..." (2.5s)
      // 2: "There's something important today." (5s)
      // 3: "September 28 🎂" (7.5s)
      // 4: "Happy Birthday, Stupid." (10s)
      // End: transition to main content (13.5s)
      const t1 = setTimeout(() => setIntroStep(1), 2500);
      const t2 = setTimeout(() => setIntroStep(2), 5000);
      const t3 = setTimeout(() => setIntroStep(3), 7500);
      const t4 = setTimeout(() => setIntroStep(4), 10000);
      const t5 = setTimeout(() => {
        sessionStorage.setItem('stupid_birthday_intro_seen', 'true');
        setShowMainContent(true);
      }, 13200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        clearTimeout(t5);
      };
    }
  }, [showMainContent, isToday]);

  // Confetti trigger shower helper
  const triggerConfettiShower = () => {
    if (reducedMotion) return;
    
    const colors = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
    const particles = Array.from({ length: 45 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 200 - 100,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 0.4,
      duration: Math.random() * 2.2 + 1.8
    }));
    setConfettiBurst(particles);

    // Clear after animation completes
    setTimeout(() => {
      setConfettiBurst([]);
    }, 4500);
  };

  // Interactive cake candle lighting
  const handleCakeClick = () => {
    if (wishState !== 'unlit') return;

    setWishState('lit');
    setCandlesLit(true);
    triggerConfettiShower();

    // Make a wish reveal
    setTimeout(() => {
      setWishState('wishing');
    }, 2000);

    // Final wish quote reveal
    setTimeout(() => {
      setWishState('done');
      triggerConfettiShower();
    }, 5500);
  };

  // Floating Birthday Heart interaction
  const handleHeartClick = () => {
    if (heartState !== 'idle') return;

    setHeartState('expanding');
    setHeartText("One more year.");

    setTimeout(() => {
      setHeartState('text1');
    }, 1500);

    setTimeout(() => {
      setHeartState('text2');
      setHeartText("One more reason to celebrate you.");
    }, 3800);

    setTimeout(() => {
      setHeartState('text3');
      setHeartText("❤️");
    }, 6200);

    setTimeout(() => {
      setHeartState('shrinking');
      setHeartText("");
    }, 8500);

    setTimeout(() => {
      setHeartState('idle');
    }, 9700);
  };

  // Redirect non-Stupid users instantly
  if (user?.email !== 'stupid') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative min-h-screen text-slate-100 select-none overflow-hidden bg-slate-950">
      
      {/* Confetti container portal */}
      <div className="fixed inset-x-0 top-0 h-0 z-50 flex justify-center pointer-events-none">
        {confettiBurst.map(p => (
          <ConfettiParticle key={p.id} {...p} />
        ))}
      </div>

      {/* 1. Cinematic Intro Screens Overlay */}
      <AnimatePresence>
        {!showMainContent && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-center select-none"
          >
            {/* Pulsing Center seed point (Step 0) */}
            {introStep === 0 && (
              <motion.div
                initial={{ scale: 0.1, opacity: 0 }}
                animate={{ scale: [1, 2.5, 1], opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                className="absolute w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500/40 filter blur-sm"
              />
            )}

            <div className="max-w-xl mx-auto space-y-6 relative z-10 px-4">
              <AnimatePresence mode="wait">
                
                {/* --- Birthday Day Mode steps --- */}
                {isToday && (
                  <>
                    {introStep === 0 && (
                      <motion.div
                        key="bday0"
                        initial={{ opacity: 0, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, filter: 'blur(8px)' }}
                        transition={{ duration: 1.1 }}
                        className="space-y-2"
                      >
                        <span className="text-pink-500 text-[10px] font-black tracking-widest uppercase block animate-pulse">
                          Surprise Event
                        </span>
                        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
                          🎂 HAPPY BIRTHDAY, STUPID ❤️
                        </h1>
                      </motion.div>
                    )}

                    {introStep === 1 && (
                      <motion.p
                        key="bday1"
                        initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -15, filter: 'blur(6px)' }}
                        transition={{ duration: 0.9 }}
                        className="text-base md:text-lg font-bold text-slate-300"
                      >
                        "Today isn't just another day."
                      </motion.p>
                    )}

                    {introStep === 2 && (
                      <motion.p
                        key="bday2"
                        initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: -15, filter: 'blur(6px)' }}
                        transition={{ duration: 0.9 }}
                        className="text-base md:text-lg font-bold text-rose-455"
                      >
                        "It's your day."
                      </motion.p>
                    )}

                    {introStep === 3 && (
                      <motion.p
                        key="bday3"
                        initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
                        transition={{ duration: 1.2 }}
                        className="text-lg md:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 uppercase tracking-wide leading-relaxed"
                      >
                        "and I'm really glad you exist."
                      </motion.p>
                    )}
                  </>
                )}

                {/* --- Standard Countdown Mode steps --- */}
                {!isToday && (
                  <>
                    {introStep === 1 && (
                      <motion.p
                        key="cd1"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 0.6 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-xs font-black tracking-widest text-slate-500 uppercase"
                      >
                        Wait...
                      </motion.p>
                    )}

                    {introStep === 2 && (
                      <motion.p
                        key="cd2"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.8 }}
                        className="text-base font-bold text-slate-300"
                      >
                        There's something important today.
                      </motion.p>
                    )}

                    {introStep === 3 && (
                      <motion.h1
                        key="cd3"
                        initial={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
                        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
                        transition={{ duration: 1 }}
                        className="text-2xl md:text-3xl font-black text-purple-400 uppercase"
                      >
                        September 28 🎂
                      </motion.h1>
                    )}

                    {introStep === 4 && (
                      <motion.div
                        key="cd4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        className="space-y-1"
                      >
                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest block animate-pulse">
                          Countdown
                        </span>
                        <h2 className="text-xl font-bold text-slate-200">
                          Happy Birthday, Stupid.
                        </h2>
                      </motion.div>
                    )}
                  </>
                )}

              </AnimatePresence>
            </div>

            {/* Skip Intro button */}
            <button
              onClick={() => {
                sessionStorage.setItem('stupid_birthday_intro_seen', 'true');
                setShowMainContent(true);
                if (isToday) triggerConfettiShower();
              }}
              className="absolute bottom-10 right-10 bg-slate-900 border border-slate-800 text-slate-400 py-2 px-4 rounded-xl text-xs font-bold transition-all hover:text-white cursor-pointer"
            >
              Skip Intro
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Page Content Block */}
      {showMainContent && (
        <div className="max-w-2xl mx-auto px-6 py-12 md:py-20 space-y-24 md:space-y-36 relative z-10">
          
          {/* Decorative ambient glowing orbs */}
          {!reducedMotion && (
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none opacity-30">
              <div className="absolute top-[15%] left-[-10%] w-[55%] h-[40%] rounded-full bg-purple-500/5 blur-[120px]" />
              <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[40%] rounded-full bg-pink-500/5 blur-[110px]" />
            </div>
          )}

          {/* --- Section A: Mode Header (Countdown or Today!) --- */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            {isToday ? (
              <div className="space-y-4">
                <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest block animate-pulse">
                  Event Active 🎂
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
                  Happy Birthday, Stupid! ❤️
                </h2>
                <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                  "Today is yours. Life is a collection of all the little moments, and I'm really glad you exist."
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/25 rounded-2xl flex items-center justify-center mx-auto text-purple-400 animate-pulse">
                  <Calendar className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-purple-450 uppercase tracking-widest block">
                    Birthday surpise
                  </span>
                  <h2 className="text-2xl font-black text-white tracking-tight">
                    Until Stupid's Day 🎂
                  </h2>
                </div>

                {/* Rolling Digit Countdown Grid */}
                <div className="flex flex-col items-center space-y-4 bg-slate-950/70 border border-purple-500/15 rounded-3xl p-6 shadow-premium backdrop-blur-md max-w-sm mx-auto">
                  <div className="flex items-center justify-center gap-1">
                    {/* Days */}
                    <div className="flex flex-col items-center px-1">
                      <div className="flex">
                        {String(timeLeft.days).split('').map((c, i) => <RollingDigit key={i} char={c} />)}
                      </div>
                      <span className="text-[7px] font-extrabold uppercase tracking-widest text-slate-500 mt-1">Days</span>
                    </div>
                    <span className="text-slate-700 font-black mb-4">:</span>

                    {/* Hours */}
                    <div className="flex flex-col items-center px-1">
                      <div className="flex">
                        {String(timeLeft.hours).split('').map((c, i) => <RollingDigit key={i} char={c} />)}
                      </div>
                      <span className="text-[7px] font-extrabold uppercase tracking-widest text-slate-500 mt-1">Hours</span>
                    </div>
                    <span className="text-slate-700 font-black mb-4">:</span>

                    {/* Minutes */}
                    <div className="flex flex-col items-center px-1">
                      <div className="flex">
                        {String(timeLeft.minutes).split('').map((c, i) => <RollingDigit key={i} char={c} />)}
                      </div>
                      <span className="text-[7px] font-extrabold uppercase tracking-widest text-slate-500 mt-1">Mins</span>
                    </div>
                    <span className="text-slate-700 font-black mb-4">:</span>

                    {/* Seconds */}
                    <div className="flex flex-col items-center px-1">
                      <div className="flex">
                        {String(timeLeft.seconds).split('').map((c, i) => <RollingDigit key={i} char={c} />)}
                      </div>
                      <span className="text-[7px] font-extrabold uppercase tracking-widest text-slate-500 mt-1">Secs</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.section>

          {/* --- Section B: Central Birthday Card --- */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
            }}
            className="relative overflow-hidden bg-white/5 dark:bg-slate-900/40 border border-purple-500/10 rounded-3xl p-8 max-w-lg mx-auto shadow-premium text-center backdrop-blur-md"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full filter blur-xl" />
            
            <div className="space-y-6">
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest block animate-pulse">
                Private Letter
              </span>
              <h3 className="text-xl font-black text-white tracking-tight uppercase">
                For Stupid ❤️
              </h3>

              <div className="space-y-2 text-xs font-semibold text-slate-300 leading-relaxed max-w-xs mx-auto">
                <p>"Another year of you."</p>
                <p>"Another year of memories."</p>
                <p>"Another year of reasons to smile."</p>
              </div>

              <div className="pt-4 border-t border-purple-500/10 space-y-4">
                <p className="text-xs text-slate-400">
                  "I hope this year gives you moments you'll want to remember forever."
                </p>
                <p className="text-sm font-black text-rose-500 uppercase tracking-wider block">
                  Happy Birthday. ❤️
                </p>
              </div>
            </div>
          </motion.section>

          {/* --- Section C: Memory Connection Card --- */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
            }}
            className="space-y-4 text-center"
          >
            <span className="text-[10px] font-black text-purple-450 uppercase tracking-widest block">
              Memory Connection
            </span>
            <div className="bg-slate-950/70 border border-purple-500/10 rounded-2xl p-6 max-w-md mx-auto shadow-lg backdrop-blur-sm space-y-3">
              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block">
                Time Bridge
              </span>
              <p className="text-xs font-bold text-slate-200 leading-relaxed">
                "Somewhere between May 6, 2021 and September 28... so many days passed."
              </p>
              <p className="text-xs font-black text-rose-500 dark:text-rose-455">
                "But some people remain important through all of them."
              </p>
            </div>
          </motion.section>

          {/* --- Section D: Animated Birthday Timeline --- */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.4 }
              }
            }}
            className="space-y-8"
          >
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black text-rose-455 uppercase tracking-widest block">
                Timeline
              </span>
              <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                Birthday Timeline
              </h3>
            </div>

            {/* Vertical timeline */}
            <div className="relative border-l border-purple-500/20 max-w-xs mx-auto pl-6 space-y-10 py-2">
              
              {/* Node 1: May 6, 2021 */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                }}
                className="relative"
              >
                <div className="absolute -left-[30px] top-1 w-3.5 h-3.5 bg-slate-900 border border-purple-500/40 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest">May 6, 2021</span>
                  <p className="text-xs font-semibold text-slate-350">
                    "One of the days I still remember."
                  </p>
                </div>
              </motion.div>

              {/* Node 2: Distance years */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                }}
                className="relative"
              >
                <div className="absolute -left-[30px] top-1 w-3.5 h-3.5 bg-slate-900 border border-purple-500/40 rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest">Years of Distance</span>
                  <p className="text-xs font-semibold text-slate-350">
                    "Life kept moving."
                  </p>
                </div>
              </motion.div>

              {/* Node 3: Sept 28 (Secret click trigger) */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                }}
                className="relative group"
              >
                {/* Secret click timeline dot */}
                <div 
                  onClick={() => unlockEgg('birthday-secret')}
                  className="absolute -left-[35px] -top-1 w-6 h-6 bg-slate-900 border-2 border-purple-500/30 rounded-full flex items-center justify-center cursor-pointer shadow-md group-hover:border-purple-400 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                </div>
                <div className="space-y-1">
                  <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest">September 28</span>
                  <p className="text-xs font-bold text-rose-500 dark:text-rose-455">
                    "Today is yours."
                  </p>
                </div>
              </motion.div>

            </div>
          </motion.section>

          {/* --- Section E: Birthday Wishes Staggered Reveals --- */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: reducedMotion ? 0.05 : 0.35 }
              }
            }}
            className="space-y-6"
          >
            <div className="text-center space-y-1">
              <span className="text-[10px] font-black text-rose-455 uppercase tracking-widest block animate-pulse">
                Surprise
              </span>
              <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                Birthday Wishes
              </h3>
            </div>

            <div className="space-y-3.5 max-w-md mx-auto">
              {birthdayWishes.map((wish, idx) => (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 15, filter: 'blur(6px)' },
                    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7 } }
                  }}
                  className="p-4 bg-slate-900/30 dark:bg-slate-900/50 border border-purple-500/5 rounded-2xl text-xs font-semibold text-slate-350 leading-relaxed shadow-sm hover:border-purple-500/20 transition-all backdrop-blur-md"
                >
                  "{wish}"
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* --- Section F: Interactive Birthday Cake --- */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
            }}
            className="space-y-8 text-center"
          >
            <div className="space-y-1">
              <span className="text-[10px] font-black text-purple-450 uppercase tracking-widest block">
                Interactive Cake
              </span>
              <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                Birthday Cake
              </h3>
            </div>

            <div className="flex flex-col items-center space-y-6">
              {/* Minimal Birthday Cake Drawing */}
              <div 
                onClick={handleCakeClick}
                className="relative w-48 h-40 flex items-end justify-center cursor-pointer group"
              >
                {/* Cake base plate */}
                <div className="w-44 h-2.5 bg-slate-800 border border-purple-500/20 rounded-full shadow-md relative z-10" />

                {/* Cake layer */}
                <div className="w-36 h-20 bg-gradient-to-t from-purple-950/40 to-slate-900/60 border border-purple-500/15 rounded-t-2xl absolute bottom-2.5 z-0 flex flex-col justify-between overflow-hidden shadow-inner p-3">
                  {/* Frosting lines */}
                  <div className="w-full flex justify-around">
                    <div className="w-4 h-6 bg-pink-500/10 rounded-b-lg border-b border-pink-500/20" />
                    <div className="w-4 h-8 bg-purple-500/15 rounded-b-lg border-b border-purple-500/20" />
                    <div className="w-4 h-6 bg-indigo-500/10 rounded-b-lg border-b border-indigo-500/20" />
                  </div>
                </div>

                {/* Cake Candle */}
                <div className="w-2.5 h-10 bg-gradient-to-t from-rose-500 to-pink-400 rounded-t-sm absolute bottom-[90px] z-10 shadow flex flex-col items-center">
                  {/* Wick */}
                  <div className="w-[1.5px] h-2 bg-slate-700 absolute -top-2" />

                  {/* Flame animation if lit */}
                  {candlesLit && (
                    <motion.div
                      animate={{
                        scale: [1, 1.25, 0.95, 1.2, 1],
                        y: [0, -1, 0, -1, 0]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute -top-6 w-3 h-4 bg-gradient-to-t from-orange-500 via-yellow-400 to-transparent rounded-full filter blur-[1px] shadow-[0_0_12px_rgba(249,115,22,0.4)]"
                    />
                  )}
                </div>
              </div>

              {/* Wish status text reveals */}
              <div className="min-h-[50px] flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                  {wishState === 'unlit' && (
                    <motion.p
                      key="unlit"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      exit={{ opacity: 0 }}
                      className="text-[9px] font-black text-purple-400 uppercase tracking-widest"
                    >
                      Click the cake to light the candle 🎂
                    </motion.p>
                  )}
                  {wishState === 'lit' && (
                    <motion.p
                      key="lit"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs font-black text-yellow-400 uppercase tracking-wider block"
                    >
                      Make a wish.
                    </motion.p>
                  )}
                  {wishState === 'wishing' && (
                    <motion.p
                      key="wishing"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 0.8 }}
                      exit={{ opacity: 0 }}
                      className="text-xs font-bold text-slate-350 italic"
                    >
                      "Wishing..."
                    </motion.p>
                  )}
                  {wishState === 'done' && (
                    <motion.p
                      key="done"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-xs font-black text-rose-500 dark:text-rose-455 tracking-wide max-w-xs mx-auto leading-relaxed"
                    >
                      "Whatever it is, I hope it comes true. ❤️"
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.section>

          {/* --- Section G: Floating Birthday Heart --- */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1 }
            }}
            className="flex flex-col items-center justify-center space-y-4 py-8"
          >
            <span className="text-[9px] font-black text-rose-455 uppercase tracking-widest animate-pulse">
              One more year
            </span>

            {/* Heart button container */}
            <div className="relative flex flex-col items-center justify-center min-h-[90px] w-full">
              <motion.button
                onClick={handleHeartClick}
                disabled={heartState !== 'idle'}
                whileHover={{ scale: heartState === 'idle' ? 1.15 : 1 }}
                whileTap={{ scale: heartState === 'idle' ? 0.9 : 1 }}
                animate={
                  heartState === 'expanding' ? { scale: 1.4 } :
                  heartState === 'shrinking' ? { scale: 1 } : {}
                }
                className="p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 rounded-full shadow-lg cursor-pointer relative z-10"
              >
                <Heart className={`w-6 h-6 ${heartState !== 'idle' && heartState !== 'shrinking' ? 'fill-rose-500' : ''}`} />
              </motion.button>

              <AnimatePresence>
                {heartText && (
                  <motion.p
                    key={heartText}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                    className="absolute top-16 text-xs font-black text-rose-500 dark:text-rose-455 mt-2 text-center"
                  >
                    {heartText}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </motion.section>

        </div>
      )}
    </div>
  );
};

export default BirthdayExperience;
export { ConfettiParticle };
