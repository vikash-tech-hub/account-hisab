import React, { useState, useMemo } from 'react';
import { Modal } from '../common/Modal';
import { useHisab } from '../../context/HisabContext';
import { formatINR, formatDate, formatTime } from '../../utils/formatters';
import { generateCustomerWhatsAppUrl } from '../../utils/exportUtils';
import { Badge } from '../common/Badge';
import {
  Phone,
  MapPin,
  Share2,
  PlusCircle,
  MinusCircle,
  History
} from 'lucide-react';

export const CustomerDetailModal = ({ customer, isOpen, onClose, onQuickTransaction }) => {
  const { allTransactions, activeBranch, addTransaction } = useHisab();
  const [quickAmount, setQuickAmount] = useState('');
  const [quickRemark, setQuickRemark] = useState('');

  const customerTransactions = useMemo(() => {
    if (!customer) return [];
    return allTransactions.filter(tx => tx.customerId === customer.id);
  }, [customer, allTransactions]);

  if (!customer) return null;

  const netBalance = (customer.totalJama || 0) - (customer.totalLiya || 0);
  const isUdhar = netBalance < 0; // Customer owes Kendra
  const isAdvance = netBalance > 0; // Kendra owes customer
  const isSettled = netBalance === 0;

  const handleQuickEntry = (type) => {
    const amount = Number(quickAmount);
    if (!amount || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    addTransaction({
      type,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      amount,
      commission: 0,
      remark: quickRemark || (type === 'JAMA' ? 'Direct Khata Cash Deposit' : 'Direct Khata Cash Withdrawal / Udhar')
    });

    setQuickAmount('');
    setQuickRemark('');
  };

  const whatsappUrl = generateCustomerWhatsAppUrl(
    customer,
    customerTransactions,
    activeBranch.name
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={customer.name}
      subtitle={`Account ID: ${customer.id} | ${customer.reference || 'Regular Customer'}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        
        {/* Customer Profile Header */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-xs text-slate-400">
              {customer.phone && (
                <div className="flex items-center gap-1 font-mono text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{customer.phone}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{customer.address}</span>
                </div>
              )}
            </div>

            <div className="text-xs text-slate-400">
              Account Opened: {formatDate(customer.createdDate || new Date())}
            </div>
          </div>

          {/* WhatsApp Share Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Send WhatsApp Statement</span>
          </a>
        </div>

        {/* Net Balance Status Banner */}
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between ${
            isUdhar
              ? 'bg-rose-950/40 border-rose-500/40 text-rose-300'
              : isAdvance
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-950 border-slate-800 text-slate-300'
          }`}
        >
          <div>
            <div className="text-xs uppercase font-bold tracking-wider opacity-80">
              Net Khata Balance
            </div>
            <div className="text-2xl font-extrabold font-mono mt-0.5">
              {formatINR(Math.abs(netBalance))}
            </div>
          </div>

          <div>
            {isUdhar ? (
              <Badge variant="danger" size="md">
                ⚠️ Pending Due (To Receive)
              </Badge>
            ) : isAdvance ? (
              <Badge variant="success" size="md">
                ✅ Advance Balance (To Give)
              </Badge>
            ) : (
              <Badge variant="default" size="md">
                ✓ Account Settled (Nil)
              </Badge>
            )}
          </div>
        </div>

        {/* Quick Payment Entry in Khata */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Quick Khata Entry
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                ₹
              </span>
              <input
                type="number"
                min="1"
                placeholder="Amount"
                value={quickAmount}
                onChange={(e) => setQuickAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <input
              type="text"
              placeholder="Remark / Purpose (e.g. Cash Settlement)"
              value={quickRemark}
              onChange={(e) => setQuickRemark(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickEntry('JAMA')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Deposit</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickEntry('LIYA')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors"
              >
                <MinusCircle className="w-4 h-4" />
                <span>- Withdraw</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statement / Passbook History */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
            <div className="flex items-center gap-1.5">
              <History className="w-4 h-4 text-indigo-400" />
              <span>Passbook Statement & Transaction History</span>
            </div>
            <span>{customerTransactions.length} Total Entries</span>
          </div>

          <div className="bg-slate-950/80 rounded-2xl border border-slate-800 overflow-hidden max-h-60 overflow-y-auto">
            {customerTransactions.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No transactions recorded for this customer yet.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Date / Time</th>
                    <th className="py-2.5 px-3">Type & Remark</th>
                    <th className="py-2.5 px-3 text-right">Deposit (+)</th>
                    <th className="py-2.5 px-3 text-right">Withdrawal (-)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {customerTransactions.map((tx) => {
                    const isJama = tx.type === 'JAMA' || tx.type === 'DMT';
                    const isLiya = tx.type === 'LIYA' || tx.type === 'AEPS';

                    return (
                      <tr key={tx.id} className="hover:bg-slate-900/40">
                        <td className="py-2 px-3 whitespace-nowrap text-slate-400 font-mono">
                          {formatDate(tx.date)} {formatTime(tx.time)}
                        </td>
                        <td className="py-2 px-3">
                          <span className="font-semibold text-white mr-1.5">
                            {tx.type}
                          </span>
                          <span className="text-slate-400 text-[11px]">
                            {tx.remark || '-'}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-semibold text-emerald-400 whitespace-nowrap">
                          {isJama ? `+${formatINR(tx.amount)}` : '-'}
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-semibold text-rose-400 whitespace-nowrap">
                          {isLiya ? `-${formatINR(tx.amount)}` : '-'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </Modal>
  );
};
