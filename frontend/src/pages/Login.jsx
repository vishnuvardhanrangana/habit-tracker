import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Antigravity from '../components/Antigravity';

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

  const isStupidLayout = email.trim().toLowerCase() === 'stupid' || isStupidLoginSuccess;

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

  // Staggered intro animations configuration
  const introContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.4
      }
    }
  };

  const introTextVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: 'easeOut' }
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-500 ${
      isStupidLayout 
        ? 'bg-slate-950 text-slate-100' 
        : 'bg-slate-50 dark:bg-slate-950 text-slate-900'
    }`}>
      {/* Background elements */}
      {isStupidLayout ? (
        <>
          <Antigravity
            count={300}
            magnetRadius={7}
            ringRadius={8}
            waveSpeed={0.35}
            waveAmplitude={1.2}
            particleSize={1.6}
            lerpSpeed={0.06}
            color="#5227FF"
            autoAnimate
            particleVariance={1.2}
            rotationSpeed={0}
            depthFactor={1}
            pulseSpeed={2.5}
            particleShape="capsule"
            fieldStrength={12}
          />
          {/* Cinematic dark radial overlay to visually separate card from particle field */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(15,23,42,0.65)_0%,rgba(2,6,23,0.95)_100%)] pointer-events-none z-0" />
        </>
      ) : (
        <>
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        </>
      )}

      <AnimatePresence mode="wait">
        {!isStupidLoginSuccess ? (
          <motion.div
            key="login-card"
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{
              scale: 0.94,
              filter: "blur(6px)",
              opacity: 0,
              transition: { duration: 0.45, ease: "easeInOut" }
            }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className={`max-w-md w-full border rounded-3xl p-8 relative z-10 transition-all duration-500 ${
              isStupidLayout
                ? 'bg-slate-900/40 border-purple-500/20 shadow-[0_0_50px_rgba(82,39,255,0.18)] backdrop-blur-xl hover:translate-y-[-2px]'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-premium dark:shadow-premium-dark'
            }`}
          >
            {/* Title Header */}
            {isStupidLayout ? (
              <motion.div
                variants={introContainerVariants}
                initial="hidden"
                animate="visible"
                className="text-center mb-8 space-y-2 select-none"
              >
                <motion.div
                  variants={introTextVariants}
                  className="w-14 h-14 bg-gradient-to-tr from-purple-600 to-indigo-650 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-500/20"
                >
                  <span className="text-white font-black text-xl">S</span>
                </motion.div>
                <motion.h2 
                  variants={introTextVariants} 
                  className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 tracking-tight"
                >
                  Welcome back, Stupid. 👀
                </motion.h2>
                <motion.p 
                  variants={introTextVariants} 
                  className="text-sm font-extrabold text-purple-400/90"
                >
                  Idiot made something for you.
                </motion.p>
                <motion.p 
                  variants={introTextVariants} 
                  className="text-xs font-bold text-slate-450"
                >
                  Let's see what you've been up to.
                </motion.p>
              </motion.div>
            ) : (
              <div className="text-center mb-8">
                <div className="w-12 h-12 bg-gradient-to-tr from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/10">
                  <span className="text-white font-bold text-lg">H</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Habit Tracker</h2>
                <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">
                  Your private space for building better habits.
                </p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  isStupidLayout ? 'text-purple-300' : 'text-slate-700 dark:text-slate-300'
                }`}>
                  Username
                </label>
                <div className="relative">
                  <span className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${
                    isStupidLayout ? 'text-purple-450' : 'text-slate-400'
                  }`}>
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={isStupidLayout ? "Who's this? Stupid?" : "Enter your username"}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-slate-50/50 dark:bg-slate-950 focus:outline-none transition-all text-sm font-medium ${
                      isStupidLayout
                        ? 'border-purple-500/25 bg-slate-950/40 text-purple-100 placeholder-purple-400/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-950/40'
                        : 'border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-950/20 dark:text-white'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${
                  isStupidLayout ? 'text-purple-300' : 'text-slate-700 dark:text-slate-300'
                }`}>
                  Password
                </label>
                <div className="relative">
                  <span className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors duration-300 ${
                    isStupidLayout ? 'text-purple-450' : 'text-slate-400'
                  }`}>
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-11 pr-12 py-3 rounded-xl border bg-slate-50/50 dark:bg-slate-950 focus:outline-none transition-all text-sm font-medium ${
                      isStupidLayout
                        ? 'border-purple-500/25 bg-slate-950/40 text-purple-100 placeholder-purple-400/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-950/40'
                        : 'border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 dark:focus:ring-emerald-950/20 dark:text-white'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-colors duration-300 ${
                      isStupidLayout ? 'text-purple-400 hover:text-purple-300' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                    }`}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className={`w-full font-semibold py-3.5 px-4 rounded-xl disabled:opacity-50 transition-all text-sm flex items-center justify-center space-x-2 cursor-pointer ${
                  isStupidLayout
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-650 hover:from-purple-750 hover:to-indigo-700 text-white shadow-lg shadow-purple-650/20 hover:shadow-purple-600/40'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg'
                }`}
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
