import React, { useEffect, useMemo, useState } from 'react';
import {
  Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { AlertCircle, Award, BarChart3, Calendar, CheckCircle, Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ICONS } from '../components/HabitModal';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
].map((label, index) => ({ label, value: index + 1 }));

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

const PremiumCard = ({ children, className, isStupid }) => {
  if (!isStupid) return <div className={className}>{children}</div>;
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const CountingNumber = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const end = Number(value) || 0;
    const startTime = performance.now();
    let frameId;
    const update = (now) => {
      const progress = Math.min((now - startTime) / 700, 1);
      setDisplayValue(Math.round(end * (1 - ((1 - progress) ** 2))));
      if (progress < 1) frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [value]);

  return displayValue;
};

const MetricNumber = ({ value, isStupid, suffix = '' }) => (
  <>{isStupid ? <CountingNumber value={value} /> : value}{suffix}</>
);

const ChartCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark">
    <div className="flex items-center space-x-2 mb-6">
      <Icon className="w-5 h-5 text-emerald-600" />
      <h3 className="text-xs font-bold text-slate-500 dark:text-white uppercase tracking-wider">{title}</h3>
    </div>
    <div className="h-64 w-full"><ResponsiveContainer width="100%" height="100%">{children}</ResponsiveContainer></div>
  </div>
);

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 p-3 rounded-2xl shadow-lg text-xs font-semibold">
      <p className="text-slate-400 mb-1">{payload[0].payload.date}</p>
      <p className="text-emerald-600 dark:text-emerald-400 font-bold">Completion: {payload[0].value}%</p>
    </div>
  );
};

const categoryColor = (category) => category === 'Other'
  ? 'bg-slate-50 text-slate-650 dark:bg-slate-900 dark:text-slate-400'
  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400';

