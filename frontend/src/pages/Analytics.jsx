import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { ResponsiveContainer, AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, CheckCircle, Award, AlertCircle, BarChart3, Calendar, Sparkles } from 'lucide-react';
import { ICONS } from '../components/HabitModal';
import { motion } from 'framer-motion';

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

// Premium interactive cards for stupid
const PremiumAnalyticsCard = ({ children, isStupid, className }) => {
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

// Number counter animation component for stupid user
const CountingNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = typeof value === 'number' ? value : parseInt(value, 10);
    if (isNaN(end)) {
      setDisplayValue(value);
      return;
    }
    if (start === end) {
      setDisplayValue(end);
      return;
    }

    const duration = 1000; // 1s animation
    const startTime = performance.now();

    let animationFrameId;

    const updateNumber = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quad
      const easeProgress = progress * (2 - progress);
      const currentValue = Math.round(start + easeProgress * (end - start));
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateNumber);
      }
    };

    animationFrameId = requestAnimationFrame(updateNumber);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [value]);

  return <span>{displayValue}</span>;
};

const MONTHS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

const Analytics = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const isStupid = user?.email === 'stupid';

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await api.get('/analytics', {
          params: { year: selectedYear, month: selectedMonth },
        });
        if (response.data?.success) {
          setAnalyticsData(response.data.data);
        } else {
          showToast(response.data?.message || 'Failed to fetch analytics', 'error');
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        showToast('Error loading analytics data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedYear, selectedMonth, showToast]);

  const hasHabits = analyticsData?.habitPerformances && analyticsData.habitPerformances.length > 0;

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

  const weeklyChartData = analyticsData?.weeklyCompletionChart?.map(point => ({
    name: point.label,
    rate: Math.round(point.value * 100),
    date: point.date,
  })) || [];

  const monthlyChartData = analyticsData?.monthlyCompletionChart?.map(point => ({
    day: point.label,
    rate: Math.round(point.value * 100),
    date: point.date,
  })) || [];

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl"></div>
          ))}
        </div>
        <div className="h-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {isStupid ? "Stupid's Performance Lab 🧪" : "Performance Analytics"}
          </h1>
          <p className="text-slate-550 dark:text-slate-400 text-sm mt-0.5 font-medium">
            {isStupid ? "Idiot has been keeping an eye on these numbers. 👀" : "Explore routine completion trends and habit efficiency."}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className={`px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-955 focus:outline-none dark:text-white text-xs font-bold transition-all ${
              isStupid 
                ? 'border-purple-500/20 focus:border-purple-500 focus:ring-1 focus:ring-purple-950' 
                : 'border-slate-200 dark:border-slate-800 focus:border-emerald-500'
            }`}
          >
            {MONTHS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
          
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className={`px-3.5 py-2.5 rounded-xl border bg-white dark:bg-slate-955 focus:outline-none dark:text-white text-xs font-bold transition-all ${
              isStupid 
                ? 'border-purple-500/20 focus:border-purple-500 focus:ring-1 focus:ring-purple-950' 
                : 'border-slate-200 dark:border-slate-800 focus:border-emerald-500'
            }`}
          >
            {[2025, 2026, 2027].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {!hasHabits ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center transition-colors duration-300 shadow-premium dark:shadow-premium-dark">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
            <BarChart3 className="w-8 h-8" />
          </div>
          <h3 className="text-md font-bold text-slate-900 dark:text-white">No analytics data yet</h3>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Start tracking habits to compile metrics and charts here.</p>
        </div>
      ) : (
        <>
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Overall Completion Rate */}
            <AnimatedWrapper delay={0} isStupid={isStupid}>
              <PremiumAnalyticsCard
                isStupid={isStupid}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-hover dark:hover:shadow-premium-dark-hover"
              >
                <div>
                  <p className="text-xs font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider">Overall Rate</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    {isStupid ? (
                      <CountingNumber value={Math.round((analyticsData?.overallCompletionRate || 0) * 100)} />
                    ) : (
                      Math.round((analyticsData?.overallCompletionRate || 0) * 100)
                    )}%
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Average across all days</p>
                </div>
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl flex items-center justify-center text-emerald-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </PremiumAnalyticsCard>
            </AnimatedWrapper>

            {/* Total Completions */}
            <AnimatedWrapper delay={100} isStupid={isStupid}>
              <PremiumAnalyticsCard
                isStupid={isStupid}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-hover dark:hover:shadow-premium-dark-hover"
              >
                <div>
                  <p className="text-xs font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider">Total Actions</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                    {isStupid ? (
                      <CountingNumber value={analyticsData?.totalCompletions || 0} />
                    ) : (
                      analyticsData?.totalCompletions
                    )}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Completions registered</p>
                </div>
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl flex items-center justify-center text-emerald-600">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </PremiumAnalyticsCard>
            </AnimatedWrapper>

            {/* Best Performing Habit */}
            <AnimatedWrapper delay={200} isStupid={isStupid}>
              <PremiumAnalyticsCard
                isStupid={isStupid}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-hover dark:hover:shadow-premium-dark-hover"
              >
                <div>
                  <p className="text-xs font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider">Best Habit</p>
                  <p className="text-base font-bold text-slate-850 dark:text-white truncate max-w-[150px] mt-1.5" title={analyticsData?.bestPerformingHabit?.name}>
                    {analyticsData?.bestPerformingHabit?.name || 'N/A'}
                  </p>
                  <p className="text-xs text-emerald-650 dark:text-emerald-450 font-bold mt-0.5">
                    {analyticsData?.bestPerformingHabit ? (
                      <>
                        {isStupid ? (
                          <CountingNumber value={Math.round(analyticsData.bestPerformingHabit.completionRate * 100)} />
                        ) : (
                          Math.round(analyticsData.bestPerformingHabit.completionRate * 100)
                        )}% completion
                      </>
                    ) : ''}
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl flex items-center justify-center text-emerald-600 animate-float">
                  <Award className="w-6 h-6 fill-emerald-500/10" />
                </div>
              </PremiumAnalyticsCard>
            </AnimatedWrapper>

            {/* Needs Improvement */}
            <AnimatedWrapper delay={300} isStupid={isStupid}>
              <PremiumAnalyticsCard
                isStupid={isStupid}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-hover dark:hover:shadow-premium-dark-hover"
              >
                <div>
                  <p className="text-xs font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wider">Lowest Habit</p>
                  <p className="text-base font-bold text-slate-850 dark:text-white truncate max-w-[150px] mt-1.5" title={analyticsData?.needsImprovementHabit?.name}>
                    {analyticsData?.needsImprovementHabit?.name || 'N/A'}
                  </p>
                  <p className="text-xs text-rose-500 font-bold mt-0.5">
                    {analyticsData?.needsImprovementHabit ? (
                      <>
                        {isStupid ? (
                          <CountingNumber value={Math.round(analyticsData.needsImprovementHabit.completionRate * 100)} />
                        ) : (
                          Math.round(analyticsData.needsImprovementHabit.completionRate * 100)
                        )}% completion
                      </>
                    ) : ''}
                  </p>
                </div>
                <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/20 rounded-xl flex items-center justify-center text-rose-500">
                  <AlertCircle className="w-6 h-6" />
                </div>
              </PremiumAnalyticsCard>
            </AnimatedWrapper>
          </div>

          {/* Time Series Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Trend */}
            <AnimatedWrapper delay={400} isStupid={isStupid}>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark transition-colors duration-300">
                <div className="flex items-center space-x-2 mb-6">
                  <Calendar className="w-5 h-5 text-emerald-650" />
                  <h3 className="text-xs font-bold text-slate-450 dark:text-white uppercase tracking-wider">Monthly Progress</h3>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                      <XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl shadow-lg text-xs font-semibold">
                                <p className="text-slate-400 mb-1">{payload[0].payload.date}</p>
                                <p className="text-emerald-600 dark:text-emerald-450 font-bold">Completion: {payload[0].value}%</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Line type="monotone" dataKey="rate" stroke="#16a34a" strokeWidth={3} dot={false} activeDot={{ r: 6 }} isAnimationActive={isStupid} animationDuration={1200} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </AnimatedWrapper>

            {/* Weekly Trend */}
            <AnimatedWrapper delay={500} isStupid={isStupid}>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark transition-colors duration-300">
                <div className="flex items-center space-x-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-emerald-650" />
                  <h3 className="text-xs font-bold text-slate-455 dark:text-white uppercase tracking-wider">Weekly Overview</h3>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" className="dark:stroke-slate-800" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[0, 100]} tickFormatter={v => `${v}%`} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl shadow-lg text-xs font-semibold">
                                <p className="text-slate-400 mb-1">{payload[0].payload.date}</p>
                                <p className="text-emerald-600 dark:text-emerald-455 font-bold">Completion: {payload[0].value}%</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="rate" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#areaGrad)" isAnimationActive={isStupid} animationDuration={1200} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </AnimatedWrapper>
          </div>

          {/* Habit Rankings List Table */}
          <AnimatedWrapper delay={600} isStupid={isStupid}>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark transition-colors duration-300">
              <h3 className="text-sm font-bold text-slate-455 dark:text-white uppercase tracking-wider mb-6">Habit Performance Ranking</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800/80 text-xs font-bold text-slate-405 dark:text-slate-500 uppercase tracking-wider">
                      <th className="pb-4 pl-4">Habit</th>
                      <th className="pb-4">Category</th>
                      <th className="pb-4 text-center">Completion Rate</th>
                      <th className="pb-4 text-center">Current Streak</th>
                      <th className="pb-4 text-center">Best Streak</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 text-sm font-semibold text-slate-700 dark:text-slate-350">
                    {analyticsData?.habitPerformances?.map((perf) => {
                      const IconComponent = ICONS.find(ico => ico.name === perf.icon)?.icon || Sparkles;
                      return (
                        <tr key={perf.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                          <td className="py-4 pl-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20">
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <span className="font-bold text-slate-850 dark:text-white">{perf.name}</span>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getCategoryColor(perf.category)}`}>
                              {perf.category}
                            </span>
                          </td>
                          <td className="py-4 text-center text-emerald-600 font-bold">
                            {isStupid ? (
                              <><CountingNumber value={Math.round(perf.completionRate * 100)} />%</>
                            ) : (
                              `${Math.round(perf.completionRate * 100)}%`
                            )}
                          </td>
                          <td className="py-4 text-center text-emerald-600 font-bold">
                            {perf.currentStreak > 0 ? (
                              isStupid ? (
                                <>🔥 <CountingNumber value={perf.currentStreak} />d</>
                              ) : (
                                `🔥 ${perf.currentStreak}d`
                              )
                            ) : '0d'}
                          </td>
                          <td className="py-4 text-center text-emerald-600 font-bold">
                            {perf.bestStreak > 0 ? (
                              isStupid ? (
                                <>🏆 <CountingNumber value={perf.bestStreak} />d</>
                              ) : (
                                `🏆 ${perf.bestStreak}d`
                              )
                            ) : '0d'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </AnimatedWrapper>
        </>
      )}
    </div>
  );
};

export default Analytics;
