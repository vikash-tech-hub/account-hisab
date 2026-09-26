import React, { useState } from 'react';
import { useHisab } from '../../context/HisabContext';
import { Building2, X, Plus, Store, User, Phone, MapPin, Wallet, Landmark } from 'lucide-react';

export const AddBranchModal = ({ isOpen, onClose }) => {
  const { addBranch, branches } = useHisab();

  const [formData, setFormData] = useState({
    name: '',
    code: `JSK-0${branches.length + 1}`,
    manager: '',
    phone: '',
    address: '',
    cashOpening: '25000',
    bankOpening: '50000',
    spiceOpening: '15000',
    paynearbyOpening: '20000'
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    addBranch({
      name: formData.name.trim(),
      code: formData.code.trim() || `JSK-0${branches.length + 1}`,
      manager: formData.manager.trim() || 'Operator',
      phone: formData.phone.trim(),
      address: formData.address.trim(),
      cashOpening: Number(formData.cashOpening) || 0,
      bankOpening: Number(formData.bankOpening) || 0,
      spiceOpening: Number(formData.spiceOpening) || 0,
      paynearbyOpening: Number(formData.paynearbyOpening) || 0
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Create New Shop / Branch</h3>
              <p className="text-xs text-slate-400">Add a shop or branch and keep its books separate</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Shop Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Shop / branch name <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="e.g. Bus Stand Kendra, Market Branch 3"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
              />
            </div>
          </div>

          {/* Code & Manager */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Branch code
              </label>
              <input
                type="text"
                placeholder="JSK-03"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Manager / operator
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Suresh Kumar"
                  value={formData.manager}
                  onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Contact & Address */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Phone number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Location / address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Near Bus Stand"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Initial Balances Section */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <span>Opening balances for the new shop</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Cash in hand (₹)
                </label>
                <div className="relative">
                  <Wallet className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    value={formData.cashOpening}
                    onChange={(e) => setFormData({ ...formData, cashOpening: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-emerald-400 font-mono text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Bank A/C Opening (₹)
                </label>
                <div className="relative">
                  <Landmark className="w-4 h-4 text-sky-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    value={formData.bankOpening}
                    onChange={(e) => setFormData({ ...formData, bankOpening: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sky-400 font-mono text-sm focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Spice Money Opening (₹)
                </label>
                <input
                  type="number"
                  value={formData.spiceOpening}
                  onChange={(e) => setFormData({ ...formData, spiceOpening: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-mono text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  PayNearby Opening (₹)
                </label>
                <input
                  type="number"
                  value={formData.paynearbyOpening}
                  onChange={(e) => setFormData({ ...formData, paynearbyOpening: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-amber-400 font-mono text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Note: All 10 standard portals (CSC, Fino, Airtel, Rapipay, etc.) will be automatically created with full daily tracking.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create shop and open accounts</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
