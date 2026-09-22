import React, { useState, useMemo } from 'react';
import { useHisab } from '../../context/HisabContext';
import { formatINR } from '../../utils/formatters';
import {
  Coins,
  Plus,
  Trash2,
  Fingerprint,
  Send,
  FileCheck2,
  Printer,
  CreditCard,
  Zap,
  Tag,
  Sparkles,
  TrendingUp,
  Clock,
  Layers,
  Search,
  Wallet,
  CheckCircle2,
  ArrowUpRight,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const INCOME_CATEGORIES = [
  {
    id: 'AEPS',
    name: 'AEPS निकासी कमीशन (AEPS Cash Out)',
    shortName: 'AEPS Comm',
    icon: Fingerprint,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10 border-emerald-500/30',
    badge: 'bg-emerald-500/20 text-emerald-300'
  },
  {
    id: 'DMT',
    name: 'मनी ट्रांसफर चार्ज (DMT Transfer Fee)',
    shortName: 'DMT Fee',
    icon: Send,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10 border-sky-500/30',
    badge: 'bg-sky-500/20 text-sky-300'
  },
  {
    id: 'PF',
    name: 'PF / ईपीएफओ फॉर्म फीस (PF Claim & KYC)',
    shortName: 'PF / EPFO',
    icon: FileCheck2,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10 border-amber-500/30',
    badge: 'bg-amber-500/20 text-amber-300'
  },
  {
    id: 'PHOTOCOPY',
    name: 'फोटोकॉपी व प्रिंटआउट (Xerox & Print)',
    shortName: 'Xerox & Print',
    icon: Printer,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/30',
    badge: 'bg-purple-500/20 text-purple-300'
  },
  {
    id: 'PAN_PASSPORT',
    name: 'पैन कार्ड व सरकारी दस्तावेज (PAN / Govt Form)',
    shortName: 'PAN / Govt',
    icon: CreditCard,
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10 border-indigo-500/30',
    badge: 'bg-indigo-500/20 text-indigo-300'
  },
  {
    id: 'BILL_PAYMENT',
    name: 'बिजली व बिल सर्विस चार्ज (Bill Payment Fee)',
    shortName: 'Bill Payment',
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-500/10 border-yellow-500/30',
    badge: 'bg-yellow-500/20 text-yellow-300'
  },
  {
    id: 'OTHER',
    name: 'अन्य विविध कमाई (Other Services)',
    shortName: 'Other Services',
    icon: Tag,
    color: 'text-slate-400',
    bg: 'bg-slate-800/60 border-slate-700',
    badge: 'bg-slate-700 text-slate-300'
  }
];

const QUICK_INCOME_PRESETS = [
  { title: 'AEPS Cash Out Fee / Comm', amount: 150, category: 'AEPS' },
  { title: 'DMT Money Transfer Fee', amount: 100, category: 'DMT' },
  { title: 'PF / EPFO Online Claim Apply', amount: 250, category: 'PF' },
  { title: 'Photo Copy / Xerox (25 Pages)', amount: 50, category: 'PHOTOCOPY' },
  { title: 'Color Printout & Lamination', amount: 80, category: 'PHOTOCOPY' },
  { title: 'New PAN Card Application', amount: 150, category: 'PAN_PASSPORT' },
  { title: 'Electricity Bill Payment Fee', amount: 30, category: 'BILL_PAYMENT' },
  { title: 'Aadhaar Card PVC / Print', amount: 50, category: 'PHOTOCOPY' }
];

export const IncomeTracker = ({ onNext, onPrev }) => {
  const {
    todaysIncomes,
    totalIncomes,
    totalExpenses,
    addIncome,
    deleteIncome,
    activeBranch,
    activeBankAccounts,
    selectedDate,
    showToast,
    triggerLoader
  } = useHisab();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('AEPS');
  const [paymentMode, setPaymentMode] = useState('Cash in Hand');
  const [customerName, setCustomerName] = useState('');
  const [remark, setRemark] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterCategory, setSelectedFilterCategory] = useState('ALL');

  const handleAddIncome = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    addIncome({
      title,
      amount: Number(amount),
      category,
      paymentMode,
      customerName,
      remark
    });

    setTitle('');
    setAmount('');
    setCustomerName('');
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
    todaysIncomes.forEach((inc) => {
      totals[inc.category] = (totals[inc.category] || 0) + Number(inc.amount || 0);
    });
    return totals;
  }, [todaysIncomes]);

  // Cash vs Bank/Online received
  const paymentBreakdown = useMemo(() => {
    let cash = 0;
    let online = 0;
    todaysIncomes.forEach((inc) => {
      const amt = Number(inc.amount || 0);
      if (inc.paymentMode === 'Cash in Hand' || inc.paymentMode.toLowerCase().includes('cash')) {
        cash += amt;
      } else {
        online += amt;
      }
    });
    return { cash, online };
  }, [todaysIncomes]);

  // Filtered income list
  const filteredIncomes = useMemo(() => {
    return todaysIncomes.filter((inc) => {
      const matchSearch =
        (inc.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inc.customerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inc.remark || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedFilterCategory === 'ALL' || inc.category === selectedFilterCategory;

      return matchSearch && matchCategory;
    });
  }, [todaysIncomes, searchQuery, selectedFilterCategory]);

  const netTodayProfit = totalIncomes - totalExpenses;

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-5">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-white tracking-wide">
                Other Income & Service Fees (दुकान की अन्य कमाई)
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                {todaysIncomes.length} Entries
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              AEPS Commission, DMT Transfer Fee, PF / EPFO Forms, Photo Copy / Xerox, PAN Card & Utility Services
            </p>
          </div>
        </div>

        {/* Live Net Profit & Total Income Badges */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Income (कुल कमाई)</div>
            <div className="text-lg font-mono font-black text-emerald-400">{formatINR(totalIncomes)}</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-indigo-500/30 text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Net Profit (कमाई - खर्च)</div>
            <div className={`text-lg font-mono font-black ${netTodayProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {formatINR(netTodayProfit)}
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown & Key Metric Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5">
        {INCOME_CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const total = categoryTotals[cat.id] || 0;
          const isSelected = selectedFilterCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedFilterCategory(isSelected ? 'ALL' : cat.id)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'ring-2 ring-emerald-500 bg-emerald-500/20 border-emerald-500/50'
                  : total > 0
                  ? `${cat.bg} hover:border-slate-600`
                  : 'bg-slate-950/60 border-slate-800/80 opacity-70 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon className={`w-4 h-4 ${cat.color}`} />
                <span className="text-[9px] font-bold text-slate-400">
                  {todaysIncomes.filter(i => i.category === cat.id).length}
                </span>
              </div>
              <div className="text-[11px] font-semibold text-slate-300 mt-1 truncate">
                {cat.shortName}
              </div>
              <div className="text-xs font-mono font-bold text-white mt-0.5">
                {formatINR(total)}
              </div>
            </button>
          );
        })}
      </div>

      {/* 1-Click Quick Presets */}
      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>Quick 1-Click Presets (जल्दी कमाई जोड़ें)</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {QUICK_INCOME_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => applyPreset(preset)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-emerald-600/30 hover:border-emerald-500/50 border border-slate-700/80 text-xs font-medium text-slate-200 transition-all flex items-center gap-1.5 group"
            >
              <span>{preset.title}</span>
              <span className="font-mono font-bold text-emerald-400 group-hover:text-emerald-300">
                ₹{preset.amount}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Entry Form */}
      <form
        onSubmit={handleAddIncome}
        className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-3.5 shadow-inner"
      >
        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Add New Service Income / Fee (नई कमाई एंट्री करें)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Service Title */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Service / Work Name (काम का नाम) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. PF Form 19 Apply / Xerox"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Amount Received (रुपये ₹) *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-xs font-bold text-slate-500">₹</span>
              <input
                type="number"
                required
                min="1"
                placeholder="250"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-7 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Category (सर्विस श्रेणी)
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              {INCOME_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Payment Mode */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 mb-1">
              Received In (भुगतान कहाँ मिला)
            </label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
            >
              <option value="Cash in Hand">💵 Cash in Hand (गल्ला कैश)</option>
              <option value="UPI / Online QR">📱 PhonePe / GPay / QR UPI</option>
              {activeBankAccounts.map((acc) => (
                <option key={acc.id} value={acc.name}>
                  🏦 {acc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Second Row: Customer Name + Remarks + Submit Button */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div>
            <input
              type="text"
              placeholder="Customer Name / Details (optional)"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Notes / Bill No / Pages (optional)"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Income (+₹{amount || '0'})</span>
          </button>
        </div>
      </form>

      {/* Income Records List & Search */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Today's Income Records ({filteredIncomes.length})
            </span>
            {selectedFilterCategory !== 'ALL' && (
              <button
                onClick={() => setSelectedFilterCategory('ALL')}
                className="text-[10px] text-emerald-400 hover:underline"
              >
                (Clear Category Filter)
              </button>
            )}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search service, customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Table / List View */}
        {filteredIncomes.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-950/50 border border-dashed border-slate-800 text-slate-500 text-xs">
            No income entries found for this selection. Use the form above to add a new income record.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Service & Details</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Received In</th>
                  <th className="py-2.5 px-3">Customer / Note</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {filteredIncomes.map((inc) => {
                  const catConfig =
                    INCOME_CATEGORIES.find((c) => c.id === inc.category) ||
                    INCOME_CATEGORIES[INCOME_CATEGORIES.length - 1];
                  const Icon = catConfig.icon;

                  return (
                    <tr
                      key={inc.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-2.5 px-3 font-medium text-slate-200">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-3.5 h-3.5 ${catConfig.color} shrink-0`} />
                          <span className="font-semibold">{inc.title}</span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${catConfig.badge}`}
                        >
                          {catConfig.shortName}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 text-slate-300">
                        <span className="text-[11px]">{inc.paymentMode}</span>
                      </td>

                      <td className="py-2.5 px-3 text-slate-400 max-w-[200px] truncate">
                        {inc.customerName || inc.remark ? (
                          <span>
                            {inc.customerName}
                            {inc.customerName && inc.remark && ' • '}
                            <span className="text-slate-500">{inc.remark}</span>
                          </span>
                        ) : (
                          <span className="text-slate-600">-</span>
                        )}
                      </td>

                      <td className="py-2.5 px-3 text-slate-400 text-[11px] whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{inc.time || '10:00 AM'}</span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3 text-right font-mono font-black text-emerald-400 text-sm whitespace-nowrap">
                        +{formatINR(inc.amount)}
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        <button
                          onClick={() => deleteIncome(inc.id)}
                          title="Delete entry"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
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

      {/* Bottom Save & Next Action Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {onPrev && (
            <button
              onClick={onPrev}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>⬅️ पिछला: ग्राहक खाता</span>
            </button>
          )}

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>कुल आज की कमाई:</span>
            <span className="font-mono font-bold text-emerald-300 text-sm">{formatINR(totalIncomes)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 justify-end">
          <button
            onClick={() => {
              triggerLoader({
                duration: 2200,
                subtitle: '💰 अन्य कमाई व सर्विस कमीशन सुरक्षित हो रहा है...',
                onFinish: () => showToast('✅ सभी सेवा कमाई रिकॉर्ड सुरक्षित हो गए!')
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
                subtitle: '💰 अन्य कमाई सुरक्षित! ☕ दुकान खर्चे लोड हो रहे हैं...',
                onFinish: () => {
                  showToast('✨ अन्य कमाई सेव हो गई! अगला: दुकान खर्च (Expenses)');
                  if (onNext) onNext();
                }
              });
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer group"
          >
            <span>💾 सेव करें और अगला: दुकान खर्च (Save & Next)</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
