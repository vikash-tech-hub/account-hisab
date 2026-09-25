import React, { useState, useEffect, useMemo } from 'react';
import { Modal } from './Modal';
import { formatINR } from '../../utils/formatters';
import {
  Calculator,
  RotateCcw,
  CheckCircle2,
  Copy,
  Check,
  Coins,
  Wallet,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const DENOMINATIONS = [
  { value: 500, label: '₹500 Note', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { value: 200, label: '₹200 Note', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  { value: 100, label: '₹100 Note', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' },
  { value: 50, label: '₹50 Note', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  { value: 20, label: '₹20 Note', color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  { value: 10, label: '₹10 Note', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
  { value: 5, label: '₹5 Note', color: 'bg-lime-500/10 text-lime-400 border-lime-500/30' },
  { value: 2, label: '₹2 Note/Coin', color: 'bg-slate-500/10 text-slate-300 border-slate-500/30' },
  { value: 1, label: '₹1 Note/Coin', color: 'bg-slate-500/10 text-slate-300 border-slate-500/30' }
];

export const CashDenominationModal = ({
  isOpen,
  onClose,
  onApplyCash,
  targetAccountName = 'Cash in Hand (गल्ला कैश)',
  initialAmount = 0
}) => {
  const [counts, setCounts] = useState({
    500: '',
    200: '',
    100: '',
    50: '',
    20: '',
    10: '',
    5: '',
    2: '',
    1: '',
    coinsExtra: ''
  });

  const [copied, setCopied] = useState(false);

  // Calculate totals
  const { totalAmount, totalNotes, breakdown } = useMemo(() => {
    let sum = 0;
    let notes = 0;
    const items = [];

    DENOMINATIONS.forEach(d => {
      const count = Number(counts[d.value]) || 0;
      const subtotal = count * d.value;
      sum += subtotal;
      notes += count;
      if (count > 0) {
        items.push({
          denom: d.value,
          count,
          subtotal
        });
      }
    });

    const extraCoins = Number(counts.coinsExtra) || 0;
    sum += extraCoins;

    return { totalAmount: sum, totalNotes: notes, breakdown: items, extraCoins };
  }, [counts]);

  const handleChange = (denom, val) => {
    setCounts(prev => ({
      ...prev,
      [denom]: val === '' ? '' : Math.max(0, parseInt(val, 10) || 0)
    }));
  };

  const handleReset = () => {
    setCounts({
      500: '',
      200: '',
      100: '',
      50: '',
      20: '',
      10: '',
      5: '',
      2: '',
      1: '',
      coinsExtra: ''
    });
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextInput = document.getElementById(`denom-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevInput = document.getElementById(`denom-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        prevInput.select();
      }
    }
  };

  const handleApply = () => {
    if (onApplyCash) {
      onApplyCash(totalAmount);
    }
    onClose();
  };

  const handleCopyBreakdown = () => {
    let text = `💵 *गल्ला कैश नोट कैलकुलेटर (Cash Breakdown)* 💵\n`;
    text += `📅 तारीख: ${new Date().toLocaleDateString('hi-IN')}\n`;
    text += `━━━━━━━━━━━━━━━━━━━━\n`;

    DENOMINATIONS.forEach(d => {
      const c = Number(counts[d.value]) || 0;
      if (c > 0) {
        text += `₹${d.value} x ${c} = ${formatINR(c * d.value)}\n`;
      }
    });

    if (Number(counts.coinsExtra) > 0) {
      text += `खुल्ले सिक्के (Coins): ${formatINR(counts.coinsExtra)}\n`;
    }

    text += `━━━━━━━━━━━━━━━━━━━━\n`;
    text += `🔢 कुल नोट: ${totalNotes}\n`;
    text += `💰 *कुल गल्ला कैश: ${formatINR(totalAmount)}*\n`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="💵 कैश डिनॉमिनेशन कैलकुलेटर (नोट गिनें)"
      subtitle={`गल्ले के नोटों की गिनती करें और सीधे ${targetAccountName} में सेट करें`}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Top Summary Banner */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 shrink-0">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                कुल गल्ला कैश (Total Cash)
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400 tracking-tight">
                {formatINR(totalAmount)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-right">
              <span className="text-[10px] text-slate-400 block font-bold">कुल नोट (Notes)</span>
              <span className="text-sm font-black font-mono text-white">{totalNotes}</span>
            </div>
            <button
              onClick={handleCopyBreakdown}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-all"
              title="पूरा ब्रेकडाउन कॉपी करें"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="text-[11px] hidden sm:inline">{copied ? 'कॉपी हुआ' : 'Copy'}</span>
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1 transition-all"
              title="सभी खाली करें"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="text-[11px] hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Denomination Input Grid */}
        <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 space-y-2 max-h-[50vh] overflow-y-auto">
          {DENOMINATIONS.map((d, index) => {
            const count = counts[d.value];
            const subtotal = (Number(count) || 0) * d.value;

            return (
              <div
                key={d.value}
                className="flex items-center justify-between gap-2 sm:gap-3 p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60 transition-colors"
              >
                {/* Denomination Badge */}
                <div className="w-28 sm:w-32 shrink-0 flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black font-mono border ${d.color}`}>
                    ₹{d.value}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                    ×
                  </span>
                </div>

                {/* Note Count Input */}
                <div className="flex-1 flex items-center gap-2 justify-center max-w-[160px]">
                  <input
                    id={`denom-input-${index}`}
                    type="number"
                    min="0"
                    placeholder="0"
                    value={count}
                    onFocus={(e) => e.target.select()}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onChange={(e) => handleChange(d.value, e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 rounded-lg px-3 py-1.5 text-center font-mono font-bold text-white text-sm focus:outline-none transition-all"
                  />
                </div>

                {/* Subtotal Display */}
                <div className="w-28 sm:w-36 text-right shrink-0">
                  <span className="text-xs font-mono font-black text-slate-300">
                    {subtotal > 0 ? (
                      <span className="text-emerald-400 font-bold">= {formatINR(subtotal)}</span>
                    ) : (
                      <span className="text-slate-600">₹0</span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Extra Loose Coins Field */}
          <div className="flex items-center justify-between gap-2 sm:gap-3 p-2 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/60 transition-colors">
            <div className="w-28 sm:w-32 shrink-0 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-black font-mono border bg-purple-500/10 text-purple-400 border-purple-500/30 flex items-center gap-1">
                <Coins className="w-3.5 h-3.5" /> सिक्के
              </span>
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                (Coins)
              </span>
            </div>

            <div className="flex-1 flex items-center gap-2 justify-center max-w-[160px]">
              <input
                id={`denom-input-${DENOMINATIONS.length}`}
                type="number"
                min="0"
                placeholder="खुल्ले सिक्के ₹"
                value={counts.coinsExtra}
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleChange('coinsExtra', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 rounded-lg px-3 py-1.5 text-center font-mono font-bold text-white text-sm focus:outline-none transition-all"
              />
            </div>

            <div className="w-28 sm:w-36 text-right shrink-0">
              <span className="text-xs font-mono font-black text-slate-300">
                {Number(counts.coinsExtra) > 0 ? (
                  <span className="text-purple-400 font-bold">= {formatINR(counts.coinsExtra)}</span>
                ) : (
                  <span className="text-slate-600">₹0</span>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
          >
            रद्द करें (Cancel)
          </button>

          <button
            type="button"
            onClick={handleApply}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>गल्ले में सेट करें ({formatINR(totalAmount)})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
