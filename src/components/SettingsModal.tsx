import React, { useState } from 'react';
import { 
  X, Fingerprint, Shield, ShieldCheck, User, Bell, 
  RotateCcw, LogOut, CheckCircle2, Smartphone, KeyRound, 
  Sparkles, Trash2, PlusCircle, AlertCircle
} from 'lucide-react';
import { AuthUser } from '../types/loan';
import { FingerprintRecord } from '../data/seedLoans';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  authUser: AuthUser | null;
  fingerprintEnabled: boolean;
  enrolledRecord: FingerprintRecord | null;
  onToggleFingerprint: (enabled: boolean) => void;
  onRequestEnroll: () => void;
  onDeleteEnrollment: () => void;
  onTestBiometrics: () => void;
  onLogout: () => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  authUser,
  fingerprintEnabled,
  enrolledRecord,
  onToggleFingerprint,
  onRequestEnroll,
  onDeleteEnrollment,
  onTestBiometrics,
  onLogout,
  onResetData,
}) => {
  const [showConfirmationAlert, setShowConfirmationAlert] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.checked;
    if (nextVal && !enrolledRecord) {
      // Must install fingerprint biometrics first!
      onClose();
      onRequestEnroll();
      return;
    }

    onToggleFingerprint(nextVal);
    if (nextVal) {
      setShowConfirmationAlert('Fingerprint Login is now active. Biometric contact required to sign in.');
      setTimeout(() => setShowConfirmationAlert(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-250"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 id="settings-title" className="text-sm font-bold text-white leading-tight">
                App Settings & Security
              </h2>
              <span className="text-[10px] text-slate-400">
                Hussein Loans and Saving Group
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            title="Close Settings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-slate-800 custom-scrollbar">
          {/* Confirmation Toast Alert */}
          {showConfirmationAlert && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-900 text-xs animate-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block">Fingerprint Login Active</span>
                <span className="text-[11px] text-emerald-700">
                  {showConfirmationAlert}
                </span>
              </div>
            </div>
          )}

          {/* Active Field Officer Card */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                {authUser?.displayName?.[0] || 'H'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm text-slate-900">
                    {authUser?.displayName || 'Hussein'}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Online
                  </span>
                </div>
                <span className="text-xs text-slate-500 block">
                  {authUser?.role || 'Senior Loan Officer & Admin'}
                </span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Kampala, UG</span>
          </div>

          {/* Security & Biometrics Section */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
              Biometric Security & Hardware
            </span>

            <div className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md space-y-3.5">
              {/* Toggle Switch Row */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    fingerprintEnabled && enrolledRecord
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}>
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <label 
                        htmlFor="fingerprint-toggle"
                        className="text-xs font-bold text-white cursor-pointer select-none"
                      >
                        Enable Fingerprint Login
                      </label>
                      {fingerprintEnabled && enrolledRecord ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                          {enrolledRecord ? 'Disabled' : 'Not Installed'}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                      {enrolledRecord
                        ? 'Require physical fingerprint contact before unlocking portfolio ledger.'
                        : 'First install your fingerprint biometrics to enable one-touch sign in.'}
                    </p>
                  </div>
                </div>

                {/* Modern Accessible Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    id="fingerprint-toggle"
                    type="checkbox"
                    checked={fingerprintEnabled && Boolean(enrolledRecord)}
                    onChange={handleToggle}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600" />
                </label>
              </div>

              {/* Installed Biometric Details or Install Callout */}
              {enrolledRecord ? (
                <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700/80 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-white">Installed Biometric Profile</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30">
                      {enrolledRecord.quality}% Quality
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-300 grid grid-cols-2 gap-2 pt-1">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Registered Finger:</span>
                      <span className="font-semibold text-white">{enrolledRecord.fingerLabel}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Installed Date:</span>
                      <span className="font-mono text-slate-300">{enrolledRecord.enrolledAt}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-700/60">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onTestBiometrics();
                      }}
                      className="px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Test Sensor</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onRequestEnroll();
                        }}
                        className="px-2 py-1.5 text-[11px] text-slate-300 hover:text-white bg-slate-700/60 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                      >
                        Re-install
                      </button>

                      <button
                        type="button"
                        onClick={onDeleteEnrollment}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                        title="Delete installed fingerprint"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* No Fingerprint Installed: Action to Install */
                <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700/80 text-center space-y-2">
                  <div className="text-xs text-slate-300">
                    No fingerprint biometrics are installed on this device yet.
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onRequestEnroll();
                    }}
                    className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Install Fingerprint Biometrics</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Regional & System Preferences */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2 px-1">
              Field Preferences
            </span>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl divide-y divide-slate-100 text-xs">
              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">Currency</span>
                  <span className="text-[11px] text-slate-500">Ugandan Shilling</span>
                </div>
                <span className="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  UGX
                </span>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">Timezone</span>
                  <span className="text-[11px] text-slate-500">Uganda Standard Time</span>
                </div>
                <span className="text-[11px] font-semibold text-slate-600">
                  EAT (UTC+3)
                </span>
              </div>

              <div className="p-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">Biometric Sensor</span>
                  <span className="text-[11px] text-slate-500">Manual touch required</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  Active
                </span>
              </div>
            </div>
          </div>

          {/* Ledger Reset Action */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onResetData();
              }}
              className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Restore Default Seed Loan Portfolio</span>
            </button>
          </div>

          {/* Sign Out Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of Officer Session</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400">
          Hussein Loans and Saving Group Mobile Field Suite · v2.4
        </div>
      </div>
    </div>
  );
};
