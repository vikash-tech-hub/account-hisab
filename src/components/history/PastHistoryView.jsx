import React from 'react';
import { useHisab } from '../../context/HisabContext';
import { formatINR, formatDate, formatDateFull } from '../../utils/formatters';
import { History, Calendar, ArrowRight, Eye, Sparkles } from 'lucide-react';

export const PastHistoryView = ({ onSelectDate }) => {
  const { availableHistoryDates, setSelectedDate, selectedDate, activeBranch } = useHisab();

  // Preset summary calculations for known history dates
  const historySummaries = {
    '2026-09-16': { portals: 124700, accounts: 184000, jama: 205000, liya: 75500, net: 438200 },
    '2026-09-15': { portals: 133200, accounts: 175000, jama: 93000, liya: 57000, net: 382200 },
    '2026-09-14': { portals: 134700, accounts: 153000, jama: 80000, liya: 15000, net: 352700 }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-indigo-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              Daily History & Past Registers Archive (दैनिक व पिछला इतिहास)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Click on any date to load that day's complete Portals, Bank accounts, Jama and Liya records
          </p>
        </div>

        <span className="text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-indigo-300 font-mono font-bold">
          {availableHistoryDates.length} Days Recorded
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/60">
              <th className="py-3 px-3">Date (तारीख)</th>
              <th className="py-3 px-3 text-right">1. Portals Total</th>
              <th className="py-3 px-3 text-right">2. Bank & Cash</th>
              <th className="py-3 px-3 text-right">3. Total Jama (+)</th>
              <th className="py-3 px-3 text-right">4. Total Liya (-)</th>
              <th className="py-3 px-3 text-right">Net Total Hisab</th>
              <th className="py-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {availableHistoryDates.map((dateStr) => {
              const isSelected = selectedDate === dateStr;
              const summary = historySummaries[dateStr] || { portals: 120000, accounts: 150000, jama: 50000, liya: 30000, net: 350000 };

              return (
                <tr
                  key={dateStr}
                  className={`transition-colors ${
                    isSelected ? 'bg-indigo-600/10 border-l-4 border-indigo-500' : 'hover:bg-slate-800/40'
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <Calendar className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                      <div>
                        <div className="font-bold text-white text-sm">
                          {formatDate(dateStr)} {isSelected && <span className="text-[10px] text-emerald-400 ml-1">(Active)</span>}
                        </div>
                        <div className="text-[10px] text-slate-400">{formatDateFull(dateStr)}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-amber-400">
                    {formatINR(summary.portals)}
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-sky-400">
                    {formatINR(summary.accounts)}
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                    +{formatINR(summary.jama)}
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-bold text-rose-400">
                    -{formatINR(summary.liya)}
                  </td>

                  <td className="py-3 px-3 text-right font-mono font-black text-sm text-indigo-300">
                    {formatINR(summary.net)}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedDate(dateStr);
                        if (onSelectDate) onSelectDate(dateStr);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ml-auto ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-md'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isSelected ? 'Viewing' : 'Open Hisab'}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
