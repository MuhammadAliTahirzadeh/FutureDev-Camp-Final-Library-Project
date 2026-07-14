import React, { useState } from 'react';
import { Mail, Lock, Bell, Moon, Sun, Check } from 'lucide-react';
import { UserProfile } from '../types';
import { GlassCard } from './GlassCard';

interface SettingsViewProps {
  user: UserProfile;
  onUpdateEmail: (email: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateEmail,
  isDarkMode,
  onToggleTheme,
}) => {
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState('•••••••••••••');
  const [dueDateReminders, setDueDateReminders] = useState(true);
  const [newArrivals, setNewArrivals] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleUpdateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateEmail(email);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div id="settings-view-container" className="space-y-8 animate-fade-in font-sans">
      <div id="settings-header">
        <h1 id="settings-title" className="text-4xl font-sans font-bold tracking-tight text-gray-900 dark:text-white">
          Settings
        </h1>
        <p id="settings-subtitle" className="text-gray-800 dark:text-slate-200 mt-1 font-medium">
          Customize your account settings, notification preferences, and appearance.
        </p>
      </div>

      <div id="settings-form-layout" className="space-y-6 max-w-4xl">
        {/* Account Settings */}
        <div id="account-settings-group" className="space-y-3">
          <h2 className="text-sm text-gray-800 dark:text-slate-200 font-extrabold uppercase tracking-wider">Account</h2>
          <GlassCard id="account-settings-card" className="p-6 border-white/20 bg-white/10 dark:bg-black/20">
            <form onSubmit={handleUpdateAccount} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              <div id="input-group-email" className="space-y-2">
                <label className="text-xs font-extrabold text-gray-850 dark:text-slate-200 flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-blue-500" /> Email
                </label>
                <input
                  id="email-input-field"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 dark:bg-black/30 border border-white/15 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div id="input-group-password" className="space-y-2">
                <label className="text-xs font-extrabold text-gray-850 dark:text-slate-200 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-blue-500" /> Password
                </label>
                <input
                  id="password-input-field"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 dark:bg-black/30 border border-white/15 rounded-xl px-4 py-3 text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div id="account-save-row" className="md:col-span-2 flex items-center justify-between pt-2">
                <div className="h-6">
                  {saveSuccess && (
                    <span id="save-status-msg" className="text-xs font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                      <Check className="w-4 h-4" /> Account updated successfully!
                    </span>
                  )}
                </div>
                <button
                  id="account-update-btn"
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                >
                  Update
                </button>
              </div>
            </form>
          </GlassCard>
        </div>

        {/* Notifications Settings */}
        <div id="notifications-settings-group" className="space-y-3">
          <h2 className="text-sm text-gray-800 dark:text-slate-200 font-extrabold uppercase tracking-wider">Notifications</h2>
          <GlassCard id="notifications-settings-card" className="p-6 border-white/20 bg-white/10 dark:bg-black/20 space-y-4">
            {/* Toggle 1 */}
            <div id="toggle-row-due" className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm text-gray-800 dark:text-white">Due Date Reminders</h4>
                <p className="text-xs text-gray-800 dark:text-slate-200 font-semibold">Send an email reminder 3 days before the book return due date.</p>
              </div>
              <button
                id="due-date-toggle-btn"
                onClick={() => setDueDateReminders(!dueDateReminders)}
                className={`w-12 h-6 rounded-full p-1 transition-all duration-300 relative flex items-center ${
                  dueDateReminders ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-800'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 transform ${
                  dueDateReminders ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {/* Toggle 2 */}
            <div id="toggle-row-arrivals" className="flex items-center justify-between pt-1">
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm text-gray-800 dark:text-white">New Arrivals</h4>
                <p className="text-xs text-gray-800 dark:text-slate-200 font-semibold">Receive newsletters about popular new arrivals in the library.</p>
              </div>
              <button
                id="new-arrivals-toggle-btn"
                onClick={() => setNewArrivals(!newArrivals)}
                className={`w-12 h-6 rounded-full p-1 transition-all duration-300 relative flex items-center ${
                  newArrivals ? 'bg-blue-600' : 'bg-gray-300 dark:bg-slate-800'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 transform ${
                  newArrivals ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Appearance Settings */}
        <div id="appearance-settings-group" className="space-y-3">
          <h2 className="text-sm text-gray-800 dark:text-slate-200 font-extrabold uppercase tracking-wider">Appearance</h2>
          <GlassCard id="appearance-settings-card" className="p-6 border-white/20 bg-white/10 dark:bg-black/20">
            <div id="theme-toggle-row" className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm text-gray-800 dark:text-white">Dark Mode</h4>
                <p className="text-xs text-gray-800 dark:text-slate-200 font-semibold">Switch the glassmorphism UI between light and dark themes.</p>
              </div>
              <button
                id="theme-toggle-switch-btn"
                onClick={onToggleTheme}
                className={`w-12 h-6 rounded-full p-1 transition-all duration-300 relative flex items-center ${
                  isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 transform ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
