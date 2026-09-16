import React, { useState } from 'react';
import { useHisab } from '../../context/HisabContext';
import { formatINR } from '../../utils/formatters';
import { CreditCard, Plus, Trash2, Edit2, Check, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export const PortalsPillar = () => {
  const { activePortals, totalPortalsBalance, updatePortalBalance, addPortal, deletePortal } = useHisab();
  const [isAdding, setIsAdding] = useState(false);
  const [newPortalName, setNewPortalName] = useState('');
  const [newPortalCode, setNewPortalCode] = useState('');
  const [newPortalOpening, setNewPortalOpening] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({ opening: '', inAmount: '', outAmount: '' });

  const handleStartEdit = (portal) => {
    setEditingId(portal.id);
    setEditValues({
      opening: portal.opening,
      inAmount: portal.inAmount,
      outAmount: portal.outAmount
    });
  };

  const handleSaveEdit = (portalId) => {
    updatePortalBalance(portalId, {
      opening: Number(editValues.opening || 0),
      inAmount: Number(editValues.inAmount || 0),
      outAmount: Number(editValues.outAmount || 0)
    });
    setEditingId(null);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newPortalName) return;
    addPortal({
      name: newPortalName,
      code: newPortalCode || `ID-${Math.floor(1000 + Math.random() * 9000)}`,
      opening: Number(newPortalOpening || 0),
      inAmount: 0,
      outAmount: 0
    });
    setNewPortalName('');
    setNewPortalCode('');
    setNewPortalOpening('');
    setIsAdding(false);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white tracking-wide">
              1. All Money Transfer Portals Balance (सभी 10 पोर्टल)
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Opening Balance + Today's AEPS/Loads In - DMT Sent Out = Live Closing Portal Balance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Portal Balance</span>
            <span className="text-lg font-black font-mono text-amber-400">
              {formatINR(totalPortalsBalance)}
            </span>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{isAdding ? 'Close' : '+ Add Portal'}</span>
          </button>
        </div>
      </div>

      {/* Inline Add Portal Form */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            type="text"
            required
            placeholder="Portal Name (e.g. Spice Money)"
            value={newPortalName}
            onChange={(e) => setNewPortalName(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          />
          <input
            type="text"
            placeholder="Agent ID Code (e.g. SM-123)"
            value={newPortalCode}
            onChange={(e) => setNewPortalCode(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
          <input
            type="number"
            placeholder="Opening Balance (₹)"
            value={newPortalOpening}
            onChange={(e) => setNewPortalOpening(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg py-2 transition-colors"
          >
            Save Portal
          </button>
        </form>
      )}

      {/* Portals Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-950/60">
              <th className="py-3 px-3">Portal Name & ID</th>
              <th className="py-3 px-3 text-right">Morning Opening (₹)</th>
              <th className="py-3 px-3 text-right">Today's Inflow (+)</th>
              <th className="py-3 px-3 text-right">DMT Outflow (-)</th>
              <th className="py-3 px-3 text-right">Live Closing Balance</th>
              <th className="py-3 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {activePortals.map((portal) => {
              const isEditing = editingId === portal.id;
              const closing = isEditing
                ? Number(editValues.opening || 0) + Number(editValues.inAmount || 0) - Number(editValues.outAmount || 0)
                : Number(portal.opening || 0) + Number(portal.inAmount || 0) - Number(portal.outAmount || 0);

              return (
                <tr key={portal.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: portal.color || '#f97316' }} />
                      <div>
                        <div className="font-bold text-white text-sm">{portal.name}</div>
                        <div className="font-mono text-[10px] text-slate-400">{portal.code}</div>
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
                      <span className="font-mono font-semibold text-slate-300">{formatINR(portal.opening)}</span>
                    )}
                  </td>

                  {/* In Amount */}
                  <td className="py-3 px-3 text-right">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editValues.inAmount}
                        onChange={(e) => setEditValues({ ...editValues, inAmount: e.target.value })}
                        className="w-28 bg-slate-950 border border-emerald-500 rounded px-2 py-1 text-right font-mono font-bold text-emerald-400 focus:outline-none"
                      />
                    ) : (
                      <span className="font-mono font-semibold text-emerald-400">
                        {portal.inAmount > 0 ? `+${formatINR(portal.inAmount)}` : '₹0'}
                      </span>
                    )}
                  </td>

                  {/* Out Amount */}
                  <td className="py-3 px-3 text-right">
                    {isEditing ? (
                      <input
                        type="number"
                        value={editValues.outAmount}
                        onChange={(e) => setEditValues({ ...editValues, outAmount: e.target.value })}
                        className="w-28 bg-slate-950 border border-rose-500 rounded px-2 py-1 text-right font-mono font-bold text-rose-400 focus:outline-none"
                      />
                    ) : (
                      <span className="font-mono font-semibold text-rose-400">
                        {portal.outAmount > 0 ? `-${formatINR(portal.outAmount)}` : '₹0'}
                      </span>
                    )}
                  </td>

                  {/* Live Closing */}
                  <td className="py-3 px-3 text-right">
                    <span className="font-mono font-black text-sm text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                      {formatINR(closing)}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    {isEditing ? (
                      <button
                        onClick={() => handleSaveEdit(portal.id)}
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors"
                        title="Save Changes"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStartEdit(portal)}
                          className="p-1.5 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Quick Edit Balance"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete ${portal.name}?`)) deletePortal(portal.id);
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
