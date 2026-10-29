import React, { useState, useEffect } from 'react';
import { Wifi, Battery } from 'lucide-react';

interface PhoneStatusBarProps {
  customTime?: string;
}

export const PhoneStatusBar: React.FC<PhoneStatusBarProps> = ({ customTime }) => {
  // Live Uganda Time (Africa/Kampala - EAT UTC+3)
  const [ugandaTime, setUgandaTime] = useState(() => {
    if (customTime) return customTime;
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Kampala',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date());
  });

  useEffect(() => {
    if (customTime) return;
    const interval = setInterval(() => {
      setUgandaTime(
        new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Africa/Kampala',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(new Date())
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [customTime]);

  return (
    <div className="h-10 bg-white text-slate-900 px-4 sm:px-6 flex items-end justify-between pb-1.5 select-none shrink-0 border-b border-slate-100 z-20">
      <div className="flex items-center gap-1.5">
        <span className="text-[13px] font-bold tracking-tight tabular-nums">
          {ugandaTime}
        </span>
        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1 py-0.2 rounded font-mono">
          UG EAT
        </span>
      </div>
      
      {/* Dynamic island / Speaker slot visual */}
      <div className="w-16 h-3 bg-slate-900/10 rounded-full flex items-center justify-center">
        <div className="w-6 h-1 bg-slate-900/30 rounded-full" />
      </div>

      <div className="flex items-center gap-1.5 text-slate-800">
        {/* Signal bars */}
        <div className="flex items-end gap-[1.5px] h-3">
          <div className="w-[3px] h-1 bg-slate-800 rounded-[0.5px]" />
          <div className="w-[3px] h-1.5 bg-slate-800 rounded-[0.5px]" />
          <div className="w-[3px] h-2 bg-slate-800 rounded-[0.5px]" />
          <div className="w-[3px] h-3 bg-slate-800 rounded-[0.5px]" />
        </div>
        <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
        <Battery className="w-4 h-4 stroke-[2.2]" />
      </div>
    </div>
  );
};
