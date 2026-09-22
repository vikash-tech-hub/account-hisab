import React, { useState } from 'react';
import { useHisab } from '../../context/HisabContext';
import { formatINR } from '../../utils/formatters';
import {
  Landmark,
  Plus,
  Trash2,
  Zap,
  Wallet,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Layers,
  Sparkles
} from 'lucide-react';

export const BankAccountsPillar = ({ onNext, onPrev }) => {
  const {
    activeBankAccounts,
    totalBankBalance,
    updateBankAccount,
    setBankAccountDirectTodayBalance,
    addBankAccount,
    deleteBankAccount,
    carryForwardAllYesterday,
    selectedDate,
    getPreviousDateString,
    showToast,
    triggerLoader
  } = useHisab();

  const [isAdding, setIsAdding] = useState(false);
  const [entryMode, setEntryMode] = useState('direct'); // 'direct' (Aaj ka balance) or 'detailed'
  const [newAccName, setNewAccName] = useState('');
  const [newAccType, setNewAccType] = useState('BANK');
  const [newAccOpening, setNewAccOpening] = useState('');

  const yesterdayDate = getPreviousDateString ? getPreviousDateString(selectedDate) : 'कल';

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newAccName) return;
    addBankAccount({
      name: newAccName,
      type: newAccType,
      opening: Number(newAccOpening || 0),
      deposits: 0,
      withdrawals: 0
    });
    setNewAccName('');
    setNewAccOpening('');
    setIsAdding(false);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextInput = document.getElementById(`bank-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevInput = document.getElementById(`bank-input-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        prevInput.select();
      }
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              2. Bank Accounts & Cash in Hand Balance (बैंक व गल्ला कैश)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            कल का क्लोजिंग = आज का ओपनिंग | सिर्फ आज का बैंक या गल्ले का बैलेंस भरें
          </p>
        </div>

        {/* Action Controls & Total */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mode Switcher */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
            <button
              onClick={() => setEntryMode('direct')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                entryMode === 'direct'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>आज का बैलेंस (Quick)</span>
            </button>
            <button
              onClick={() => setEntryMode('detailed')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                entryMode === 'detailed'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Deposits / Withdrawals</span>
            </button>
          </div>

          {/* 1-Click Carry Forward Button */}
          <button
            onClick={carryForwardAllYesterday}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 text-xs font-bold transition-all shadow-sm"
            title="कल का क्लोजिंग बैलेंस आज के ओपनिंग में कॉपी करें"
          >
            <Zap className="w-4 h-4 text-sky-400" />
            <span>⚡ कल का बैलेंस लाएं ({yesterdayDate})</span>
          </button>

          {/* Total Badge */}
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Bank & Cash</span>
            <span className="text-lg font-black font-mono text-sky-400">
              {formatINR(totalBankBalance)}
            </span>
          </div>

          {/* Add Account Button */}
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{isAdding ? 'Close' : '+ Add Account'}</span>
          </button>
        </div>
      </div>

      {/* Inline Add Account Form */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="p-4 rounded-xl bg-slate-950 border border-sky-500/30 grid grid-cols-1 sm:grid-cols-4 gap-3 animate-fadeIn">
          <input
            type="text"
            required
            placeholder="Account / Bank Name (e.g. SBI Main Current)"
            value={newAccName}
            onChange={(e) => setNewAccName(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
          />
          <select
            value={newAccType}
            onChange={(e) => setNewAccType(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500"
          >
            <option value="BANK">Bank Account (बैंक)</option>
            <option value="CASH">Physical Cash Drawer (गल्ला कैश)</option>
          </select>
          <input
            type="number"
            placeholder="Opening Balance (₹)"
            value={newAccOpening}
            onChange={(e) => setNewAccOpening(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-sky-500 font-mono"
          />
          <button
            type="submit"
            className="bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg py-2 transition-colors"
          >
            Save Account
          </button>
        </form>
      )}

      {/* Bank Accounts Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            {entryMode === 'direct' ? (
              <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/60">
                <th className="py-3 px-3">Account Name & Type</th>
                <th className="py-3 px-3 text-right">🌅 कल का बैलेंस / सुबह का ओपनिंग (₹)</th>
                <th className="py-3 px-3 text-right text-sky-400">🏦 आज का लाइव बैलेंस (Today's Balance ₹)</th>
                <th className="py-3 px-3 text-right">🔄 आज का फर्क (Net Change)</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            ) : (
              <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/60">
                <th className="py-3 px-3">Account Name & Type</th>
                <th className="py-3 px-3 text-right">Morning Opening (₹)</th>
                <th className="py-3 px-3 text-right text-emerald-400">Deposits In (+)</th>
                <th className="py-3 px-3 text-right text-rose-400">Withdrawals Out (-)</th>
                <th className="py-3 px-3 text-right text-sky-400">Net Available Balance</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            )}
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {activeBankAccounts.map((acc, index) => {
              const opening = Number(acc.opening) || 0;
              const deposits = Number(acc.deposits) || 0;
              const withdrawals = Number(acc.withdrawals) || 0;
              const closing = opening + deposits - withdrawals;
              const diff = closing - opening;
              const isCash = acc.type === 'CASH';

              return (
                <tr key={acc.id} className="hover:bg-slate-800/40 transition-colors">
                  {/* Account Name & Type */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${isCash ? 'bg-emerald-500/20 text-emerald-400' : 'bg-sky-500/20 text-sky-400'}`}>
                        {isCash ? <Wallet className="w-4 h-4" /> : <Landmark className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{acc.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono uppercase">{acc.type}</div>
                      </div>
                    </div>
                  </td>

                  {entryMode === 'direct' ? (
                    <>
                      {/* Morning Opening (Yesterday's Closing - Disabled / Read-Only) */}
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center justify-end">
                          <span
                            className="font-mono font-semibold text-slate-400 bg-slate-950/80 border border-slate-800/80 px-3 py-1.5 rounded-lg text-xs cursor-not-allowed select-none"
                            title="कल का क्लोजिंग बैलेंस (Locked & Auto-Loaded)"
                          >
                            🔒 {formatINR(acc.opening)}
                          </span>
                        </div>
                      </td>

                      {/* Direct Today's Live Balance (Input with Enter Key Navigation) */}
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <span className="text-sky-400 font-bold text-xs">₹</span>
                          <input
                            id={`bank-input-${index}`}
                            type="number"
                            value={closing === 0 ? '' : closing}
                            placeholder="0"
                            onFocus={(e) => e.target.select()}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onChange={(e) => setBankAccountDirectTodayBalance(acc.id, e.target.value)}
                            className="w-32 bg-sky-950/40 border border-sky-500/50 hover:border-sky-400 focus:border-sky-400 focus:bg-sky-950/80 rounded-lg px-2.5 py-1.5 text-right font-mono font-black text-sky-300 text-sm focus:outline-none transition-all shadow-inner ring-0 focus:ring-2 focus:ring-sky-500/50"
                          />
                        </div>
                      </td>

                      {/* Net Difference Badge */}
                      <td className="py-3 px-3 text-right">
                        <span
                          className={`inline-flex items-center gap-1 font-mono font-bold text-xs px-2 py-0.5 rounded-md ${
                            diff > 0
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : diff < 0
                              ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              : 'text-slate-500 bg-slate-800/40'
                          }`}
                        >
                          {diff > 0 && <TrendingUp className="w-3 h-3 text-emerald-400" />}
                          {diff < 0 && <TrendingDown className="w-3 h-3 text-rose-400" />}
                          {diff > 0 ? `+${formatINR(diff)}` : diff < 0 ? `-${formatINR(Math.abs(diff))}` : 'बराबर (₹0)'}
                        </span>
                      </td>
                    </>
                  ) : (
                    <>
                      {/* Detailed Mode - Opening */}
                      <td className="py-3 px-3 text-right">
                        <input
                          type="number"
                          value={acc.opening === 0 ? '' : acc.opening}
                          placeholder="0"
                          onChange={(e) => updateBankAccount(acc.id, { opening: Number(e.target.value) || 0 })}
                          className="w-24 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-right font-mono font-semibold text-slate-300 focus:outline-none focus:border-sky-500 text-xs"
                        />
                      </td>

                      {/* Detailed Mode - Deposits In */}
                      <td className="py-3 px-3 text-right">
                        <input
                          type="number"
                          value={acc.deposits === 0 ? '' : acc.deposits}
                          placeholder="0"
                          onChange={(e) => updateBankAccount(acc.id, { deposits: Number(e.target.value) || 0 })}
                          className="w-24 bg-slate-950 border border-emerald-500/40 focus:border-emerald-400 rounded px-2 py-1 text-right font-mono font-bold text-emerald-400 focus:outline-none text-xs"
                        />
                      </td>

                      {/* Detailed Mode - Withdrawals Out */}
                      <td className="py-3 px-3 text-right">
                        <input
                          type="number"
                          value={acc.withdrawals === 0 ? '' : acc.withdrawals}
                          placeholder="0"
                          onChange={(e) => updateBankAccount(acc.id, { withdrawals: Number(e.target.value) || 0 })}
                          className="w-24 bg-slate-950 border border-rose-500/40 focus:border-rose-400 rounded px-2 py-1 text-right font-mono font-bold text-rose-400 focus:outline-none text-xs"
                        />
                      </td>

                      {/* Detailed Mode - Closing */}
                      <td className="py-3 px-3 text-right">
                        <span className="font-mono font-black text-sm text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20">
                          {formatINR(closing)}
                        </span>
                      </td>
                    </>
                  )}

                  {/* Actions */}
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${acc.name}?`)) deleteBankAccount(acc.id);
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                      title="Delete Account"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom Save & Next Action Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {onPrev && (
            <button
              onClick={onPrev}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>⬅️ पिछला: 10 पोर्टल</span>
            </button>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>कुल बैंक व गल्ला:</span>
            <span className="font-mono font-bold text-sky-300 text-sm">{formatINR(totalBankBalance)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 justify-end">
          <button
            onClick={() => {
              triggerLoader({
                duration: 2200,
                subtitle: '🏦 बैंक खाते व गल्ला कैश सुरक्षित हो रहा है...',
                onFinish: () => showToast('✅ सभी बैंक खाते व गल्ला कैश सुरक्षित हो गए!')
              });
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>💾 सेव करें (Save)</span>
          </button>

          <button
            onClick={() => {
              triggerLoader({
                duration: 2400,
                subtitle: '🏦 बैंक व गल्ला सुरक्षित हुआ! 👥 ग्राहक खाता बही लोड हो रही है...',
                onFinish: () => {
                  showToast('✨ बैंक व गल्ला कैश सेव हो गया! अगला: ग्राहक खाता (जमा/उधार)');
                  if (onNext) onNext();
                }
              });
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-slate-950 font-black text-xs shadow-lg shadow-sky-500/20 transition-all flex items-center gap-2 cursor-pointer group"
          >
            <span>💾 सेव करें और अगला: ग्राहक खाता (Save & Next)</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
