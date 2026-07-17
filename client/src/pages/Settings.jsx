import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  User, 
  Mail, 
  Lock, 
  Sun, 
  Moon, 
  CheckCircle, 
  AlertCircle, 
  Loader2 
} from 'lucide-react';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password && password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password && password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const updateData = { name, email };
    if (password) {
      updateData.password = password;
    }

    const result = await updateProfile(updateData);
    setLoading(false);

    if (result.success) {
      setSuccess('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } else {
      setError(result.error || 'Failed to update profile');
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-extrabold font-outfit text-slate-800 dark:text-white">
          Settings
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
          Customize your profile, account security, and display preferences.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 sm:p-8 border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900/60 rounded-3xl shadow-sm space-y-6">
            <h3 className="text-lg font-bold font-outfit text-slate-800 dark:text-white">
              Profile Details
            </h3>

            {success && (
              <div className="flex items-center gap-2.5 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/35 text-emerald-600 dark:text-emerald-400 text-sm">
                <CheckCircle className="h-5 w-5 shrink-0" />
                <span>{success}</span>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2.5 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 text-sm">
                <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                    <User className="h-5 w-5" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-950 text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Email */}
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
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-950 text-slate-850 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                      <Lock className="h-5 w-5" />
                    </span>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Leave blank to keep current"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-950 text-slate-850 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
                      <Lock className="h-5 w-5" />
                    </span>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-950 text-slate-850 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-sm shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4.5 w-4.5 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Display Settings */}
        <div className="space-y-6">
          <div className="p-6 border border-slate-200 dark:border-dark-800 bg-white dark:bg-dark-900/60 rounded-3xl shadow-sm space-y-6">
            <h3 className="text-lg font-bold font-outfit text-slate-800 dark:text-white">
              Display Preferences
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <span className="block text-sm font-bold text-slate-800 dark:text-slate-200">
                  Interface Theme
                </span>
                <span className="block text-xs text-slate-400 mt-0.5">
                  Currently active: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              
              <button
                onClick={toggleTheme}
                type="button"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-800 hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-700 dark:text-slate-350 transition-all text-xs font-bold"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="h-4.5 w-4.5 text-amber-500" />
                    Light Theme
                  </>
                ) : (
                  <>
                    <Moon className="h-4.5 w-4.5 text-brand-600" />
                    Dark Theme
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
