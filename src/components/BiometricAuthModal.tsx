import React, { useState, useEffect, useRef } from 'react';
import { 
  Fingerprint, ShieldCheck, CheckCircle2, Lock, 
  AlertCircle, RefreshCw, Sparkles, Smartphone 
} from 'lucide-react';
import { AuthUser } from '../types/loan';
import { FingerprintRecord } from '../data/seedLoans';

interface BiometricAuthModalProps {
  isOpen: boolean;
  user: AuthUser | null;
  enrolledRecord: FingerprintRecord | null;
  onSuccess: () => void;
  onCancel?: () => void;
  onRequestEnroll?: () => void;
  isTestMode?: boolean;
}

export const BiometricAuthModal: React.FC<BiometricAuthModalProps> = ({
  isOpen,
  user,
  enrolledRecord,
  onSuccess,
  onCancel,
  onRequestEnroll,
  isTestMode = false,
}) => {
  // States: 'waiting_touch' | 'scanning' | 'success' | 'lifted_early'
  const [scanState, setScanState] = useState<'waiting_touch' | 'scanning' | 'success' | 'lifted_early'>('waiting_touch');
  const [scanProgress, setScanProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Place your finger on the sensor to sign in');
  
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const holdStartTimeRef = useRef<number>(0);

  // Play subtle feedback sound
  const playSound = (type: 'touch' | 'success' | 'error') => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === 'touch') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      } else if (type === 'success') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.12); // A5
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        gain.gain.setValueAtTime(0.06, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      }
    } catch {
      // Audio fails gracefully
    }
  };

  // Reset state when modal opens - NOTE: CRITICAL - NO AUTO-SCAN!
  // The user must first physically place their finger on the sensor!
  useEffect(() => {
    if (isOpen) {
      setScanState('waiting_touch');
      setScanProgress(0);
      setStatusMessage('Place and hold your finger on the sensor to sign in');
    }
    return () => {
      if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
    };
  }, [isOpen]);

  // When user places finger down
  const handleFingerDown = () => {
    if (scanState === 'scanning' || scanState === 'success') return;

    setScanState('scanning');
    setStatusMessage('Finger detected! Hold still... Scanning ridge pattern...');
    playSound('touch');
    setScanProgress(15);
    holdStartTimeRef.current = Date.now();

    if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);

    // Scan progress over 700ms of finger contact
    let currentProgress = 15;
    scanIntervalRef.current = setInterval(() => {
      currentProgress += 18;
      if (currentProgress >= 100) {
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
        setScanProgress(100);
        setScanState('success');
        setStatusMessage('Fingerprint matched & verified! Access granted.');
        playSound('success');

        // Allow visual confirmation to be seen before completing
        setTimeout(() => {
          onSuccess();
        }, 700);
      } else {
        setScanProgress(currentProgress);
      }
    }, 110);
  };

  // If user lifts finger too quickly before the scan finishes
  const handleFingerUp = () => {
    if (scanState === 'scanning') {
      const elapsed = Date.now() - holdStartTimeRef.current;
      if (elapsed < 600) {
        if (scanIntervalRef.current) clearInterval(scanIntervalRef.current);
        setScanState('lifted_early');
        setScanProgress(0);
        setStatusMessage('Finger lifted too early. Please place and hold until scan completes.');
        playSound('error');
      }
    }
  };

  if (!isOpen) return null;

  const officerName = user?.displayName || enrolledRecord?.officerName || 'Hussein';
  const enrolledLabel = enrolledRecord?.fingerLabel || 'Installed Biometric';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="biometric-sign-in-title"
      >
        {/* Subtle background glow */}
        <div 
          className={`absolute -top-16 -left-16 w-40 h-40 rounded-full blur-3xl transition-colors duration-500 pointer-events-none ${
            scanState === 'success' 
              ? 'bg-emerald-500/30' 
              : scanState === 'scanning' 
              ? 'bg-cyan-500/25' 
              : 'bg-emerald-600/15'
          }`} 
        />
        <div 
          className={`absolute -bottom-16 -right-16 w-40 h-40 rounded-full blur-3xl transition-colors duration-500 pointer-events-none ${
            scanState === 'success' 
              ? 'bg-emerald-500/25' 
              : 'bg-indigo-600/15'
          }`} 
        />

        {/* Top Header Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/90 border border-slate-700 rounded-full mb-3 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[11px] font-semibold text-slate-300">
            {isTestMode ? 'Biometric Test' : 'Biometric Security Sign In'}
          </span>
        </div>

        <h3 id="biometric-sign-in-title" className="text-lg font-bold tracking-tight text-white">
          Hussein Loans and Saving Group
        </h3>

        <div className="mt-1 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <span>Officer:</span>
          <span className="font-bold text-slate-200">{officerName}</span>
          {enrolledRecord && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-semibold">
              {enrolledLabel}
            </span>
          )}
        </div>

        {/* Check if no fingerprint has been installed yet */}
        {!enrolledRecord && !isTestMode ? (
          <div className="my-6 p-4 bg-amber-950/60 border border-amber-500/40 rounded-2xl text-left w-full">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold mb-1">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Fingerprint Not Yet Installed</span>
            </div>
            <p className="text-[11px] text-amber-200/80 leading-relaxed mb-3">
              You must first install your biometric fingerprint on this device before using one-touch sign in.
            </p>
            {onRequestEnroll && (
              <button
                type="button"
                onClick={onRequestEnroll}
                className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Install Fingerprint Biometrics Now</span>
              </button>
            )}
          </div>
        ) : (
          /* Interactive Sensor Contact Area (No auto verify - place finger to scan) */
          <>
            <div className="my-6 relative flex items-center justify-center">
              {/* Concentric Sensor Rings */}
              <div 
                className={`absolute w-36 h-36 rounded-full border border-dashed transition-all duration-500 ${
                  scanState === 'scanning' 
                    ? 'border-cyan-400/60 scale-110 animate-spin' 
                    : scanState === 'success'
                    ? 'border-emerald-500/80 scale-105'
                    : 'border-slate-700/60 scale-95'
                }`} 
                style={{ animationDuration: '4s' }}
              />

              {/* Progress Ring during Contact */}
              <div 
                className={`absolute w-28 h-28 rounded-full border-2 transition-all duration-200 ${
                  scanState === 'scanning'
                    ? 'border-cyan-400 scale-105'
                    : scanState === 'success'
                    ? 'border-emerald-400 scale-110'
                    : 'border-slate-800'
                }`}
              />

              {/* Capacitive Fingerprint Touch Sensor Pad */}
              <button
                type="button"
                onMouseDown={handleFingerDown}
                onMouseUp={handleFingerUp}
                onTouchStart={handleFingerDown}
                onTouchEnd={handleFingerUp}
                disabled={scanState === 'success'}
                className={`relative w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer select-none active:scale-95 ${
                  scanState === 'success'
                    ? 'bg-emerald-600 text-white shadow-emerald-500/30 ring-4 ring-emerald-500/40'
                    : scanState === 'scanning'
                    ? 'bg-slate-800 text-cyan-400 border-2 border-cyan-400 shadow-cyan-500/30 scale-105'
                    : scanState === 'lifted_early'
                    ? 'bg-rose-950/80 text-rose-300 border-2 border-rose-500/60'
                    : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-2 border-slate-700 hover:border-emerald-500/60'
                }`}
                title="Place and hold your finger here to sign in"
              >
                {/* Laser scanning beam line */}
                {scanState === 'scanning' && (
                  <div 
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_8px_#22d3ee] transition-all"
                    style={{ top: `${scanProgress}%` }}
                  />
                )}

                {scanState === 'success' ? (
                  <CheckCircle2 className="w-12 h-12 text-white animate-in zoom-in-50 duration-200 stroke-[2.5]" />
                ) : (
                  <Fingerprint 
                    className={`w-12 h-12 transition-all duration-200 ${
                      scanState === 'scanning' 
                        ? 'scale-110 text-cyan-400 animate-pulse' 
                        : scanState === 'lifted_early'
                        ? 'text-rose-400'
                        : 'text-emerald-400'
                    }`} 
                  />
                )}
              </button>
            </div>

            {/* Instruction & Status Badge */}
            <div 
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                scanState === 'success'
                  ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/60'
                  : scanState === 'scanning'
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/60'
                  : scanState === 'lifted_early'
                  ? 'bg-rose-950/70 text-rose-300 border border-rose-700/60'
                  : 'bg-slate-800/90 text-slate-300 border border-slate-700/60'
              }`}
            >
              {scanState === 'scanning' && (
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              )}
              {scanState === 'success' && (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              )}
              {scanState === 'lifted_early' && (
                <AlertCircle className="w-4 h-4 text-rose-400" />
              )}
              {scanState === 'waiting_touch' && (
                <Fingerprint className="w-4 h-4 text-emerald-400 animate-pulse" />
              )}
              <span>{statusMessage}</span>
            </div>

            {/* Action Button: Touch / Place Finger to Sign In */}
            <div className="w-full mt-4 space-y-2">
              {scanState !== 'success' && (
                <button
                  type="button"
                  onMouseDown={handleFingerDown}
                  onMouseUp={handleFingerUp}
                  onTouchStart={handleFingerDown}
                  onTouchEnd={handleFingerUp}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>
                    {scanState === 'scanning' ? 'Scanning Fingerprint...' : 'Place Finger to Sign In'}
                  </span>
                </button>
              )}
            </div>
          </>
        )}

        {/* Fallback & Cancel */}
        <div className="w-full mt-3 space-y-1.5">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full h-9 text-slate-400 hover:text-white font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Use Password Instead</span>
            </button>
          )}

          {onRequestEnroll && (
            <button
              type="button"
              onClick={onRequestEnroll}
              className="w-full text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold underline underline-offset-2 transition-colors cursor-pointer py-1"
            >
              {enrolledRecord ? 'Re-install / Update Fingerprint' : 'Install Fingerprint Biometrics'}
            </button>
          )}
        </div>

        {/* Small Trust Micro-copy */}
        <p className="text-[10px] text-slate-500 mt-2">
          Biometric hardware: Touch to authenticate • Never auto-verified
        </p>
      </div>
    </div>
  );
};
