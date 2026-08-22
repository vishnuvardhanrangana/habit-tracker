import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight, Check, X, Calendar as CalendarIcon, Award, Sparkles } from 'lucide-react';
import { ICONS } from '../components/HabitModal';
import { motion, AnimatePresence } from 'framer-motion';

// Framer Motion animated digits for countdown timer
const AnimatedNumber = ({ value }) => {
  return (
    <div className="relative overflow-hidden h-10 w-6 flex items-center justify-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -15, opacity: 0 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="absolute font-extrabold text-emerald-600 dark:text-emerald-555 text-3xl tracking-tight"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};

// Premium Countdown Card at the top of the Calendar page for stupid
const BirthdayCountdown = ({ days, isToday }) => {
  return (
    <div className="relative bg-white dark:bg-slate-900 border border-emerald-500/20 rounded-3xl p-6 md:p-8 shadow-premium dark:shadow-premium-dark overflow-hidden transition-all duration-300">
      {/* Soft green glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Floating particles inside the countdown */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 80, x: Math.random() * 200 - 100 }}
            animate={{
              opacity: [0, 0.6, 0],
              y: -40,
              x: Math.random() * 200 - 100
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
            className="absolute left-[50%] bottom-[10%] w-1.5 h-1.5 rounded-full bg-emerald-400/25"
          />
        ))}
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-center space-x-4">
          <motion.div
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 rounded-2xl flex items-center justify-center text-3xl shadow-inner"
          >
            🎂
          </motion.div>
          <div>
            <h2 className="text-lg font-black text-slate-850 dark:text-white tracking-tight uppercase">
              Stupid's Birthday
            </h2>
            <p className="text-emerald-650 dark:text-emerald-455 font-bold text-xs mt-1">
              {isToday ? "Today is your day!" : "Advance Happy Birthday, Stupid! 🎉"}
            </p>
          </div>
        </div>

        {isToday ? (
          <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight animate-bounce">
            🎂 HAPPY BIRTHDAY, STUPID! 🎉
          </h3>
        ) : (
          <div className="flex items-baseline space-x-1.5 bg-slate-50 dark:bg-slate-950/50 px-5 py-2.5 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-inner">
            <div className="flex items-center">
              {String(days).split('').map((char, index) => (
                <AnimatedNumber key={index} value={char} />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-455 dark:text-slate-500 uppercase tracking-widest pl-1">
              Days to Go
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

// Birthday celebration modal
const BirthdayCelebration = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 30 }}
          transition={{ type: "spring", stiffness: 350, damping: 25 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-sm text-center shadow-2xl relative overflow-hidden"
        >
          {/* Confetti particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.span
                key={i}
                initial={{ y: 250, opacity: 1, scale: Math.random() * 0.5 + 0.5 }}
                animate={{
                  y: -250,
                  x: Math.sin(i) * 50 + (Math.random() * 40 - 20),
                  opacity: [1, 1, 0]
                }}
                transition={{
                  duration: 2.2,
                  delay: i * 0.1,
                  repeat: Infinity
                }}
                className="absolute text-xl"
                style={{ left: `${(i * 6) + 5}%`, bottom: -20 }}
              >
                {['🎉', '🎈', '✨', '🎂', '💖'][i % 5]}
              </motion.span>
            ))}
          </div>

          <div className="relative z-10 space-y-4">
            <span className="text-6xl block animate-bounce" style={{ animationDuration: '1.5s' }}>
              🎂
            </span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              HAPPY BIRTHDAY, STUPID! 🎂
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              We generated this custom lab experience just for you. Hope your habits bloom and you have a gorgeous birthday! 🌸
            </p>
            <button
              onClick={onClose}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-md active:scale-98"
            >
              Thank You! 💕
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const Calendar = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const isStupid = user?.email === 'stupid';

  const [habits, setHabits] = useState([]);
  const [completionsMap, setCompletionsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [showBdayModal, setShowBdayModal] = useState(false);

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, isToday: false });

  const getNextBirthday = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    let targetDate = new Date(currentYear, 8, 28, 0, 0, 0, 0); // Sept 28

    if (today > targetDate) {
      targetDate = new Date(currentYear + 1, 8, 28, 0, 0, 0, 0);
    }
    return targetDate;
  };

  const getBirthdayCountdownDetails = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentDateVal = today.getDate();

    const isToday = currentMonth === 8 && currentDateVal === 28;

    const target = getNextBirthday();
    const todayDateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffTime = target.getTime() - todayDateOnly.getTime();
    const daysToGo = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

    const totalWindow = 60;
    const daysPassed = Math.max(0, Math.min(totalWindow, totalWindow - daysToGo));
    const progressPercent = Math.round((daysPassed / totalWindow) * 100);

    return {
      daysToGo: isToday ? 0 : daysToGo,
      isToday,
      daysPassed,
      totalWindow,
      progressPercent,
      targetYear: target.getFullYear()
    };
  };

  useEffect(() => {
    if (user?.email !== 'stupid') return;

    const updateTimer = () => {
      const today = new Date();
      const target = getNextBirthday();
      const details = getBirthdayCountdownDetails();

      if (details.isToday) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isToday: true });
        return;
      }

      const diffMs = target.getTime() - today.getTime();

      if (diffMs <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isToday: true });
        return;
      }

      const seconds = Math.floor((diffMs / 1000) % 60);
      const minutes = Math.floor((diffMs / 1000 / 60) % 60);
      const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
      const days = details.daysToGo;

      setTimeLeft({ days, hours, minutes, seconds, isToday: false });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [user]);

  // Birthday modal trigger check
  useEffect(() => {
    if (user?.email !== 'stupid') return;
    const details = getBirthdayCountdownDetails();
    if (details.isToday) {
      const shown = sessionStorage.getItem('stupid_bday_celebrated');
      if (!shown) {
        setShowBdayModal(true);
        sessionStorage.setItem('stupid_bday_celebrated', 'true');
      }
    }
  }, [user]);

  const renderScratchOffGrid = (daysPassed, daysToGo) => {
    const segments = [];
    for (let i = 0; i < daysPassed; i++) {
      segments.push(
        <div key={`scratched-${i}`} className="w-5 h-5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded flex items-center justify-center text-[9px] text-slate-350 dark:text-slate-650 line-through select-none transition-all duration-500 hover:scale-105">
          ✓
        </div>
      );
    }
    for (let i = 0; i < daysToGo; i++) {
      segments.push(
        <div key={`clean-${i}`} className="w-5 h-5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250 dark:border-emerald-800/40 rounded flex items-center justify-center text-[9px] text-emerald-600 dark:text-emerald-450 font-bold select-none transition-all duration-300 hover:scale-110">
          {i + 1}
        </div>
      );
    }

    return (
      <div className="flex flex-wrap gap-1.5 justify-center max-w-lg mx-auto p-4 bg-slate-50/50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-900 rounded-2xl animate-fade-up" style={{ animationDelay: '200ms' }}>
        {segments}
      </div>
    );
  };

  const renderBirthdayCalendar = (targetYear) => {
    const bdayMonth = 8; // September
    const daysInSeptember = 30;
    const firstDay = new Date(targetYear, bdayMonth, 1).getDay();

    const cells = [];
    for (let i = 0; i < firstDay; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= daysInSeptember; d++) {
      cells.push(d);
    }

    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark transition-colors duration-300 animate-fade-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-850 dark:text-white flex items-center gap-2">
            🎂 September {targetYear}
          </h3>
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            Birthday Month
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-2 text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <span key={day} className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-1">
              {day}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {cells.map((cell, idx) => {
            if (cell === null) {
              return <div key={`empty-bday-${idx}`} className="aspect-square bg-slate-50/20 dark:bg-slate-900/10 rounded-xl"></div>;
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const cellDate = new Date(targetYear, 8, cell);
            cellDate.setHours(0, 0, 0, 0);

            const isPast = cellDate < today;
            const isTodayCell = cellDate.getTime() === today.getTime();
            const isBdayCell = cell === 28;

            let cellStyle = 'bg-slate-50/50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-900 text-slate-550 dark:text-slate-400';
            let hoverEffect = {};

            if (isBdayCell) {
              cellStyle = 'bg-gradient-to-tr from-amber-400 via-emerald-600 to-pink-500 text-white font-extrabold shadow-lg shadow-emerald-600/20 relative overflow-hidden';
            } else if (isPast) {
              cellStyle = 'bg-slate-100/40 dark:bg-slate-950/10 border border-transparent text-slate-350 dark:text-slate-650 opacity-60 line-through';
            } else {
              cellStyle = 'bg-emerald-50/40 dark:bg-emerald-950/10 text-emerald-700 dark:text-emerald-450 border border-emerald-100/30 font-bold';
              hoverEffect = {
                y: -1.5,
                scale: 1.05,
                boxShadow: "0 6px 12px -3px rgba(16, 185, 129, 0.15)"
              };
            }

            return (
              <motion.div
                key={`bday-cell-${cell}`}
                whileHover={isStupid ? hoverEffect : {}}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center relative select-none ${cellStyle}`}
              >
                <span className="text-sm font-bold">{cell}</span>
                {isBdayCell && (
                  <span className="text-[10px] md:text-xs font-extrabold uppercase mt-0.5 tracking-tighter">🎂 Birthday</span>
                )}
                {isPast && !isBdayCell && (
                  <span className="absolute bottom-1 text-[9px] font-black text-slate-400">✓</span>
                )}
                {isTodayCell && !isBdayCell && (
                  <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    );
  };

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const fetchCalendarData = async () => {
    try {
      const lastDay = new Date(year, month + 1, 0);

      const startStr = `${year}-${String(month + 1).padStart(2, '0')}-01`;
      const endStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay.getDate()).padStart(2, '0')}`;

      const [habitsRes, rangeRes] = await Promise.all([
        api.get('/habits'),
        api.get('/completions/range', { params: { startDate: startStr, endDate: endStr } })
      ]);

      if (habitsRes.data.success) {
        setHabits(habitsRes.data.data.filter(h => h.active));
      }
      if (rangeRes.data.success) {
        setCompletionsMap(rangeRes.data.data || {});
      }
    } catch (err) {
      console.error("Failed to load calendar data:", err);
      showToast("Could not load completion history.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendarData();
    setSelectedDate(null);
  }, [currentDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDaysInMonth = () => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfWeek = () => new Date(year, month, 1).getDay(); // 0 is Sunday

  const daysInMonth = getDaysInMonth();
  const firstDayOfWeek = getFirstDayOfWeek();

  const calendarCells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push(new Date(year, month, d));
  }

  const getLocalDateString = (date) => {
    if (!date) return '';
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getDayCompletions = (date) => {
    const key = getLocalDateString(date);
    return completionsMap[key] || [];
  };

  const getDayDetails = (date) => {
    if (!date) return null;
    const dateStr = getLocalDateString(date);
    const completedIds = getDayCompletions(date);
    const totalCount = habits.length;

    const list = habits.map(habit => ({
      ...habit,
      completed: completedIds.includes(habit.id)
    }));

    const completedCount = list.filter(h => h.completed).length;
    const rate = totalCount > 0 ? (completedCount / totalCount) : 0;

    return {
      date,
      dateString: dateStr,
      habitsList: list,
      completedCount,
      totalCount,
      rate
    };
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isFuture = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl"></div>
          <div className="h-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  const activeSelectedDetails = selectedDate ? getDayDetails(selectedDate) : null;

  return (
    <div className="space-y-6 animate-fade-up">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Completion Calendar</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Visualize your monthly check-ins and review daily status.</p>
      </div>

      {isStupid && (
        <BirthdayCountdown 
          days={timeLeft.days} 
          isToday={timeLeft.isToday} 
          isStupid={true}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid Card */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark flex flex-col justify-between transition-colors duration-300">
          {/* Calendar Controller Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-880 dark:text-white">
              {monthNames[month]} {year}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 border border-slate-200 dark:border-slate-800 text-slate-650 dark:text-slate-400 hover:bg-emerald-50/50 hover:text-emerald-700 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 border border-slate-200 dark:border-slate-800 text-slate-655 dark:text-slate-400 hover:bg-emerald-50/50 hover:text-emerald-700 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Weekday Labels */}
          <div className="grid grid-cols-7 gap-2 mb-2 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <span key={day} className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider py-2">
                {day}
              </span>
            ))}
          </div>

          {/* Month Transitions Wrapping Calendar Days */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${month}-${year}`}
              initial={isStupid ? { opacity: 0, x: 15 } : {}}
              animate={isStupid ? { opacity: 1, x: 0 } : {}}
              exit={isStupid ? { opacity: 0, x: -15 } : {}}
              transition={isStupid ? { duration: 0.18, ease: "easeOut" } : {}}
              className="grid grid-cols-7 gap-2 flex-1"
            >
              {calendarCells.map((cell, idx) => {
                if (cell === null) {
                  return <div key={`empty-${idx}`} className="aspect-square bg-slate-50/20 dark:bg-slate-900/10 rounded-2xl"></div>;
                }

                const isFutureCell = isFuture(cell);
                const isTodayCell = isToday(cell);
                const isBdayCell = cell.getMonth() === 8 && cell.getDate() === 28;
                const completedIds = getDayCompletions(cell);
                const totalCount = habits.length;

                let cellStyle = 'bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 text-slate-750 dark:text-slate-300 cursor-pointer hover:bg-emerald-50/20 hover:border-emerald-250 dark:hover:bg-slate-900';

                if (isFutureCell) {
                  cellStyle = 'bg-slate-50/30 dark:bg-slate-950/10 border border-transparent text-slate-300 dark:text-slate-700 pointer-events-none';
                } else if (isStupid && isBdayCell) {
                  cellStyle = 'bg-gradient-to-tr from-amber-400 via-emerald-600 to-pink-500 text-white font-extrabold shadow-lg shadow-emerald-500/20 relative overflow-hidden';
                } else if (totalCount > 0) {
                  const rate = completedIds.length / totalCount;
                  if (rate === 1) {
                    cellStyle = 'bg-emerald-600 text-white font-bold cursor-pointer hover:bg-emerald-700';
                  } else if (rate > 0) {
                    cellStyle = 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-150 dark:border-emerald-900/40 cursor-pointer hover:bg-emerald-100/50';
                  }
                }

                const isCellSelected = selectedDate && cell.getDate() === selectedDate.getDate() && cell.getMonth() === selectedDate.getMonth();
                const selectedRing = isCellSelected ? 'ring-4 ring-offset-2 dark:ring-offset-slate-900 ring-emerald-600 dark:ring-emerald-500 scale-[1.03]' : '';

                // Week-by-week entry delays
                const weekIndex = Math.floor(idx / 7);
                const cellDelay = isStupid ? weekIndex * 0.05 : 0;

                return (
                  <motion.button
                    key={`day-${cell.getDate()}`}
                    onClick={() => !isFutureCell && setSelectedDate(cell)}
                    disabled={isFutureCell}
                    initial={isStupid ? { opacity: 0, scale: 0.92, y: 5 } : {}}
                    animate={isStupid ? { opacity: 1, scale: 1, y: 0 } : {}}
                    transition={isStupid ? { duration: 0.25, delay: cellDelay, ease: "easeOut" } : {}}
                    whileHover={isStupid && !isFutureCell ? {
                      y: -2,
                      scale: 1.03,
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)"
                    } : {}}
                    whileTap={isStupid && !isFutureCell ? { scale: 0.95 } : {}}
                    className={`aspect-square rounded-xl flex flex-col items-center justify-center relative transition-all ${cellStyle} ${selectedRing}`}
                  >
                    {isStupid && isBdayCell ? (
                      <div className="flex flex-col items-center justify-center relative w-full h-full">
                        <span className="text-sm font-black">28</span>
                        <span className="text-[8px] font-black uppercase tracking-tighter">🎂 Birthday</span>
                        {/* Sparkles */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <motion.span
                              key={i}
                              animate={{ scale: [0.5, 1, 0.5], opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1.5 + i * 0.5, repeat: Infinity }}
                              className="absolute text-[8px]"
                              style={{
                                top: i === 0 ? 3 : i === 1 ? 23 : 13,
                                left: i === 2 ? 3 : i === 3 ? 23 : 13
                              }}
                            >
                              ✨
                            </motion.span>
                          ))}
                        </div>
                        {/* Animated Border */}
                        <motion.div
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute inset-0 rounded-xl border border-white/60 pointer-events-none"
                        />
                      </div>
                    ) : (
                      <span className="text-sm font-bold">{cell.getDate()}</span>
                    )}
                    
                    {isTodayCell && !isBdayCell && (
                      <span className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${
                        completedIds.length / totalCount === 1 ? 'bg-white' : 'bg-emerald-600 dark:bg-emerald-500'
                      }`}></span>
                    )}

                    {/* Today's pulsing highlight frame */}
                    {isStupid && isTodayCell && (
                      <motion.div
                        animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.7, 0.3] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute inset-0 rounded-xl border-2 border-emerald-500 pointer-events-none shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                      />
                    )}
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Selected Date Details Panel */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark flex flex-col justify-between transition-colors duration-300">
          {!selectedDate ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400 dark:text-slate-500">
              <CalendarIcon className="w-12 h-12 mb-4 text-emerald-555" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No Date Selected</h3>
              <p className="text-xs text-slate-450 mt-1">Select a past or today's date on the calendar to view completions.</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between h-full space-y-6">
              {/* Header details */}
              <div>
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-450 uppercase tracking-wider block mb-1">
                  Day Summary
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </h3>

                {/* Progress details */}
                <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-855/50 rounded-2xl p-4 mt-4">
                  <div>
                    <span className="text-xs text-slate-455 block font-semibold">Completions</span>
                    <span className="text-base font-bold text-slate-800 dark:text-white">
                      {activeSelectedDetails?.completedCount} / {activeSelectedDetails?.totalCount}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-455 block font-semibold">Daily Rate</span>
                    <span className="text-base font-bold text-emerald-650 dark:text-emerald-450">
                      {Math.round((activeSelectedDetails?.rate || 0) * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* List of Habits with check/cross */}
              <div className="flex-1 overflow-y-auto max-h-[40vh] space-y-2.5">
                {activeSelectedDetails?.habitsList.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-4">No active habits on this day.</p>
                ) : (
                  activeSelectedDetails?.habitsList.map(item => {
                    const IconComponent = ICONS.find(ico => ico.name === item.icon)?.icon || Sparkles;
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                          item.completed
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30'
                            : 'bg-slate-50/50 dark:bg-slate-950/30 border-slate-150 dark:border-slate-850'
                        }`}
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className={`p-2 rounded-xl flex-shrink-0 ${
                            item.completed
                              ? 'bg-emerald-500 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                          }`}>
                            <IconComponent className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                            {item.name}
                          </span>
                        </div>

                        {item.completed ? (
                          <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-850 text-slate-400 dark:text-slate-650 flex items-center justify-center">
                            <X className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Bottom Award Card */}
              {activeSelectedDetails?.rate === 1 && (
                <div className="bg-gradient-to-r from-emerald-550 to-emerald-700 rounded-2xl p-4 text-white flex items-center gap-3 shadow-md shadow-emerald-600/10">
                  <Award className="w-9 h-9 flex-shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider">Perfect Day!</h4>
                    <p className="text-[10px] text-emerald-50 mt-0.5 leading-snug">
                      You achieved 100% completion of your daily routines on this day.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Birthday sections for 'stupid' account */}
      {isStupid && (
        <div className="space-y-8 pt-6 border-t border-slate-200 dark:border-slate-800 animate-fade-up">
          {/* Section Divider Header */}
          <div className="flex items-center space-x-3">
            <span className="text-xl animate-float">🎂</span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Special Birthday Calendar Experience
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar 2: Birthday Month Highlights */}
            {renderBirthdayCalendar(getBirthdayCountdownDetails().targetYear)}

            {/* Countdown Progress Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-premium dark:shadow-premium-dark flex flex-col justify-between transition-colors duration-300 relative overflow-hidden">
              {/* Confetti Balloons if Birthday is today */}
              {timeLeft.isToday && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl z-0">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                    <span
                      key={n}
                      className="absolute text-2xl animate-float-up"
                      style={{
                        left: `${n * 10 + Math.random() * 5}%`,
                        bottom: `-30px`,
                        animationDelay: `${n * 0.4}s`,
                        animationDuration: `${5 + Math.random() * 3}s`,
                        opacity: 0.8
                      }}
                    >
                      {n % 2 === 0 ? '🎈' : '🎉'}
                    </span>
                  ))}
                </div>
              )}

              <div className="relative z-10 space-y-6">
                <div className="text-center">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-450 uppercase tracking-widest block mb-1">
                    🎂 Birthday Countdown
                  </span>
                  
                  {timeLeft.isToday ? (
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-1 flex items-center justify-center gap-2 animate-bounce">
                      🎂 HAPPY BIRTHDAY, STUPID! 🎉
                    </h3>
                  ) : (
                    <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
                      {getBirthdayCountdownDetails().daysToGo} <span className="text-sm font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider block md:inline">Days to Go</span>
                    </h3>
                  )}

                  <p className="text-slate-700 dark:text-slate-350 font-bold text-sm mt-2">
                    {timeLeft.isToday ? "Today is your day!" : "Advance Happy Birthday, Stupid! 🎉"}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                    {timeLeft.isToday ? "Hope you have an amazing day!" : "Every day, one more day gets scratched off."}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-600 font-bold mt-1">
                    Your birthday is getting closer... 🎂
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-455 dark:text-slate-500">
                    <span>Birthday Progress</span>
                    <span>{timeLeft.isToday ? '100% Complete' : `${getBirthdayCountdownDetails().daysToGo} days remaining`}</span>
                  </div>
                  <div className="h-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${timeLeft.isToday ? 100 : getBirthdayCountdownDetails().progressPercent}%` }}
                    ></div>
                  </div>
                </div>

                {/* Scratch-off grid */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block text-center">
                    Scratch-Off Day Progress
                  </span>
                  {renderScratchOffGrid(getBirthdayCountdownDetails().daysPassed, getBirthdayCountdownDetails().daysToGo)}
                </div>
              </div>
            </div>
          </div>

          {/* Time Until Birthday Live Timer */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-premium dark:shadow-premium-dark transition-colors duration-300 text-center">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">
              ⏳ Time Until September 28
            </h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-xl mx-auto">
              {[
                { label: 'DAYS', value: String(timeLeft.days).padStart(2, '0') },
                { label: 'HOURS', value: String(timeLeft.hours).padStart(2, '0') },
                { label: 'MINUTES', value: String(timeLeft.minutes).padStart(2, '0') },
                { label: 'SECONDS', value: String(timeLeft.seconds).padStart(2, '0') }
              ].map(t => (
                <div key={t.label} className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl p-4 text-center shadow-premium dark:shadow-premium-dark flex flex-col justify-center items-center transition-all hover:scale-[1.02] duration-300">
                  <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-450 tracking-tight transition-all duration-350">
                    {t.value}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                    {t.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Birthday Celebration Overlay Modal */}
      <BirthdayCelebration 
        isOpen={showBdayModal} 
        onClose={() => setShowBdayModal(false)} 
      />
    </div>
  );
};

export default Calendar;
