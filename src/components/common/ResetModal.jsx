import React, { useState } from 'react';
import { useHisab } from '../../context/HisabContext';
import {
  RotateCcw,
  Trash2,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Store,
  Layers,
  X,
  Database
} from 'lucide-react';

export const ResetModal = ({ isOpen, onClose }) => {
  const {
    clearAllDataToFresh,
    resetToDemoData,
    branches,
    selectedBranchId,
    setSelectedBranchId,
    activeBranch,
    showToast,
    triggerLoader
  } = useHisab();

  const [selectedOption, setSelectedOption] = useState('fresh'); // 'fresh' | 'demo' | 'clear_branch'

  if (!isOpen) return null;

  const handleExecuteReset = () => {
    if (selectedOption === 'fresh') {
      triggerLoader({
        duration: 2500,
        subtitle: 'Clearing old data and preparing a fresh account...',
        onFinish: () => {
          clearAllDataToFresh();
          showToast('Fresh account ready. Enter your live balances.', 'success');
          onClose();
        }
      });
    } else if (selectedOption === 'demo') {
      triggerLoader({
        duration: 2500,
        subtitle: 'Loading demo data...',
        onFinish: () => {
          resetToDemoData();
          showToast('Demo data restored.');
          onClose();
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scaleIn">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>Reset and fresh start</span>
              </h3>
              <p className="text-xs text-slate-400">
                Choose a fresh start or restore demo data
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Options */}
        <div className="p-5 space-y-3.5">
          
          {/* Option 1: 100% Fresh Start (Zero/Blank Balance) */}
          <label
            onClick={() => setSelectedOption('fresh')}
            className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
              selectedOption === 'fresh'
                ? 'bg-emerald-950/40 border-emerald-500/80 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-950/40'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="reset_type"
                checked={selectedOption === 'fresh'}
                onChange={() => setSelectedOption('fresh')}
                className="mt-1 accent-emerald-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-emerald-300">
                    Start a fresh account (recommended)
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2 py-0.5 rounded-md border border-emerald-500/30 uppercase">
                    Your real books
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Old test entries, deposits, withdrawals, income, and expenses will be cleared. Portals and bank accounts will start at ₹0 so you can enter today’s real balances.
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-[10px] text-slate-400 font-medium">
                  <span className="bg-slate-800/80 px-2 py-0.5 rounded text-emerald-400">10 portals at ₹0</span>
                  <span className="bg-slate-800/80 px-2 py-0.5 rounded text-emerald-400">Bank and cash at ₹0</span>
                  <span className="bg-slate-800/80 px-2 py-0.5 rounded text-emerald-400">Empty customer ledger</span>
                </div>
              </div>
            </div>
          </label>

          {/* Option 2: Reset Demo Data */}
          <label
            onClick={() => setSelectedOption('demo')}
            className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
              selectedOption === 'demo'
                ? 'bg-indigo-950/40 border-indigo-500/80 ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-950/40'
                : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="radio"
                name="reset_type"
                checked={selectedOption === 'demo'}
                onChange={() => setSelectedOption('demo')}
                className="mt-1 accent-indigo-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-indigo-300">
                    Load sample demo data
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Use this to preview a filled sample book (Spice Money, SBI, Ramesh Dairy, and more).
                </p>
              </div>
            </div>
          </label>

          {/* LocalStorage Note & Multi-Shop info */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-start gap-2.5 text-xs text-slate-400">
            <Database className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-slate-200 font-bold">Running 2–3 shops?</span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Use <strong>"+ Add Shop"</strong> to add separate shops. Each shop keeps its own saved data and you can switch with one click.
              </p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleExecuteReset}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
              selectedOption === 'fresh'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>
              {selectedOption === 'fresh' ? 'Start fresh account' : 'Load demo data'}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
