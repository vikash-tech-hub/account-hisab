import React, { useState } from 'react';
import { useHisab } from '../../context/HisabContext';
import { formatINR } from '../../utils/formatters';
import { Landmark, Plus, Trash2, Edit2, Check, Wallet } from 'lucide-react';

export const BankAccountsPillar = () => {
  const { activeBankAccounts, totalBankBalance, updateBankAccount, addBankAccount, deleteBankAccount } = useHisab();
  const [isAdding, setIsAdding] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccType, setNewAccType] = useState('BANK');
  const [newAccOpening, setNewAccOpening] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ opening: '', deposits: '', withdrawals: '' });

  const handleStartEdit = (acc) => {
    setEditingId(acc.id);
    setEditValues({
      opening: acc.opening,
      deposits: acc.deposits,
      withdrawals: acc.withdrawals
    });
  };

  const handleSaveEdit = (accId) => {
    updateBankAccount(accId, {
      opening: Number(editValues.opening || 0),
      deposits: Number(editValues.deposits || 0),
      withdrawals: Number(editValues.withdrawals || 0)
    });
    setEditingId(null);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newAccName) return;
    addBankAccount({
      name: newAccName,
      type: newAccType,
      opening: Number(newAccOpening || 0),
      deposits: 0,
      withdrawals: 0
    });
    setNewAccName('');
    setNewAccOpening('');
    setIsAdding(false);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-sky-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              2. Bank Accounts & Cash in Hand Balance (बैंक व गल्ला कैश)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Opening Balance + Today's Deposits - Today's Withdrawals = Net Available Bank & Cash Balance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Bank & Cash</span>
            <span className="text-lg font-black font-mono text-sky-400">
              {formatINR(totalBankBalance)}
            </span>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{isAdding ? 'Close' : '+ Add Account'}</span>
          </button>
        </div>
      </div>

      {/* Inline Add Account Form */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            required
            placeholder="Account / Bank Name (e.g. SBI Main Current)"
            value={newAccName}
            onChange={(e) => setNewAccName(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
          <select
            value={newAccType}
            onChange={(e) => setNewAccType(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="BANK">Bank Account (बैंक)</option>
            <option value="CASH">Physical Cash Drawer (गल्ला कैश)</option>
          </select>
          <input
            type="number"
            placeholder="Opening Balance (₹)"
            value={newAccOpening}
            onChange={(e) => setNewAccOpening(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg py-2 transition-colors"
          >
            Save Account
          </button>
        </form>
      )}

      {/* Bank Accounts Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/60">
              <th className="py-3 px-3">Account Name & Type</th>
              <th className="py-3 px-3 text-right">Morning Opening (₹)</th>
              <th className="py-3 px-3 text-right">Deposits In (+)</th>
              <th className="py-3 px-3 text-right">Withdrawals Out (-)</th>
              <th className="py-3 px-3 text-right">Net Available Balance</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {activeBankAccounts.map((acc) => {
              const isEditing = editingId === acc.id;
              const closing = isEditing
                ? Number(editValues.opening || 0) + Number(editValues.deposits || 0) - Number(editValues.withdrawals || 0)
                : Number(acc.opening || 0) + Number(acc.deposits || 0) - Number(acc.withdrawals || 0);

              const isCash = acc.type === 'CASH';

              return (
                <tr key={acc.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-lg ${isCash ? 'bg-emerald-500/20 text-emerald-400' : 'bg-sky-500/20 text-sky-400'}`}>
                        {isCash ? <Wallet className="w-4 h-4" /> : <Landmark className="w-4 h-4" />}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">{acc.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono uppercase">{acc.type}</div>
                      </div>
                    </div>
                  </td>

                  {/* Opening */}
                  <td className="py-3 px-3 text-right">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editValues.opening}
                        onChange={(e) => setEditValues({ ...editValues, opening: e.target.value })}
                        className="w-28 bg-slate-950 border border-indigo-500 rounded px-2 py-1 text-right font-mono font-bold text-white focus:outline-none"
                      />
                    ) : (
                      <span className="font-mono font-semibold text-slate-300">{formatINR(acc.opening)}</span>
                    )}
                  </td>

                  {/* Deposits In */}
                  <td className="py-3 px-3 text-right">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editValues.deposits}
                        onChange={(e) => setEditValues({ ...editValues, deposits: e.target.value })}
                        className="w-28 bg-slate-950 border border-emerald-500 rounded px-2 py-1 text-right font-mono font-bold text-emerald-400 focus:outline-none"
                      />
                    ) : (
                      <span className="font-mono font-semibold text-emerald-400">
                        {acc.deposits > 0 ? `+${formatINR(acc.deposits)}` : '₹0'}
                      </span>
                    )}
                  </td>

                  {/* Withdrawals Out */}
                  <td className="py-3 px-3 text-right">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editValues.withdrawals}
                        onChange={(e) => setEditValues({ ...editValues, withdrawals: e.target.value })}
                        className="w-28 bg-slate-950 border border-rose-500 rounded px-2 py-1 text-right font-mono font-bold text-rose-400 focus:outline-none"
                      />
                    ) : (
                      <span className="font-mono font-semibold text-rose-400">
                        {acc.withdrawals > 0 ? `-${formatINR(acc.withdrawals)}` : '₹0'}
                      </span>
                    )}
                  </td>

                  {/* Net Closing */}
                  <td className="py-3 px-3 text-right">
                    <span className="font-mono font-black text-sm text-sky-400 bg-sky-500/10 px-2.5 py-1 rounded-lg border border-sky-500/20">
                      {formatINR(closing)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    {isEditing ? (
                      <button
                        onClick={() => handleSaveEdit(acc.id)}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                        title="Save Changes"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStartEdit(acc)}
                          className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Quick Edit Balance"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${acc.name}?`)) deleteBankAccount(acc.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
