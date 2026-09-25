import React, { useState } from 'react';
import {
  User,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Shield,
  Bell,
  Settings,
  ChevronRight,
  Sparkles,
  Moon,
  Sun,
  Key,
  CheckCircle2,
  AlertTriangle,
  Heart,
  HelpCircle,
  FileCheck,
  Edit3,
  X,
  Save
} from 'lucide-react';
import { USER_PROFILE_DEFAULT } from '../data/constants';

interface ProfileViewProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenGuardian: () => void;
  runtimeApiKey: string;
  onUpdateApiKey: (key: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenGuardian,
  runtimeApiKey,
  onUpdateApiKey,
}) => {
  const [profile, setProfile] = useState(USER_PROFILE_DEFAULT);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState(USER_PROFILE_DEFAULT);

  // Settings sub-modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showClaimsModal, setShowClaimsModal] = useState(false);
  const [showGuardianConfigModal, setShowGuardianConfigModal] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(runtimeApiKey);
  const [audioSirensEnabled, setAudioSirensEnabled] = useState(true);
  const [gpsPrecisionHigh, setGpsPrecisionHigh] = useState(true);

  const handleSaveProfile = () => {
    setProfile(editForm);
    setIsEditingProfile(false);
  };

  const handleSaveApiKey = () => {
    onUpdateApiKey(tempApiKey);
    setShowGuardianConfigModal(false);
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-5">
      
      {/* USER HEADER (MATCHING ASSET 4 & 5) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 via-purple-500 to-indigo-600 p-0.5 shadow-lg shadow-purple-500/20">
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-white font-black text-xl">
                  VP
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center gap-0.5 shadow">
                ★ {profile.rating.toFixed(2)}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 dark:text-white capitalize">
                  {profile.name}
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{profile.phone}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{profile.email}</p>
            </div>
          </div>

          <button
            onClick={() => setIsEditingProfile(true)}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            title="Edit Profile"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Highlights Bar */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Escrow Hold</span>
            <div className="text-sm font-black text-emerald-600 dark:text-emerald-400">
              ${profile.preAuthBalanceHold.toFixed(2)} USD
            </div>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">TPA Insurance</span>
            <div className="text-sm font-black text-purple-600 dark:text-purple-400 truncate">
              Pre-Cleared
            </div>
          </div>
        </div>
      </div>

      {/* GEMINI SAFETY GUARDIAN CONFIGURATION CARD (POINT B IN SPECIFICATION) */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white border border-cyan-500/30 shadow-xl space-y-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Sparkles className="w-5 h-5 text-cyan-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase text-cyan-400">
                  Point B • Safety Guardian
                </span>
                <span className="text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/30">
                  ONLINE
                </span>
              </div>
              <h3 className="text-sm font-bold text-white">
                Gemini 1.5 Flash Emergency Triage
              </h3>
            </div>
          </div>

          <button
            onClick={() => setShowGuardianConfigModal(true)}
            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-cyan-300 border border-white/10 transition-colors"
          >
            Configure
          </button>
        </div>

        <div className="text-xs text-slate-300 space-y-1 relative z-10">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Runtime API Key:</span>
            <span className="font-mono text-cyan-300 truncate max-w-[200px]">
              {runtimeApiKey ? `${runtimeApiKey.substring(0, 10)}...${runtimeApiKey.substring(runtimeApiKey.length - 6)}` : 'Pre-configured'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Automated Triage Latency:</span>
            <span className="text-emerald-400 font-semibold">&lt; 850ms Instant</span>
          </div>
        </div>

        <button
          onClick={onOpenGuardian}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:opacity-95 shadow-lg shadow-cyan-500/20"
        >
          <Sparkles className="w-4 h-4" />
          <span>Launch Emergency Safety Triage Protocol</span>
        </button>
      </div>

      {/* ITEMIZED MENU LIST (MATCHING ASSET 4) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
        
        {/* Payment & Escrow */}
        <button
          onClick={() => setShowPaymentModal(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Payment &amp; Escrow
              </div>
              <p className="text-[11px] text-slate-500">
                Saved Visa •••• 4917 • $75.00 Pre-auth hold balance
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Insurance Claims */}
        <button
          onClick={() => setShowClaimsModal(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Insurance Claims (TPA)
              </div>
              <p className="text-[11px] text-slate-500">
                Pre-cleared hazard coverage • Policy #ZAP-TPA-9921
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

        {/* Notifications & Audio Siren Toggle */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Emergency Audio Siren &amp; Gate Alerts
              </div>
              <p className="text-[11px] text-slate-500">
                Audio alarm chime upon vehicle arrival
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={audioSirensEnabled}
              onChange={(e) => setAudioSirensEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {/* Ambient Glow Dark Mode Switch */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Ambient Glow Dark Mode
              </div>
              <p className="text-[11px] text-slate-500">
                Neon accents &amp; high contrast OLED dark mode
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={darkMode}
              onChange={onToggleDarkMode}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
          </label>
        </div>

        {/* Detailed Profile View Trigger */}
        <button
          onClick={() => setIsEditingProfile(true)}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                Personal Profile Details
              </div>
              <p className="text-[11px] text-slate-500">
                DOB, Gender, Emergency Contacts, Member info
              </p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </button>

      </div>

      {/* DETAILED PROFILE MODAL (MATCHING ASSET 5) */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-6">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold">Profile Details (Asset 5 Suite)</h3>
              </div>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs divide-y divide-slate-100 dark:divide-slate-800">
              
              {/* Name */}
              <div className="pt-2">
                <label className="text-slate-400 uppercase font-bold text-[10px]">Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                />
              </div>

              {/* Phone */}
              <div className="pt-3">
                <label className="text-slate-400 uppercase font-bold text-[10px]">Phone Number</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono"
                />
              </div>

              {/* Email */}
              <div className="pt-3">
                <label className="text-slate-400 uppercase font-bold text-[10px]">Email Address</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Gender */}
              <div className="pt-3">
                <label className="text-slate-400 uppercase font-bold text-[10px]">Gender</label>
                <select
                  value={editForm.gender}
                  onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-Binary">Non-Binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* Date of Birth */}
              <div className="pt-3">
                <label className="text-slate-400 uppercase font-bold text-[10px]">Date of Birth</label>
                <input
                  type="text"
                  value={editForm.dob}
                  onChange={(e) => setEditForm({ ...editForm, dob: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              {/* Member Since */}
              <div className="pt-3 flex justify-between items-center text-slate-600 dark:text-slate-300">
                <span className="text-slate-400 font-semibold">Member Since:</span>
                <span className="font-bold">{editForm.memberSince}</span>
              </div>

              {/* Emergency Contact */}
              <div className="pt-3">
                <label className="text-slate-400 uppercase font-bold text-[10px]">Emergency Contact</label>
                <input
                  type="text"
                  value={editForm.emergencyContact}
                  onChange={(e) => setEditForm({ ...editForm, emergencyContact: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-2">
              <button
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-purple-600 hover:opacity-95 shadow-md flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" /> Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GEMINI API CONFIGURATION MODAL */}
      {showGuardianConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Gemini AI Guardian Runtime Key
                </h3>
              </div>
              <button
                onClick={() => setShowGuardianConfigModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Pre-configured runtime key from specification. You can test or update below:
            </p>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400">
                Active Runtime Key:
              </label>
              <input
                type="text"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white"
              />
            </div>

            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Safety Guardian model: <strong>gemini-3.8-flash</strong> active &amp; ready.</span>
            </div>

            <button
              onClick={handleSaveApiKey}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20"
            >
              Save Configuration
            </button>
          </div>
        </div>
      )}

      {/* PAYMENT & ESCROW MODAL */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-500" />
                Payment &amp; Escrow Balance
              </h3>
              <button onClick={() => setShowPaymentModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Active Escrow Pre-Auth Hold</span>
              <div className="text-2xl font-black text-cyan-400">$75.00 USD</div>
              <p className="text-[11px] text-slate-400">
                Temporary pre-auth hold released or converted to final bill upon repair sign-off.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 dark:text-white">Visa ending in 4917</span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded font-bold">Default</span>
              </div>
              <span className="text-slate-400">Expires 08/29</span>
            </div>

            <button
              onClick={() => setShowPaymentModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-white font-bold text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* TPA INSURANCE MODAL */}
      {showClaimsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-500" />
                TPA Insurance Claims
              </h3>
              <button onClick={() => setShowClaimsModal(false)} className="text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 space-y-2">
              <span className="text-[10px] font-bold uppercase text-purple-700 dark:text-purple-300">Coverage Pre-Cleared</span>
              <div className="text-xl font-black text-purple-900 dark:text-purple-200">$5,000 Emergency Allowance</div>
              <p className="text-xs text-purple-800 dark:text-purple-300">
                Policy #ZAP-TPA-9921 with HDFC ERGO Home Shield. Direct settlement on plumbing, water damage &amp; electrical surges.
              </p>
            </div>

            <button
              onClick={() => setShowClaimsModal(false)}
              className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
