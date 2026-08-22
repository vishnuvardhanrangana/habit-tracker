import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast: addToast }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => {
          let bgColor = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800';
          let iconColor = 'text-emerald-600 dark:text-emerald-400';
          let Icon = Info;

          if (toast.type === 'success') {
            bgColor = 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40';
            iconColor = 'text-emerald-600 dark:text-emerald-400';
            Icon = CheckCircle;
          } else if (toast.type === 'error') {
            bgColor = 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/40';
            iconColor = 'text-rose-600 dark:text-rose-400';
            Icon = XCircle;
          } else if (toast.type === 'warning') {
            bgColor = 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40';
            iconColor = 'text-amber-600 dark:text-amber-400';
            Icon = AlertTriangle;
          } else {
            // info/neutral
            bgColor = 'bg-emerald-50/20 dark:bg-slate-900 border-slate-200 dark:border-slate-800';
            iconColor = 'text-emerald-600 dark:text-emerald-400';
            Icon = Info;
          }

          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 p-4 rounded-2xl border shadow-premium dark:shadow-premium-dark backdrop-blur-md transition-all duration-300 animate-slide-in pointer-events-auto ${bgColor}`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
              <div className="flex-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                {toast.message}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-0.5 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(1rem) scale(0.95);
            opacity: 0;
          }
          to {
            transform: translateX(0) scale(1);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
