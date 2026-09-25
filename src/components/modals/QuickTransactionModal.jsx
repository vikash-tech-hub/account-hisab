import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useHisab } from '../../context/HisabContext';
import {
  Send,
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  Building,
  Landmark
} from 'lucide-react';

const TRANSACTION_TYPES = [
  {
    id: 'DMT',
    label: 'DMT Money Transfer',
    desc: 'Customer gives Cash → Sent via Portal',
    icon: Send,
    color: 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
  },
  {
    id: 'AEPS',
    label: 'AEPS Cash Withdrawal',
    desc: 'Biometric in Portal → Cash given to customer',
    icon: CreditCard,
    color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
  },
  {
    id: 'JAMA',
    label: 'Cash Deposit (Jama)',
    desc: 'Customer deposits cash into shop account',
    icon: ArrowDownLeft,
    color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
  },
  {
    id: 'LIYA',
    label: 'Cash Withdrawal (Liya)',
    desc: 'Customer takes cash withdrawal or credit',
    icon: ArrowUpRight,
    color: 'border-rose-500 bg-rose-500/10 text-rose-400'
  },
  {
    id: 'PORTAL_LOAD',
    label: 'Wallet Top-up',
    desc: 'Drawer cash paid to reload portal wallet',
    icon: Building,
    color: 'border-amber-500 bg-amber-500/10 text-amber-400'
  },
  {
    id: 'BANK_WITHDRAWAL',
    label: 'Bank ATM Cash In',
    desc: 'Owner withdraws bank funds into drawer',
    icon: Landmark,
    color: 'border-sky-500 bg-sky-500/10 text-sky-400'
  }
];

export const QuickTransactionModal = ({ isOpen, onClose, initialData = {} }) => {
  const { activePortals, customers, addTransaction, showToast } = useHisab();

  const [type, setType] = useState('DMT');
  const [portalId, setPortalId] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [customCustomerName, setCustomCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [commission, setCommission] = useState('');
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [remark, setRemark] = useState('');

  // Sync initial preset
  useEffect(() => {
    if (initialData.type) setType(initialData.type);
    if (initialData.portalId) setPortalId(initialData.portalId);
    else if (activePortals.length > 0 && !portalId) setPortalId(activePortals[0].id);
  }, [initialData, activePortals]);

  // If customer selected from dropdown, autofill phone and name
  const handleCustomerSelect = (id) => {
    setCustomerId(id);
    if (id) {
      const selectedCust = customers.find(c => c.id === id);
      if (selectedCust) {
        setCustomCustomerName(selectedCust.name);
        setCustomerPhone(selectedCust.phone || '');
      }
    } else {
      setCustomCustomerName('');
      setCustomerPhone('');
    }
  };

  // Auto-calculate suggested commission based on amount & type
  const handleAmountChange = (val) => {
    setAmount(val);
    const num = Number(val);
    if (num > 0) {
      if (type === 'DMT') {
        const suggested = Math.max(25, Math.round(num * 0.005));
        setCommission(String(suggested));
      } else if (type === 'AEPS') {
        const suggested = num >= 5000 ? 30 : num >= 2000 ? 20 : 10;
        setCommission(String(suggested));
      } else {
        setCommission('0');
      }
    } else {
      setCommission('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      if (showToast) showToast('⚠️ कृपया सही रकम दर्ज करें', 'error');
      return;
    }

    addTransaction({
      type,
      portalId: (type === 'DMT' || type === 'AEPS' || type === 'PORTAL_LOAD') ? portalId : null,
      customerId: customerId || null,
      customerName: customCustomerName || (customerId ? customers.find(c => c.id === customerId)?.name : 'Direct Cash Customer'),
      customerPhone,
      amount: numAmount,
      commission: Number(commission || 0),
      beneficiaryName,
      remark
    });

    // Reset form
    setAmount('');
    setCommission('');
    setBeneficiaryName('');
    setRemark('');
    setCustomerId('');
    setCustomCustomerName('');
    setCustomerPhone('');
    onClose();
  };

  const showPortalSelect = type === 'DMT' || type === 'AEPS' || type === 'PORTAL_LOAD';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Daily Transaction Entry"
      subtitle="Log DMT transfer, AEPS withdrawal, deposit, withdrawal or wallet refill"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Transaction Type Selector Grid */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Select Transaction Type *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {TRANSACTION_TYPES.map((t) => {
              const Icon = t.icon;
              const isSelected = type === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    setType(t.id);
                    if (t.id === 'JAMA' || t.id === 'LIYA' || t.id === 'BANK_WITHDRAWAL') {
                      setCommission('0');
                    }
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? `${t.color} ring-2 ring-offset-1 ring-offset-slate-900 ring-indigo-500`
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-bold leading-tight truncate">
                      {t.label}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 leading-snug">
                    {t.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Portal Selector (if DMT or AEPS or Load) */}
        {showPortalSelect && (
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Money Transfer Portal *
            </label>
            <select
              value={portalId}
              onChange={(e) => setPortalId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
            >
              {activePortals.map((portal) => (
                <option key={portal.id} value={portal.id}>
                  {portal.name} ({portal.code})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Amount & Commission Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-emerald-400 mb-1">
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
                placeholder="e.g. 10000"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-sm font-mono font-bold text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-indigo-400 mb-1">
              Commission Earned (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                ₹
              </span>
              <input
                type="number"
                min="0"
                placeholder="0"
                value={commission}
                onChange={(e) => setCommission(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-7 pr-3 py-2 text-sm font-mono font-bold text-indigo-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Customer Link / Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Select Customer Khata
            </label>
            <select
              value={customerId}
              onChange={(e) => handleCustomerSelect(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="">-- Direct Cash Customer / Walk-in --</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.phone ? `(${c.phone})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Customer / Sender Name
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh Verma / Direct Walk-in"
              value={customCustomerName}
              onChange={(e) => setCustomCustomerName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Beneficiary & Remarks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {type === 'DMT' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Beneficiary A/C / Bank Name
              </label>
              <input
                type="text"
                placeholder="e.g. Brijesh Yadav (SBI 3098****)"
                value={beneficiaryName}
                onChange={(e) => setBeneficiaryName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          <div className={type === 'DMT' ? '' : 'sm:col-span-2'}>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Remark / Purpose
            </label>
            <input
              type="text"
              placeholder="e.g. Family maintenance money transfer / AEPS biometric payout"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            Save Transaction
          </button>
        </div>
      </form>
    </Modal>
  );
};
