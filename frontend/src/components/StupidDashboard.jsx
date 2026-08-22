import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Plus, Check, Calendar, BarChart3, ChevronRight, Award, Flame, 
  CheckCircle, TrendingUp, CheckSquare, Sparkles 
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { ICONS } from './HabitModal';
import Antigravity from './Antigravity';
import StupidQuote from './stupid/StupidQuote';
import StupidBirthdayCountdown, { getNextBirthday } from './stupid/StupidBirthdayCountdown';

// Imports for the special "Little World of Idiot" experience
import TimeSinceMeeting from './stupid/TimeSinceMeeting';
import UntilWeMeetAgain from './stupid/UntilWeMeetAgain';
import DistanceConnection from './stupid/DistanceConnection';
import SameSkyExperience from './stupid/SameSkyExperience';
import SendAHug from './stupid/SendAHug';
import TeleportMessage from './stupid/TeleportMessage';
import ThingsToSay from './stupid/ThingsToSay';
import OneDay from './stupid/OneDay';
import StupidSurprise from './stupid/StupidSurprise';
import StupidEasterEgg from './stupid/StupidEasterEgg';
import { useEasterEggs } from '../context/EasterEggContext';

// --- Counting Number Effect ---
export const CountingNumber = ({ value, duration = 800 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseInt(value, 10) || 0;
    if (start === end) {
      setCount(end);
      return;
    }
    const startTime = performance.now();
    let animationFrameId;

    const updateNumber = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const easeProgress = progress * (2 - progress);
      const current = Math.floor(easeProgress * (end - start) + start);
      setCount(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateNumber);
      }
    };

    animationFrameId = requestAnimationFrame(updateNumber);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value, duration]);

  return <span>{count}</span>;
};

