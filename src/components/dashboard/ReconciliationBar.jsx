import React from 'react';
import { useHisab } from '../../context/HisabContext';
import { formatINR } from '../../utils/formatters';
import { CheckCircle2, AlertTriangle, ArrowRight, Banknote } from 'lucide-react';

export const ReconciliationBar = ({ onOpenCashCounter, onOpenDailyRegister }) => {
  const { dailySummary, denominationsSummary } = useHisab();

  const expectedCash = dailySummary.expectedClosingCash;
  const countedCash = denominationsSummary.total;
  const diff = countedCash - expectedCash;
  const isZeroDiff = Math.abs(diff) === 0 && countedCash > 0;
  const isNotCountedYet = countedCash === 0;

  return (
    <div
      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-300 shadow-xl ${
        isNotCountedYet
          ? 'bg-slate-900/90 border-slate-700/80'
          : isZeroDiff
          ? 'bg-gradient-to-r from-emerald-950/80 via-slate-900 to-emerald-950/80 border-emerald-500/40 glow-emerald'
          : diff > 0
          ? 'bg-gradient-to-r from-amber-950/80 via-slate-900 to-slate-900 border-amber-500/40'
          : 'bg-gradient-to-r from-rose-950/80 via-slate-900 to-slate-900 border-rose-500/40 glow-rose'
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left Status */}
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className={`p-3 rounded-2xl shrink-0 ${
              isNotCountedYet
                ? 'bg-slate-800 text-slate-400 border border-slate-700'
                : isZeroDiff
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : diff > 0
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}
          >
            {isNotCountedYet ? (
              <Banknote className="w-6 h-6" />
            ) : isZeroDiff ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Daily Cash Reconciliation Status
              </span>
              {isZeroDiff && (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  100% Matched ✓
                </span>
              )}
            </div>

            <div className="text-base sm:text-lg font-bold text-white mt-0.5 flex flex-wrap items-center gap-x-2">
              {isNotCountedYet ? (
                <span>Physical note count pending for closing cash verification</span>
              ) : isZeroDiff ? (
                <span className="text-emerald-300">
                  Congratulations! Drawer cash and system tally match 100%
                </span>
              ) : diff > 0 ? (
                <span className="text-amber-300">
                  Drawer has {formatINR(diff)} Extra / Surplus Cash
                </span>
              ) : (
                <span className="text-rose-300">
                  Drawer is short by {formatINR(Math.abs(diff))} Short Cash!
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-1">
              Opening Cash + Deposits/DMT - AEPS Payouts - Top-ups - Shop Expenses = Expected Cash
            </p>
          </div>
        </div>

        {/* Right: Metrics & CTA button */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-6 bg-slate-950/60 p-3 sm:px-4 sm:py-2.5 rounded-xl border border-slate-800">
          <div>
            <div className="text-[11px] text-slate-400">System Expected Cash</div>
            <div className="text-sm sm:text-base font-mono font-bold text-white">
              {formatINR(expectedCash)}
            </div>
          </div>

          <div className="h-8 w-px bg-slate-800" />

          <div>
            <div className="text-[11px] text-slate-400">Counted Physical Notes</div>
            <div
              className={`text-sm sm:text-base font-mono font-bold ${
                isZeroDiff ? 'text-emerald-400' : countedCash > 0 ? 'text-amber-400' : 'text-slate-400'
              }`}
            >
              {isNotCountedYet ? 'Count Notes →' : formatINR(countedCash)}
            </div>
          </div>

          <button
            onClick={onOpenCashCounter}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all"
          >
            <Banknote className="w-3.5 h-3.5" />
            <span>Count Cash Notes</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

      </div>
    </div>
  );
};
