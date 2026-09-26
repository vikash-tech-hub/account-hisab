import React, { useState, useMemo } from 'react';
import { useHisab } from '../../context/HisabContext';
import { formatINR } from '../../utils/formatters';
import {
  Receipt,
  Plus,
  Trash2,
  Coffee,
  FileText,
  Zap,
  Building,
  Tag,
  Wallet,
  Sparkles,
  TrendingDown,
  Clock,
  Landmark,
  Layers,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

const CATEGORIES = [
  { id: 'CHAI_SNACKS', name: 'Tea and snacks', icon: Coffee, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' },
  { id: 'STATIONERY', name: 'Printing paper and stationery', icon: FileText, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/30' },
  { id: 'ELECTRICITY_INTERNET', name: 'Electricity and internet', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' },
  { id: 'RENT', name: 'Shop rent', icon: Building, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30' },
  { id: 'STAFF', name: 'Staff wages', icon: Wallet, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' },
  { id: 'OTHER', name: 'Other expenses', icon: Tag, color: 'text-slate-400', bg: 'bg-slate-800/60 border-slate-700' }
];

const QUICK_EXPENSE_PRESETS = [
  { title: 'Morning Tea & Samosa', amount: 80, category: 'CHAI_SNACKS' },
  { title: 'Afternoon Tea', amount: 50, category: 'CHAI_SNACKS' },
  { title: 'A4 Paper Bundle (500 sheets)', amount: 320, category: 'STATIONERY' },
  { title: 'POS Printer Rolls Pack', amount: 150, category: 'STATIONERY' },
  { title: 'Broadband / WiFi Bill', amount: 599, category: 'ELECTRICITY_INTERNET' },
  { title: 'Shop Cleaning Expense', amount: 100, category: 'OTHER' }
];

export const ExpenseTracker = ({ onNext, onPrev }) => {
  const {
    todaysExpenses,
    totalExpenses,
    addExpense,
    deleteExpense,
    activeBranch,
    activeBankAccounts,
    selectedDate,
    showToast,
    triggerLoader
  } = useHisab();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('CHAI_SNACKS');
  const [paymentMode, setPaymentMode] = useState('Cash in Hand');
  const [vendor, setVendor] = useState('');
  const [remark, setRemark] = useState('');

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    addExpense({
      title,
      amount: Number(amount),
      category,
      paymentMode,
      vendor,
      remark
    });

    setTitle('');
    setAmount('');
    setVendor('');
    setRemark('');
  };

  const applyPreset = (preset) => {
    setTitle(preset.title);
    setAmount(preset.amount);
    setCategory(preset.category);
  };

  // Category breakdown
  const categoryTotals = useMemo(() => {
    const totals = {};
    todaysExpenses.forEach((exp) => {
      totals[exp.category] = (totals[exp.category] || 0) + Number(exp.amount || 0);
    });
    return totals;
  }, [todaysExpenses]);

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 shrink-0">
            <Receipt className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white tracking-wide">
                Daily shop expenses
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-bold">
                {todaysExpenses.length} Records
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Record tea, utilities, rent, stationery, and other shop spend
            </p>
          </div>
        </div>

        {/* Total Expense Badge */}
        <div className="bg-slate-950 px-4 py-2 rounded-xl border border-rose-500/30 text-right shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Expenses Today</span>
          <span className="text-xl font-black font-mono text-rose-400">
            -{formatINR(totalExpenses)}
          </span>
        </div>
      </div>

      {/* Quick 1-Click Preset Chips */}
      <div className="space-y-1.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick expense presets:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {QUICK_EXPENSE_PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(p)}
              className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800 text-xs text-slate-300 font-medium transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span>{p.title}</span>
              <span className="font-mono font-bold text-rose-400">₹{p.amount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Add Expense Form + Right Expense Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT: Add Expense Form (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-slate-800 flex items-center gap-1.5">
            <Plus className="w-4 h-4 text-rose-400" />
            <span>+ Add expense</span>
          </h4>

          <form onSubmit={handleAddExpense} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Expense title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Morning Tea & Samosa"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Amount (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-sm font-mono font-bold text-rose-400 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Paid from
              </label>
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Cash in Hand">Cash in Hand</option>
                {activeBankAccounts.map((b) => (
                  <option key={b.id} value={b.name}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                Vendor / Remark (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Pappu Tea Stall"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Save expense</span>
            </button>
          </form>
        </div>

        {/* RIGHT: Category Breakdown Cards + Expense Table (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Category Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const total = categoryTotals[cat.id] || 0;
              return (
                <div
                  key={cat.id}
                  className={`p-3 rounded-xl border flex items-center gap-2.5 ${cat.bg}`}
                >
                  <div className={`p-2 rounded-lg bg-slate-950 shrink-0 ${cat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-300 font-semibold truncate">
                      {cat.name.split('(')[0]}
                    </div>
                    <div className="text-xs font-mono font-black text-white">
                      {formatINR(total)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Today's Expense Records Table */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Today's Expense Statement ({todaysExpenses.length})
              </h4>
              <span className="text-[11px] font-mono font-bold text-rose-400">
                Total: -{formatINR(totalExpenses)}
              </span>
            </div>

            {todaysExpenses.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No expenses recorded for today yet. Use the left form or presets above.
              </div>
            ) : (
              <div className="overflow-x-auto max-h-[380px] overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] font-bold uppercase text-slate-400 bg-slate-900/80 sticky top-0">
                      <th className="py-2.5 px-3">Time</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Purpose / Title</th>
                      <th className="py-2.5 px-3">Paid Via</th>
                      <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {todaysExpenses.map((exp) => {
                      const catConfig =
                        CATEGORIES.find((c) => c.id === exp.category) || CATEGORIES[5];
                      const Icon = catConfig.icon;

                      return (
                        <tr key={exp.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">
                            {exp.time || '10:00 AM'}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] text-slate-300">
                              <Icon className={`w-3 h-3 ${catConfig.color}`} />
                              <span>{catConfig.name.split('(')[0]}</span>
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-bold text-white">
                            <div>{exp.title}</div>
                            {exp.vendor && (
                              <div className="text-[10px] text-slate-400 font-normal">
                                {exp.vendor}
                              </div>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-slate-300 text-[11px]">
                            {exp.paymentMode || 'Cash in Hand'}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-black text-rose-400">
                            -{formatINR(exp.amount)}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete expense "${exp.title}"?`)) {
                                  deleteExpense(exp.id);
                                }
                              }}
                              className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                              title="Delete Expense"
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
            )}
          </div>

        </div>

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
              <span>Back: Other income</span>
            </button>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-pink-400" />
            <span>Total shop expenses:</span>
            <span className="font-mono font-bold text-pink-300 text-sm">{formatINR(totalExpenses)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 justify-end">
          <button
            onClick={() => {
              triggerLoader({
                duration: 2200,
                subtitle: 'Saving shop expenses...',
                onFinish: () => showToast('Shop expenses saved.')
              });
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>Save</span>
          </button>

          <button
            onClick={() => {
              triggerLoader({
                duration: 2400,
                subtitle: 'Expenses saved. Opening the profit report...',
                onFinish: () => {
                  showToast('Expenses saved. Next: profit report.');
                  if (onNext) onNext();
                }
              });
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white font-black text-xs shadow-lg shadow-pink-500/20 transition-all flex items-center gap-2 cursor-pointer group"
          >
            <span>Save and next: Profit</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
