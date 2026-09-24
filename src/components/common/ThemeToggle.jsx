import React from 'react';
import { useHisab } from '../../context/HisabContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = ({ variant = 'navbar', className = '' }) => {
  const { theme, toggleTheme } = useHisab();
  const isDark = theme === 'dark';

  if (variant === 'compact') {
    return (
      <button
        onClick={toggleTheme}
        className={`p-2 rounded-xl border transition-all duration-200 flex items-center justify-center cursor-pointer shadow-sm ${
          isDark
            ? 'bg-slate-800 hover:bg-slate-700 text-amber-400 border-slate-700'
            : 'bg-white hover:bg-slate-100 text-indigo-600 border-slate-200'
        } ${className}`}
        title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        aria-label="Toggle Theme"
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-600 transition-transform hover:-rotate-12" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer select-none shadow-sm ${
        isDark
          ? 'bg-slate-800/90 hover:bg-slate-800 border-slate-700 text-amber-300 hover:text-amber-200'
          : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 hover:text-indigo-600'
      } ${className}`}
      title={isDark ? 'Switch to Light Theme (लाइट थीम)' : 'Switch to Dark Theme (डार्क थीम)'}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <>
          <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>☀️ Light</span>
        </>
      ) : (
        <>
          <Moon className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span>🌙 Dark</span>
        </>
      )}
    </button>
  );
};
