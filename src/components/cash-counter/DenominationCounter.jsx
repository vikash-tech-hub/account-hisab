import React, { useState, useEffect } from 'react';
import { useHisab } from '../../context/HisabContext';
import { formatINR } from '../../utils/formatters';
import { calculateDenominationsTotal } from '../../utils/calculations';
import { Badge } from '../common/Badge';
import {
  Banknote,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Save,
  Sparkles
} from 'lucide-react';

export const DenominationCounter = () => {
  const { currentRegister, updateDenominations, dailySummary, showToast } = useHisab();

  const [notes, setNotes] = useState(() => ({
    500: currentRegister.denominations?.['500'] || 0,
    200: currentRegister.denominations?.['200'] || 0,
    100: currentRegister.denominations?.['100'] || 0,
    50: currentRegister.denominations?.['50'] || 0,
    20: currentRegister.denominations?.['20'] || 0,
    10: currentRegister.denominations?.['10'] || 0,
    5: currentRegister.denominations?.['5'] || 0,
    coins: currentRegister.denominations?.['coins'] || 0
  }));

  // Sync state if register changes
  useEffect(() => {
    if (currentRegister.denominations) {
      setNotes({
        500: currentRegister.denominations['500'] || 0,
        200: currentRegister.denominations['200'] || 0,
        100: currentRegister.denominations['100'] || 0,
        50: currentRegister.denominations['50'] || 0,
        20: currentRegister.denominations['20'] || 0,
        10: currentRegister.denominations['10'] || 0,
        5: currentRegister.denominations['5'] || 0,
        coins: currentRegister.denominations['coins'] || 0
      });
    }
  }, [currentRegister]);

  const { total, breakdown } = calculateDenominationsTotal(notes);
  const expectedCash = dailySummary.expectedClosingCash;
  const difference = total - expectedCash;
  const isExactMatch = total > 0 && difference === 0;

  const handleCountChange = (denom, val) => {
    const num = Math.max(0, parseInt(val, 10) || 0);
    const updated = {
      ...notes,
      [denom]: num
    };
    setNotes(updated);
    const result = calculateDenominationsTotal(updated);
    updateDenominations(updated, result.total);
  };

  const handleAdjust = (denom, delta) => {
    const current = notes[denom] || 0;
    const nextVal = Math.max(0, current + delta);
    handleCountChange(denom, nextVal);
  };

  const handleReset = () => {
    if (window.confirm('Do you want to reset all denomination note counts to 0?')) {
      const zeroNotes = { 500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0, 5: 0, coins: 0 };
      setNotes(zeroNotes);
      updateDenominations(zeroNotes, 0);
      showToast('Note counts reset');
    }
  };

  const denomConfigs = [
    { denom: '500', val: 500, name: '₹500 Notes', color: 'border-slate-500 bg-slate-800/80 text-emerald-300' },
    { denom: '200', val: 200, name: '₹200 Notes', color: 'border-amber-600/40 bg-amber-950/30 text-amber-300' },
    { denom: '100', val: 100, name: '₹100 Notes', color: 'border-indigo-500/40 bg-indigo-950/30 text-indigo-300' },
    { denom: '50', val: 50, name: '₹50 Notes', color: 'border-cyan-500/40 bg-cyan-950/30 text-cyan-300' },
    { denom: '20', val: 20, name: '₹20 Notes', color: 'border-yellow-500/40 bg-yellow-950/30 text-yellow-300' },
    { denom: '10', val: 10, name: '₹10 Notes', color: 'border-orange-600/40 bg-orange-950/30 text-orange-300' },
    { denom: '5', val: 5, name: '₹5 Notes', color: 'border-emerald-600/40 bg-emerald-950/30 text-emerald-300' },
    { denom: 'coins', val: 1, name: 'Coins (सिक्के)', color: 'border-slate-600 bg-slate-900 text-slate-300' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-wide">
              Cash Denomination Calculator
            </h2>
            <Badge variant="purple">
              <Banknote className="w-3.5 h-3.5" />
              Interactive Note Counter
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Count 500, 200, 100, 50, 20, 10 notes and coins at closing to reconcile drawer with system calculations.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Clear All Notes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Interactive Note Table */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>Currency / Note Value</span>
            <span>Quantity (Count)</span>
            <span className="text-right">Subtotal (₹)</span>
          </div>

          <div className="space-y-3">
            {denomConfigs.map(({ denom, val, name, color }) => {
              const count = notes[denom] || 0;
              const subtotal = breakdown[denom]?.subtotal || 0;

              return (
                <div
                  key={denom}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${color}`}
                >
                  {/* Denom Label */}
                  <div className="flex items-center gap-3 w-36 shrink-0">
                    <div className="w-10 h-8 rounded-lg bg-black/40 border border-white/10 flex items-center justify-center font-mono font-bold text-sm">
                      {val === 1 ? '🪙' : `₹${val}`}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{name}</div>
                      <div className="text-[10px] text-slate-400">
                        {val === 1 ? 'Loose Coins' : `× ₹${val}`}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Input + Increment Buttons */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleAdjust(denom, -1)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-xs transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={count || ''}
                      placeholder="0"
                      onChange={(e) => handleCountChange(denom, e.target.value)}
                      className="w-20 bg-slate-950 border border-slate-700 rounded-lg py-1 px-2 text-center text-sm font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleAdjust(denom, 1)}
                      className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold flex items-center justify-center text-xs transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right w-28 shrink-0">
                    <div className="font-mono font-bold text-sm text-white">
                      {formatINR(subtotal)}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {count > 0 ? `${count} pcs` : '0 pcs'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Total Bar at Bottom of Table */}
          <div className="pt-4 border-t border-slate-800 flex justify-between items-center bg-slate-950/60 p-4 rounded-xl">
            <span className="text-sm font-bold text-slate-300">
              Total Counted Physical Cash:
            </span>
            <span className="text-2xl font-mono font-extrabold text-emerald-400">
              {formatINR(total)}
            </span>
          </div>
        </div>

        {/* Right Col: Reconciliation & Tally Verification Card */}
        <div className="space-y-6">
          <div
            className={`p-6 rounded-2xl border transition-all duration-300 shadow-2xl space-y-5 ${
              isExactMatch
                ? 'bg-gradient-to-b from-emerald-950/80 to-slate-900 border-emerald-500/50 glow-emerald'
                : total === 0
                ? 'bg-slate-900/90 border-slate-800'
                : difference > 0
                ? 'bg-gradient-to-b from-amber-950/80 to-slate-900 border-amber-500/50'
                : 'bg-gradient-to-b from-rose-950/80 to-slate-900 border-rose-500/50 glow-rose'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Cash Tally Report
              </h3>
              {isExactMatch ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              )}
            </div>

            {/* Comparison Metrics */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold">
                    1. System Calculated Expected Cash
                  </div>
                  <div className="text-[10px] text-slate-400">System Closing Cash</div>
                </div>
                <div className="text-base font-mono font-bold text-white">
                  {formatINR(expectedCash)}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold">
                    2. Physical Counted Cash
                  </div>
                  <div className="text-[10px] text-slate-400">Drawer Cash</div>
                </div>
                <div className="text-base font-mono font-bold text-emerald-400">
                  {formatINR(total)}
                </div>
              </div>
            </div>

            {/* Verdict Difference Display */}
            <div className="pt-2">
              <div className="text-xs text-slate-400 font-semibold mb-1">
                Cash Reconciliation Verdict:
              </div>

              <div
                className={`p-4 rounded-xl text-center border font-bold ${
                  isExactMatch
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : total === 0
                    ? 'bg-slate-800 text-slate-400 border-slate-700'
                    : difference > 0
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}
              >
                {total === 0 ? (
                  <span className="text-xs font-normal">
                    Enter note quantities in counter to check difference.
                  </span>
                ) : isExactMatch ? (
                  <div>
                    <div className="text-lg flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-400" />
                      <span>100% Exact Cash Match (₹0 Difference)</span>
                    </div>
                    <div className="text-xs font-normal text-emerald-200 mt-1">
                      Today's physical cash matches the register tally perfectly.
                    </div>
                  </div>
                ) : difference > 0 ? (
                  <div>
                    <div className="text-base">
                      +{formatINR(difference)} Surplus / Extra Cash in drawer
                    </div>
                    <div className="text-xs font-normal text-amber-200 mt-1">
                      Possible unrecorded cash deposit in register.
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-base text-rose-300">
                      -{formatINR(Math.abs(difference))} Short Cash in drawer!
                    </div>
                    <div className="text-xs font-normal text-rose-200 mt-1">
                      Please verify today's payouts, withdrawals, and expenses.
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Save Notice */}
            <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-2">
              <Save className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Note quantities are auto-saved to the Daily Register.</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