// --- Canvas Animated Background ---
export const StupidBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Orbs parameters
    const orbs = [
      { x: width * 0.2, y: height * 0.3, vx: 0.3, vy: 0.2, radius: 180, color: 'rgba(16, 185, 129, 0.04)' },
      { x: width * 0.8, y: height * 0.7, vx: -0.2, vy: -0.3, radius: 240, color: 'rgba(99, 102, 241, 0.03)' },
      { x: width * 0.5, y: height * 0.5, vx: 0.15, vy: -0.15, radius: 210, color: 'rgba(236, 72, 153, 0.03)' }
    ];

    // Particles parameters
    const particles = Array.from({ length: 25 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: Math.random() * 0.4 - 0.2,
      vy: -(Math.random() * 0.5 + 0.2),
      radius: Math.random() * 2 + 1,
      alpha: Math.random() * 0.4 + 0.1,
      decay: Math.random() * 0.005 + 0.002
    }));

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Draw glowing orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x - orb.radius < 0 || orb.x + orb.radius > width) orb.vx *= -1;
        if (orb.y - orb.radius < 0 || orb.y + orb.radius > height) orb.vy *= -1;

        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw rising particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.y < 0 || p.alpha <= 0) {
          p.x = Math.random() * width;
          p.y = height + 10;
          p.alpha = Math.random() * 0.4 + 0.1;
          p.vx = Math.random() * 0.4 - 0.2;
          p.vy = -(Math.random() * 0.5 + 0.2);
        }

        ctx.fillStyle = `rgba(16, 185, 129, ${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full pointer-events-none z-0" />;
};

// --- Interactive 3D Spotlight Card ---
export const StupidHabitCard = ({ habit, onToggle, sparklingHabitId, getCategoryColor }) => {
  const cardRef = useRef(null);
  const IconComponent = ICONS.find((ico) => ico.name === habit.icon)?.icon || Sparkles;

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card || window.innerWidth < 768) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    // 3D Rotation Tilt
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rotateX = -((e.clientY - centerY) / (rect.height / 2)) * 6; // max 6 deg
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 6; // max 6 deg
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden bg-white/70 dark:bg-slate-900/60 border rounded-3xl p-5 shadow-premium dark:shadow-premium-dark flex items-center gap-4 transition-all duration-200 border-slate-200 dark:border-slate-800/80 backdrop-blur-md group ${
        habit.completedToday 
          ? 'border-purple-550/20 shadow-[0_0_20px_rgba(82,39,255,0.05)] bg-gradient-to-r from-purple-500/5 to-transparent' 
          : 'hover:border-slate-350 dark:hover:border-slate-700'
      }`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Spotlight Hover Radial Background */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-[radial-gradient(400px_circle_at_var(--mouse-x,0px)_var(--mouse-y,0px),rgba(82,39,255,0.035),transparent_80%)]" />

      {/* 1. Leftmost: Circular Checkbox Completion Control */}
      <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-11 h-11" style={{ transform: 'translateZ(15px)' }}>
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => onToggle(habit)}
          type="button"
          className={`w-9 h-9 rounded-full border-2 cursor-pointer flex items-center justify-center transition-all duration-300 relative ${
            habit.completedToday
              ? 'bg-purple-650 border-purple-650 text-white shadow-md shadow-purple-600/30'
              : 'border-slate-350 dark:border-slate-700 text-transparent hover:border-purple-500 hover:bg-purple-50/10'
          }`}
          style={{ minWidth: '36px', minHeight: '36px' }}
        >
          <Check className={`w-5 h-5 stroke-[3] transition-transform duration-300 ${habit.completedToday ? 'scale-100' : 'scale-0'}`} />
        </motion.button>

        {/* Click Sparkles Effect */}
        {sparklingHabitId === habit.id && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
              <motion.div
                key={idx}
                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                animate={{
                  scale: [0.5, 1.2, 0.2],
                  x: Math.cos((angle * Math.PI) / 180) * 24,
                  y: Math.sin((angle * Math.PI) / 180) * 24,
                  opacity: 0
                }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                className="absolute w-1.5 h-1.5 rounded-full bg-purple-400"
              />
            ))}
          </div>
        )}
      </div>

      {/* 2. Right Side: Category Icon and Text Details */}
      <div className="flex items-center gap-4 min-w-0 z-10 flex-grow">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
          habit.completedToday 
            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' 
            : 'bg-slate-100 text-slate-650 dark:bg-slate-800 dark:text-slate-300'
        }`}>
          <IconComponent className={`w-6 h-6 ${habit.completedToday ? 'animate-pulse' : ''}`} />
        </div>
        
        {/* Habit Details */}
        <div className="min-w-0 flex-1">
          <span className={`inline-block text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1 ${getCategoryColor(habit.category)}`}>
            {habit.category}
          </span>
          <h4 className={`font-extrabold truncate text-base transition-colors duration-300 ${
            habit.completedToday ? 'text-purple-750 dark:text-purple-305 line-through opacity-80' : 'text-slate-850 dark:text-white'
          }`}>
            {habit.name}
          </h4>
          
          {/* Target progress */}
          {habit.targetCount > 1 && (
            <div className="text-xs font-bold text-slate-505 mt-0.5 flex items-center gap-1">
              <span>Progress:</span>
              <span className="text-slate-750 dark:text-slate-200">
                {habit.completedCount || 0} / {habit.targetCount}
              </span>
            </div>
          )}

          {/* Streak count */}
          {habit.currentStreak > 0 ? (
            <div className="text-xs font-bold text-slate-500 mt-1 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
              <span className="text-orange-655 dark:text-orange-400 font-extrabold">{habit.currentStreak} day streak</span>
            </div>
          ) : (
            <div className="text-xs font-bold text-slate-455 dark:text-slate-500 mt-1 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
              <span>No active streak</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// --- Magnetic Button ---
export const MagneticButton = ({ children, onClick, className }) => {
  const btnRef = useRef(null);

  const handleMouseMove = (e) => {
    const btn = btnRef.current;
    if (!btn || window.innerWidth < 768) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Pull slightly toward mouse
    btn.style.transform = `translate(${x * 0.28}px, ${y * 0.28}px)`;
  };

  const handleMouseLeave = () => {
    const btn = btnRef.current;
    if (!btn) return;
    btn.style.transform = 'translate(0px, 0px)';
  };

  return (
    <div
      ref={btnRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`inline-block transition-transform duration-250 ease-out ${className || ''}`}
    >
      {children}
    </div>
  );
};

// --- Playful Text reveal Hero ---
const StupidHero = ({ progressToday, daysToBirthday, onLogoClick, isNightTimeMessageVisible }) => {
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good morning';
    if (hrs < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getFormattedDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  const titleWords = `Hey, Stupid`.split(' ');

  return (
    <div className="relative overflow-hidden bg-slate-900/30 dark:bg-slate-950/40 border border-purple-500/20 rounded-3xl p-6 md:p-8 shadow-premium dark:shadow-premium-dark flex flex-col md:flex-row md:items-center md:justify-between gap-6 transition-all duration-300 backdrop-blur-md min-h-[170px]">
      {/* 1. Canvas Interactive Particles Background Layer */}
      <Antigravity
        count={250}
        magnetRadius={6}
        ringRadius={7}
        waveSpeed={0.3}
        waveAmplitude={1.0}
        particleSize={1.4}
        lerpSpeed={0.06}
        color="#5227FF"
        autoAnimate
        particleVariance={1.0}
        rotationSpeed={0}
        depthFactor={0.8}
        pulseSpeed={2.5}
        particleShape="capsule"
        fieldStrength={8}
      />
      {/* 2. Contrast Overlay to separate canvas and text content */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/80 to-white/70 dark:from-slate-950/90 dark:via-slate-950/80 dark:to-slate-950/70 pointer-events-none z-0" />

      <div className="z-10 flex flex-col items-start gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight flex flex-wrap gap-x-2 gap-y-1 items-center">
            {titleWords.map((word, idx) => (
              <motion.span
                key={idx}
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
              </motion.span>
            ))}
            <motion.span
              onClick={onLogoClick}
              whileTap={{ scale: 0.8 }}
              className="cursor-pointer select-none inline-block ml-1 hover:rotate-12 transition-transform text-2xl md:text-3xl"
              title="Click 5 times for a secret... 👀"
            >
              🌌
            </motion.span>
          </h1>
          <motion.p 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-slate-550 dark:text-slate-450 font-bold text-sm mt-1.5 flex items-center gap-2"
          >
            <span>{getFormattedDate()}</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-purple-650 dark:text-purple-400 font-extrabold uppercase tracking-wide">
              {getGreeting()}
            </span>
          </motion.p>
        </div>

        {/* Night time message overlay */}
        {isNightTimeMessageVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] font-bold text-indigo-500 bg-indigo-950/20 px-3.5 py-1.5 rounded-xl border border-indigo-500/10 flex items-center gap-1.5 select-none backdrop-blur-sm"
          >
            <span>Still awake, Stupid? 🌙 Somewhere out there, Idiot is probably thinking about you too.</span>
          </motion.div>
        )}

        {/* Dynamic quote system */}
        <StupidQuote progressToday={progressToday} daysToBirthday={daysToBirthday} />
      </div>

      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, delay: 0.45 }}
        className="flex items-center gap-4 bg-purple-500/10 dark:bg-purple-950/20 border border-purple-500/20 px-5 py-3 rounded-2xl z-10 backdrop-blur-sm self-start md:self-auto"
      >
        <div className="text-center">
          <span className="block text-[10px] font-black text-purple-650 dark:text-purple-450 uppercase tracking-widest">
            Progress Rate
          </span>
          <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            <CountingNumber value={Math.round(progressToday * 100)} />%
          </span>
        </div>
      </motion.div>
    </div>
  );
};

// --- Main Stupid Dashboard Component ---
const StupidDashboard = ({
  dashboardData,
  habits,
  timeLeft,
  setModalOpen,
  handleToggleComplete,
  sparklingHabitId,
  milestoneCelebration,
  setMilestoneCelebration
}) => {
  const progressRate = dashboardData?.progressToday || 0;
  const isAllCompleted = progressRate >= 1 && dashboardData?.totalToday > 0;

  const { unlockEgg } = useEasterEggs();

  const [daysToBirthday, setDaysToBirthday] = useState(null);
  
  // Easter egg states
  const [logoClicks, setLogoClicks] = useState([]);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  // Night time state checks
  const [isNightTime, setIsNightTime] = useState(false);

  useEffect(() => {
    const calculateDays = () => {
      const now = new Date();
      const target = getNextBirthday();
      const isToday = now.getMonth() === 8 && now.getDate() === 28;
      if (isToday) {
        setDaysToBirthday(0);
      } else {
        const diff = target - now;
        setDaysToBirthday(Math.ceil(diff / (1000 * 60 * 60 * 24)));
      }

      // Check if browser time is night (between 10 PM and 5 AM)
      const hour = now.getHours();
      setIsNightTime(hour >= 22 || hour < 5);
    };
    calculateDays();
    const interval = setInterval(calculateDays, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  // Keyboard listener spelling "idiot" for EGG 10 (Secret Egg)
  useEffect(() => {
    let typed = '';
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key.length !== 1 || !/[a-z]/.test(key)) return;

      typed += key;
      if (typed.length > 5) {
        typed = typed.substring(typed.length - 5);
      }

      if (typed === 'idiot') {
        unlockEgg('secret-egg');
        typed = '';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [unlockEgg]);

  // Idle timer for EGG 09
  useEffect(() => {
    let idleTimer;
    let hasTriggered = false;

    const resetIdleTimer = () => {
      if (hasTriggered) return;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        unlockEgg('secret-idle');
        hasTriggered = true; // Trigger at most once per page session
      }, 20000);
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetIdleTimer));

    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      events.forEach(event => window.removeEventListener(event, resetIdleTimer));
    };
  }, [unlockEgg]);

  // Refactored EGG 06 — Logo Click 5 times within 3 seconds
  const handleLogoClick = () => {
    const now = Date.now();
    setLogoClicks(prev => {
      const activeClicks = prev.filter(time => now - time < 3000);
      const nextClicks = [...activeClicks, now];
      if (nextClicks.length >= 5) {
        unlockEgg('logo-click');
        setShowEasterEgg(true); // Open secret room modal (existing functionality)
        return [];
      }
      return nextClicks;
    });
  };

  const getPlayfulMessage = (rate) => {
    const percentage = Math.round(rate * 100);
    if (percentage === 100) return "STUPID DID IT! Idiot is proud. 🥹🏆";
    if (percentage >= 81) return "SO CLOSE. DON'T STOP NOW. 😤";
    if (percentage >= 61) return "Okayyy Stupid, you're cooking. 🔥";
    if (percentage >= 41) return "You're getting there. 🔥";
    if (percentage >= 21) return "Not bad, Stupid. Keep going. 👀";
    return "Okay Stupid... let's actually start. 😭";
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Study': return 'bg-amber-105 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400';
      case 'Health': return 'bg-rose-105 text-rose-700 dark:bg-rose-955/20 dark:text-rose-400';
      case 'Fitness': return 'bg-blue-105 text-blue-700 dark:bg-blue-955/20 dark:text-blue-400';
      case 'Personal': return 'bg-purple-105 text-purple-700 dark:bg-purple-955/20 dark:text-purple-400';
      case 'Work': return 'bg-cyan-105 text-cyan-700 dark:bg-cyan-955/20 dark:text-cyan-400';
      case 'Learning': return 'bg-emerald-105 text-emerald-700 dark:bg-emerald-955/20 dark:text-emerald-400';
      default: return 'bg-slate-105 text-slate-650 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const weeklyChartData = dashboardData?.weeklyOverview.map(day => ({
    name: day.dayName,
    percentage: Math.round(day.completionRate * 100),
    date: day.date
  })) || [];

  return (
    <div className="space-y-8 relative min-h-screen pb-12">
      {/* 1. Canvas Interactive Particles Background */}
      <StupidBackground />

      {/* 2. Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <StupidHero 
          progressToday={progressRate} 
          daysToBirthday={daysToBirthday} 
          onLogoClick={handleLogoClick}
          isNightTimeMessageVisible={isNightTime}
        />
      </motion.div>

      {/* 3. Birthday Countdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10"
      >
        <StupidBirthdayCountdown onBirthdayStateChange={() => {}} />
      </motion.div>

      {/* 3.5. The Little World of Idiot (Interactive grid connection) */}
      <div className="relative z-10 space-y-4">
        <h2 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5 select-none">
          <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
          <span>The Little World of Idiot 🌌</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <TimeSinceMeeting />
          <UntilWeMeetAgain />
          <DistanceConnection />
          <SameSkyExperience />
          <SendAHug />
          <TeleportMessage />
          <ThingsToSay />
          <OneDay />
          <StupidSurprise />
        </div>
      </div>

      {/* 4. Playful Progress Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Progress Card */}
        <div className="bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md lg:col-span-2">
          <div className="text-center md:text-left">
            <h3 className="text-xs font-black text-slate-405 dark:text-slate-500 uppercase tracking-widest">
              TODAY'S RATING
            </h3>
            <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-2">
              {getPlayfulMessage(progressRate)}
            </p>
            <p className="text-slate-550 dark:text-slate-400 text-sm font-semibold mt-2">
              <CountingNumber value={dashboardData?.completedToday || 0} /> of <CountingNumber value={dashboardData?.totalToday || 0} /> units achieved today.
            </p>
          </div>

          <div className="relative w-28 h-28 flex items-center justify-center flex-shrink-0">
            {/* Glow ring under */}
            <div className={`absolute w-24 h-24 rounded-full filter blur-md opacity-25 transition-colors duration-1000 ${
              isAllCompleted ? 'bg-amber-400/60' : 'bg-purple-500/40'
            }`} />

            <svg className="w-full h-full transform -rotate-90">
              <circle cx="56" cy="56" r="48" className="stroke-slate-100 dark:stroke-slate-800/50 fill-none" strokeWidth="6" />
              <circle
                cx="56" cy="56" r="48"
                className={`fill-none transition-all duration-1000 ease-out ${
                  isAllCompleted 
                    ? 'stroke-amber-500 dark:stroke-amber-400' 
                    : 'stroke-purple-600 dark:stroke-purple-500'
                }`}
                strokeWidth="6"
                strokeDasharray="301.6"
                strokeDashoffset={301.6 - 301.6 * progressRate}
                strokeLinecap="round"
              />
            </svg>
            <span className={`absolute text-base font-black tracking-tighter ${
              isAllCompleted ? 'text-amber-600 dark:text-amber-400 scale-110' : 'text-purple-650 dark:text-purple-400'
            }`}>
              <CountingNumber value={Math.round(progressRate * 100)} />%
            </span>
          </div>
        </div>

        {/* Streaks Card */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 shadow-premium dark:shadow-premium-dark flex flex-col justify-between backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-12 h-12 bg-purple-500/5 rounded-full filter blur-lg" />
            <div className="w-10 h-10 bg-purple-550/10 dark:bg-purple-500/20 text-purple-650 dark:text-purple-400 rounded-xl flex items-center justify-center">
              <Flame className="w-5 h-5 fill-purple-555/10" />
            </div>
            <div className="mt-4">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-505 uppercase tracking-widest">
                Active Streak
              </span>
              <p className="text-3xl font-black text-slate-850 dark:text-white tracking-tighter mt-1">
                <CountingNumber value={dashboardData?.currentStreak || 0} />
              </p>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-5 shadow-premium dark:shadow-premium-dark flex flex-col justify-between backdrop-blur-md relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-12 h-12 bg-amber-500/5 rounded-full filter blur-lg" />
            <div className="w-10 h-10 bg-amber-550/10 dark:bg-amber-500/20 text-amber-605 dark:text-amber-400 rounded-xl flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div className="mt-4">
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-505 uppercase tracking-widest">
                Best Streak
              </span>
              <p className="text-3xl font-black text-slate-850 dark:text-white tracking-tighter mt-1">
                <CountingNumber value={dashboardData?.bestStreak || 0} />
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 5. Main Grid: Habits and Overview */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Habit Checklist */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <CheckSquare className="w-4 h-4 text-purple-650" />
              <span>Today's Routine</span>
            </h2>
            <Link to="/habits" className="text-xs font-black text-purple-650 dark:text-purple-450 hover:underline flex items-center gap-0.5">
              <span>Manage all</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {habits.filter((h) => h.active).length === 0 ? (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center transition-colors backdrop-blur-md shadow-premium dark:shadow-premium-dark"
            >
              <div className="w-16 h-16 bg-purple-50 dark:bg-purple-950/20 text-purple-650 dark:text-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckSquare className="w-8 h-8" />
              </div>
              <h3 className="text-md font-bold text-slate-900 dark:text-white">No habits active today</h3>
              <p className="text-slate-450 dark:text-slate-500 text-sm mt-1 mb-5">Start building your routine by creating your first habit.</p>
              
              <MagneticButton className="inline-block">
                <button
                  onClick={() => setModalOpen(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all active:scale-98 shadow-md"
                >
                  <Plus className="w-4 h-4 inline-block mr-1 -mt-0.5" />
                  <span>Create First Habit</span>
                </button>
              </MagneticButton>
            </motion.div>
          ) : (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.08
                  }
                }
              }}
              className="space-y-3"
            >
              {habits.filter((h) => h.active).map((habit) => (
                <motion.div
                  key={habit.id}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <StupidHabitCard
                    habit={habit}
                    onToggle={handleToggleComplete}
                    sparklingHabitId={sparklingHabitId}
                    getCategoryColor={getCategoryColor}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Sidebar Performance Charts */}
        <div className="space-y-6">
          <h2 className="text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-purple-650" />
            <span>Weekly overview</span>
          </h2>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark transition-colors backdrop-blur-md"
          >
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-wider mb-6">
              <span>Completion Rate (Last 7 Days)</span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyChartData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    tickFormatter={(val) => `${val}%`}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(82, 39, 255, 0.02)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 p-3 rounded-2xl shadow-lg text-xs font-semibold">
                            <p className="text-slate-400 mb-1">{payload[0].payload.date}</p>
                            <p className="text-purple-650 dark:text-purple-400 font-bold">
                              Completed: {payload[0].value}%
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                    {weeklyChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.percentage === 0 ? 'var(--border-color)' : 'url(#colorGrad)'}
                      />
                    ))}
                  </Bar>
                  <defs>
                    <linearGradient id="colorGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6d28d9" />
                      <stop offset="100%" stopColor="#a78bfa" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Actions Links */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/50">
              <MagneticButton className="w-full">
                <Link
                  to="/calendar"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 hover:bg-purple-50/30 dark:hover:bg-purple-950/20 hover:border-purple-100 text-slate-655 dark:text-slate-400 hover:text-purple-700 transition-all group"
                >
                  <Calendar className="w-5 h-5 text-purple-655 mb-1.5 transition-transform group-hover:scale-110" />
                  <span className="text-xs font-black">Calendar</span>
                </Link>
              </MagneticButton>
              <MagneticButton className="w-full">
                <Link
                  to="/analytics"
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 hover:bg-purple-50/30 dark:hover:bg-purple-950/20 hover:border-purple-100 text-slate-655 dark:text-slate-400 hover:text-purple-700 transition-all group"
                >
                  <BarChart3 className="w-5 h-5 text-purple-655 mb-1.5 transition-transform group-hover:scale-110" />
                  <span className="text-xs font-black">Analytics</span>
                </Link>
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Add Habit trigger */}
      <div className="fixed bottom-6 right-6 z-20">
        <MagneticButton>
          <button
            onClick={() => setModalOpen(true)}
            className="w-14 h-14 bg-purple-600 hover:bg-purple-700 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer border-0"
          >
            <Plus className="w-7 h-7" />
          </button>
        </MagneticButton>
      </div>

      {/* Streak level milestones overlay */}
      <AnimatePresence>
        {milestoneCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={() => setMilestoneCelebration(null)}
          >
            <motion.div
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-sm text-center shadow-2xl relative"
            >
              <span className="text-5xl block animate-bounce mb-4">🔥</span>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {milestoneCelebration.streak} DAY STREAK!
              </h3>
              <p className="text-sm text-slate-500 mt-2 font-medium">
                Amazing achievement with <strong>{milestoneCelebration.name}</strong>! Keep up the incredible momentum. 🥳
              </p>
              
              <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
                {[1, 2, 3, 4, 5, 6].map(n => (
                  <motion.span
                    key={n}
                    initial={{ y: 20, opacity: 1 }}
                    animate={{ y: -150, x: (n % 2 === 0 ? 40 : -40) * Math.random(), opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: n * 0.2 }}
                    className="absolute text-xl"
                    style={{ bottom: 10, left: `${n * 15}%` }}
                  >
                    ✨
                  </motion.span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Easter Egg modal/room */}
      <StupidEasterEgg isOpen={showEasterEgg} onClose={() => setShowEasterEgg(false)} />
    </div>
  );
};

export default StupidDashboard;
