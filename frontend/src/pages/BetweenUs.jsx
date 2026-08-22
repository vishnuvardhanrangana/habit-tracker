import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Heart, Calendar, Clock, ChevronRight, HelpCircle, Sun, Cloud, Moon, Sunrise, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEasterEggs } from '../context/EasterEggContext';

// Predefined daily messages for EGG 13
const dailyMessages = [
  "Today feels a little longer.",
  "Some days I miss you more than usual.",
  "Another day closer to seeing you again.",
  "Wish you were here for this moment.",
  "Some people become part of your routine. You became part of my thoughts."
];

// Interactive things I would tell you card phrases
const tellYouMessages = [
  "I missed you today.",
  "You crossed my mind again.",
  "I wish you were here.",
  "I hope you're doing okay.",
  "I can't wait to make new memories with you.",
  "I still remember May 6."
];

// Slow rising background particle component
const FloatingMemoryParticle = ({ type, x, delay, speed, scale }) => {
  return (
    <motion.div
      initial={{ y: '110vh', x, opacity: 0, rotate: 0 }}
      animate={{
        y: '-10vh',
        opacity: [0, 0.4, 0.4, 0],
        rotate: 360
      }}
      transition={{
        duration: speed,
        delay,
        ease: 'linear',
        repeat: Infinity
      }}
      className="absolute pointer-events-none select-none text-rose-500/20 dark:text-purple-400/25 z-0"
      style={{ scale }}
    >
      {type === 'heart' ? '❤️' : type === 'sparkle' ? '✨' : '•'}
    </motion.div>
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
          className="absolute font-mono font-black text-xl text-rose-500 dark:text-rose-400"
        >
          {char}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

const BetweenUs = () => {
  const { user } = useAuth();
  const { unlockEgg } = useEasterEggs();


  const [introStep, setIntroStep] = useState(0);
  const [showMainContent, setShowMainContent] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Counters states
  const [elapsed, setElapsed] = useState({ years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Interactive Card counts
  const [tellYouIndex, setTellYouIndex] = useState(0);
  const [isTellYouComplete, setIsTellYouComplete] = useState(false);

  // Heart click animations
  const [heartState, setHeartState] = useState('idle'); // idle, expanding, text1, text2, text3, shrinking
  const [heartText, setHeartText] = useState('');

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });

  // Parallax transforms
  const floatingOrbsY = useTransform(scrollYProgress, [0, 1], ['0%', '-15%']);

  // Detect user motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const listener = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Intro Cinematic Timeline Loops
  useEffect(() => {
    if (showMainContent) return;
    
    // Auto cycle stages:
    // 0: "Between Us" (0s)
    // 1: "Some distances are measured in kilometres." (3s)
    // 2: "Some are measured in days." (6s)
    // 3: "Some are measured in all the little moments..." (9s)
    // 4: "I miss you." (12.5s)
    // End: enter main page (15.5s)
    const t1 = setTimeout(() => setIntroStep(1), 3200);
    const t2 = setTimeout(() => setIntroStep(2), 6400);
    const t3 = setTimeout(() => setIntroStep(3), 9600);
    const t4 = setTimeout(() => setIntroStep(4), 13200);
    const t5 = setTimeout(() => {
      setShowMainContent(true);
    }, 16500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [showMainContent]);

  // Live Timer Setup since May 6, 2021
  useEffect(() => {
    const startDate = new Date('2021-05-06T00:00:00');
    
    const calculateTime = () => {
      const now = new Date();
      let diffMs = now - startDate;
      if (diffMs < 0) diffMs = 0;

      // Absolute Breakdown
      const totalSecs = Math.floor(diffMs / 1000);
      const seconds = totalSecs % 60;
      const totalMins = Math.floor(totalSecs / 60);
      const minutes = totalMins % 60;
      const totalHours = Math.floor(totalMins / 60);
      const hours = totalHours % 24;

      // Estimate years and months
      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();
      let days = now.getDate() - startDate.getDate();

      if (days < 0) {
        // Borrow days from previous month
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
      }
      if (months < 0) {
        months += 12;
        years--;
      }

      setElapsed({ years, months, days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Redirect non-Stupid users instantly for perfect isolation
  if (user?.email !== 'stupid') {
    return <Navigate to="/" replace />;
  }

  // Predefined local messages selection logic (date-based selection)
  const getDailyMessage = () => {
    const today = new Date();
    const index = (today.getFullYear() + today.getMonth() + today.getDate()) % dailyMessages.length;
    return dailyMessages[index];
  };

  // Interactive Card progress clicks
  const handleTellYouClick = () => {
    if (isTellYouComplete) return;

    if (tellYouIndex + 1 >= tellYouMessages.length) {
      setIsTellYouComplete(true);
    } else {
      setTellYouIndex(prev => prev + 1);
    }
  };

  // Interactive Heart expansions checks
  const handleHeartClick = () => {
    if (heartState !== 'idle') return;

    setHeartState('expanding');
    setHeartText("Still here.");

    // Sequence timing
    setTimeout(() => {
      setHeartState('text1');
    }, 1500);

    setTimeout(() => {
      setHeartState('text2');
      setHeartText("Still missing you.");
    }, 3500);

    setTimeout(() => {
      setHeartState('text3');
      setHeartText("Still looking forward to seeing you again.");
    }, 6000);

    setTimeout(() => {
      setHeartState('shrinking');
      setHeartText("");
    }, 9000);

    setTimeout(() => {
      setHeartState('idle');
    }, 10200);
  };

  // Custom static counter display format
  const getStaticCounterText = () => {
    return `${elapsed.years} Years, ${elapsed.months} Months, and ${elapsed.days} Days`;
  };

  // Timeline particles list
  const memoryParticles = Array.from({ length: reducedMotion ? 0 : 20 }).map((_, i) => ({
    id: i,
    type: i % 3 === 0 ? 'heart' : i % 3 === 1 ? 'sparkle' : 'dot',
    x: `${Math.random() * 100}%`,
    delay: Math.random() * -30,
    speed: Math.random() * 15 + 18,
    scale: Math.random() * 0.4 + 0.6
  }));

  return (
    <div ref={containerRef} className="relative min-h-screen text-slate-100 font-sans antialiased overflow-hidden select-none bg-slate-950">
      
      {/* 1. Cinematic Intro Opening Screen (fixed Overlay) */}
      <AnimatePresence>
        {!showMainContent && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center p-6 text-center select-none"
          >
            {/* Particles background */}
            {!reducedMotion && memoryParticles.map(p => (
              <FloatingMemoryParticle key={p.id} {...p} />
            ))}

            <div className="max-w-xl mx-auto space-y-6 relative z-10 px-4">
              <AnimatePresence mode="wait">
                {introStep === 0 && (
                  <motion.div
                    key="intro0"
                    initial={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
                    animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
                    exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="space-y-2"
                  >
                    <span className="text-rose-500 font-extrabold text-sm tracking-widest uppercase block animate-pulse">
                      A Private Letter
                    </span>
                    <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                      Between Us
                    </h1>
                  </motion.div>
                )}

                {introStep === 1 && (
                  <motion.p
                    key="intro1"
                    initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -15, filter: 'blur(6px)' }}
                    transition={{ duration: 1 }}
                    className="text-lg md:text-xl font-bold text-slate-350 leading-relaxed max-w-sm mx-auto"
                  >
                    "Some distances are measured in kilometres."
                  </motion.p>
                )}

                {introStep === 2 && (
                  <motion.p
                    key="intro2"
                    initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -15, filter: 'blur(6px)' }}
                    transition={{ duration: 1 }}
                    className="text-lg md:text-xl font-bold text-slate-350 leading-relaxed max-w-sm mx-auto"
                  >
                    "Some are measured in days."
                  </motion.p>
                )}

                {introStep === 3 && (
                  <motion.p
                    key="intro3"
                    initial={{ opacity: 0, y: 15, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -15, filter: 'blur(6px)' }}
                    transition={{ duration: 1.1 }}
                    className="text-base md:text-lg font-bold text-slate-350 leading-relaxed max-w-md mx-auto"
                  >
                    "Some are measured in all the little moments you wish you could share with someone."
                  </motion.p>
                )}

                {introStep === 4 && (
                  <motion.h2
                    key="intro4"
                    initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="text-3xl md:text-4xl font-black text-rose-455 tracking-tight flex flex-col items-center gap-3"
                  >
                    <span>I miss you.</span>
                    <Heart className="w-7 h-7 text-rose-500 fill-rose-500 animate-bounce" />
                  </motion.h2>
                )}
              </AnimatePresence>
            </div>

            {/* Skip cinematic controls */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              whileHover={{ opacity: 1 }}
              onClick={() => setShowMainContent(true)}
              className="absolute bottom-10 right-10 bg-slate-900 border border-slate-800 text-slate-400 py-2 px-4 rounded-xl text-xs font-bold transition-all hover:text-white cursor-pointer"
            >
              Skip Intro
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Main Page Layout */}
      {showMainContent && (
        <div className="relative z-10 w-full min-h-screen flex flex-col bg-slate-950 text-slate-200">
          
          {/* Ambient flowing orbs (parallax background) */}
          {!reducedMotion && (
            <motion.div 
              style={{ y: floatingOrbsY }}
              className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none opacity-40"
            >
              <div className="absolute top-[10%] left-[-15%] w-[60%] h-[40%] rounded-full bg-rose-500/5 blur-[120px]" />
              <div className="absolute top-[45%] right-[-15%] w-[55%] h-[45%] rounded-full bg-purple-500/5 blur-[130px]" />
              <div className="absolute bottom-[5%] left-[20%] w-[50%] h-[35%] rounded-full bg-indigo-500/5 blur-[110px]" />
            </motion.div>
          )}

          {/* Floating Memory Particles (Parallax layered background) */}
          {!reducedMotion && memoryParticles.map(p => (
            <FloatingMemoryParticle key={p.id} {...p} />
          ))}

          {/* Letter Content Container */}
          <div className="max-w-2xl mx-auto px-6 py-12 md:py-20 space-y-24 md:space-y-36 relative z-10">
            
            {/* --- Section A: Cinematic Greeting & Daily message --- */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-4"
            >
              <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest block animate-pulse">
                Between Us ❤️
              </span>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                Hey, Stupid.
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Sometimes the screen feels like a thin window between different worlds. Let's look back and see what's been saved.
              </p>

              {/* Deterministic daily message card */}
              <div className="bg-white/5 dark:bg-slate-900/40 border border-purple-500/10 rounded-2xl p-4 max-w-sm mx-auto shadow-lg backdrop-blur-sm">
                <span className="text-[8px] font-extrabold uppercase tracking-widest text-rose-455 block mb-1">
                  Today's Thought
                </span>
                <p className="text-xs font-bold text-slate-350 italic">
                  "{getDailyMessage()}"
                </p>
              </div>
            </motion.section>

            {/* --- Section B: Last Meeting static counter --- */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
              }}
              className="space-y-6 text-center"
            >
              <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/25 rounded-2xl flex items-center justify-center mx-auto text-rose-500">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-rose-455 uppercase tracking-widest block">
                  The last time we met
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  May 6, 2021
                </h3>
                <p className="text-xs font-semibold text-slate-400">
                  And somehow, that day still feels close.
                </p>
              </div>

              {/* Large static counter card */}
              <div className="bg-slate-950/70 border border-rose-500/10 rounded-3xl p-6 max-w-md mx-auto shadow-premium backdrop-blur-md">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-rose-500/80 block mb-1">
                  Time Passed
                </span>
                <p className="text-base font-black text-rose-400">
                  {getStaticCounterText()}
                </p>
                <span className="text-[9px] font-medium text-slate-500 block mt-2 uppercase tracking-wide">
                  Idiot & Stupid
                </span>
              </div>
            </motion.section>

            {/* --- Section C: Every Second live counter with rolling digits --- */}
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
              <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/25 rounded-2xl flex items-center justify-center mx-auto text-purple-400">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-black text-purple-450 uppercase tracking-widest block">
                  Every Second Ticks
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  Since May 6, 2021
                </h3>
              </div>

              {/* Rolling digits counter grid */}
              <div className="flex flex-col items-center space-y-4 bg-slate-950/70 border border-purple-500/15 rounded-3xl p-6 shadow-premium backdrop-blur-md max-w-lg mx-auto">
                <div className="flex flex-wrap items-center justify-center gap-y-3">
                  {/* Years */}
                  <div className="flex flex-col items-center px-2">
                    <div className="flex">
                      {String(elapsed.years).split('').map((c, i) => <RollingDigit key={i} char={c} />)}
                    </div>
                    <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 mt-1">Years</span>
                  </div>
                  <span className="text-slate-700 font-black mb-4">:</span>

                  {/* Months */}
                  <div className="flex flex-col items-center px-2">
                    <div className="flex">
                      {String(elapsed.months).split('').map((c, i) => <RollingDigit key={i} char={c} />)}
                    </div>
                    <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 mt-1">Months</span>
                  </div>
                  <span className="text-slate-700 font-black mb-4">:</span>

                  {/* Days */}
                  <div className="flex flex-col items-center px-2">
                    <div className="flex">
                      {String(elapsed.days).split('').map((c, i) => <RollingDigit key={i} char={c} />)}
                    </div>
                    <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 mt-1">Days</span>
                  </div>
                  <span className="text-slate-700 font-black mb-4">:</span>

                  {/* Hours */}
                  <div className="flex flex-col items-center px-2">
                    <div className="flex">
                      {String(elapsed.hours).split('').map((c, i) => <RollingDigit key={i} char={c} />)}
                    </div>
                    <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 mt-1">Hrs</span>
                  </div>
                  <span className="text-slate-700 font-black mb-4">:</span>

                  {/* Minutes */}
                  <div className="flex flex-col items-center px-2">
                    <div className="flex">
                      {String(elapsed.minutes).split('').map((c, i) => <RollingDigit key={i} char={c} />)}
                    </div>
                    <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 mt-1">Min</span>
                  </div>
                  <span className="text-slate-700 font-black mb-4">:</span>

                  {/* Seconds */}
                  <div className="flex flex-col items-center px-2">
                    <div className="flex">
                      {String(elapsed.seconds).split('').map((c, i) => <RollingDigit key={i} char={c} />)}
                    </div>
                    <span className="text-[8px] font-extrabold uppercase tracking-widest text-slate-500 mt-1">Sec</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-purple-500/10 w-full text-center space-y-2">
                  <p className="text-xs font-bold text-slate-400 italic">
                    "Every second keeps moving."
                  </p>
                  <p className="text-xs font-black text-rose-500 dark:text-rose-400 max-w-sm mx-auto leading-relaxed">
                    And somehow, I still wish I could pause time and spend a little more of it with you.
                  </p>
                </div>
              </div>
            </motion.section>

            {/* --- Section D: What I Miss staggered reveals --- */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: reducedMotion ? 0.05 : 0.35
                  }
                }
              }}
              className="space-y-6"
            >
              <div className="text-center space-y-1">
                <span className="text-[10px] font-black text-rose-455 uppercase tracking-widest block">
                  Confession
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                  What I Miss
                </h3>
              </div>

              <div className="space-y-3.5 max-w-md mx-auto">
                {[
                  "I miss having you nearby.",
                  "I miss the little conversations.",
                  "I miss laughing about things that probably weren't even that funny.",
                  "I miss knowing that I could simply see you.",
                  "I miss the ordinary moments most.",
                  "I miss you being part of the same place, not just part of my thoughts."
                ].map((sentence, idx) => (
                  <motion.div
                    key={idx}
                    variants={{
                      hidden: { opacity: 0, y: 15, filter: 'blur(6px)' },
                      visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7 } }
                    }}
                    className="p-4 bg-slate-900/30 dark:bg-slate-900/50 border border-purple-500/5 rounded-2xl text-xs font-semibold text-slate-300 leading-relaxed shadow-sm hover:border-purple-500/20 transition-all duration-300 backdrop-blur-md"
                  >
                    "{sentence}"
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* --- Section E: A Normal Day Without You Timeline --- */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
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
                <span className="text-[10px] font-black text-purple-450 uppercase tracking-widest block">
                  Routine
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                  A normal day without you
                </h3>
              </div>

              {/* Vertical Timeline container */}
              <div className="relative border-l border-purple-500/20 max-w-sm mx-auto pl-6 space-y-8 py-2">
                {[
                  { stage: "Morning", text: "Another day starts.", icon: <Sunrise className="w-3.5 h-3.5 text-orange-400" /> },
                  { stage: "Afternoon", text: "Life gets busy.", icon: <Sun className="w-3.5 h-3.5 text-yellow-400" /> },
                  { stage: "Evening", text: "And then everything gets quiet.", icon: <Cloud className="w-3.5 h-3.5 text-indigo-400" /> },
                  { stage: "Night", text: "And somehow, you're still the person I think about.", icon: <Moon className="w-3.5 h-3.5 text-purple-400 fill-purple-400/20" /> }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: 'easeOut' } }
                    }}
                    className="relative group"
                  >
                    {/* Glowing Bullet dot indicator */}
                    <div className="absolute -left-[31px] top-1 w-4 h-4 bg-slate-900 border border-purple-500/40 rounded-full flex items-center justify-center group-hover:border-purple-400 transition-colors">
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full group-hover:scale-125 transition-transform" />
                    </div>

                    <div className="space-y-1">
                      <span className="text-[8px] font-black text-purple-400 uppercase tracking-widest flex items-center gap-1">
                        {item.icon}
                        {item.stage}
                      </span>
                      <p className="text-xs font-bold text-slate-200">
                        {item.text}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.section>

            {/* --- Section F: If You Were Here scroll reveals --- */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: reducedMotion ? 0.05 : 0.4 }
                }
              }}
              className="space-y-6 text-center"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-black text-rose-455 uppercase tracking-widest block">
                  Scenarios
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                  If you were here...
                </h3>
              </div>

              <div className="space-y-4 max-w-md mx-auto">
                {[
                  "I'd probably want to talk about everything.",
                  "Even the completely useless things.",
                  "I'd want to laugh.",
                  "I'd want to make new memories.",
                  "I'd want to make ordinary days feel special.",
                  "I'd simply want more time with you."
                ].map((phrase, idx) => {
                  const isLast = idx === 5;
                  return (
                    <motion.p
                      key={idx}
                      variants={{
                        hidden: { opacity: 0, y: 10, filter: 'blur(4px)' },
                        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6 } }
                      }}
                      className={
                        isLast 
                          ? "text-sm font-black text-rose-500 uppercase tracking-wide block pt-2"
                          : "text-xs font-semibold text-slate-350"
                      }
                    >
                      {phrase}
                    </motion.p>
                  );
                })}
              </div>
            </motion.section>

            {/* --- Section G: Lifetime Message & heart glow --- */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: 'easeOut' } }
              }}
              className="relative overflow-hidden bg-slate-900/40 border border-purple-500/20 rounded-3xl p-8 max-w-lg mx-auto shadow-premium text-center backdrop-blur-md"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-transparent pointer-events-none" />
              
              <div className="relative z-10 space-y-6">
                <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest block animate-pulse">
                  Forever
                </span>
                <h3 className="text-xl font-black text-white tracking-tight uppercase">
                  Not Just Today
                </h3>

                <div className="space-y-2.5 text-xs text-slate-300 font-semibold leading-relaxed max-w-sm mx-auto">
                  <p>"I don't just want one special day with you."</p>
                  <p>"I want the boring days too."</p>
                  <p>"The random conversations."</p>
                  <p>"The unexpected laughs."</p>
                  <p>"The quiet evenings."</p>
                  <p>"The stupid jokes."</p>
                  <p>"The memories we haven't made yet."</p>
                </div>

                <div className="pt-4 border-t border-purple-500/10 space-y-4">
                  <p className="text-sm font-black text-rose-500 uppercase tracking-wider">
                    "I want a lifetime of those little moments."
                  </p>
                  
                  <div className="space-y-1 text-[11px] text-slate-455 font-bold">
                    <p>I don't know when we'll meet again.</p>
                    <p>But I know I want that day to come.</p>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* --- Section H: Things I would tell you interactive card --- */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
              }}
              className="space-y-6 text-center"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-black text-purple-450 uppercase tracking-widest block">
                  Interactive
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                  Things I would tell you
                </h3>
              </div>

              <div 
                onClick={handleTellYouClick}
                className="bg-white/5 dark:bg-slate-900/40 border border-purple-500/20 rounded-3xl p-6 max-w-md mx-auto shadow-premium backdrop-blur-md cursor-pointer hover:border-purple-500/40 transition-all duration-300 min-h-[160px] flex flex-col justify-between group"
              >
                <div className="flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-purple-400" />
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                    Card Reveal
                  </span>
                </div>

                <div className="py-4">
                  <AnimatePresence mode="wait">
                    {!isTellYouComplete ? (
                      <motion.p
                        key={tellYouIndex}
                        initial={{ opacity: 0, rotateX: 90 }}
                        animate={{ opacity: 1, rotateX: 0 }}
                        exit={{ opacity: 0, rotateX: -90 }}
                        transition={{ duration: 0.3 }}
                        className="text-sm font-bold text-slate-200"
                      >
                        "{tellYouMessages[tellYouIndex]}"
                      </motion.p>
                    ) : (
                      <motion.p
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-sm font-black text-rose-500 dark:text-rose-400 leading-relaxed"
                      >
                        "You already knew most of these, didn't you? ❤️"
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="text-[8px] font-extrabold text-purple-400 uppercase tracking-wider flex items-center justify-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{!isTellYouComplete ? "Tap to continue" : "Revealed"}</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </motion.section>

            {/* --- Section I: Interactive heart sequence --- */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { duration: 0.8 } }
              }}
              className="flex flex-col items-center justify-center space-y-4 py-8"
            >
              <span className="text-[9px] font-black text-rose-455 uppercase tracking-widest animate-pulse">
                Click me
              </span>

              {/* Heart animation box */}
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
                  className="p-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 rounded-full shadow-lg shadow-rose-500/5 cursor-pointer relative z-10"
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
                      className="absolute top-16 text-xs font-black text-rose-500 dark:text-rose-400 mt-2 text-center"
                    >
                      {heartText}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.section>

            {/* --- Section J: Until We Meet Again empty timeline & Someday secret click --- */}
            <motion.section
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
              }}
              className="space-y-8 text-center pb-12"
            >
              <div className="space-y-1">
                <span className="text-[10px] font-black text-purple-450 uppercase tracking-widest block">
                  Timeline
                </span>
                <h3 className="text-2xl font-black text-white tracking-tight uppercase">
                  Until we meet again...
                </h3>
              </div>

              {/* Glowing empty future timeline */}
              <div className="flex flex-col items-center max-w-sm mx-auto relative py-6">
                <div className="flex items-center justify-between w-full relative z-10 px-4">
                  {/* Past node */}
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-slate-900 border-2 border-rose-500/60 rounded-full flex items-center justify-center text-rose-500 shadow-lg shadow-rose-500/10">
                      ❤️
                    </div>
                    <span className="text-[10px] font-black text-slate-300 mt-2">May 6, 2021</span>
                  </div>

                  {/* Future node (Someday secret click) */}
                  <div className="flex flex-col items-center">
                    <motion.div 
                      onClick={() => unlockEgg('between-us-secret')}
                      whileHover={{ scale: 1.1, boxShadow: '0 0 15px rgba(168,85,247,0.4)' }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 bg-slate-900 border-2 border-purple-500/40 rounded-full flex items-center justify-center text-purple-400 shadow-md shadow-purple-500/5 cursor-pointer relative"
                    >
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      {/* Ambient outer pulsing ring */}
                      <motion.div
                        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 2.2, repeat: Infinity }}
                        className="absolute inset-0 rounded-full border border-purple-400 pointer-events-none"
                      />
                    </motion.div>
                    <span className="text-[10px] font-black text-purple-450 mt-2 uppercase tracking-wide">Someday</span>
                  </div>
                </div>

                {/* Timeline connector bridge */}
                <div className="absolute top-11 left-12 right-12 h-[2px] bg-gradient-to-r from-rose-500/30 to-purple-500/30 z-0">
                  <motion.div
                    animate={!reducedMotion ? { x: ['-100%', '100%'] } : {}}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="h-full w-24 bg-gradient-to-r from-transparent via-purple-400/80 to-transparent absolute"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-purple-500/10 max-w-sm mx-auto">
                <p className="text-xs font-semibold text-slate-400 italic">
                  "There are still so many memories left to make."
                </p>
                <div className="space-y-1 text-xs font-black text-rose-500 dark:text-rose-455">
                  <p>Until then, I'll keep moving forward.</p>
                  <p>And I'll keep saving a little space in every day for you. ❤️</p>
                </div>
              </div>
            </motion.section>

          </div>
        </div>
      )}
    </div>
  );
};

export default BetweenUs;
