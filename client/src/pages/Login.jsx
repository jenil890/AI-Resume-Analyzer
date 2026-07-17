import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BrainCircuit, Mail, Lock, Loader2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    const result = await loginWithGoogle();
    setLoading(false);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Google Sign-In failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    setLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 flex flex-col font-sans transition-colors duration-300 relative justify-center items-center px-6">
      {/* Background decoration */}
      <div className="absolute top-10 left-10">
        <Link to="/" className="inline-flex items-center gap-2 p-2 rounded-xl text-slate-500 hover:text-brand-500 hover:bg-slate-100 dark:hover:bg-dark-900 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-semibold">Back to Home</span>
        </Link>
      </div>

      <div className="absolute top-10 right-10">
        <ThemeToggle />
      </div>

      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-brand-500/5 blur-[100px] pointer-events-none"></div>

      {/* Main card */}
      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-dark-800 bg-white/70 dark:bg-dark-900/60 backdrop-blur-md shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex p-3.5 bg-brand-500 rounded-2xl text-white shadow-lg shadow-brand-500/25 mb-4">
            <BrainCircuit className="h-7 w-7" />
          </div>
          <h2 className="text-3xl font-extrabold font-outfit text-slate-800 dark:text-slate-100">
            Welcome Back
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 font-medium">
            Sign in to check your resumes and audit history
          </p>
        </div>

        {error && (
          <div className="flex items-start gap-2.5 p-4 mb-6 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-sm">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <Mail className="h-5 w-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-955 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Password
              </label>
            </div>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                <Lock className="h-5 w-5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-dark-850 bg-white dark:bg-dark-955 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:focus:ring-brand-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 rounded-2xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 disabled:bg-slate-300 dark:disabled:bg-dark-800 text-white font-bold transition-all duration-200 shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200 dark:border-dark-800"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-dark-900 px-3 text-slate-400 dark:text-slate-500 font-bold">
              Or continue with
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          type="button"
          className="w-full py-3.5 px-4 rounded-2xl border border-slate-200 dark:border-dark-800 hover:bg-slate-55 dark:hover:bg-dark-800 bg-white dark:bg-dark-900 text-slate-700 dark:text-slate-200 font-bold transition-all duration-200 shadow-sm flex items-center justify-center gap-3 active:scale-[0.98]"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          Google Account
        </button>

        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8 font-medium">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-500 hover:text-brand-600 font-bold">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
