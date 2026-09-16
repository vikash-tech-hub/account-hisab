import React, { useState, useMemo } from 'react';
import { useHisab } from '../../context/HisabContext';
import { formatINR } from '../../utils/formatters';
import { exportCustomerLedgerToCSV, generateCustomerWhatsAppUrl } from '../../utils/exportUtils';
import { Badge } from '../common/Badge';
import { AddCustomerModal } from './AddCustomerModal';
import { CustomerDetailModal } from './CustomerDetailModal';
import {
  Users,
  Search,
  Plus,
  Download,
  Share2,
  Phone,
  ArrowDownLeft,
  ArrowUpRight,
  BookOpen
} from 'lucide-react';

export const CustomerLedger = ({ onOpenTransactionModal }) => {
  const { customers, activeBranch } = useHisab();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, LENE_HAIN (Due), DENE_HAIN (Advance), SETTLED
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [selectedCustomerForDetail, setSelectedCustomerForDetail] = useState(null);

  // Filter logic
  const filteredCustomers = useMemo(() => {
    return customers.filter(c => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        c.name.toLowerCase().includes(q) ||
        (c.phone && c.phone.includes(q)) ||
        (c.reference && c.reference.toLowerCase().includes(q));

      const net = (c.totalJama || 0) - (c.totalLiya || 0);
      let matchesStatus = true;

      if (filterStatus === 'LENE_HAIN') {
        matchesStatus = net < 0; // Customer owes Kendra
      } else if (filterStatus === 'DENE_HAIN') {
        matchesStatus = net > 0; // Kendra owes customer
      } else if (filterStatus === 'SETTLED') {
        matchesStatus = net === 0;
      }

      return matchesSearch && matchesStatus;
    });
  }, [customers, searchQuery, filterStatus]);

  // Aggregate totals
  const totalLeneHain = useMemo(() => {
    return customers.reduce((sum, c) => {
      const net = (c.totalJama || 0) - (c.totalLiya || 0);
      return net < 0 ? sum + Math.abs(net) : sum;
    }, 0);
  }, [customers]);

  const totalDeneHain = useMemo(() => {
    return customers.reduce((sum, c) => {
      const net = (c.totalJama || 0) - (c.totalLiya || 0);
      return net > 0 ? sum + net : sum;
    }, 0);
  }, [customers]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-wide">
              Customer Khata & Ledger
            </h2>
            <Badge variant="purple">
              <Users className="w-3.5 h-3.5" />
              {customers.length} Registered Accounts
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Branch: <span className="text-indigo-400 font-semibold">{activeBranch.name}</span> | Manage customer balances, deposits, credit dues and statements
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => exportCustomerLedgerToCSV(customers)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Khata CSV</span>
          </button>

          <button
            onClick={() => setIsAddCustomerOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Customer Khata</span>
          </button>
        </div>
      </div>

      {/* Summary Aggregate Cards for Khata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-rose-500/20 p-4 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-rose-400">
              Total Market Credit Dues (To Receive)
            </div>
            <div className="text-2xl font-extrabold font-mono text-rose-400 mt-1">
              {formatINR(totalLeneHain)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Outstanding due from customers
            </div>
          </div>
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-emerald-500/20 p-4 rounded-2xl shadow-lg flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Total Advance Credit (To Give)
            </div>
            <div className="text-2xl font-extrabold font-mono text-emerald-400 mt-1">
              {formatINR(totalDeneHain)}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Advance cash deposited by customers
            </div>
          </div>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl shadow-lg flex items-center justify-between sm:col-span-2 lg:col-span-1">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              WhatsApp Statement Share
            </div>
            <div className="text-xs text-slate-300 mt-1">
              Share instant balance statement receipts directly to customer WhatsApp.
            </div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
            <Share2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer by name, mobile or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {[
            { id: 'ALL', label: `All Accounts (${customers.length})` },
            { id: 'LENE_HAIN', label: 'Pending Dues' },
            { id: 'DENE_HAIN', label: 'Advance Balance' },
            { id: 'SETTLED', label: 'Settled (Nil)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-all ${
                filterStatus === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Customers List / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-4">
        {filteredCustomers.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-slate-900/80 border border-slate-800 rounded-2xl">
            <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-300">
              No Customers Found
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Try searching with different terms or create a new customer account.
            </p>
          </div>
        ) : (
          filteredCustomers.map((cust) => {
            const net = (cust.totalJama || 0) - (cust.totalLiya || 0);
            const isUdhar = net < 0;
            const isAdvance = net > 0;
            const isSettled = net === 0;

            const waLink = generateCustomerWhatsAppUrl(cust, [], activeBranch.name);

            return (
              <div
                key={cust.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 shadow-xl transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                        {cust.name}
                      </h4>
                      {cust.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mt-0.5">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{cust.phone}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      {isUdhar ? (
                        <Badge variant="danger" size="xs">
                          Pending Due
                        </Badge>
                      ) : isAdvance ? (
                        <Badge variant="success" size="xs">
                          Advance
                        </Badge>
                      ) : (
                        <Badge variant="default" size="xs">
                          Settled
                        </Badge>
                      )}
                    </div>
                  </div>

                  {cust.reference && (
                    <div className="text-[11px] text-slate-400 italic truncate mb-3">
                      {cust.reference}
                    </div>
                  )}

                  {/* Balance Display */}
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 mb-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[11px] font-semibold text-slate-400">Net Account Balance:</span>
                      <span
                        className={`text-lg font-mono font-extrabold ${
                          isUdhar
                            ? 'text-rose-400'
                            : isAdvance
                            ? 'text-emerald-400'
                            : 'text-slate-300'
                        }`}
                      >
                        {formatINR(Math.abs(net))}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 mt-2 border-t border-slate-800/60 text-slate-400">
                      <div>
                        Total Deposits: <span className="font-mono text-emerald-400 font-semibold">{formatINR(cust.totalJama || 0)}</span>
                      </div>
                      <div className="text-right">
                        Total Payouts: <span className="font-mono text-rose-400 font-semibold">{formatINR(cust.totalLiya || 0)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center gap-2">
                  <button
                    onClick={() => setSelectedCustomerForDetail(cust)}
                    className="flex-1 py-1.5 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Passbook Ledger</span>
                  </button>

                  <a
                    href={waLink}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 transition-colors"
                    title="Send statement via WhatsApp"
                  >
                    <Share2 className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isAddCustomerOpen}
        onClose={() => setIsAddCustomerOpen(false)}
      />

      {/* Customer Detail & Statement Modal */}
      <CustomerDetailModal
        customer={selectedCustomerForDetail}
        isOpen={!!selectedCustomerForDetail}
        onClose={() => setSelectedCustomerForDetail(null)}
        onQuickTransaction={onOpenTransactionModal}
      />
    </div>
  );
};
