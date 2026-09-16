import React from 'react';
import { Modal } from '../common/Modal';
import { useHisab } from '../../context/HisabContext';
import { formatINR, formatDate, formatDateFull } from '../../utils/formatters';
import { Printer, CheckCircle2 } from 'lucide-react';

export const QuickHisabParchi = ({ isOpen, onClose }) => {
  const {
    activeBranch,
    selectedDate,
    activePortals,
    activeBankAccounts,
    activeJamaList,
    activeLiyaList,
    totalPortalsBalance,
    totalBankBalance,
    totalJamaAmount,
    totalLiyaAmount,
    netTotalCapital
  } = useHisab();

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Daily 4-Pillar Hisab Statement Slip"
      subtitle="Complete summary of Portals, Bank Accounts, Jama and Liya"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        <div className="flex justify-end no-print">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Slip</span>
          </button>
        </div>

        <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-xl border border-slate-300 space-y-4 print-page font-sans text-xs">
          {/* Header */}
          <div className="text-center pb-3 border-b-2 border-slate-900">
            <h2 className="text-xl font-black uppercase text-slate-900">{activeBranch.name}</h2>
            <div className="text-xs text-slate-600">Branch: {activeBranch.code} | Manager: {activeBranch.manager}</div>
            <div className="mt-1 font-bold bg-slate-900 text-white px-3 py-0.5 rounded-full inline-block text-[11px]">
              DAILY 4-PILLAR HISAB REGISTER SLIP
            </div>
            <div className="mt-1 font-semibold text-slate-700">Date: {formatDate(selectedDate)} ({formatDateFull(selectedDate)})</div>
          </div>

          {/* 4 Pillars Summary Grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-2.5 rounded-lg border border-slate-300 bg-slate-50">
              <div className="font-bold text-slate-600 uppercase text-[10px]">1. Total 10 Portals Balance</div>
              <div className="text-base font-mono font-black text-slate-900 mt-0.5">{formatINR(totalPortalsBalance)}</div>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-300 bg-slate-50">
              <div className="font-bold text-slate-600 uppercase text-[10px]">2. Total Bank & Cash in Hand</div>
              <div className="text-base font-mono font-black text-slate-900 mt-0.5">{formatINR(totalBankBalance)}</div>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-300 bg-slate-50">
              <div className="font-bold text-slate-600 uppercase text-[10px]">3. Total People Deposited (Jama)</div>
              <div className="text-base font-mono font-black text-emerald-800 mt-0.5">+{formatINR(totalJamaAmount)}</div>
            </div>
            <div className="p-2.5 rounded-lg border border-slate-300 bg-slate-50">
              <div className="font-bold text-slate-600 uppercase text-[10px]">4. Total People Took (Liya/Due)</div>
              <div className="text-base font-mono font-black text-rose-800 mt-0.5">-{formatINR(totalLiyaAmount)}</div>
            </div>
          </div>

          {/* Grand Net Total */}
          <div className="p-3 bg-slate-100 rounded-xl border border-slate-900 flex justify-between items-center text-sm font-bold">
            <span className="uppercase text-slate-900">Total Net Available Hisab / Capital:</span>
            <span className="font-mono text-base font-black text-slate-900">{formatINR(netTotalCapital)}</span>
          </div>

          {/* 10 Portals List */}
          <div className="pt-2 border-t border-slate-200">
            <div className="font-bold uppercase text-[11px] text-slate-700 mb-1.5">Portals Breakdown ({activePortals.length}):</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px]">
              {activePortals.map(p => {
                const closing = (Number(p.opening) || 0) + (Number(p.inAmount) || 0) - (Number(p.outAmount) || 0);
                return (
                  <div key={p.id} className="flex justify-between border-b border-dashed border-slate-200 py-0.5">
                    <span className="text-slate-700 truncate mr-1">{p.name}:</span>
                    <span className="font-mono font-bold text-slate-900">{formatINR(closing)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Signatures */}
          <div className="pt-8 flex justify-between text-[11px] text-slate-600 border-t border-dashed border-slate-400">
            <div>Operator Signature</div>
            <div>Manager Stamp</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
