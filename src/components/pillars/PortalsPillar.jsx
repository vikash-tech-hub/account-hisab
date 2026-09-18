import React, { useState } from 'react';
import { useHisab } from '../../context/HisabContext';
import { formatINR } from '../../utils/formatters';
import {
  CreditCard,
  Plus,
  Trash2,
  Zap,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  Layers,
  Sparkles
} from 'lucide-react';

export const PortalsPillar = () => {
  const {
    activePortals,
    totalPortalsBalance,
    updatePortalBalance,
    setPortalDirectTodayBalance,
    addPortal,
    deletePortal,
    carryForwardAllYesterday,
    selectedDate,
    getPreviousDateString
  } = useHisab();

  const [isAdding, setIsAdding] = useState(false);
  const [entryMode, setEntryMode] = useState('direct'); // 'direct' (Aaj ka balance) or 'detailed' (Inflow/Outflow)
  const [newPortalName, setNewPortalName] = useState('');
  const [newPortalCode, setNewPortalCode] = useState('');
  const [newPortalOpening, setNewPortalOpening] = useState('');

  const yesterdayDate = getPreviousDateString ? getPreviousDateString(selectedDate) : 'कल';

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newPortalName) return;
    addPortal({
      name: newPortalName,
      code: newPortalCode || `ID-${Math.floor(1000 + Math.random() * 9000)}`,
      opening: Number(newPortalOpening || 0),
      inAmount: 0,
      outAmount: 0
    });
    setNewPortalName('');
    setNewPortalCode('');
    setNewPortalOpening('');
    setIsAdding(false);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextInput = document.getElementById(`portal-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
        nextInput.select();
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevInput = document.getElementById(`portal-input-${index - 1}`);
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
            <CreditCard className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              1. All Money Transfer Portals Balance (सभी 10 पोर्टल)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            कल का क्लोजिंग = आज का ओपनिंग | सिर्फ आज का लाइव बैलेंस भरें और हिसाब तुरंत पाएं
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
                  ? 'bg-indigo-600 text-white shadow-md'
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
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Inflow / Outflow</span>
            </button>
          </div>

          {/* 1-Click Carry Forward Button */}
          <button
            onClick={carryForwardAllYesterday}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all shadow-sm"
            title="कल का क्लोजिंग बैलेंस आज के ओपनिंग में कॉपी करें"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>⚡ कल का बैलेंस लाएं ({yesterdayDate})</span>
          </button>

          {/* Total Badge */}
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Portal Balance</span>
            <span className="text-lg font-black font-mono text-amber-400">
              {formatINR(totalPortalsBalance)}
            </span>
          </div>

          {/* Add Portal Button */}
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{isAdding ? 'Close' : '+ Add Portal'}</span>
          </button>
        </div>
      </div>

      {/* Inline Add Portal Form */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 grid grid-cols-1 sm:grid-cols-4 gap-3 animate-fadeIn">
          <input
            type="text"
            required
            placeholder="Portal Name (e.g. Spice Money)"
            value={newPortalName}
            onChange={(e) => setNewPortalName(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
          <input
            type="text"
            placeholder="Agent ID Code (e.g. SM-123)"
            value={newPortalCode}
            onChange={(e) => setNewPortalCode(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
          <input
            type="number"
            placeholder="Opening Balance (₹)"
            value={newPortalOpening}
            onChange={(e) => setNewPortalOpening(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg py-2 transition-colors"
          >
            Save Portal
          </button>
        </form>
      )}

      {/* Portals Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            {entryMode === 'direct' ? (
              <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/60">
                <th className="py-3 px-3">Portal Name & ID</th>
                <th className="py-3 px-3 text-right">🌅 कल का बैलेंस / सुबह का ओपनिंग (₹)</th>
                <th className="py-3 px-3 text-right text-indigo-400">📱 आज का लाइव बैलेंस (Today's Balance ₹)</th>
                <th className="py-3 px-3 text-right">🔄 आज का फर्क (Net Change)</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            ) : (
              <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/60">
                <th className="py-3 px-3">Portal Name & ID</th>
                <th className="py-3 px-3 text-right">Morning Opening (₹)</th>
                <th className="py-3 px-3 text-right text-emerald-400">Today's Inflow (+)</th>
                <th className="py-3 px-3 text-right text-rose-400">DMT Outflow (-)</th>
                <th className="py-3 px-3 text-right text-amber-400">Live Closing Balance</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            )}
          </thead>

          <tbody className="divide-y divide-slate-800/60">
            {activePortals.map((portal, index) => {
              const opening = Number(portal.opening) || 0;
              const inAmount = Number(portal.inAmount) || 0;
              const outAmount = Number(portal.outAmount) || 0;
              const closing = opening + inAmount - outAmount;
              const diff = closing - opening;

              return (
                <tr key={portal.id} className="hover:bg-slate-800/40 transition-colors">
                  {/* Name & ID */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: portal.color || '#f97316' }} />
                      <div>
                        <div className="font-bold text-white text-sm">{portal.name}</div>
                        <div className="font-mono text-[10px] text-slate-400">{portal.code}</div>
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
                            🔒 {formatINR(portal.opening)}
                          </span>
                        </div>
                      </td>

                      {/* Direct Today's Live Balance (Input with Enter Key Navigation) */}
                      <td className="py-3 px-3 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <span className="text-indigo-400 font-bold text-xs">₹</span>
                          <input
                            id={`portal-input-${index}`}
                            type="number"
                            value={closing === 0 ? '' : closing}
                            placeholder="0"
                            onFocus={(e) => e.target.select()}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onChange={(e) => setPortalDirectTodayBalance(portal.id, e.target.value)}
                            className="w-32 bg-indigo-950/40 border border-indigo-500/50 hover:border-indigo-400 focus:border-indigo-400 focus:bg-indigo-950/80 rounded-lg px-2.5 py-1.5 text-right font-mono font-black text-amber-300 text-sm focus:outline-none transition-all shadow-inner ring-0 focus:ring-2 focus:ring-indigo-500/50"
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
                          value={portal.opening === 0 ? '' : portal.opening}
                          placeholder="0"
                          onChange={(e) => updatePortalBalance(portal.id, { opening: Number(e.target.value) || 0 })}
                          className="w-24 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-right font-mono font-semibold text-slate-300 focus:outline-none focus:border-indigo-500 text-xs"
                        />
                      </td>

                      {/* Detailed Mode - Inflow */}
                      <td className="py-3 px-3 text-right">
                        <input
                          type="number"
                          value={portal.inAmount === 0 ? '' : portal.inAmount}
                          placeholder="0"
                          onChange={(e) => updatePortalBalance(portal.id, { inAmount: Number(e.target.value) || 0 })}
                          className="w-24 bg-slate-950 border border-emerald-500/40 focus:border-emerald-400 rounded px-2 py-1 text-right font-mono font-bold text-emerald-400 focus:outline-none text-xs"
                        />
                      </td>

                      {/* Detailed Mode - Outflow */}
                      <td className="py-3 px-3 text-right">
                        <input
                          type="number"
                          value={portal.outAmount === 0 ? '' : portal.outAmount}
                          placeholder="0"
                          onChange={(e) => updatePortalBalance(portal.id, { outAmount: Number(e.target.value) || 0 })}
                          className="w-24 bg-slate-950 border border-rose-500/40 focus:border-rose-400 rounded px-2 py-1 text-right font-mono font-bold text-rose-400 focus:outline-none text-xs"
                        />
                      </td>

                      {/* Detailed Mode - Live Closing */}
                      <td className="py-3 px-3 text-right">
                        <span className="font-mono font-black text-sm text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                          {formatINR(closing)}
                        </span>
                      </td>
                    </>
                  )}

                  {/* Actions */}
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete ${portal.name}?`)) deletePortal(portal.id);
                      }}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Delete Portal"
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
    </div>
  );
};
