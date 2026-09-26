import React from 'react';
import { useHisab } from '../../context/HisabContext';
import { formatINR } from '../../utils/formatters';
import { exportTransactionsToCSV, exportCustomerLedgerToCSV } from '../../utils/exportUtils';
import { Badge } from '../common/Badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import {
  BarChart3,
  Printer,
  Download,
  CreditCard,
  Wallet,
  FileSpreadsheet
} from 'lucide-react';

export const AnalyticsView = ({ onOpenPrintModal }) => {
  const {
    dailySummary,
    activePortals,
    portalsMap,
    todaysTransactions,
    customers,
    activeBranch
  } = useHisab();

  // 1. Portal Balances Data for Bar Chart
  const portalChartData = activePortals.map(p => {
    const summary = dailySummary.portalSummaries[p.id];
    return {
      name: p.name.split(' ')[0],
      fullName: p.name,
      balance: summary ? summary.closing : (p.minBalance || 0),
      color: p.color || '#6366f1'
    };
  });

  // 2. Cash Flow Comparison
  const cashFlowData = [
    { name: 'Opening Cash', amount: dailySummary.openingCash, fill: '#6366f1' },
    { name: 'Cash In (Deposits)', amount: dailySummary.totalJamaCash + dailySummary.totalTransfersIn, fill: '#10b981' },
    { name: 'Cash Out (Payouts)', amount: dailySummary.totalLiyaCash + dailySummary.totalTransfersOut, fill: '#f43f5e' },
    { name: 'Closing Cash', amount: dailySummary.expectedClosingCash, fill: '#0ea5e9' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-wide">
              Reports & Financial Analytics
            </h2>
            <Badge variant="purple">
              <BarChart3 className="w-3.5 h-3.5" />
              Live Visual Charts
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Branch: <span className="text-indigo-400 font-semibold">{activeBranch.name}</span> | Daily liquidity shares, cash flow metrics and exports
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onOpenPrintModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all shrink-0"
          >
            <Printer className="w-4 h-4" />
            <span>Print Daily Slip</span>
          </button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: 10 Portal Liquidity Bar Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                10 Portal Liquidity Distribution
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Current closing balance across all Money Transfer portals
              </p>
            </div>
            <CreditCard className="w-5 h-5 text-sky-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={portalChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl shadow-xl text-xs">
                          <div className="font-bold text-white">{data.fullName}</div>
                          <div className="font-mono text-emerald-400 mt-1">
                            Balance: {formatINR(data.balance)}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="balance" radius={[6, 6, 0, 0]}>
                  {portalChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Cash Flow In vs Out */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Daily Cash Movement Analysis
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Comparison of opening, inflows, outflows, and net closing cash
              </p>
            </div>
            <Wallet className="w-5 h-5 text-emerald-400" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickFormatter={(val) => `₹${val / 1000}k`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl shadow-xl text-xs">
                          <div className="font-bold text-white">{data.name}</div>
                          <div className="font-mono font-bold mt-1 text-indigo-400">
                            {formatINR(data.amount)}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                  {cashFlowData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Data Export & Backup Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">Daily Transactions CSV Export</h4>
            <p className="text-xs text-slate-400 mt-1">
              Download all DMT, AEPS, deposit and payout records into an Excel spreadsheet.
            </p>
            <button
              onClick={() => exportTransactionsToCSV(todaysTransactions, portalsMap)}
              className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-indigo-400" />
              <span>Download Transactions CSV</span>
            </button>
          </div>
          <FileSpreadsheet className="w-10 h-10 text-emerald-400 shrink-0 ml-4 opacity-80" />
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white">Customer ledger CSV export</h4>
            <p className="text-xs text-slate-400 mt-1">
              Export all customer accounts, outstanding credit dues, and advance balances.
            </p>
            <button
              onClick={() => exportCustomerLedgerToCSV(customers)}
              className="mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Download customer ledger CSV</span>
            </button>
          </div>
          <FileSpreadsheet className="w-10 h-10 text-sky-400 shrink-0 ml-4 opacity-80" />
        </div>
      </div>
    </div>
  );
};
