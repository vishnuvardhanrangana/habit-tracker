import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Lightweight particle generator for premium login success transition
const StupidParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 120 - 60, // scatter sideways
    y: Math.random() * -120 - 40, // rise up
    size: Math.random() * 5 + 3,
    delay: Math.random() * 0.4,
    duration: Math.random() * 1.2 + 1.2
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 150, x: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 0.8, 0.8, 0],
            y: p.y,
            x: p.x,
            scale: [0.5, 1, 1, 0.5]
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeOut",
            repeat: Infinity
          }}
          className="absolute left-[50%] bottom-[20%] rounded-full bg-emerald-400/40 blur-[0.5px]"
          style={{
            width: p.size,
            height: p.size,
            marginLeft: -p.size / 2
          }}
        />
      ))}
    </div>
  );
};

const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStupidLoginSuccess, setIsStupidLoginSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please fill in all fields', 'warning');
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);

    if (result.success) {
      if (email.trim().toLowerCase() === 'stupid') {
        setIsStupidLoginSuccess(true);
        setTimeout(() => {
          setIsSubmitting(false);
          navigate('/');
        }, 1500);
      } else {
        setIsSubmitting(false);
        showToast('Login successful', 'success');
        navigate('/');
      }
    } else {
      setIsSubmitting(false);
      showToast(result.message || 'Invalid username or password', 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-300 relative overflow-hidden">
      {/* Background blobs for premium depth */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <AnimatePresence mode="wait">
        {!isStupidLoginSuccess ? (
          <motion.div
            key="login-card"
            exit={{
              scale: 0.94,
              filter: "blur(6px)",
              opacity: 0,
              transition: { duration: 0.45, ease: "easeInOut" }
            }}
            className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-premium dark:shadow-premium-dark relative z-10"
          >
            {/* Title */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/10">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Habit Tracker</h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">
                Your private space for building better habits.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your username"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-950/20 focus:outline-none dark:text-white transition-all text-sm font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-950/20 focus:outline-none dark:text-white transition-all text-sm font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 px-4 rounded-xl hover:shadow-lg disabled:opacity-50 transition-all text-sm flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </motion.button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-md w-full h-[380px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-premium dark:shadow-premium-dark relative z-10 flex flex-col items-center justify-center overflow-hidden"
          >
            {/* Expanding green glow */}
            <motion.div
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 2.5, opacity: 0.12 }}
              transition={{ duration: 1.3, ease: "easeOut" }}
              className="absolute w-64 h-64 bg-emerald-500 rounded-full blur-3xl pointer-events-none"
            />

            {/* Particles */}
            <StupidParticles />

            {/* Personalized Welcome Msg */}
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-center z-20 space-y-3 px-4"
            >
              <motion.div
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-5xl mb-4 select-none filter drop-shadow-md"
              >
                🫀
              </motion.div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                Welcome back, Stupid🫠💕
              </h2>
              <p className="text-xs text-emerald-650 dark:text-emerald-450 font-extrabold uppercase tracking-widest animate-pulse">
                Preparing your wellness lab...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
