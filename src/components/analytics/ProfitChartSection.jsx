import React, { useState } from 'react';
import { useHisab } from '../../context/HisabContext';
import { formatINR, formatDate } from '../../utils/formatters';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
  Legend
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Receipt,
  PieChart,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

export const ProfitChartSection = () => {
  const { activeBranch, selectedDate, totalPortalsBalance, totalBankBalance, totalIncomes, totalExpenses, todaysIncomes } = useHisab();
  const [viewTimeframe, setViewTimeframe] = useState('7DAYS'); // '7DAYS', 'MONTH'

  // Realistic Daily Commission & Net Profit Trend Data (Past 7 Days)
  const dailyProfitData = [
    { date: '10 Sep', grossCommission: 1850, expenses: 320, netProfit: 1530, dmtVolume: 85000, aepsVolume: 42000 },
    { date: '11 Sep', grossCommission: 2100, expenses: 450, netProfit: 1650, dmtVolume: 92000, aepsVolume: 51000 },
    { date: '12 Sep', grossCommission: 2450, expenses: 280, netProfit: 2170, dmtVolume: 110000, aepsVolume: 65000 },
    { date: '13 Sep', grossCommission: 1900, expenses: 350, netProfit: 1550, dmtVolume: 78000, aepsVolume: 48000 },
    { date: '14 Sep', grossCommission: 2300, expenses: 400, netProfit: 1900, dmtVolume: 95000, aepsVolume: 58000 },
    { date: '15 Sep', grossCommission: 2650, expenses: 520, netProfit: 2130, dmtVolume: 125000, aepsVolume: 72000 },
    { date: '16 Sep', grossCommission: totalIncomes || 2950, expenses: totalExpenses || 480, netProfit: (totalIncomes || 2950) - (totalExpenses || 480), dmtVolume: 145000, aepsVolume: 88000 }
  ];

  // Service & Portal-wise Commission Earnings Breakdown (Today)
  const portalCommissionData = [
    { name: 'AEPS Cash Out', commission: todaysIncomes.filter(i => i.category === 'AEPS').reduce((s, i) => s + Number(i.amount || 0), 0) || 650, count: todaysIncomes.filter(i => i.category === 'AEPS').length || 14, color: '#10b981' },
    { name: 'DMT Transfer Fee', commission: todaysIncomes.filter(i => i.category === 'DMT').reduce((s, i) => s + Number(i.amount || 0), 0) || 480, count: todaysIncomes.filter(i => i.category === 'DMT').length || 12, color: '#0284c7' },
    { name: 'PF / EPFO Online', commission: todaysIncomes.filter(i => i.category === 'PF').reduce((s, i) => s + Number(i.amount || 0), 0) || 500, count: todaysIncomes.filter(i => i.category === 'PF').length || 5, color: '#f59e0b' },
    { name: 'Photo Copy & Xerox', commission: todaysIncomes.filter(i => i.category === 'PHOTOCOPY').reduce((s, i) => s + Number(i.amount || 0), 0) || 320, count: todaysIncomes.filter(i => i.category === 'PHOTOCOPY').length || 8, color: '#a855f7' },
    { name: 'PAN / Govt Services', commission: todaysIncomes.filter(i => i.category === 'PAN_PASSPORT').reduce((s, i) => s + Number(i.amount || 0), 0) || 300, count: todaysIncomes.filter(i => i.category === 'PAN_PASSPORT').length || 4, color: '#6366f1' },
    { name: 'Bill Payment Charges', commission: todaysIncomes.filter(i => i.category === 'BILL_PAYMENT').reduce((s, i) => s + Number(i.amount || 0), 0) || 150, count: todaysIncomes.filter(i => i.category === 'BILL_PAYMENT').length || 5, color: '#eab308' }
  ];

  // Aggregate stats
  const todayGross = totalIncomes > 0 ? totalIncomes : dailyProfitData[6].grossCommission;
  const todayExpenses = totalExpenses > 0 ? totalExpenses : dailyProfitData[6].expenses;
  const todayProfit = todayGross - todayExpenses;
  const totalWeeklyProfit = dailyProfitData.reduce((sum, d) => sum + d.netProfit, 0);
  const avgDailyProfit = Math.round(totalWeeklyProfit / dailyProfitData.length);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                Profit and Commission Analytics
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Branch: <span className="text-indigo-400 font-semibold">{activeBranch.name}</span> | Daily commission earnings, shop expenses and net profit
              </p>
            </div>
          </div>
        </div>

        {/* Timeframe Chips */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewTimeframe('7DAYS')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewTimeframe === '7DAYS'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Past 7 Days Trend
          </button>
          <button
            onClick={() => setViewTimeframe('MONTH')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewTimeframe === 'MONTH'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Summary
          </button>
        </div>
      </div>

      {/* 4 Top Profit KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-emerald-500/30 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Today's Net Profit
            </span>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
              +{formatINR(todayProfit)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              After ₹{todayExpenses} daily expenses
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-indigo-500/30 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Gross Commissions
            </span>
            <div className="text-2xl font-black font-mono text-indigo-300 mt-1">
              +{formatINR(todayGross)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              DMT + AEPS transaction fees
            </div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-rose-500/30 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Shop Expenses
            </span>
            <div className="text-2xl font-black font-mono text-rose-400 mt-1">
              -{formatINR(todayExpenses)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Tea, Stationery, WiFi & Bills
            </div>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-sky-500/30 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              7-Day Total Profit
            </span>
            <div className="text-2xl font-black font-mono text-sky-400 mt-1">
              +{formatINR(totalWeeklyProfit)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Avg ₹{avgDailyProfit}/day profit
            </div>
          </div>
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Day-by-Day Net Profit Trend Line & Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Daily Net Profit Trend
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Gross Commissions earned vs Net Profit after shop expenses
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              Growing ↗
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyProfitData} margin={{ top: 10, right: 15, left: -15, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickFormatter={(val) => `₹${val}`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-2xl text-xs space-y-1">
                          <div className="font-bold text-white text-sm">{d.date}</div>
                          <div className="font-mono text-indigo-400">Gross Commission: +{formatINR(d.grossCommission)}</div>
                          <div className="font-mono text-rose-400">Shop Expenses: -{formatINR(d.expenses)}</div>
                          <div className="font-mono text-emerald-400 font-extrabold pt-1 border-t border-slate-800">
                            Net Daily Profit: +{formatINR(d.netProfit)}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="top"
                  height={36}
                  wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                />
                <Line
                  type="monotone"
                  dataKey="grossCommission"
                  name="Gross Commission"
                  stroke="#818cf8"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#818cf8' }}
                />
                <Line
                  type="monotone"
                  dataKey="netProfit"
                  name="Net Profit"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 5, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Portal-wise Commission Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Commission by Service
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Which Money Transfer portal generated the highest commissions
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/30">
              Spice Money #1
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={portalCommissionData} margin={{ top: 10, right: 15, left: -15, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" fontSize={10} tickFormatter={(val) => `₹${val}`} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-2xl text-xs space-y-1">
                          <div className="font-bold text-white text-sm">{d.name}</div>
                          <div className="font-mono text-emerald-400 font-bold">
                            Commission: +{formatINR(d.commission)}
                          </div>
                          <div className="text-slate-400 text-[11px]">{d.count} Successful Transactions</div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="commission" radius={[6, 6, 0, 0]}>
                  {portalCommissionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Daily Volume vs Profit Insight Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
          7-Day Volume and Profit
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/60">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3 text-right">DMT Transfer Volume</th>
                <th className="py-2.5 px-3 text-right">AEPS Withdrawal Volume</th>
                <th className="py-2.5 px-3 text-right">Gross Commission</th>
                <th className="py-2.5 px-3 text-right">Expenses Deducted</th>
                <th className="py-2.5 px-3 text-right">Net Daily Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {dailyProfitData.slice().reverse().map((row, idx) => (
                <tr key={row.date} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-white">{row.date}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">{formatINR(row.dmtVolume)}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-300">{formatINR(row.aepsVolume)}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-indigo-400">+{formatINR(row.grossCommission)}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-rose-400">-{formatINR(row.expenses)}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-black text-sm text-emerald-400">+{formatINR(row.netProfit)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
