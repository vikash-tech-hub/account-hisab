import React, { useState } from 'react';
import { useHisab } from '../../context/HisabContext';
import { formatINR } from '../../utils/formatters';
import { ArrowDownLeft, Plus, Trash2, Search, UserCheck } from 'lucide-react';

export const JamaPillar = () => {
  const { activeJamaList, totalJamaAmount, addJamaRecord, deleteJamaRecord, activeBankAccounts, activePortals } = useHisab();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [targetAccount, setTargetAccount] = useState('Cash in Hand');
  const [note, setNote] = useState('');
  const [search, setSearch] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    addJamaRecord({
      name,
      phone,
      amount: Number(amount),
      portalOrAccount: targetAccount,
      note
    });
    setName('');
    setPhone('');
    setAmount('');
    setNote('');
  };

  const filtered = activeJamaList.filter(j =>
    !search || j.name.toLowerCase().includes(search.toLowerCase()) || (j.phone && j.phone.includes(search)) || (j.note && j.note.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              3. People's Deposits (लोगों के कितने जमा हैं - Jama)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Log all cash deposits, money transfer funds received, or customer advance payments
          </p>
        </div>

        <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Total People Jama</span>
          <span className="text-lg font-black font-mono text-emerald-400">
            {formatINR(totalJamaAmount)}
          </span>
        </div>
      </div>

      {/* Direct Quick Add Entry Bar */}
      <form onSubmit={handleAdd} className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 grid grid-cols-1 sm:grid-cols-5 gap-3">
        <input
          type="text"
          required
          placeholder="Customer Name (ग्राहक का नाम) *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
        />
        <input
          type="tel"
          placeholder="Mobile No. (फ़ोन नंबर)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
        />
        <div className="relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
          <input
            type="number"
            required
            min="1"
            placeholder="Deposit Amount (जमा रकम) *"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-6 pr-3 py-2 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <select
          value={targetAccount}
          onChange={(e) => setTargetAccount(e.target.value)}
          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
        >
          <option value="Cash in Hand">Cash in Hand (गल्ला नकद)</option>
          {activeBankAccounts.map(b => (
            <option key={b.id} value={b.name}>{b.name}</option>
          ))}
          {activePortals.map(p => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg py-2 transition-colors flex items-center justify-center gap-1.5 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>+ Add Jama (जमा करें)</span>
        </button>
      </form>

      {/* Filter / Search */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search deposited by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {filtered.length} Records
        </span>
      </div>

      {/* Jama Records Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/60">
              <th className="py-2.5 px-3">Time</th>
              <th className="py-2.5 px-3">Customer Name</th>
              <th className="py-2.5 px-3">Mobile No.</th>
              <th className="py-2.5 px-3">Received In (Account/Portal)</th>
              <th className="py-2.5 px-3">Remark / Note</th>
              <th className="py-2.5 px-3 text-right">Jama Amount (₹)</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((r) => (
              <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-2.5 px-3 text-slate-400 font-mono text-[11px]">{r.time}</td>
                <td className="py-2.5 px-3 font-bold text-white text-sm">{r.name}</td>
                <td className="py-2.5 px-3 text-slate-400 font-mono">{r.phone || '-'}</td>
                <td className="py-2.5 px-3 text-emerald-300 font-medium">{r.portalOrAccount}</td>
                <td className="py-2.5 px-3 text-slate-400">{r.note || '-'}</td>
                <td className="py-2.5 px-3 text-right font-mono font-black text-sm text-emerald-400">
                  +{formatINR(r.amount)}
                </td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    onClick={() => deleteJamaRecord(r.id)}
                    className="p-1 text-slate-500 hover:text-rose-400 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
