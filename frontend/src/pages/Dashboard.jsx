import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import StupidDashboard from '../components/StupidDashboard';
import { useEasterEggs } from '../context/EasterEggContext';
import HabitModal, { ICONS } from '../components/HabitModal';
import { Plus, Check, Calendar, BarChart3, ChevronRight, Award, Flame, CheckCircle, TrendingUp, CheckSquare, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Framer Motion helper wrapper for staggered fades
const AnimatedWrapper = ({ children, delay = 0, isStupid }) => {
  if (!isStupid) return children;
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: delay / 1000, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

// Framer Motion animated digits for timer
const AnimatedNumber = ({ value }) => {
  return (
    <div className="relative overflow-hidden h-9 w-10 flex items-center justify-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -15, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="absolute font-extrabold text-emerald-600 dark:text-emerald-500 text-3xl tracking-tight"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

// Premium interactive cards for stupid
const PremiumDashboardCard = ({ children, isStupid, className }) => {
  if (!isStupid) return <div className={className}>{children}</div>;
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [dashboardData, setDashboardData] = useState(null);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [progressOffset, setProgressOffset] = useState(0);

  // States for particle and milestone celebrations
  const [sparklingHabitId, setSparklingHabitId] = useState(null);
  const [milestoneCelebration, setMilestoneCelebration] = useState(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isToday: false });

  const { unlockEgg } = useEasterEggs();

  // Trigger Easter eggs based on confirmed dashboard data (EGG 02, 03, 04, 05)
  useEffect(() => {
    if (user?.email !== 'stupid' || !dashboardData) return;

    // EGG 02 — Perfect Day
    if (dashboardData.progressToday === 1 && dashboardData.totalToday > 0) {
      unlockEgg('perfect-day');
    }

    // EGG 03 — 7-Day Streak
    if (dashboardData.currentStreak >= 7) {
      unlockEgg('streak-7');
    }

    // EGG 04 — 30-Day Streak
    if (dashboardData.currentStreak >= 30) {
      unlockEgg('streak-30');
    }

    // EGG 05 — Birthday Check
    const today = new Date();
    if (today.getMonth() === 8 && today.getDate() === 28) {
      unlockEgg('birthday');
    }
  }, [dashboardData, user, unlockEgg]);
  useEffect(() => {
    if (user?.email !== 'stupid') return;

    const updateTimer = () => {
      const today = new Date();
      const currentYear = today.getFullYear();
      let target = new Date(currentYear, 8, 28, 0, 0, 0, 0);

      if (today > target) {
        target = new Date(currentYear + 1, 8, 28, 0, 0, 0, 0);
      }

      const diffMs = target.getTime() - today.getTime();

      const isBdayToday = today.getMonth() === 8 && today.getDate() === 28;

      if (isBdayToday || diffMs <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isToday: true });
        return;
      }

      const seconds = Math.floor((diffMs / 1000) % 60);
      const minutes = Math.floor((diffMs / 1000 / 60) % 60);
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      
      const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const daysToGo = Math.max(0, Math.ceil((target.getTime() - todayDateOnly.getTime()) / (1000 * 60 * 60 * 24)));

      setTimeLeft({ days: daysToGo, hours, minutes, seconds, isToday: false });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [user]);

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Good morning';
    if (hrs < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getBirthdayCountdown = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentYear = today.getFullYear();
    let bday = new Date(currentYear, 8, 28); // Sept 28
    bday.setHours(0, 0, 0, 0);

    if (today > bday) {
      bday = new Date(currentYear + 1, 8, 28);
      bday.setHours(0, 0, 0, 0);
    }

    const diffTime = bday.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      daysRemaining: diffDays,
      isToday: diffDays === 0 || (today.getMonth() === 8 && today.getDate() === 28),
      targetDateString: bday.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };
  };

  const getFormattedDate = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
  };

  const fetchData = async () => {
    try {
      const [dashRes, habitsRes] = await Promise.all([
        api.get('/dashboard'),
        api.get('/habits')
      ]);

      if (dashRes.data.success) {
        setDashboardData(dashRes.data.data);
      }
      if (habitsRes.data.success) {
        setHabits(habitsRes.data.data);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
      showToast("Could not sync with server. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (dashboardData) {
      const timer = setTimeout(() => {
        setProgressOffset(dashboardData.progressToday || 0);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [dashboardData]);

  const handleToggleComplete = async (habit) => {
    const isCompleted = habit.completedToday;
    const url = `/habits/${habit.id}/complete`;
    
    // For habits with targetCount > 1, clicking increments completions Count, capping or toggling when completed.
    const currentCount = habit.completedCount || 0;
    const target = habit.targetCount || 1;
    let nextCount = isCompleted ? target - 1 : currentCount + 1;
    if (nextCount < 0) nextCount = 0;
    
    const nextCompletedToday = nextCount >= target;

    // Optimistic UI updates
    const updatedHabits = habits.map(h => {
      if (h.id === habit.id) {
        const prevStreak = h.currentStreak;
        let nextStreak = h.currentStreak;
        if (nextCompletedToday && !isCompleted) {
          nextStreak = prevStreak + 1;
        } else if (!nextCompletedToday && isCompleted) {
          nextStreak = Math.max(0, prevStreak - 1);
        }
        return {
          ...h,
          completedToday: nextCompletedToday,
          completedCount: nextCount,
          currentStreak: nextStreak,
          bestStreak: Math.max(h.bestStreak, nextStreak)
        };
      }
      return h;
    });
    setHabits(updatedHabits);

    // Optimistically update dashboard stats
    if (dashboardData) {
      const diff = isCompleted ? -1 : 1;
      const nextCompletedTodayCount = Math.max(0, dashboardData.completedToday + diff);
      const nextProgressToday = dashboardData.totalToday > 0 ? nextCompletedTodayCount / dashboardData.totalToday : 0;
      setDashboardData({
        ...dashboardData,
        completedToday: nextCompletedTodayCount,
        progressToday: nextProgressToday,
        totalCompletions: Math.max(0, dashboardData.totalCompletions + diff)
      });
    }

    try {
      let res;
      if (isCompleted) {
        res = await api.delete(url);
        if (res.data.success) {
          showToast(`Undone completion for ${habit.name}`, 'info');
        }
      } else {
        res = await api.post(url);
        if (res.data.success) {
          const updatedHabit = res.data.data;
          
          if (user?.email === 'stupid') {
            setSparklingHabitId(habit.id);
            setTimeout(() => setSparklingHabitId(null), 800);

            const streak = updatedHabit.currentStreak;
            const milestones = [7, 14, 30, 50, 100];
            if (milestones.includes(streak)) {
              setMilestoneCelebration({ name: habit.name, streak });
            }
          }
          
          // Milestone messages
          if (updatedHabit.currentStreak > 0 && updatedHabit.currentStreak % 5 === 0) {
            showToast(`Awesome! ${updatedHabit.currentStreak}-day streak for ${habit.name}! 🔥`, 'success');
          } else {
            showToast(`Completed ${habit.name}! Keep it up.`, 'success');
          }
          
          // Check if all habits completed today
          const activeCount = habits.filter(h => h.active).length;
          const completedCount = updatedHabits.filter(h => h.active && h.completedToday).length;
          if (activeCount === completedCount && activeCount > 0) {
            showToast("Perfect! All habits completed today 🎉", "success");
            if (user?.email === 'stupid') {
              unlockEgg('perfect-day');
            }
          }
        }
      }
      fetchData();
    } catch (err) {
      console.error("Failed to toggle completion error object:", err);
      if (err.response) {
        console.error("Error response status:", err.response.status);
        console.error("Error response data:", JSON.stringify(err.response.data));
      }
      showToast("Failed to save completion status. Syncing back...", "error");
      fetchData();
    }
  };

  const handleSaveHabit = async (habitData) => {
    try {
      const res = await api.post('/habits', habitData);
      if (res.data.success) {
        showToast('New habit created successfully!', 'success');
        fetchData();
        return true;
      }
    } catch (err) {
      console.error("Failed to create habit:", err);
      showToast(err.response?.data?.message || 'Could not create habit', 'error');
    }
    return false;
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Study': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'Health': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'Fitness': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'Personal': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'Work': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400';
      case 'Learning': return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400';
      default: return 'bg-slate-50 text-slate-600 dark:bg-slate-900 dark:text-slate-400';
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl"></div>
          <div className="h-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  const weeklyChartData = dashboardData?.weeklyOverview.map(day => ({
    name: day.dayName,
    percentage: Math.round(day.completionRate * 100),
    date: day.date
  })) || [];

  const isAllCompleted = progressOffset >= 1 && dashboardData?.totalToday > 0;

  if (user?.email === 'stupid' && dashboardData) {
    return (
      <StupidDashboard
        dashboardData={dashboardData}
        habits={habits}
        timeLeft={timeLeft}
        setModalOpen={setModalOpen}
        handleToggleComplete={handleToggleComplete}
        sparklingHabitId={sparklingHabitId}
        milestoneCelebration={milestoneCelebration}
        setMilestoneCelebration={setMilestoneCelebration}
      />
    );
  }

  return (
    <div className="space-y-8 animate-fade-up">
      {/* Header and Quick Greeting */}
      <AnimatedWrapper delay={0} isStupid={user?.email === 'stupid'}>
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-premium dark:shadow-premium-dark flex flex-col md:flex-row md:items-center md:justify-between gap-6 transition-colors duration-300">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {user?.email === 'stupid' ? 'Good morning, Stupid 👋' : `${getGreeting()}, ${user?.email}`}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mt-1">
              {user?.email === 'stupid' ? "Let's make today count." : "Let's build a better routine today."}
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center justify-center space-x-2 bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg active:scale-98 text-white font-semibold py-3 px-5 rounded-xl transition-all self-start md:self-auto text-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Add Habit</span>
          </button>
        </div>
      </AnimatedWrapper>

      {/* Birthday Countdown for "stupid" user */}
      {user?.email === 'stupid' && (
        <AnimatedWrapper delay={100} isStupid={true}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-premium dark:shadow-premium-dark transition-all duration-300 hover:shadow-premium-hover dark:hover:shadow-premium-dark-hover relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.08)] border-emerald-500/25">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-455 rounded-2xl flex items-center justify-center shadow-inner animate-float">
                  <span className="text-3xl">🎂</span>
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-850 dark:text-white tracking-tight">
                    {timeLeft.isToday ? "🎂 HAPPY BIRTHDAY, STUPID! 🎉" : "Birthday Countdown"}
                  </h2>
                  <p className="text-emerald-650 dark:text-emerald-455 font-bold text-sm mt-1">
                    {timeLeft.isToday ? "Today is your day!" : "Advance Happy Birthday, Stupid! 🎉"}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-xs mt-0.5">
                    {timeLeft.isToday ? "Hope you have an amazing day!" : "Every day brings you one day closer! 🥳"}
                  </p>
                </div>
              </div>

              {!timeLeft.isToday && (
                <div className="flex flex-col items-center lg:items-end gap-2">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-5xl font-black text-emerald-600 dark:text-emerald-500 tracking-tighter animate-pulse" style={{ animationDuration: '2s' }}>
                      {timeLeft.days}
                    </span>
                    <span className="text-xs font-bold text-slate-450 dark:text-slate-550 uppercase tracking-widest">
                      Days to Go
                    </span>
                  </div>
                  
                  {/* Live countdown timer digit slide */}
                  <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-950 px-4 py-2 border border-slate-100 dark:border-slate-900 rounded-2xl shadow-inner mt-1">
                    <div className="flex flex-col items-center px-1">
                      <AnimatedNumber value={timeLeft.hours} />
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Hr</span>
                    </div>
                    <span className="text-slate-300 dark:text-slate-800 font-bold">:</span>
                    <div className="flex flex-col items-center px-1">
                      <AnimatedNumber value={timeLeft.minutes} />
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Min</span>
                    </div>
                    <span className="text-slate-300 dark:text-slate-800 font-bold">:</span>
                    <div className="flex flex-col items-center px-1">
                      <AnimatedNumber value={timeLeft.seconds} />
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Sec</span>
                    </div>
                  </div>
                </div>
              )}

              {timeLeft.isToday && (
                <div className="flex flex-col items-center lg:items-end">
                  <span className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-500 tracking-tight animate-bounce">
                    🎉
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest mt-1">
                    September 28
                  </span>
                </div>
              )}
            </div>
          </div>
        </AnimatedWrapper>
      )}

      {/* Progress Cards */}
      <AnimatedWrapper delay={200} isStupid={user?.email === 'stupid'}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Today's Progress Card */}
          <PremiumDashboardCard
            isStupid={user?.email === 'stupid'}
            className={`bg-white dark:bg-slate-900 border rounded-3xl p-6 shadow-premium dark:shadow-premium-dark flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-hover dark:hover:shadow-premium-dark-hover ${
              isAllCompleted 
                ? 'border-emerald-500/50 shadow-[0_0_15px_rgba(22,163,74,0.08)]' 
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div>
              <p className="text-xs font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider">Today's Progress</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {Math.round((dashboardData?.progressToday || 0) * 100)}%
              </p>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                {dashboardData?.completedToday} of {dashboardData?.totalToday} completed
              </p>
            </div>
            <div className="relative w-14 h-14">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="28" cy="28" r="24" className="stroke-slate-100 dark:stroke-slate-800 fill-none" strokeWidth="4" />
                <circle
                  cx="28" cy="28" r="24"
                  className="stroke-emerald-600 dark:stroke-emerald-500 fill-none transition-all duration-1000 ease-out"
                  strokeWidth="4"
                  strokeDasharray="150.7"
                  strokeDashoffset={150.7 - 150.7 * progressOffset}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-emerald-600 dark:text-emerald-500">
                {Math.round((dashboardData?.progressToday || 0) * 100)}%
              </span>
            </div>
          </PremiumDashboardCard>

          {/* Current Streak */}
          <PremiumDashboardCard
            isStupid={user?.email === 'stupid'}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-hover dark:hover:shadow-premium-dark-hover"
          >
            <div>
              <p className="text-xs font-bold text-slate-455 dark:text-slate-550 uppercase tracking-wider">Current Streak</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 flex items-baseline gap-1">
                {dashboardData?.currentStreak} <span className="text-xs font-medium text-slate-500">days</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Active habit streak</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl flex items-center justify-center text-emerald-650">
              <Flame className="w-6 h-6 fill-emerald-500/10" />
            </div>
          </PremiumDashboardCard>

          {/* Best Streak */}
          <PremiumDashboardCard
            isStupid={user?.email === 'stupid'}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-hover dark:hover:shadow-premium-dark-hover"
          >
            <div>
              <p className="text-xs font-bold text-slate-455 dark:text-slate-555 uppercase tracking-wider">Best Streak</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 flex items-baseline gap-1">
                {dashboardData?.bestStreak} <span className="text-xs font-medium text-slate-500">days</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Your highest milestone</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl flex items-center justify-center text-emerald-650">
              <Award className="w-6 h-6 fill-emerald-500/10" />
            </div>
          </PremiumDashboardCard>

          {/* Total Completed */}
          <PremiumDashboardCard
            isStupid={user?.email === 'stupid'}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-hover dark:hover:shadow-premium-dark-hover"
          >
            <div>
              <p className="text-xs font-bold text-slate-455 dark:text-slate-555 uppercase tracking-wider">Total Completed</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 flex items-baseline gap-1">
                {dashboardData?.totalCompletions} <span className="text-xs font-medium text-slate-500">times</span>
              </p>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Completions recorded</p>
            </div>
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl flex items-center justify-center text-emerald-650">
              <CheckCircle className="w-6 h-6 fill-emerald-500/10" />
            </div>
          </PremiumDashboardCard>
        </div>
      </AnimatedWrapper>

      {/* Main Grid: Habits and Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Habit Checklist */}
        <div className="lg:col-span-2">
          <AnimatedWrapper delay={300} isStupid={user?.email === 'stupid'}>
            <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-md font-bold text-slate-900 dark:text-white">Today's Routine</h2>
            <Link to="/habits" className="text-xs font-bold text-emerald-600 dark:text-emerald-450 hover:underline flex items-center gap-0.5">
              <span>Manage all</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {habits.filter(h => h.active).length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center transition-colors duration-300 shadow-premium dark:shadow-premium-dark">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
                <CheckSquare className="w-8 h-8" />
              </div>
              <h3 className="text-md font-bold text-slate-900 dark:text-white">No habits active today</h3>
              <p className="text-slate-450 dark:text-slate-500 text-sm mt-1 mb-5">Start building your routine by creating your first habit.</p>
              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition-all active:scale-98"
              >
                <Plus className="w-4 h-4" />
                <span>Create First Habit</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {habits.filter(h => h.active).map(habit => {
                const IconComponent = ICONS.find(ico => ico.name === habit.icon)?.icon || Sparkles;
                
                let checkStyle = 'border-slate-350 text-transparent hover:bg-emerald-50/50 hover:border-emerald-500';
                if (habit.completedToday) {
                  checkStyle = 'bg-emerald-600 border-emerald-600 text-white';
                }

                return (
                  <div
                    key={habit.id}
                    className={`bg-white dark:bg-slate-900 border rounded-3xl p-5 shadow-premium dark:shadow-premium-dark hover:shadow-premium-hover dark:hover:shadow-premium-dark-hover flex items-center justify-between gap-4 transition-all duration-300 ${
                      habit.completedToday 
                        ? 'border-emerald-100 dark:border-emerald-950 bg-emerald-50/10 dark:bg-emerald-950/5' 
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      {/* Habit Icon Container */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                        habit.completedToday 
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' 
                          : 'bg-slate-50 text-slate-655 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      
                      {/* Habit Details */}
                      <div className="min-w-0">
                        <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 ${getCategoryColor(habit.category)}`}>
                          {habit.category}
                        </span>
                        <h4 className="font-bold text-slate-850 dark:text-white truncate text-base">
                          {habit.name}
                        </h4>
                        
                        {/* Target progress if > 1 */}
                        {habit.targetCount > 1 && (
                          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                            Target: {habit.completedCount || 0} / {habit.targetCount}
                          </div>
                        )}

                        {/* Streak count */}
                        {habit.currentStreak > 0 ? (
                          <div className="flex items-center text-xs font-semibold text-emerald-600 mt-0.5">
                            <Flame className="w-4 h-4 fill-emerald-500/10 mr-1 text-emerald-600" />
                            <span>{habit.currentStreak} day streak</span>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 mt-0.5 font-medium">No active streak</div>
                        )}
                      </div>
                    </div>

                    {/* Completion Button */}
                    {user?.email === 'stupid' ? (
                      <div className="relative">
                        <motion.button
                          whileTap={{ scale: 0.85 }}
                          onClick={() => handleToggleComplete(habit)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 cursor-pointer transition-colors duration-300 relative ${checkStyle}`}
                        >
                          <Check className={`w-5 h-5 stroke-[3] transition-transform duration-300 ${habit.completedToday ? 'scale-100' : 'scale-0'}`} />
                        </motion.button>
                        {/* Completion Sparkles */}
                        {sparklingHabitId === habit.id && (
                          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                                animate={{
                                  scale: 1,
                                  x: Math.cos((angle * Math.PI) / 180) * 20,
                                  y: Math.sin((angle * Math.PI) / 180) * 20,
                                  opacity: 0
                                }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                className="absolute w-1.5 h-1.5 rounded-full bg-emerald-500"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleToggleComplete(habit)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-300 active:scale-95 cursor-pointer ${checkStyle}`}
                      >
                        <Check className={`w-5 h-5 stroke-[3] transition-transform duration-300 ${habit.completedToday ? 'scale-100' : 'scale-0'}`} />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          </div>
          </AnimatedWrapper>
        </div>

        {/* Sidebar/Performance */}
        <div>
          <AnimatedWrapper delay={400} isStupid={user?.email === 'stupid'}>
            <div className="space-y-6">
          <h2 className="text-md font-bold text-slate-900 dark:text-white">Weekly Performance</h2>
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark transition-colors duration-300">
            <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-6">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
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
                    cursor={{ fill: 'rgba(22, 163, 74, 0.03)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-855 p-3 rounded-2xl shadow-lg text-xs font-semibold">
                            <p className="text-slate-400 mb-1">{payload[0].payload.date}</p>
                            <p className="text-emerald-600 dark:text-emerald-400">
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
                      <stop offset="0%" stopColor="#16a34a" />
                      <stop offset="100%" stopColor="#4ade80" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Actions Links */}
            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/50">
              <Link
                to="/calendar"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 hover:border-emerald-100 text-slate-650 dark:text-slate-400 hover:text-emerald-700 transition-all group"
              >
                <Calendar className="w-5 h-5 text-emerald-600 mb-1.5 transition-transform group-hover:scale-110" />
                <span className="text-xs font-bold">Calendar</span>
              </Link>
              <Link
                to="/analytics"
                className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 hover:border-emerald-100 text-slate-650 dark:text-slate-400 hover:text-emerald-700 transition-all group"
              >
                <BarChart3 className="w-5 h-5 text-emerald-650 mb-1.5 transition-transform group-hover:scale-110" />
                <span className="text-xs font-bold">Analytics</span>
              </Link>
            </div>
          </div>
          </div>
          </AnimatedWrapper>
        </div>
      </div>

      {/* Habit modal */}
      <HabitModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveHabit}
      />

      {/* Streak Level-Up / Milestone Celebration overlay for stupid user */}
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
              
              {/* Confetti floats */}
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
    </div>
  );
};

export default Dashboard;
