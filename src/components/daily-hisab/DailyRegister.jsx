import React, { useState } from 'react';
import { useHisab } from '../../context/HisabContext';
import { formatINR, formatDate, formatDateFull } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Edit3,
  CheckCircle,
  AlertCircle,
  Lock,
  Unlock,
  Plus
} from 'lucide-react';

export const DailyRegister = ({ onOpenTransactionModal, onOpenCashCounter }) => {
  const {
    currentRegister,
    updateDailyRegister,
    dailySummary,
    activePortals,
    activeBranch,
    selectedDate
  } = useHisab();

  const [isEditingOpening, setIsEditingOpening] = useState(false);
  const [openingCashInput, setOpeningCashInput] = useState(currentRegister.openingCash || 0);
  const [openingPortalsInput, setOpeningPortalsInput] = useState({
    ...currentRegister.openingPortals
  });
  const [notesInput, setNotesInput] = useState(currentRegister.notes || '');

  const handleSaveOpening = () => {
    updateDailyRegister({
      openingCash: Number(openingCashInput),
      openingPortals: openingPortalsInput,
      notes: notesInput
    });
    setIsEditingOpening(false);
  };

  const isClosed = currentRegister.status === 'CLOSED';

  return (
    <div className="space-y-6">
      {/* Top Banner: Date & Status */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-wide">
              Daily Hisab Register
            </h2>
            <Badge variant={isClosed ? 'danger' : 'success'}>
              {isClosed ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
              {isClosed ? 'Register Closed' : 'Register Open & Active'}
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Branch: <span className="text-indigo-400 font-semibold">{activeBranch.name}</span> | Date: {formatDateFull(selectedDate)}
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setIsEditingOpening(!isEditingOpening)}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <Edit3 className="w-4 h-4 text-indigo-400" />
            <span>{isEditingOpening ? 'Cancel Edit' : 'Edit Opening Balances'}</span>
          </button>

          <button
            onClick={() =>
              updateDailyRegister({
                status: isClosed ? 'OPEN' : 'CLOSED'
              })
            }
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
              isClosed
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30'
            }`}
          >
            {isClosed ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
            <span>{isClosed ? 'Reopen Register' : 'Close Day Register'}</span>
          </button>
        </div>
      </div>

      {/* Opening Balances Editor (if active) */}
      {isEditingOpening && (
        <div className="bg-indigo-950/40 border border-indigo-500/40 rounded-2xl p-5 shadow-2xl animate-scaleIn">
          <div className="flex items-center justify-between pb-3 border-b border-indigo-500/30 mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-400" />
                Set Morning Opening Balances
              </h3>
              <p className="text-xs text-indigo-200/70 mt-0.5">
                Set morning opening cash in drawer and opening balances for all 10 portals.
              </p>
            </div>
            <button
              onClick={handleSaveOpening}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg transition-colors"
            >
              Save Changes
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Opening Cash Input */}
            <div className="bg-slate-900/90 p-3.5 rounded-xl border border-indigo-500/30">
              <label className="block text-xs font-semibold text-emerald-400 mb-1">
                💵 Morning Cash in Hand
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  value={openingCashInput}
                  onChange={(e) => setOpeningCashInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-7 pr-3 py-1.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Portal Balances Inputs */}
            {activePortals.map((portal) => (
              <div
                key={portal.id}
                className="bg-slate-900/90 p-3.5 rounded-xl border border-slate-800"
              >
                <label className="block text-xs font-semibold text-slate-300 truncate mb-1">
                  {portal.name}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    ₹
                  </span>
                  <input
                    type="number"
                    value={openingPortalsInput[portal.id] || 0}
                    onChange={(e) =>
                      setOpeningPortalsInput({
                        ...openingPortalsInput,
                        [portal.id]: Number(e.target.value)
                      })
                    }
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-7 pr-3 py-1.5 text-sm font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Morning Remarks / Notes
            </label>
            <input
              type="text"
              value={notesInput}
              onChange={(e) => setNotesInput(e.target.value)}
              placeholder="e.g. Started day with 80 notes of 500 and 25 notes of 200..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Main Breakdown: Step-by-Step Daily Hisab Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Step 1 & 2: Cash Inflow (Jama) & Cash Outflow (Liya) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Detailed Cash Flow Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white tracking-wide">
                  Complete Cash Flow Breakdown
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Detailed breakdown of cash added (+) and cash paid out (-) from drawer
                </p>
              </div>
              <button
                onClick={onOpenTransactionModal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Entry</span>
              </button>
            </div>

            {/* Inflow / Outflow Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Cash Inflow (+) */}
              <div className="bg-slate-950/60 border border-emerald-500/20 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                      <ArrowDownLeft className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Cash Inflow (+)
                    </span>
                  </div>
                  <span className="font-mono font-extrabold text-emerald-400 text-base">
                    +{formatINR(dailySummary.openingCash + dailySummary.totalJamaCash + dailySummary.totalTransfersIn)}
                  </span>
                </div>

                <div className="space-y-2 text-xs pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between text-slate-300">
                    <span>1. Morning Opening Cash:</span>
                    <span className="font-mono font-semibold">{formatINR(dailySummary.openingCash)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>2. Customer Cash Deposits (Jama/DMT):</span>
                    <span className="font-mono font-semibold text-emerald-400">
                      +{formatINR(dailySummary.totalJamaCash)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>3. Bank ATM Cash Withdrawals:</span>
                    <span className="font-mono font-semibold text-emerald-400">
                      +{formatINR(dailySummary.totalTransfersIn)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cash Outflow (-) */}
              <div className="bg-slate-950/60 border border-rose-500/20 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                      Cash Outflow (-)
                    </span>
                  </div>
                  <span className="font-mono font-extrabold text-rose-400 text-base">
                    -{formatINR(dailySummary.totalLiyaCash + dailySummary.totalTransfersOut + dailySummary.totalExpenses)}
                  </span>
                </div>

                <div className="space-y-2 text-xs pt-2 border-t border-slate-800/80">
                  <div className="flex justify-between text-slate-300">
                    <span>1. AEPS Cash Payouts to Customers (Liya):</span>
                    <span className="font-mono font-semibold text-rose-400">
                      -{formatINR(dailySummary.totalLiyaCash)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>2. Wallet Top-up (Distributor Cash):</span>
                    <span className="font-mono font-semibold text-rose-400">
                      -{formatINR(dailySummary.totalTransfersOut)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>3. Daily Shop Expenses:</span>
                    <span className="font-mono font-semibold text-rose-400">
                      -{formatINR(dailySummary.totalExpenses)}
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Formula Result Calculation Banner */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 p-4 rounded-xl border border-indigo-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  Expected Closing Cash
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  [Opening Cash + Cash Inflows] - [AEPS Payouts + Wallet Top-ups + Expenses]
                </div>
              </div>
              <div className="text-2xl font-extrabold font-mono text-emerald-400">
                {formatINR(dailySummary.expectedClosingCash)}
              </div>
            </div>

          </div>

          {/* 10 Portal Live Balances Grid */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white tracking-wide">
                  10 Money Transfer Portal Balances
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Opening + (AEPS In + Wallet Loads) - (DMT Out + Transfers) = Closing Balance
                </p>
              </div>
              <span className="text-xs bg-slate-800 text-sky-300 px-2.5 py-1 rounded-lg border border-slate-700 font-mono font-bold">
                Total Portals: {formatINR(dailySummary.totalPortalClosing)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {activePortals.map((portal) => {
                const summary = dailySummary.portalSummaries[portal.id] || {
                  opening: 0,
                  dmtOut: 0,
                  aepsIn: 0,
                  loadIn: 0,
                  transferOut: 0,
                  closing: 0
                };
                const isLow = summary.closing < (portal.minBalance || 2000);

                return (
                  <div
                    key={portal.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/90 hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: portal.color || '#6366f1' }}
                        />
                        <span className="text-xs font-bold text-white truncate">
                          {portal.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        {portal.code}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-[11px] pt-2 border-t border-slate-800/80">
                      <div>
                        <div className="text-slate-500">Opening</div>
                        <div className="font-mono text-slate-300 font-semibold">
                          {formatINR(summary.opening)}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500">DMT Out (-)</div>
                        <div className="font-mono text-rose-400 font-semibold">
                          {summary.dmtOut > 0 ? `-${formatINR(summary.dmtOut)}` : '0'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-slate-500">Closing</div>
                        <div
                          className={`font-mono font-bold ${
                            isLow ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        >
                          {formatINR(summary.closing)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: Physical Cash Verification & Today's Summary Card */}
        <div className="space-y-6">
          
          {/* Physical Cash Counting Widget */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Cash Tally & Verification
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verify physical cash drawer at closing time
                </p>
              </div>
              <button
                onClick={onOpenCashCounter}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Count Notes →
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-300">System Expected Cash:</span>
                <span className="font-mono font-bold text-white">
                  {formatINR(dailySummary.expectedClosingCash)}
                </span>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-xs text-slate-300">Physical Counted Cash:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {formatINR(currentRegister.closingCashCounted || 0)}
                </span>
              </div>

              {/* Tally match pill */}
              <div
                className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  currentRegister.closingCashCounted === dailySummary.expectedClosingCash &&
                  currentRegister.closingCashCounted > 0
                    ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                    : currentRegister.closingCashCounted > 0
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {currentRegister.closingCashCounted === dailySummary.expectedClosingCash &&
                currentRegister.closingCashCounted > 0 ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Exact 100% Cash Match!</span>
                  </>
                ) : currentRegister.closingCashCounted > 0 ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>
                      Difference: {formatINR(Math.abs(currentRegister.closingCashCounted - dailySummary.expectedClosingCash))}
                    </span>
                  </>
                ) : (
                  <span>Count notes at closing to verify register</span>
                )}
              </div>
            </div>

            <button
              onClick={onOpenCashCounter}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Wallet className="w-4 h-4" />
              <span>Open Note Counter</span>
            </button>
          </div>

          {/* Today's Profit & Commission Summary */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
              Daily Profit Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span>Total Commissions:</span>
                <span className="font-mono font-semibold text-emerald-400">
                  +{formatINR(dailySummary.totalCommissionEarned)}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-300">
                <span>Total Shop Expenses:</span>
                <span className="font-mono font-semibold text-rose-400">
                  -{formatINR(dailySummary.totalExpenses)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                <span className="font-bold text-white">Net Daily Profit:</span>
                <span className="font-mono font-extrabold text-base text-indigo-300">
                  {formatINR(dailySummary.netDailyProfit)}
                </span>
              </div>
            </div>
          </div>

          {/* Today's Notes */}
          {currentRegister.notes && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl text-xs">
              <div className="font-bold text-slate-300 mb-1">📝 Daily Notes:</div>
              <p className="text-slate-400 leading-relaxed">
                {currentRegister.notes}
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
