import React, { useState, useMemo } from 'react';
import { useHisab } from '../../context/HisabContext';
import { formatINR, formatTime } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import {
  Receipt,
  Plus,
  Trash2,
  Coffee,
  FileText,
  Zap,
  Building,
  Tag
} from 'lucide-react';

const CATEGORIES = [
  { id: 'CHAI_SNACKS', name: 'Tea & Refreshments', icon: Coffee, color: 'text-amber-400' },
  { id: 'STATIONERY', name: 'Stationery & A4 Paper', icon: FileText, color: 'text-sky-400' },
  { id: 'ELECTRICITY_INTERNET', name: 'Electricity & Broadband Bill', icon: Zap, color: 'text-yellow-400' },
  { id: 'RENT', name: 'Shop Rent', icon: Building, color: 'text-indigo-400' },
  { id: 'OTHER', name: 'Miscellaneous Expenses', icon: Tag, color: 'text-slate-400' }
];

export const ExpenseTracker = () => {
  const { todaysExpenses, addExpense, deleteExpense, dailySummary, activeBranch } = useHisab();

  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'CHAI_SNACKS',
    remark: ''
  });

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) {
      alert('Please enter the expense title and amount.');
      return;
    }

    addExpense({
      ...formData,
      amount: Number(formData.amount)
    });

    setFormData({
      title: '',
      amount: '',
      category: 'CHAI_SNACKS',
      remark: ''
    });
  };

  // Category breakdown
  const categoryTotals = useMemo(() => {
    const totals = {};
    todaysExpenses.forEach(exp => {
      totals[exp.category] = (totals[exp.category] || 0) + Number(exp.amount || 0);
    });
    return totals;
  }, [todaysExpenses]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-wide">
              Daily Shop Expenses Tracker
            </h2>
            <Badge variant="danger">
              <Receipt className="w-3.5 h-3.5" />
              {todaysExpenses.length} Expenses Recorded
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Branch: <span className="text-indigo-400 font-semibold">{activeBranch.name}</span> | Log daily tea, printing supplies, utilities and rent
          </p>
        </div>

        <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 text-right">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Expenses Today</div>
          <div className="text-xl font-extrabold font-mono text-rose-400">
            {formatINR(dailySummary.totalExpenses)}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Add Expense Form */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800 flex items-center gap-2">
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>Add New Expense</span>
          </h3>

          <form onSubmit={handleAddExpense} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Expense Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Title / Purpose *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Morning Tea & Biscuits"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Amount (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  min="1"
                  placeholder="0"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-7 pr-3 py-2 text-xs font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Vendor / Remark
              </label>
              <input
                type="text"
                placeholder="e.g. Pappu Tea Stall"
                value={formData.remark}
                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Receipt className="w-4 h-4" />
              <span>Record Expense</span>
            </button>
          </form>
        </div>

        {/* Right 2 Cols: Expense List & Category Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Category Quick Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.slice(0, 4).map(cat => {
              const Icon = cat.icon;
              const total = categoryTotals[cat.id] || 0;
              return (
                <div
                  key={cat.id}
                  className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl flex items-center gap-3"
                >
                  <div className={`p-2 rounded-lg bg-slate-950 ${cat.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-400 truncate">{cat.name}</div>
                    <div className="text-xs font-mono font-bold text-white">
                      {formatINR(total)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Today's Expense Table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
              Today's Expenses Log
            </h3>

            {todaysExpenses.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500">
                No expenses recorded for today yet.
              </div>
            ) : (
              <div className="overflow-x-auto mt-2">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      <th className="py-2.5 px-3">Time / Category</th>
                      <th className="py-2.5 px-3">Title / Purpose</th>
                      <th className="py-2.5 px-3">Vendor / Remark</th>
                      <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {todaysExpenses.map((exp) => {
                      const catConfig = CATEGORIES.find(c => c.id === exp.category) || CATEGORIES[4];
                      const Icon = catConfig.icon;

                      return (
                        <tr key={exp.id} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-slate-400 text-[11px]">
                                {formatTime(exp.time)}
                              </span>
                              <span className="flex items-center gap-1 text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300">
                                <Icon className={`w-3 h-3 ${catConfig.color}`} />
                                <span>{catConfig.name}</span>
                              </span>
                            </div>
                          </td>

                          <td className="py-2.5 px-3 font-semibold text-white">
                            {exp.title}
                          </td>

                          <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                            {exp.remark || '-'}
                          </td>

                          <td className="py-2.5 px-3 text-right whitespace-nowrap font-mono font-bold text-rose-400">
                            -{formatINR(exp.amount)}
                          </td>

                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <button
                              onClick={() => {
                                if (window.confirm('Do you want to delete this expense record?')) {
                                  deleteExpense(exp.id);
                                }
                              }}
                              className="p-1 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
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
    </div>
  );
};
