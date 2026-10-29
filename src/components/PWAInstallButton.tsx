import React, { useState } from 'react';
import { Download, Share2, Smartphone, X, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);

  // If already installed and running standalone, hide the prompt
  if (isInstalled) {
    return null;
  }

  const handleAction = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleAction}
        className={`flex items-center justify-center gap-1.5 rounded-xl font-bold transition-all active:scale-[0.98] ${
          compact
            ? 'px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs'
            : 'px-3 py-2 text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 w-full'
        }`}
        title="Download and install app on your phone"
      >
        <Download className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>Download App</span>
      </button>

      {/* Mobile Download Guide Modal for iOS & general mobile installation */}
      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div 
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-200 text-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  HLG
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Install on Your Phone</h3>
                  <span className="text-[11px] text-emerald-700 font-semibold">Hussein Loans and Saving Group</span>
                </div>
              </div>
              <button
                onClick={() => setShowGuide(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-600">
              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  <strong className="text-slate-800 block">Open in Phone Browser</strong>
                  <span>Visit this link on your smartphone in <strong>Chrome</strong> or <strong>Safari</strong>.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  <strong className="text-slate-800 block">Add to Home Screen</strong>
                  {isIOS ? (
                    <span>Tap the Safari <strong>Share icon</strong> (box with arrow) and select <strong>&quot;Add to Home Screen&quot;</strong>.</span>
                  ) : (
                    <span>Tap browser menu (<strong>⋮</strong> or banner) and select <strong>&quot;Install App&quot;</strong> or <strong>&quot;Add to Home Screen&quot;</strong>.</span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div>
                  <strong className="text-slate-800 block">Launch Directly</strong>
                  <span>Open from your phone home screen anytime, with offline support and full-screen view!</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowGuide(false)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </>
  );
};
