import React, { useState, useEffect } from 'react';
import { useHisab } from '../../context/HisabContext';
import {
  CreditCard,
  Plus,
  CheckCircle2,
  X
} from 'lucide-react';

export const AddPortalModal = ({ isOpen, onClose }) => {
  const { addPortal, showToast, activePortals } = useHisab();
  const [addedCount, setAddedCount] = useState(0);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    opening: '',
    minBalance: 2000
  });

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        document.getElementById('new-portal-name-input')?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (addAnother = false) => {
    if (!formData.name.trim()) {
      showToast('Enter the portal name', 'error');
      const inputName = document.getElementById('new-portal-name-input');
      if (inputName) inputName.focus();
      return;
    }

    addPortal({
      name: formData.name.trim(),
      code: formData.code.trim() || `ID-${Math.floor(1000 + Math.random() * 9000)}`,
      opening: Number(formData.opening || 0),
      inAmount: 0,
      outAmount: 0,
      minBalance: Number(formData.minBalance || 2000),
      color: '#6366f1'
    });

    setAddedCount(prev => prev + 1);

    if (addAnother) {
      setFormData({
        name: '',
        code: '',
        opening: '',
        minBalance: 2000
      });
      showToast(`✅ Portal #${activePortals.length + 1} added. Enter the next one.`, 'success');
      setTimeout(() => {
        const inputName = document.getElementById('new-portal-name-input');
        if (inputName) {
          inputName.focus();
          inputName.select();
        }
      }, 50);
    } else {
      showToast(`✅  "${formData.name}" added.`, 'success');
      onClose();
    }
  };

  const handleKeyDown = (e, nextFieldId, isFinal = false) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (isFinal) {
        handleSave(true);
      } else {
        const nextEl = document.getElementById(nextFieldId);
        if (nextEl) {
          nextEl.focus();
          if (typeof nextEl.select === 'function') nextEl.select();
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-scaleIn">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-600/15 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Add portal / BC ID</span>
                {addedCount > 0 && (
                  <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/30">
                    +{addedCount} Added
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Press Enter to move to the next field
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body - Clean Form Fields with Enter Key Navigation */}
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Portal name *
              </label>
              <input
                id="new-portal-name-input"
                name="portal_name_no_autofill"
                type="text"
                required
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
                placeholder="e.g. Spice Money / PayNearby"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, 'new-portal-code-input')}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Agent ID / code / PIN
              </label>
              <input
                id="new-portal-code-input"
                name="portal_code_no_autofill"
                type="text"
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
                placeholder="e.g. SM-984321 / PIN-1234"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, 'new-portal-opening-input')}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Opening balance (₹)
              </label>
              <input
                id="new-portal-opening-input"
                name="portal_opening_no_autofill"
                type="number"
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
                placeholder="e.g. 25000"
                value={formData.opening}
                onChange={(e) => setFormData({ ...formData, opening: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, 'new-portal-alert-input')}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Low-balance alert (₹)
              </label>
              <input
                id="new-portal-alert-input"
                name="portal_alert_no_autofill"
                type="number"
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
                data-lpignore="true"
                data-1p-ignore="true"
                data-form-type="other"
                placeholder="e.g. 2000"
                value={formData.minBalance}
                onChange={(e) => setFormData({ ...formData, minBalance: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, null, true)}
                className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-mono font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 flex flex-wrap items-center justify-between gap-2.5">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Portals added: <strong className="text-slate-900 dark:text-white">{activePortals.length}</strong>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => handleSave(true)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 text-amber-300 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer border border-amber-500/30"
              title="Save and add the next portal (Enter does the same)"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Save & Add Next</span>
            </button>

            <button
              type="button"
              onClick={() => handleSave(false)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Save & Done</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
