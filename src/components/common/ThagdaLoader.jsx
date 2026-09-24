import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Zap, Layers, CheckCircle2 } from 'lucide-react';
import { useHisab } from '../../context/HisabContext';

export const ThagdaLoader = ({
  onFinish,
  duration = 2400,
  title = 'Jan Seva Kendra Hisab',
  subtitle
}) => {
  const { theme } = useHisab();
  const isDark = theme !== 'light';

  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(subtitle || '4-Pillars Daily Hisab लोड हो रहा है...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / duration) * 100));
      setProgress(pct);

      if (subtitle) {
        setStatusText(subtitle);
      } else {
        if (pct < 30) {
          setStatusText('📱 10 पोर्टल बैलेंस व वॉलेट लोड हो रहे हैं...');
        } else if (pct < 60) {
          setStatusText('🏦 बैंक खाते व गल्ला कैश सुरक्षित हो रहा है...');
        } else if (pct < 85) {
          setStatusText('👥 ग्राहक खाता बही (Jama/Liya) सिंक हो रही है...');
        } else {
          setStatusText('✨ जन सेवा केंद्र हिसाब पोर्टल तैयार है!');
        }
      }

      if (elapsed >= duration) {
        clearInterval(interval);
        setIsFadingOut(true);
        setTimeout(() => {
          if (onFinish) onFinish();
        }, 300);
      }
    }, 20);

    return () => clearInterval(interval);
  }, [duration, onFinish, subtitle]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-300 ${
        isDark
          ? 'bg-slate-950/95 backdrop-blur-2xl'
          : 'bg-slate-50/95 backdrop-blur-2xl'
      } ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Radial Glow */}
      <div className="absolute w-96 h-96 bg-gradient-to-tr from-indigo-600/20 via-emerald-500/15 to-transparent rounded-full blur-3xl animate-pulse pointer-events-none" />
      <div className="absolute w-80 h-80 bg-gradient-to-br from-amber-500/10 via-sky-500/15 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Main Center Logo & Animated Rings Container */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Outer Rotating Dashed Ring 1 */}
        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full border-2 border-dashed border-indigo-500/40 animate-[spin_8s_linear_infinite] absolute flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-indigo-500 absolute -top-1.5 shadow-lg shadow-indigo-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -bottom-1 shadow-lg shadow-emerald-500/80" />
        </div>

        {/* Inner Counter-Rotating Ring 2 */}
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-emerald-500/40 border-t-emerald-500 border-b-indigo-500 animate-[spin_4s_linear_infinite_reverse] absolute flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-amber-400 absolute -right-1 shadow-md shadow-amber-400" />
        </div>

        {/* Glowing Pulsing Circle */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-0.5 shadow-2xl shadow-indigo-500/30 relative z-10 flex items-center justify-center animate-pulse">
          <div className={`w-full h-full rounded-[22px] flex flex-col items-center justify-center relative overflow-hidden ${
            isDark ? 'bg-slate-950' : 'bg-white'
          }`}>
            {/* Shimmer Light Bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            
            {/* Center Logo Typography */}
            <div className="text-2xl sm:text-3xl font-black font-mono tracking-wider bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent drop-shadow-md">
              4H
            </div>
            <div className="text-[8px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mt-0.5 font-sans">
              HISAB
            </div>
          </div>
        </div>
      </div>

      {/* Brand Title & Subtitle */}
      <div className="mt-8 text-center space-y-1.5 relative z-10 px-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-base sm:text-lg font-black tracking-wide uppercase text-slate-900 dark:text-white">
            Jan Seva Kendra Hisab
          </span>
          <span className="bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
            4-Pillars
          </span>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
          Portals • Bank Accounts • Jama • Liya • Other Income
        </p>
      </div>

      {/* Progress Bar & Percentage */}
      <div className="w-64 sm:w-80 mt-6 space-y-2 relative z-10">
        <div className={`h-2.5 w-full rounded-full border p-0.5 overflow-hidden shadow-inner ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-200 border-slate-300'
        }`}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400 transition-all duration-75 shadow-lg shadow-emerald-500/50"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-600 dark:text-slate-400 truncate max-w-[200px] flex items-center gap-1.5 font-medium">
            <Sparkles className="w-3 h-3 text-amber-500 animate-spin shrink-0" />
            <span className="truncate">{statusText}</span>
          </span>
          <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-xs">{progress}%</span>
        </div>
      </div>

      {/* Bottom Secure Badge */}
      <div className="absolute bottom-8 flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-widest">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>100% Offline LocalStorage Encrypted</span>
      </div>
    </div>
  );
};
