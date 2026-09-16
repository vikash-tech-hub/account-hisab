import React, { useState, useMemo } from 'react';
import { useHisab } from '../../context/HisabContext';
import { formatINR, formatTime } from '../../utils/formatters';
import { exportTransactionsToCSV } from '../../utils/exportUtils';
import { Badge } from '../common/Badge';
import {
  Search,
  Filter,
  Download,
  Trash2,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Send,
  CreditCard,
  Building
} from 'lucide-react';

export const QuickTransactionList = ({ onOpenTransactionModal }) => {
  const { todaysTransactions, portalsMap, deleteTransaction } = useHisab();
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = useMemo(() => {
    return todaysTransactions.filter(tx => {
      const matchesType = filterType === 'ALL' || tx.type === filterType;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        (tx.customerName && tx.customerName.toLowerCase().includes(q)) ||
        (tx.customerPhone && tx.customerPhone.includes(q)) ||
        (tx.remark && tx.remark.toLowerCase().includes(q)) ||
        (tx.beneficiaryName && tx.beneficiaryName.toLowerCase().includes(q));

      return matchesType && matchesSearch;
    });
  }, [todaysTransactions, filterType, searchQuery]);

  const getTypeBadge = (type) => {
    switch (type) {
      case 'DMT':
        return (
          <Badge variant="primary" size="xs">
            <Send className="w-3 h-3" />
            DMT Transfer
          </Badge>
        );
      case 'AEPS':
        return (
          <Badge variant="success" size="xs">
            <CreditCard className="w-3 h-3" />
            AEPS Withdrawal
          </Badge>
        );
      case 'JAMA':
        return (
          <Badge variant="success" size="xs">
            <ArrowDownLeft className="w-3 h-3" />
            Cash Deposit (Jama)
          </Badge>
        );
      case 'LIYA':
        return (
          <Badge variant="danger" size="xs">
            <ArrowUpRight className="w-3 h-3" />
            Cash Withdrawal (Liya)
          </Badge>
        );
      case 'PORTAL_LOAD':
        return (
          <Badge variant="warning" size="xs">
            <Building className="w-3 h-3" />
            Wallet Top-up
          </Badge>
        );
      default:
        return <Badge size="xs">{type}</Badge>;
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white tracking-wide">
              Today's Transaction Register
            </h3>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700 font-mono">
              {todaysTransactions.length} Entries
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time log of DMT transfers, AEPS withdrawals, customer deposits and payouts
          </p>
        </div>

        {/* Actions: Search, Filter, Export */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, phone or remark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <button
            onClick={() => exportTransactionsToCSV(todaysTransactions, portalsMap)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            title="Download CSV file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV Export</span>
          </button>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-3 no-scrollbar border-b border-slate-800/60 text-xs">
        {[
          { id: 'ALL', label: 'All Entries' },
          { id: 'DMT', label: 'DMT Transfers' },
          { id: 'AEPS', label: 'AEPS Withdrawals' },
          { id: 'JAMA', label: 'Deposits (Jama)' },
          { id: 'LIYA', label: 'Withdrawals (Liya)' },
          { id: 'PORTAL_LOAD', label: 'Wallet Top-ups' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition-all ${
              filterType === tab.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transactions Table / List */}
      <div className="overflow-x-auto mt-2">
        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 text-slate-500 flex items-center justify-center mx-auto mb-3">
              <Filter className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-300">
              No transactions found
            </p>
            <p className="text-xs text-slate-500 mt-1">
              No transactions have been recorded yet today matching this filter.
            </p>
            <button
              onClick={onOpenTransactionModal}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-lg shadow-indigo-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Transaction</span>
            </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-3">Time / Type</th>
                <th className="py-3 px-3">Customer / Party</th>
                <th className="py-3 px-3">Portal / Mode</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3 text-right">Commission</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {filteredTransactions.map((tx) => {
                const portal = portalsMap[tx.portalId];
                const isCashIn = tx.type === 'DMT' || tx.type === 'JAMA';
                const isCashOut = tx.type === 'AEPS' || tx.type === 'LIYA' || tx.type === 'PORTAL_LOAD';

                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-800/40 transition-colors group"
                  >
                    {/* Time & Type */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-400 text-[11px]">
                          {formatTime(tx.time)}
                        </span>
                        <div>{getTypeBadge(tx.type)}</div>
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="py-3 px-3">
                      <div className="font-semibold text-white">
                        {tx.customerName || 'Direct Cash Customer'}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-xs">
                        {tx.customerPhone && (
                          <span className="font-mono text-slate-400 mr-2">
                            📱 {tx.customerPhone}
                          </span>
                        )}
                        {tx.remark && <span>{tx.remark}</span>}
                      </div>
                    </td>

                    {/* Portal */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {portal ? (
                        <div className="flex items-center gap-1.5">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: portal.color || '#6366f1' }}
                          />
                          <span className="text-slate-200 font-medium">{portal.name}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">Cash in Hand</span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <div
                        className={`font-mono font-bold text-sm ${
                          isCashIn
                            ? 'text-emerald-400'
                            : isCashOut
                            ? 'text-rose-400'
                            : 'text-white'
                        }`}
                      >
                        {isCashIn ? '+' : isCashOut ? '-' : ''}
                        {formatINR(tx.amount)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {isCashIn ? 'Cash In' : 'Cash Out'}
                      </div>
                    </td>

                    {/* Commission */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      {tx.commission > 0 ? (
                        <span className="font-mono font-semibold text-emerald-400">
                          +{formatINR(tx.commission)}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">-</span>
                      )}
                    </td>

                    {/* Delete Action */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => {
                          if (window.confirm('Do you want to delete this transaction record?')) {
                            deleteTransaction(tx.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors opacity-80 group-hover:opacity-100"
                        title="Delete Transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
