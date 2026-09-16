import React from 'react';

export const StatCard = ({
  title,
  titleHindi,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendLabel,
  color = 'indigo',
  onClick,
  actionLabel
}) => {
  const colorMap = {
    indigo: {
      bg: 'bg-indigo-500/10',
      text: 'text-indigo-400',
      border: 'border-indigo-500/20',
      hover: 'hover:border-indigo-500/40',
      glow: 'hover:shadow-indigo-500/10'
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/20',
      hover: 'hover:border-emerald-500/40',
      glow: 'hover:shadow-emerald-500/10'
    },
    rose: {
      bg: 'bg-rose-500/10',
      text: 'text-rose-400',
      border: 'border-rose-500/20',
      hover: 'hover:border-rose-500/40',
      glow: 'hover:shadow-rose-500/10'
    },
    amber: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-400',
      border: 'border-amber-500/20',
      hover: 'hover:border-amber-500/40',
      glow: 'hover:shadow-amber-500/10'
    },
    sky: {
      bg: 'bg-sky-500/10',
      text: 'text-sky-400',
      border: 'border-sky-500/20',
      hover: 'hover:border-sky-500/40',
      glow: 'hover:shadow-sky-500/10'
    },
    purple: {
      bg: 'bg-purple-500/10',
      text: 'text-purple-400',
      border: 'border-purple-500/20',
      hover: 'hover:border-purple-500/40',
      glow: 'hover:shadow-purple-500/10'
    }
  };

  const scheme = colorMap[color] || colorMap.indigo;

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-2xl bg-slate-900/80 border ${scheme.border} ${scheme.hover} backdrop-blur-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {title}
            </span>
            {titleHindi && (
              <span className="text-[11px] text-slate-400 font-hindi">({titleHindi})</span>
            )}
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
            {value}
          </div>
        </div>

        {Icon && (
          <div className={`p-3 rounded-xl ${scheme.bg} ${scheme.text} border ${scheme.border} shrink-0`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>

      {(subtitle || trend || actionLabel) && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-400 truncate">{subtitle}</span>}
          {trend && (
            <span
              className={`font-semibold flex items-center gap-1 ${
                trend > 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trend > 0 ? '▲' : '▼'} {trendLabel || trend}
            </span>
          )}
          {actionLabel && (
            <span className={`font-medium ${scheme.text} hover:underline ml-auto`}>
              {actionLabel} →
            </span>
          )}
        </div>
      )}
    </div>
  );
};
