import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useHisab } from '../../context/HisabContext';

export const AddCustomerModal = ({ isOpen, onClose }) => {
  const { addCustomer, showToast } = useHisab();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    reference: '',
    initialJama: 0,
    initialLiya: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) {
      if (showToast) showToast('Enter the customer name', 'error');
      return;
    }

    addCustomer(formData);
    if (showToast) showToast(`✅ Customer "${formData.name}" added.`, 'success');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add customer account"
      subtitle="Create a ledger account for a regular customer, merchant or party"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Customer Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Ramesh Kumar Verma (Dairy Owner)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Mobile Number (WhatsApp)
            </label>
            <input
              type="tel"
              placeholder="e.g. 9839012345 (10 digits)"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Shop Address / Location
            </label>
            <input
              type="text"
              placeholder="e.g. Main Market, Shop #15"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Business Reference / Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Daily cash transfer service"
              value={formData.reference}
              onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-emerald-400 mb-1">
              Opening Advance Balance (₹)
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={formData.initialJama || ''}
              onChange={(e) => setFormData({ ...formData, initialJama: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-rose-400 mb-1">
              Opening Due Balance (₹)
            </label>
            <input
              type="number"
              min="0"
              placeholder="0"
              value={formData.initialLiya || ''}
              onChange={(e) => setFormData({ ...formData, initialLiya: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
            />
          </div>
        </div>

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
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
          >
            Create customer
          </button>
        </div>
      </form>
    </Modal>
  );
};
