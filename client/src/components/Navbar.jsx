import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BrainCircuit, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-dark-800/80 bg-white/80 dark:bg-dark-950/80 backdrop-blur-md">
      <div className="flex h-20 items-center justify-between px-6 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="flex items-center gap-2">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="p-2 lg:hidden rounded-lg hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-600 dark:text-slate-300"
            >
              <Menu className="h-6 w-6" />
            </button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <div className="p-2 bg-brand-500 rounded-xl text-white shadow-md shadow-brand-500/20">
              <BrainCircuit className="h-6 w-6" />
            </div>
            <span className="font-outfit text-xl font-bold bg-gradient-to-r from-brand-600 to-indigo-500 dark:from-brand-400 dark:to-indigo-400 bg-clip-text text-transparent">
              ATS Analyzer
            </span>
          </Link>
        </div>

        {/* Public Links */}
        {!onMenuClick && (
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors">
              Features
            </a>
          </nav>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {user ? (
            <Link
              to="/dashboard"
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 transition-all duration-200"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-medium bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-200 shadow-sm"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