const Analytics = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const isStupid = user?.email === 'stupid';

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const response = await api.get('/analytics', { params: { year: selectedYear, month: selectedMonth } });
        if (mounted && response.data.success) setAnalyticsData(response.data.data);
      } catch (error) {
        if (mounted) showToast(error.response?.data?.message || 'Could not load analytics.', 'error');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [selectedMonth, selectedYear, showToast]);

  const monthlyData = useMemo(() => (analyticsData?.monthlyCompletionChart || []).map((point) => ({
    day: point.label, date: point.date, rate: Math.round((point.value || 0) * 100),
  })), [analyticsData]);
  const weeklyData = useMemo(() => (analyticsData?.weeklyCompletionChart || []).map((point) => ({
    name: point.label, date: point.date, rate: Math.round((point.value || 0) * 100),
  })), [analyticsData]);
  const performances = analyticsData?.habitPerformances || [];

  if (loading) {
    return <div className="space-y-6 animate-pulse"><div className="h-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl" /><div className="grid grid-cols-1 md:grid-cols-4 gap-6">{[1, 2, 3, 4].map((item) => <div key={item} className="h-24 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl" />)}</div><div className="h-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl" /></div>;
  }

  const bestHabit = analyticsData?.bestPerformingHabit;
  const lowestHabit = analyticsData?.needsImprovementHabit;
  const cards = [
    { label: 'Overall Rate', value: <MetricNumber value={Math.round((analyticsData?.overallCompletionRate || 0) * 100)} isStupid={isStupid} suffix="%" />, detail: 'Average across all days', Icon: TrendingUp, tone: 'emerald' },
    { label: 'Total Actions', value: <MetricNumber value={analyticsData?.totalCompletions || 0} isStupid={isStupid} />, detail: 'Completions registered', Icon: CheckCircle, tone: 'emerald' },
    { label: 'Best Habit', value: bestHabit?.name || 'N/A', detail: bestHabit ? <><MetricNumber value={Math.round(bestHabit.completionRate * 100)} isStupid={isStupid} suffix="%" /> completion</> : '', Icon: Award, tone: 'emerald' },
    { label: 'Lowest Habit', value: lowestHabit?.name || 'N/A', detail: lowestHabit ? <><MetricNumber value={Math.round(lowestHabit.completionRate * 100)} isStupid={isStupid} suffix="%" /> completion</> : '', Icon: AlertCircle, tone: 'rose' },
  ];

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{isStupid ? "Stupid's Performance Lab 🧪" : 'Performance Analytics'}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{isStupid ? 'Real-time metrics, streaks and performance formulas.' : 'Explore routine completion trends and habit efficiency.'}</p>
        </div>
        <div className="flex items-center space-x-2">
          <select value={selectedMonth} onChange={(event) => setSelectedMonth(Number(event.target.value))} className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-emerald-500 focus:outline-none dark:text-white text-xs font-bold">{MONTHS.map((month) => <option key={month.value} value={month.value}>{month.label}</option>)}</select>
          <select value={selectedYear} onChange={(event) => setSelectedYear(Number(event.target.value))} className="px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:border-emerald-500 focus:outline-none dark:text-white text-xs font-bold">{[now.getFullYear() - 1, now.getFullYear(), now.getFullYear() + 1].map((year) => <option key={year} value={year}>{year}</option>)}</select>
        </div>
      </div>

      {!performances.length ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-premium dark:shadow-premium-dark">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600"><BarChart3 className="w-8 h-8" /></div>
          <h3 className="text-md font-bold text-slate-900 dark:text-white">No analytics data yet</h3>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Start tracking habits to compile metrics and charts here.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map(({ label, value, detail, Icon, tone }, index) => (
              <AnimatedWrapper key={label} delay={index * 100} isStupid={isStupid}>
                <PremiumCard isStupid={isStupid} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-premium-hover">
                  <div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p><p className="text-xl font-bold text-slate-900 dark:text-white mt-1 truncate max-w-[150px]">{value}</p><p className={`text-xs mt-0.5 font-medium ${tone === 'rose' ? 'text-rose-500' : 'text-slate-400'}`}>{detail}</p></div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${tone === 'rose' ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-500' : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600'}`}><Icon className="w-6 h-6" /></div>
                </PremiumCard>
              </AnimatedWrapper>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatedWrapper delay={400} isStupid={isStupid}><ChartCard title="Monthly Progress" icon={Calendar}><LineChart data={monthlyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="day" stroke="#94a3b8" fontSize={10} tickLine={false} /><YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[0, 100]} tickFormatter={(value) => `${value}%`} /><Tooltip content={<ChartTooltip />} /><Line type="monotone" dataKey="rate" stroke="#16a34a" strokeWidth={3} dot={false} activeDot={{ r: 6 }} isAnimationActive={isStupid} animationDuration={1200} /></LineChart></ChartCard></AnimatedWrapper>
            <AnimatedWrapper delay={500} isStupid={isStupid}><ChartCard title="Weekly Overview" icon={TrendingUp}><AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}><defs><linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} /><stop offset="95%" stopColor="#16a34a" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} /><YAxis stroke="#94a3b8" fontSize={10} tickLine={false} domain={[0, 100]} tickFormatter={(value) => `${value}%`} /><Tooltip content={<ChartTooltip />} /><Area type="monotone" dataKey="rate" stroke="#16a34a" strokeWidth={3} fill="url(#areaGrad)" isAnimationActive={isStupid} animationDuration={1200} /></AreaChart></ChartCard></AnimatedWrapper>
          </div>

          <AnimatedWrapper delay={600} isStupid={isStupid}>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-premium dark:shadow-premium-dark">
              <h3 className="text-sm font-bold text-slate-500 dark:text-white uppercase tracking-wider mb-6">Habit Performance Ranking</h3>
              <div className="overflow-x-auto"><table className="w-full text-left border-collapse"><thead><tr className="border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider"><th className="pb-4 pl-4">Habit</th><th className="pb-4">Category</th><th className="pb-4 text-center">Completion Rate</th><th className="pb-4 text-center">Current Streak</th><th className="pb-4 text-center">Best Streak</th></tr></thead><tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300">{performances.map((performance) => { const Icon = ICONS.find((item) => item.name === performance.icon)?.icon || Sparkles; return <tr key={performance.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/50"><td className="py-4 pl-4"><div className="flex items-center space-x-3"><div className="w-8 h-8 rounded-lg flex items-center justify-center bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"><Icon className="w-4 h-4" /></div><span className="font-bold text-slate-900 dark:text-white">{performance.name}</span></div></td><td className="py-4"><span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${categoryColor(performance.category)}`}>{performance.category}</span></td><td className="py-4 text-center text-emerald-600"><MetricNumber value={Math.round(performance.completionRate * 100)} isStupid={isStupid} suffix="%" /></td><td className="py-4 text-center text-emerald-600">{performance.currentStreak ? <>🔥 <MetricNumber value={performance.currentStreak} isStupid={isStupid} suffix="d" /></> : '0d'}</td><td className="py-4 text-center text-emerald-600">{performance.bestStreak ? <>🏆 <MetricNumber value={performance.bestStreak} isStupid={isStupid} suffix="d" /></> : '0d'}</td></tr>; })}</tbody></table></div>
            </div>
          </AnimatedWrapper>
        </>
      )}
    </div>
  );
};

export default Analytics;
