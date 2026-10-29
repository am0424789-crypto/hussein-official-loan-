import React, { useState } from 'react';
import { Lock, User, KeyRound, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { AuthUser } from '../types/loan';

interface LoginScreenProps {
  onLogin: (user: AuthUser) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    // Verify credentials
    if (cleanId === 'hussein' && cleanPass === '2026') {
      onLogin({
        username: 'hussein',
        displayName: 'Hussein',
        role: 'Senior Loan Officer & Admin',
      });
      return;
    }

    if (cleanId === 'anyango' && cleanPass === '2026') {
      onLogin({
        username: 'anyango',
        displayName: 'Anyango',
        role: 'Credit & Field Officer',
      });
      return;
    }

    setError('Invalid username or password. Please try again.');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-slate-900 text-white overflow-y-auto custom-scrollbar">
      {/* Top Branding with Official Seal */}
      <div className="pt-6 text-center">
        <div className="w-20 h-20 rounded-full mx-auto mb-3 shadow-xl shadow-emerald-950/50 ring-4 ring-emerald-500/40 overflow-hidden bg-slate-950 border border-amber-400/30">
          <img 
            src="/assets/aistudio/hlg_official_seal_1793007495526_dffae54d.jpg" 
            alt="Hussein Loans Group Official Seal" 
            className="w-full h-full object-cover scale-105"
          />
        </div>

        <h1 className="text-xl font-extrabold tracking-tight text-white">
          Hussein Loans and Saving Group
        </h1>
        <p className="text-xs font-semibold text-emerald-400 mt-1 uppercase tracking-widest">
          Helping You Move Forward
        </p>
        <div className="mt-2 text-[11px] text-slate-400">
          Authorized Microfinance Field Access
        </div>
      </div>

      {/* Login Card Form */}
      <div className="my-auto py-4">
        <div className="bg-slate-800/90 rounded-3xl p-5 border border-slate-700/80 shadow-xl max-w-sm mx-auto">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-700/60">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-slate-200">Sign In</h2>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-950/70 border border-rose-800/80 rounded-xl text-rose-300 text-xs">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username / Phone / Email
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter username, phone, or email"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-900/90 text-sm text-white placeholder:text-slate-500 rounded-xl border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-900/90 text-sm text-white placeholder:text-slate-500 rounded-xl border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-12 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-slate-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all mt-4 cursor-pointer"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-[11px] text-slate-500 pb-2">
        Hussein Loans and Saving Group © 2026 · Kampala, Uganda
      </div>
    </div>
  );
};
