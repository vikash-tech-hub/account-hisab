import React, { useState, useEffect } from 'react';
import { useHisab } from '../../context/HisabContext';
import {
  Landmark,
  X,
  Plus,
  Wallet,
  CheckCircle2,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';

const ADMIN_PIN_STORAGE_KEY = 'jsk_v4_admin_pin';
const PIN_ENABLED_STORAGE_KEY = 'jsk_v4_bank_pin_enabled';

export const AddBankAccountModal = ({ isOpen, onClose }) => {
  const { addBankAccount, showToast } = useHisab();

  // Pin Protection Toggle (Pin / Unpin Mode)
  const [isPinEnabled, setIsPinEnabled] = useState(() => {
    const saved = localStorage.getItem(PIN_ENABLED_STORAGE_KEY);
    return saved !== null ? saved === 'true' : false; // Default false (Unpin / No PIN required)
  });

  const [savedPin] = useState(() => {
    return localStorage.getItem(ADMIN_PIN_STORAGE_KEY) || '1234';
  });

  const [enteredPin, setEnteredPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinError, setPinError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    type: 'BANK',
    accountNumber: '',
    opening: ''
  });

  const togglePinSecurity = () => {
    const nextState = !isPinEnabled;
    setIsPinEnabled(nextState);
    localStorage.setItem(PIN_ENABLED_STORAGE_KEY, String(nextState));
    setPinError('');
    showToast(
      nextState ? 'PIN protection on' : 'PIN protection off',
      'info'
    );
  };

  // Auto focus first field on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        document.getElementById('new-acc-name-input')?.focus();
      }, 80);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFieldKeyDown = (e, nextFieldId) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextFieldId) {
        const nextEl = document.getElementById(nextFieldId);
        if (nextEl) {
          nextEl.focus();
          if (nextEl.select) nextEl.select();
        }
      } else {
        handleSubmit(e);
      }
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setPinError('');

    // If PIN is enabled, verify PIN
    if (isPinEnabled) {
      if (!enteredPin) {
        setPinError('Enter the security PIN (default: 1234)');
        document.getElementById('new-acc-pin-input')?.focus();
        return;
      }
      if (enteredPin !== savedPin) {
        setPinError('Wrong PIN. Enter the admin PIN (default: 1234)');
        document.getElementById('new-acc-pin-input')?.focus();
        return;
      }
    }

    if (!formData.name.trim()) {
      showToast('Enter an account or bank name', 'error');
      document.getElementById('new-acc-name-input')?.focus();
      return;
    }

    const displayName = formData.accountNumber.trim()
      ? `${formData.name.trim()} (****${formData.accountNumber.trim().slice(-4)})`
      : formData.name.trim();

    addBankAccount({
      name: displayName,
      type: formData.type,
      opening: Number(formData.opening) || 0,
      deposits: 0,
      withdrawals: 0
    });

    showToast(`✅ Account "${displayName}" added.`, 'success');

    // Reset and close
    setFormData({
      name: '',
      type: 'BANK',
      accountNumber: '',
      opening: ''
    });
    setEnteredPin('');
    setPinError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-sky-500/30 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">+ Add bank or cash account</h3>
                
                {/* 🔒 / 🔓 Interactive PIN & UNPIN Toggle Button */}
                <button
                  type="button"
                  onClick={togglePinSecurity}
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition-all flex items-center gap-1 cursor-pointer ${
                    isPinEnabled
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30 shadow-sm'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700'
                  }`}
                  title="Turn PIN protection on or off"
                >
                  {isPinEnabled ? (
                    <>
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>PIN On</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-3 h-3 text-slate-400" />
                      <span>Unpinned (No PIN)</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-400">Add a bank account or cash drawer</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Account Type */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Account type
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'BANK' })}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                  formData.type === 'BANK'
                    ? 'bg-sky-600/20 border-sky-500 text-sky-300 shadow-md ring-1 ring-sky-500/40'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Landmark className="w-4 h-4 text-sky-400" />
                <div className="text-left">
                  <div>Bank Account</div>
                  <div className="text-[10px] text-slate-400 font-normal">Bank account / Current / Savings</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'CASH' })}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                  formData.type === 'CASH'
                    ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300 shadow-md ring-1 ring-emerald-500/40'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Wallet className="w-4 h-4 text-emerald-400" />
                <div className="text-left">
                  <div>Cash Drawer</div>
                  <div className="text-[10px] text-slate-400 font-normal">Physical cash</div>
                </div>
              </button>
            </div>
          </div>

          {/* Account / Bank Name */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Account or bank name <span className="text-rose-400">*</span>
            </label>
            <input
              id="new-acc-name-input"
              type="text"
              required
              placeholder={formData.type === 'BANK' ? 'e.g. SBI Current A/C, ICICI Settlement' : 'e.g. Shop cash drawer'}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              onKeyDown={(e) => handleFieldKeyDown(e, 'new-acc-number-input')}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
            />
          </div>

          {/* Account Number & Opening Balance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Account number / last 4 digits (optional)
              </label>
              <input
                id="new-acc-number-input"
                type="text"
                placeholder="e.g. 4882 or the full account number"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                onKeyDown={(e) => handleFieldKeyDown(e, 'new-acc-opening-input')}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Opening balance (₹)
              </label>
              <input
                id="new-acc-opening-input"
                type="number"
                placeholder="₹ 0.00"
                value={formData.opening}
                onChange={(e) => setFormData({ ...formData, opening: e.target.value })}
                onKeyDown={(e) => handleFieldKeyDown(e, isPinEnabled ? 'new-acc-pin-input' : null)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono transition-colors font-bold"
              />
            </div>
          </div>

          {/* 🔒 Optional Security PIN Section (Shown only when isPinEnabled is true) */}
          {isPinEnabled && (
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2 animate-fadeIn">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>Owner / admin security PIN <span className="text-rose-400">*</span></span>
                </label>
                <span className="text-[10px] text-amber-400/80 font-mono font-medium">
                  (Default PIN: 1234)
                </span>
              </div>

              <div className="relative">
                <input
                  id="new-acc-pin-input"
                  type={showPin ? 'text' : 'password'}
                  required
                  maxLength="6"
                  placeholder="Enter the 4-digit PIN (1234)"
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    setPinError('');
                  }}
                  onKeyDown={(e) => handleFieldKeyDown(e, null)}
                  className="w-full bg-slate-950 border border-amber-500/50 rounded-xl px-3.5 py-2.5 text-center text-sm font-mono font-bold text-amber-300 placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  title={showPin ? 'Hide PIN' : 'Show PIN'}
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {pinError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400 font-semibold bg-rose-500/10 p-2 rounded-lg border border-rose-500/20 animate-shake">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{pinError}</span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={togglePinSecurity}
              className="text-[11px] font-semibold text-slate-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
            >
              {isPinEnabled ? <Unlock className="w-3.5 h-3.5 text-amber-400" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
              <span>{isPinEnabled ? 'Turn PIN off' : 'Turn PIN on'}</span>
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save account</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
