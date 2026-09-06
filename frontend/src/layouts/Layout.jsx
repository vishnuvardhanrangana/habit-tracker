import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, CheckSquare, Calendar, BarChart3, Settings, LogOut, Menu, X, Heart, Cake } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isStupid = user?.email === 'stupid';

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Habits', path: '/habits', icon: CheckSquare },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
    ...(isStupid ? [
      { name: 'Between Us', path: '/between-us', icon: Heart },
      { name: 'Birthday', path: '/birthday', icon: Cake },
      { name: '♡ Missing You', path: '/missing-you', icon: Heart },
    ] : [])
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors duration-300">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 dark:border-slate-800/50">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md shadow-emerald-500/10">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="font-extrabold text-xl bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-green-500">
              HabitFlow
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            const isRomantic = item.path === '/between-us' || item.path === '/missing-you';

            const activeClass = isActive
              ? (isStupid
                  ? (isRomantic
                      ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 pl-4 shadow-[0_0_10px_rgba(244,63,94,0.15)] border border-rose-500/10'
                      : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 pl-4')
                  : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-l-4 border-emerald-600 pl-3 rounded-l-none')
              : (isStupid
                  ? (isRomantic
                      ? 'text-slate-600 dark:text-slate-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/10 hover:text-rose-700 dark:hover:text-rose-300 pl-4 hover:shadow-[0_0_10px_rgba(244,63,94,0.12)] border border-transparent hover:border-rose-500/10'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10 hover:text-emerald-700 dark:hover:text-emerald-300 pl-4')
                  : 'text-slate-600 dark:text-slate-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10 hover:text-emerald-700 dark:hover:text-emerald-300 border-l-4 border-transparent pl-3 rounded-l-none');

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`relative flex items-center space-x-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 group ${activeClass}`}
              >
                {isStupid && isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className={`absolute left-0 top-0 bottom-0 w-1 ${isRomantic ? 'bg-rose-500' : 'bg-emerald-600'} rounded-r z-10`}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-105 ${isActive ? (isRomantic ? 'text-rose-500' : 'text-emerald-600 dark:text-emerald-400') : (`text-slate-400 dark:text-slate-500 ${isRomantic ? 'group-hover:text-rose-500' : 'group-hover:text-emerald-600'}`)}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User profile footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <Link to="/settings" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                {getInitials(user?.fullName)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {user?.fullName}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                  {user?.email}
                </p>
              </div>
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Layout Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 z-40 transition-colors duration-300">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold">
              H
            </div>
            <span className="font-extrabold text-lg bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-green-500">
              HabitFlow
            </span>
          </Link>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
        </header>

        {/* Mobile menu slide-over drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            ></div>

            {/* Sidebar drawer content */}
            <div className="relative flex flex-col w-72 max-w-xs bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-full p-6 shadow-2xl animate-slide-right transition-colors duration-300">
              <div className="flex items-center justify-between mb-8">
                <Link to="/" className="flex items-center space-x-2" onClick={() => setMobileMenuOpen(false)}>
                  <div className="w-8 h-8 bg-gradient-to-tr from-emerald-500 to-green-600 rounded-lg flex items-center justify-center text-white font-bold">
                    H
                  </div>
                  <span className="font-extrabold text-lg bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-green-500">
                    HabitFlow
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  const isRomantic = item.path === '/between-us' || item.path === '/missing-you';

                  const activeClass = isActive
                    ? (isStupid
                        ? (isRomantic
                            ? 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400 pl-4 shadow-[0_0_10px_rgba(244,63,94,0.15)] border border-rose-500/10'
                            : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 pl-4')
                        : 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-l-4 border-emerald-600 pl-3 rounded-l-none')
                    : (isStupid
                        ? (isRomantic
                            ? 'text-slate-600 dark:text-slate-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/10 hover:text-rose-700 pl-4 hover:shadow-[0_0_10px_rgba(244,63,94,0.12)] border border-transparent hover:border-rose-500/10'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10 hover:text-emerald-700 pl-4')
                        : 'text-slate-600 dark:text-slate-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10 hover:text-emerald-700 border-l-4 border-transparent pl-3 rounded-l-none');

                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`relative flex items-center space-x-3 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${activeClass}`}
                    >
                      {isStupid && isActive && (
                        <motion.div
                          layoutId="activeIndicatorMobile"
                          className={`absolute left-0 top-0 bottom-0 w-1 ${isRomantic ? 'bg-rose-500' : 'bg-emerald-600'} rounded-r z-10`}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                      <Icon className={`w-5 h-5 ${isActive ? (isRomantic ? 'text-rose-500' : 'text-emerald-600') : (`text-slate-400 ${isRomantic ? 'group-hover:text-rose-500' : ''}`)}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-green-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {getInitials(user?.fullName)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">{user?.fullName}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user?.email}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 font-semibold text-sm hover:bg-rose-50 dark:hover:bg-rose-950/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto focus:outline-none p-6 md:p-8 relative z-10">
          {user?.email === 'stupid' ? (
            <>
              {/* Soft background blob effects for stupid */}
              <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 select-none">
                <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-emerald-300/10 blur-[130px] dark:bg-emerald-950/20"></div>
                <div className="absolute bottom-[10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-green-200/10 blur-[140px] dark:bg-green-950/10"></div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full w-full relative z-10"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </>
          ) : (
            <div className="animate-fade-up h-full w-full">
              {children}
            </div>
          )}
        </main>
      </div>
      
      <style>{`
        @keyframes slideRight {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-right {
          animation: slideRight 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default Layout;
