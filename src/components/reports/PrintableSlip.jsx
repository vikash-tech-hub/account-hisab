import React from 'react';
import { Modal } from '../common/Modal';
import { useHisab } from '../../context/HisabContext';
import { formatINR, formatDate, formatDateFull } from '../../utils/formatters';
import { generateDailyHisabWhatsAppUrl } from '../../utils/exportUtils';
import { Printer, Share2 } from 'lucide-react';

export const PrintableSlip = ({ isOpen, onClose }) => {
  const {
    activeBranch,
    selectedDate,
    dailySummary,
    activePortals,
    currentRegister
  } = useHisab();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const waUrl = generateDailyHisabWhatsAppUrl(
    activeBranch?.name || 'Maa Vaishno Enterprises',
    selectedDate,
    dailySummary,
    activeBranch?.name || 'Maa Vaishno Enterprises'
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Daily accounts slip"
      subtitle="Printable slip for shop daily records and WhatsApp sharing"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        
        {/* Action Header in Modal */}
        <div className="flex items-center justify-between gap-3 no-print bg-slate-950 p-3 rounded-xl border border-slate-800">
          <span className="text-xs text-slate-400">
            Print in standard A4/A5 format or thermal receipt printer.
          </span>

          <div className="flex gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
          </div>
        </div>

        {/* Printable Slip Container */}
        <div
          id="printable-slip"
          className="bg-white text-slate-900 p-6 rounded-2xl shadow-xl border border-slate-300 font-sans space-y-4 print-page"
        >
          {/* Slip Header */}
          <div className="text-center pb-3 border-b-2 border-slate-900 space-y-1">
            <h2 className="text-xl font-extrabold uppercase tracking-wide text-slate-900">
              {activeBranch.name}
            </h2>
            <p className="text-xs font-semibold text-slate-700">
              Branch Code: {activeBranch.code} | Manager: {activeBranch.manager}
            </p>
            <p className="text-[11px] text-slate-600">
              {activeBranch.address} | Phone: {activeBranch.phone}
            </p>
            <div className="inline-block bg-slate-900 text-white text-xs font-bold px-3 py-0.5 rounded-full mt-1">
              DAILY ACCOUNTS STATEMENT AND CLOSING SLIP
            </div>
          </div>

          {/* Date Row */}
          <div className="flex justify-between text-xs font-semibold border-b border-dashed border-slate-400 pb-2">
            <div>
              <span>Date: </span>
              <span className="font-bold">{formatDate(selectedDate)} ({formatDateFull(selectedDate)})</span>
            </div>
            <div>
              <span>Generated On: </span>
              <span className="font-bold">{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          {/* Cash Summary Section */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider bg-slate-100 p-1.5 rounded text-slate-800">
              1. Cash In Hand Reconciliation
            </div>

            <table className="w-full text-xs">
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-1 text-slate-700">Morning Opening Cash:</td>
                  <td className="py-1 text-right font-mono font-bold">{formatINR(dailySummary.openingCash)}</td>
                </tr>
                <tr>
                  <td className="py-1 text-emerald-800 font-medium">(+) Customer cash deposits:</td>
                  <td className="py-1 text-right font-mono font-bold text-emerald-700">+{formatINR(dailySummary.totalJamaCash)}</td>
                </tr>
                <tr>
                  <td className="py-1 text-emerald-800 font-medium">(+) Bank ATM Cash Withdrawals:</td>
                  <td className="py-1 text-right font-mono font-bold text-emerald-700">+{formatINR(dailySummary.totalTransfersIn)}</td>
                </tr>
                <tr>
                  <td className="py-1 text-rose-800 font-medium">(−) AEPS cash payouts to customers:</td>
                  <td className="py-1 text-right font-mono font-bold text-rose-700">-{formatINR(dailySummary.totalLiyaCash)}</td>
                </tr>
                <tr>
                  <td className="py-1 text-rose-800 font-medium">(-) Wallet Top-up Paid (Distributor Cash):</td>
                  <td className="py-1 text-right font-mono font-bold text-rose-700">-{formatINR(dailySummary.totalTransfersOut)}</td>
                </tr>
                <tr>
                  <td className="py-1 text-rose-800 font-medium">(-) Daily Shop Expenses:</td>
                  <td className="py-1 text-right font-mono font-bold text-rose-700">-{formatINR(dailySummary.totalExpenses)}</td>
                </tr>
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-900">
                  <td className="py-1.5 text-slate-900 font-extrabold text-sm">
                    = Expected Closing Cash in Drawer:
                  </td>
                  <td className="py-1.5 text-right font-mono font-extrabold text-sm text-slate-900">
                    {formatINR(dailySummary.expectedClosingCash)}
                  </td>
                </tr>
                {currentRegister.closingCashCounted > 0 && (
                  <tr>
                    <td className="py-1 text-slate-700">Physical Counted Cash:</td>
                    <td className="py-1 text-right font-mono font-bold">{formatINR(currentRegister.closingCashCounted)}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 10 Portals Breakdown Section */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider bg-slate-100 p-1.5 rounded text-slate-800 flex justify-between">
              <span>2. 10 Money Transfer Portals Closing Balances</span>
              <span className="font-mono font-bold">Total: {formatINR(dailySummary.totalPortalClosing)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {activePortals.map((p) => {
                const pSummary = dailySummary.portalSummaries[p.id];
                return (
                  <div key={p.id} className="flex justify-between border-b border-slate-200 py-0.5">
                    <span className="text-slate-700 truncate mr-1">{p.name}:</span>
                    <span className="font-mono font-bold text-slate-900">
                      {formatINR(pSummary ? pSummary.closing : p.minBalance)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Profit & Commission */}
          <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-xs">
            <div>
              <span className="text-slate-600">Total Commissions Earned: </span>
              <span className="font-mono font-bold text-emerald-800">+{formatINR(dailySummary.totalCommissionEarned)}</span>
            </div>
            <div>
              <span className="font-bold text-slate-900">Net Daily Profit: </span>
              <span className="font-mono font-extrabold text-sm text-slate-900">
                {formatINR(dailySummary.netDailyProfit)}
              </span>
            </div>
          </div>

          {/* Signature Footer */}
          <div className="pt-8 flex justify-between text-[11px] text-slate-600 border-t border-dashed border-slate-400">
            <div>Authorized Operator Signature</div>
            <div>Branch Manager Stamp</div>
          </div>
        </div>

      </div>
    </Modal>
  );
};
