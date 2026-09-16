import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useHisab } from '../../context/HisabContext';

export const AddPortalModal = ({ isOpen, onClose }) => {
  const { addPortal, selectedBranchId } = useHisab();

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    operator: '',
    color: '#6366f1',
    minBalance: 3000,
    openingBalance: 10000,
    distributorName: '',
    loginUrl: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.code) {
      alert('Please enter the portal name and agent code.');
      return;
    }

    addPortal(selectedBranchId, formData);
    onClose();
  };

  const presetColors = [
    '#f97316', // Orange
    '#0284c7', // Sky Blue
    '#4f46e5', // Indigo
    '#b91c1c', // Red
    '#059669', // Emerald
    '#8b5cf6', // Purple
    '#0891b2', // Cyan
    '#d97706', // Amber
    '#0d9488', // Teal
    '#ec4899'  // Pink
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Money Transfer Portal ID"
      subtitle="Register a new BC portal or DigiPay ID for this branch"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Portal Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. PayNearby / Fino Bank"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Agent ID / Login Code *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. PN-887612"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Company / Operator
            </label>
            <input
              type="text"
              placeholder="e.g. Nearby Tech Pvt Ltd"
              value={formData.operator}
              onChange={(e) => setFormData({ ...formData, operator: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Distributor Name & Mobile
            </label>
            <input
              type="text"
              placeholder="e.g. Sharma Agency (+91 98899...)"
              value={formData.distributorName}
              onChange={(e) => setFormData({ ...formData, distributorName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Opening Balance (₹)
            </label>
            <input
              type="number"
              value={formData.openingBalance}
              onChange={(e) => setFormData({ ...formData, openingBalance: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Minimum Balance Alert Limit (₹)
            </label>
            <input
              type="number"
              value={formData.minBalance}
              onChange={(e) => setFormData({ ...formData, minBalance: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Portal Tag Color
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            {presetColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className={`w-7 h-7 rounded-full transition-transform ${
                  formData.color === color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
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
            Save Portal
          </button>
        </div>
      </form>
    </Modal>
  );
};
