import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useHisab } from '../../context/HisabContext';
import { formatINR, formatDate, formatDateFull } from '../../utils/formatters';
import {
  Printer,
  Share2,
  Building2,
  CreditCard,
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  Scale,
  Calendar
} from 'lucide-react';

export const QuickHisabParchi = ({ isOpen, onClose }) => {
  const {
    activeBranch,
    selectedDate,
    activePortals,
    activeBankAccounts,
    totalPortalsBalance,
    totalBankBalance,
    totalJamaAmount,
    totalLiyaAmount,
    totalIncomes,
    totalExpenses,
    netTotalCapital,
    allTimeJamaAmount,
    allTimeLiyaAmount,
    allTimeIncomes,
    allTimeExpenses,
    allTimeNetTotalCapital,
    allTimeJamaList,
    allTimeLiyaList,
    incomes,
    expenses,
    isAllShops,
    selectedBranchId
  } = useHisab();

  const [printViewMode, setPrintViewMode] = useState('compact');

  if (!isOpen) return null;

  const netTodayProfit = totalIncomes - totalExpenses;
  const netAllTimeProfit = allTimeIncomes - allTimeExpenses;
  const inThisShop = (row) => isAllShops || row.branchId === selectedBranchId;
  const newestFirst = (list) => [...(list || [])].sort((a, b) => String(b.date).localeCompare(String(a.date)));
  const slipDeposits = newestFirst(allTimeJamaList);
  const slipGiven = newestFirst(allTimeLiyaList);
  const slipIncomes = newestFirst((incomes || []).filter(inThisShop));
  const slipExpenses = newestFirst((expenses || []).filter(inThisShop));
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const compactRows = [
    { label: 'Portals', note: `${activePortals.length} IDs`, today: totalPortalsBalance, till: totalPortalsBalance },
    { label: 'Bank and cash', note: `${activeBankAccounts.length} accounts`, today: totalBankBalance, till: totalBankBalance },
    { label: 'Received', note: 'Money taken in', today: totalJamaAmount, till: allTimeJamaAmount },
    { label: 'Given', note: 'Money given out', today: totalLiyaAmount, till: allTimeLiyaAmount },
    { label: 'Other income', note: 'Service fees', today: totalIncomes, till: allTimeIncomes },
    { label: 'Expenses', note: 'Shop spend', today: totalExpenses, till: allTimeExpenses }
  ];

  const handlePrint = () => {
    window.print();
  };

  // WhatsApp Summary Message Generator
  const generateWhatsAppText = () => {
    const line = (label, today, till) => `${label}: ${formatINR(today)} | till today ${formatINR(till)}`;
    const text = `*${activeBranch.name} (${activeBranch.code})*
*Compact hisab*
Date: ${formatDate(selectedDate)} (${formatDateFull(selectedDate)})
Today | Till today
--------------------------------
${line('Portals', totalPortalsBalance, totalPortalsBalance)}
${line('Bank and cash', totalBankBalance, totalBankBalance)}
${line('Received', totalJamaAmount, allTimeJamaAmount)}
${line('Given', totalLiyaAmount, allTimeLiyaAmount)}
${line('Other income', totalIncomes, allTimeIncomes)}
${line('Expenses', totalExpenses, allTimeExpenses)}
--------------------------------
*Net capital:* ${formatINR(netTotalCapital)} | till today ${formatINR(allTimeNetTotalCapital)}
*Profit:* ${formatINR(netTodayProfit)} | till today ${formatINR(netAllTimeProfit)}
--------------------------------
_Maa Vaishno Enterprises_`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Daily accounts statement"
      subtitle="Compact slip: today and till today"
      maxWidth={printViewMode === 'compact' ? 'max-w-xl' : 'max-w-4xl'}
    >
      <div className="space-y-4">
        
        {/* Action Controls Bar (Hidden during Print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 no-print text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Print view:</span>
            <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center">
              <button
                type="button"
                onClick={() => setPrintViewMode('full')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  printViewMode === 'full'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Full statement
              </button>
              <button
                type="button"
                onClick={() => setPrintViewMode('compact')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  printViewMode === 'compact'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Compact
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={generateWhatsAppText()}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-md cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share on WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print slip</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PRINTABLE HISAB DOCUMENT (Optimized for A4 Paper & Thermal Printers)     */}
        {/* ========================================================================= */}
        <div
          id="printable-slip"
          className="bg-white text-slate-950 p-6 sm:p-8 rounded-2xl shadow-xl border border-slate-300 font-sans space-y-5 print-page"
        >
          {/* Top Brand Header */}
          <div className="text-center pb-4 border-b-2 border-slate-900 space-y-1">
            <div className="flex items-center justify-center gap-2">
              <Building2 className="w-6 h-6 text-slate-900" />
              <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">
                {activeBranch.name}
              </h1>
            </div>
            <p className="text-xs font-semibold text-slate-700">
              Branch code: <strong>{activeBranch.code}</strong> | Manager: <strong>{activeBranch.manager}</strong>
              {activeBranch.phone && ` | Phone: ${activeBranch.phone}`}
            </p>
            {activeBranch.address && (
              <p className="text-[11px] text-slate-600">
                Shop address: {activeBranch.address}
              </p>
            )}
            <div className="pt-1">
              <span className="inline-block bg-slate-900 text-white text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider">
                {printViewMode === 'compact' ? 'Today and till today' : 'Daily all-in-one accounts statement'}
              </span>
            </div>
          </div>

          {/* Date & Time Row */}
          <div className="flex flex-wrap items-center justify-between text-xs font-bold border-b border-dashed border-slate-400 pb-2.5 text-slate-800">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span>Statement date:</span>
              <span className="text-sm font-black text-slate-950">
                {formatDate(selectedDate)} ({formatDateFull(selectedDate)})
              </span>
            </div>
            <div>
              <span>Printed at: </span>
              <span className="font-mono">{currentTime}</span>
            </div>
          </div>

          {printViewMode === 'compact' && (
            <div className="space-y-2">
            <table className="w-full text-sm border border-slate-900 border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[11px] uppercase tracking-wide">
                  <th className="p-2 text-left font-bold">Hisab</th>
                  <th className="p-2 text-right font-bold">Today</th>
                  <th className="p-2 text-right font-bold">Till today</th>
                </tr>
              </thead>
              <tbody>
                {compactRows.map((row) => (
                  <tr key={row.label} className="border-t border-slate-300">
                    <td className="px-2 py-1.5">
                      <div className="font-bold text-slate-950">{row.label}</div>
                      <div className="text-[10px] font-medium text-slate-500">{row.note}</div>
                    </td>
                    <td className="px-2 py-1.5 text-right font-mono font-black text-slate-950">
                      {formatINR(row.today)}
                    </td>
                    <td className="px-2 py-1.5 text-right font-mono font-black text-slate-950">
                      {formatINR(row.till)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-slate-900 bg-slate-100">
                  <td className="px-2 py-2 text-xs font-black uppercase text-slate-950">Net capital</td>
                  <td className="px-2 py-2 text-right font-mono font-black text-slate-950">{formatINR(netTotalCapital)}</td>
                  <td className="px-2 py-2 text-right font-mono font-black text-slate-950">{formatINR(allTimeNetTotalCapital)}</td>
                </tr>
                <tr className="border-t border-slate-300 bg-slate-50">
                  <td className="px-2 py-2 text-xs font-bold text-slate-800">Profit</td>
                  <td className="px-2 py-2 text-right font-mono font-black text-slate-950">{formatINR(netTodayProfit)}</td>
                  <td className="px-2 py-2 text-right font-mono font-black text-slate-950">{formatINR(netAllTimeProfit)}</td>
                </tr>
              </tfoot>
            </table>
            <p className="text-[10px] text-center text-slate-500 leading-snug">
              Portals and bank are the balance on this date. Received, given, other income and expenses show this day and the total till today.
            </p>
            </div>
          )}

          {printViewMode === 'full' && (
          <>
          {/* 6 Metric Summary Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-1">
            <div className="p-2 rounded-xl border border-slate-300 bg-slate-50 text-center">
              <div className="text-[10px] font-bold text-slate-600 uppercase">1. All portals</div>
              <div className="text-xs sm:text-sm font-mono font-black text-slate-950 mt-0.5">
                {formatINR(totalPortalsBalance)}
              </div>
              <div className="text-[9px] text-slate-500 font-semibold">{activePortals.length} Portals</div>
            </div>

            <div className="p-2 rounded-xl border border-slate-300 bg-slate-50 text-center">
              <div className="text-[10px] font-bold text-slate-600 uppercase">2. Bank and cash</div>
              <div className="text-xs sm:text-sm font-mono font-black text-slate-950 mt-0.5">
                {formatINR(totalBankBalance)}
              </div>
              <div className="text-[9px] text-slate-500 font-semibold">{activeBankAccounts.length} A/C + Cash</div>
            </div>

            <div className="p-2 rounded-xl border border-emerald-300 bg-emerald-50/70 text-center">
              <div className="text-[10px] font-bold text-emerald-800 uppercase">3. Received</div>
              <div className="text-xs sm:text-sm font-mono font-black text-emerald-800 mt-0.5">
                {formatINR(totalJamaAmount)}
              </div>
              <div className="text-[9px] text-emerald-700 font-semibold">Till today {formatINR(allTimeJamaAmount)}</div>
            </div>

            <div className="p-2 rounded-xl border border-rose-300 bg-rose-50/70 text-center">
              <div className="text-[10px] font-bold text-rose-800 uppercase">4. Given</div>
              <div className="text-xs sm:text-sm font-mono font-black text-rose-800 mt-0.5">
                {formatINR(totalLiyaAmount)}
              </div>
              <div className="text-[9px] text-rose-700 font-semibold">Till today {formatINR(allTimeLiyaAmount)}</div>
            </div>

            <div className="p-2 rounded-xl border border-teal-300 bg-teal-50/70 text-center">
              <div className="text-[10px] font-bold text-teal-800 uppercase">5. Other income</div>
              <div className="text-xs sm:text-sm font-mono font-black text-teal-800 mt-0.5">
                {formatINR(totalIncomes)}
              </div>
              <div className="text-[9px] text-teal-700 font-semibold">Till today {formatINR(allTimeIncomes)}</div>
            </div>

            <div className="p-2 rounded-xl border border-amber-300 bg-amber-50/70 text-center">
              <div className="text-[10px] font-bold text-amber-800 uppercase">6. Expenses</div>
              <div className="text-xs sm:text-sm font-mono font-black text-amber-800 mt-0.5">
                {formatINR(totalExpenses)}
              </div>
              <div className="text-[9px] text-amber-700 font-semibold">Till today {formatINR(allTimeExpenses)}</div>
            </div>
          </div>

          {/* Grand Net Total Capital Banner */}
          <div className="p-3.5 rounded-xl border-2 border-slate-900 bg-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <div className="text-xs font-black uppercase text-slate-900 tracking-wider">
                Net available capital
              </div>
              <div className="text-[10px] text-slate-600 font-semibold mt-0.5">
                Portals {formatINR(totalPortalsBalance)} + Bank and cash {formatINR(totalBankBalance)} + given {formatINR(totalLiyaAmount)} − received {formatINR(totalJamaAmount)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl sm:text-2xl font-black font-mono text-slate-950">
                {formatINR(netTotalCapital)}
              </div>
              <div className="text-[11px] font-bold text-slate-600">Till today {formatINR(allTimeNetTotalCapital)}</div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 1: ALL 10 MONEY TRANSFER PORTALS BREAKDOWN TABLE                  */}
          {/* ========================================================================= */}
          <div className="space-y-1.5 pt-1">
            <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5" />
                <span>1. All portal closing balances</span>
              </span>
              <span className="font-mono">Total: {formatINR(totalPortalsBalance)}</span>
            </div>

            <table className="w-full text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 text-[10px] uppercase font-bold text-left">
                  <th className="p-1.5">Portal</th>
                  <th className="p-1.5 text-right">Opening</th>
                  <th className="p-1.5 text-right text-emerald-800">(+IN)</th>
                  <th className="p-1.5 text-right text-rose-800">(-OUT)</th>
                  <th className="p-1.5 text-right">Closing (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {activePortals.map((p) => {
                  const closing = (Number(p.opening) || 0) + (Number(p.inAmount) || 0) - (Number(p.outAmount) || 0);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-1.5 font-bold text-slate-900">
                        {p.name}
                        {p.code && <span className="text-[10px] text-slate-500 font-normal ml-1">({p.code})</span>}
                      </td>
                      <td className="p-1.5 text-right font-mono text-slate-700">{formatINR(p.opening || 0)}</td>
                      <td className="p-1.5 text-right font-mono text-emerald-700">
                        {p.inAmount > 0 ? `+${formatINR(p.inAmount)}` : '-'}
                      </td>
                      <td className="p-1.5 text-right font-mono text-rose-700">
                        {p.outAmount > 0 ? `-${formatINR(p.outAmount)}` : '-'}
                      </td>
                      <td className="p-1.5 text-right font-mono font-black text-slate-950">{formatINR(closing)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-black border-t-2 border-slate-900">
                  <td colSpan={4} className="p-1.5 text-slate-900 uppercase text-[11px]">
                    Total portal balance:
                  </td>
                  <td className="p-1.5 text-right font-mono font-black text-sm text-slate-950">
                    {formatINR(totalPortalsBalance)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: BANK ACCOUNTS & CASH IN HAND BREAKDOWN TABLE                   */}
          {/* ========================================================================= */}
          <div className="space-y-1.5 pt-1">
            <div className="bg-slate-900 text-white px-3 py-1.5 rounded-lg flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5" />
                <span>2. Bank accounts and cash in hand</span>
              </span>
              <span className="font-mono">Total: {formatINR(totalBankBalance)}</span>
            </div>

            <table className="w-full text-xs border border-slate-300 border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 text-[10px] uppercase font-bold text-left">
                  <th className="p-1.5">Account</th>
                  <th className="p-1.5">Type</th>
                  <th className="p-1.5 text-right">Opening</th>
                  <th className="p-1.5 text-right text-emerald-800">(+Deposits)</th>
                  <th className="p-1.5 text-right text-rose-800">(-Withdrawals)</th>
                  <th className="p-1.5 text-right">Closing (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {activeBankAccounts.map((a) => {
                  const closing = (Number(a.opening) || 0) + (Number(a.deposits) || 0) - (Number(a.withdrawals) || 0);
                  return (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="p-1.5 font-bold text-slate-900">{a.name}</td>
                      <td className="p-1.5 text-[10px] font-semibold text-slate-600">{a.type || 'BANK'}</td>
                      <td className="p-1.5 text-right font-mono text-slate-700">{formatINR(a.opening || 0)}</td>
                      <td className="p-1.5 text-right font-mono text-emerald-700">
                        {a.deposits > 0 ? `+${formatINR(a.deposits)}` : '-'}
                      </td>
                      <td className="p-1.5 text-right font-mono text-rose-700">
                        {a.withdrawals > 0 ? `-${formatINR(a.withdrawals)}` : '-'}
                      </td>
                      <td className="p-1.5 text-right font-mono font-black text-slate-950">{formatINR(closing)}</td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 font-black border-t-2 border-slate-900">
                  <td colSpan={5} className="p-1.5 text-slate-900 uppercase text-[11px]">
                    Total bank and cash:
                  </td>
                  <td className="p-1.5 text-right font-mono font-black text-sm text-slate-950">
                    {formatINR(totalBankBalance)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {[
              {
                title: '3. Received',
                Icon: ArrowDownLeft,
                bar: 'bg-emerald-800',
                head: 'bg-emerald-50 text-emerald-900',
                foot: 'bg-emerald-100/80 text-emerald-900 border-emerald-400',
                ink: 'text-emerald-800',
                rows: slipDeposits,
                todayAmount: totalJamaAmount,
                tillAmount: allTimeJamaAmount,
                nameOf: (row) => row.name,
                detailOf: (row) => row.portalOrAccount || row.note || 'Cash in Hand'
              },
              {
                title: '4. Given',
                Icon: ArrowUpRight,
                bar: 'bg-rose-800',
                head: 'bg-rose-50 text-rose-900',
                foot: 'bg-rose-100/80 text-rose-900 border-rose-400',
                ink: 'text-rose-800',
                rows: slipGiven,
                todayAmount: totalLiyaAmount,
                tillAmount: allTimeLiyaAmount,
                nameOf: (row) => row.name,
                detailOf: (row) => row.portalOrAccount || row.note || 'Cash in Hand'
              },
              {
                title: '5. Other income',
                Icon: TrendingUp,
                bar: 'bg-teal-800',
                head: 'bg-teal-50 text-teal-900',
                foot: 'bg-teal-100/80 text-teal-900 border-teal-400',
                ink: 'text-teal-800',
                rows: slipIncomes,
                todayAmount: totalIncomes,
                tillAmount: allTimeIncomes,
                nameOf: (row) => row.title || row.serviceName || row.category || 'Service income',
                detailOf: (row) => row.customerName || row.remark || row.note || row.category || '-'
              },
              {
                title: '6. Expenses',
                Icon: Receipt,
                bar: 'bg-amber-800',
                head: 'bg-amber-50 text-amber-900',
                foot: 'bg-amber-100/80 text-amber-900 border-amber-400',
                ink: 'text-amber-900',
                rows: slipExpenses,
                todayAmount: totalExpenses,
                tillAmount: allTimeExpenses,
                nameOf: (row) => row.title || row.category || 'Shop expense',
                detailOf: (row) => row.vendor || row.remark || row.note || row.description || '-'
              }
            ].map((block) => {
              const Icon = block.Icon;
              return (
                <div key={block.title} className="space-y-1.5">
                  <div className={`${block.bar} text-white px-3 py-1.5 rounded-lg flex items-center justify-between gap-2 text-xs font-bold`}>
                    <span className="flex items-center gap-1.5 min-w-0">
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{block.title}</span>
                    </span>
                    <span className="font-mono text-right leading-tight shrink-0">
                      <span className="block">Today {formatINR(block.todayAmount)}</span>
                      <span className="block text-[10px] opacity-90">Till today {formatINR(block.tillAmount)}</span>
                    </span>
                  </div>
                  {block.rows.length === 0 ? (
                    <div className="p-3 border border-dashed border-slate-300 rounded-lg text-center text-xs text-slate-500">
                      No entries yet.
                    </div>
                  ) : (
                    <table className="w-full text-xs border border-slate-300 border-collapse">
                      <thead>
                        <tr className={`${block.head} border-b border-slate-300 text-[10px] uppercase font-bold text-left`}>
                          <th className="p-1.5">Date</th>
                          <th className="p-1.5">Details</th>
                          <th className="p-1.5 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {block.rows.map((row) => (
                          <tr key={row.id} className={row.date === selectedDate ? 'bg-amber-50/70' : ''}>
                            <td className="p-1.5 whitespace-nowrap text-slate-700">
                              {formatDate(row.date)}
                              {row.date === selectedDate && (
                                <div className="text-[9px] font-black uppercase text-amber-700">Today</div>
                              )}
                            </td>
                            <td className="p-1.5">
                              <div className="font-bold text-slate-900">{block.nameOf(row)}</div>
                              <div className="text-[10px] text-slate-500">{block.detailOf(row)}</div>
                            </td>
                            <td className={`p-1.5 text-right font-mono font-black ${block.ink}`}>
                              {formatINR(row.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className={`${block.foot} font-black border-t`}>
                          <td colSpan={2} className="p-1.5 text-[11px]">Today</td>
                          <td className="p-1.5 text-right font-mono">{formatINR(block.todayAmount)}</td>
                        </tr>
                        <tr className={`${block.foot} font-black border-t`}>
                          <td colSpan={2} className="p-1.5 text-[11px]">Till today</td>
                          <td className="p-1.5 text-right font-mono">{formatINR(block.tillAmount)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  )}
                </div>
              );
            })}
          </div>

          <div className="p-3 rounded-xl border border-slate-400 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-slate-700" />
              <span>Profit (other income − expenses)</span>
            </div>
            <div className="text-right">
              <div className="font-mono text-base font-black text-slate-950">Today {formatINR(netTodayProfit)}</div>
              <div className="font-mono text-xs font-bold text-slate-600">Till today {formatINR(netAllTimeProfit)}</div>
            </div>
          </div>

          {/* Signatures & Verification Footer */}
          <div className="pt-8 flex justify-between text-xs text-slate-700 border-t-2 border-dashed border-slate-400">
            <div className="text-center">
              <div className="w-44 border-b border-slate-900 mb-1"></div>
              <div className="font-bold">Operator signature</div>
              <div className="text-[10px] text-slate-500">(Operator Signature)</div>
            </div>

            <div className="text-center">
              <div className="w-44 border-b border-slate-900 mb-1"></div>
              <div className="font-bold">Manager / shop stamp</div>
              <div className="text-[10px] text-slate-500">(Manager & Shop Stamp)</div>
            </div>
          </div>

          {/* Bottom Certified Footer */}
          <div className="text-center text-[10px] text-slate-500 pt-2 border-t border-slate-200 font-mono">
            Maa Vaishno Enterprises daily statement • {formatDate(selectedDate)}
          </div>
          </>
          )}
        </div>

      </div>
    </Modal>
  );
};
