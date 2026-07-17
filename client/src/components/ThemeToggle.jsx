import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className="p-2.5 rounded-xl border border-slate-200 dark:border-dark-800 bg-white/50 dark:bg-dark-900/50 hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-600 dark:text-slate-300 transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-amber-400 rotate-0 transition-transform duration-500" />
      ) : (
        <Moon className="h-5 w-5 text-brand-600 rotate-0 transition-transform duration-500" />
      )}
    </button>
  );
};

export default ThemeToggle;
