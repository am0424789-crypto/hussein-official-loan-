import React, { useState } from 'react';
import { 
  X, Fingerprint, ShieldCheck, CheckCircle2, 
  Sparkles, RefreshCw, Smartphone, ChevronRight 
} from 'lucide-react';
import { FingerprintRecord } from '../data/seedLoans';
import { AuthUser } from '../types/loan';

interface FingerprintEnrollModalProps {
  isOpen: boolean;
  onClose: () => void;
  authUser: AuthUser | null;
  onEnrollSuccess: (record: FingerprintRecord) => void;
}

export const FingerprintEnrollModal: React.FC<FingerprintEnrollModalProps> = ({
  isOpen,
  onClose,
  authUser,
  onEnrollSuccess,
}) => {
  const [selectedFinger, setSelectedFinger] = useState('Right Thumb');
  const [enrollStep, setEnrollStep] = useState(0); // 0 to 4 (0%, 25%, 50%, 75%, 100%)
  const [isHolding, setIsHolding] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Place and hold your finger on the sensor');
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const playChime = (pitch: number) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio fallback
    }
  };

  const handleSensorDown = () => {
    if (isCompleted || isHolding) return;
    setIsHolding(true);
    setStatusMessage('Hold your finger still... Scanning biometric ridges...');
    playChime(440 + enrollStep * 110);

    // Simulate ridge capture taking 600ms
    setTimeout(() => {
      setEnrollStep((prev) => {
        const next = prev + 1;
        if (next >= 4) {
          setIsCompleted(true);
          setIsHolding(false);
          setStatusMessage('Fingerprint installed & encrypted successfully!');
          playChime(880);

          const record: FingerprintRecord = {
            id: `BIO-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
            fingerLabel: selectedFinger,
            enrolledAt: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
            officerName: authUser?.displayName || 'Hussein',
            quality: 99,
          };

          setTimeout(() => {
            onEnrollSuccess(record);
            onClose();
          }, 1200);

          return 4;
        } else {
          setIsHolding(false);
          playChime(600);
          setStatusMessage(`Sample ${next}/4 captured. Lift and place your finger again.`);
          return next;
        }
      });
    }, 650);
  };

  const handleReset = () => {
    setEnrollStep(0);
    setIsCompleted(false);
    setIsHolding(false);
    setStatusMessage('Place and hold your finger on the sensor');
  };

  const progressPercent = Math.min(100, enrollStep * 25);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl text-white relative overflow-hidden flex flex-col items-center text-center animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="enroll-title"
      >
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

        {/* Header Close */}
        <div className="w-full flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 border border-emerald-500/40 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-bold text-emerald-300">Biometric Setup Wizard</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h2 id="enroll-title" className="text-lg font-bold text-white tracking-tight">
          Install Fingerprint Biometrics
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-[270px]">
          Calibrate and register your biometric fingerprint for secure one-touch signing in.
        </p>

        {/* Finger Selection */}
        {!isCompleted && enrollStep === 0 && (
          <div className="w-full mt-4 bg-slate-800/80 p-2 rounded-2xl border border-slate-700/80 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1 mb-1.5">
              Select Finger to Install
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {['Right Thumb', 'Right Index', 'Left Thumb', 'Left Index'].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setSelectedFinger(label)}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer ${
                    selectedFinger === label
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-700/70 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Progress Display */}
        <div className="w-full mt-4 mb-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300 mb-1 px-1">
            <span>Calibration Progress</span>
            <span className="font-mono text-emerald-400 font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Sensor Interaction Area */}
        <div className="my-5 relative flex items-center justify-center">
          {/* Animated concentric guides */}
          <div 
            className={`absolute w-36 h-36 rounded-full border border-dashed transition-all duration-500 ${
              isHolding 
                ? 'border-cyan-400/60 scale-105 animate-spin' 
                : isCompleted
                ? 'border-emerald-500 scale-100'
                : 'border-slate-700'
            }`}
            style={{ animationDuration: '4s' }}
          />

          <button
            type="button"
            onMouseDown={handleSensorDown}
            onTouchStart={handleSensorDown}
            onClick={handleSensorDown}
            disabled={isCompleted || isHolding}
            className={`relative w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-300 shadow-2xl cursor-pointer select-none active:scale-95 ${
              isCompleted
                ? 'bg-emerald-600 text-white ring-4 ring-emerald-500/40'
                : isHolding
                ? 'bg-slate-800 text-cyan-400 ring-4 ring-cyan-500/50 scale-105'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border-2 border-dashed border-emerald-500/50 hover:border-emerald-400'
            }`}
            title="Place and hold finger on sensor to enroll"
          >
            {isCompleted ? (
              <CheckCircle2 className="w-12 h-12 text-white stroke-[2.5] animate-in zoom-in-50" />
            ) : (
              <Fingerprint 
                className={`w-12 h-12 transition-transform duration-200 ${
                  isHolding ? 'scale-110 text-cyan-400' : 'text-emerald-400'
                }`} 
              />
            )}
          </button>
        </div>

        {/* Live Instruction Banner */}
        <div 
          className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
            isCompleted
              ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/60'
              : isHolding
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/60'
              : 'bg-slate-800 text-slate-300 border border-slate-700'
          }`}
        >
          {isHolding && <RefreshCw className="w-3.5 h-3.5 text-cyan-400 animate-spin" />}
          {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          <span>{statusMessage}</span>
        </div>

        {/* Prompt Button to Place Finger */}
        {!isCompleted && (
          <div className="w-full mt-4 space-y-2">
            <button
              type="button"
              onClick={handleSensorDown}
              disabled={isHolding}
              className="w-full h-11 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
            >
              <Fingerprint className="w-4 h-4" />
              <span>{isHolding ? 'Scanning Fingerprint...' : `Place Finger on Sensor (${enrollStep}/4)`}</span>
            </button>

            {enrollStep > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-white transition-colors"
              >
                Restart Fingerprint Installation
              </button>
            )}
          </div>
        )}

        <div className="text-[10px] text-slate-500 mt-3">
          Sensor: Biometric Cryptographic Enclave (Local Storage Only)
        </div>
      </div>
    </div>
  );
};
