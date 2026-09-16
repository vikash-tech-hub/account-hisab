import React, { useState } from 'react';
import { useHisab } from '../../context/HisabContext';
import { formatINR } from '../../utils/formatters';
import { Badge } from '../common/Badge';
import { AddPortalModal } from './AddPortalModal';
import {
  CreditCard,
  Plus,
  ExternalLink,
  Phone,
  ShieldCheck,
  AlertTriangle,
  Zap
} from 'lucide-react';

export const PortalManager = ({ onOpenTransactionModal }) => {
  const { activePortals, dailySummary, activeBranch } = useHisab();
  const [isAddPortalOpen, setIsAddPortalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-xl font-bold text-white tracking-wide">
              10 Money Transfer Portal Balances
            </h2>
            <Badge variant="primary">
              <CreditCard className="w-3 h-3" />
              {activePortals.length} Active Portals
            </Badge>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Branch: <span className="text-indigo-400 font-semibold">{activeBranch.name}</span> | Live balances, limits, and wallet refills
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800 text-right">
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Portals Liquidity</div>
            <div className="text-lg font-extrabold font-mono text-sky-400">
              {formatINR(dailySummary.totalPortalClosing)}
            </div>
          </div>

          <button
            onClick={() => setIsAddPortalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Portal ID</span>
          </button>
        </div>
      </div>

      {/* Grid of Up to 10 Portals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-5">
        {activePortals.map((portal) => {
          const summary = dailySummary.portalSummaries[portal.id] || {
            opening: 0,
            dmtOut: 0,
            aepsIn: 0,
            loadIn: 0,
            transferOut: 0,
            commission: 0,
            closing: 0
          };

          const isLowBalance = summary.closing < (portal.minBalance || 2000);

          return (
            <div
              key={portal.id}
              className="relative bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between overflow-hidden group"
            >
              {/* Top Accent Line */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{ backgroundColor: portal.color || '#6366f1' }}
              />

              <div>
                {/* Portal Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-sm shrink-0"
                      style={{ backgroundColor: portal.color || '#6366f1' }}
                    >
                      {portal.code.split('-')[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {portal.name}
                      </h4>
                      <div className="text-[11px] font-mono text-slate-400">
                        ID: {portal.code}
                      </div>
                    </div>
                  </div>

                  {isLowBalance ? (
                    <Badge variant="danger" size="xs">
                      <AlertTriangle className="w-3 h-3" />
                      Low Balance
                    </Badge>
                  ) : (
                    <Badge variant="success" size="xs">
                      <ShieldCheck className="w-3 h-3" />
                      Healthy
                    </Badge>
                  )}
                </div>

                {/* Main Balances */}
                <div className="bg-slate-950/70 rounded-xl p-3.5 border border-slate-800/80 mb-4">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[11px] font-semibold text-slate-400">
                      Closing Balance:
                    </span>
                    <span
                      className={`text-xl font-extrabold font-mono ${
                        isLowBalance ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {formatINR(summary.closing)}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span>Morning Opening:</span>
                    <span className="font-mono text-slate-300 font-medium">
                      {formatINR(summary.opening)}
                    </span>
                  </div>
                </div>

                {/* Today's Transactions on this portal */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/50">
                    <div className="text-[10px] text-slate-400">DMT Outflow</div>
                    <div className="font-mono font-bold text-rose-400 mt-0.5">
                      {summary.dmtOut > 0 ? `-${formatINR(summary.dmtOut)}` : '₹0'}
                    </div>
                  </div>

                  <div className="p-2 rounded-lg bg-slate-950/40 border border-slate-800/50">
                    <div className="text-[10px] text-slate-400">AEPS / Loads In</div>
                    <div className="font-mono font-bold text-emerald-400 mt-0.5">
                      {summary.aepsIn + summary.loadIn > 0 ? `+${formatINR(summary.aepsIn + summary.loadIn)}` : '₹0'}
                    </div>
                  </div>
                </div>

                {/* Distributor / Rep info */}
                {portal.distributorName && (
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-4 truncate">
                    <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{portal.distributorName}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() =>
                    onOpenTransactionModal({
                      type: 'PORTAL_LOAD',
                      portalId: portal.id
                    })
                  }
                  className="flex-1 py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Wallet Top-up</span>
                </button>

                {portal.loginUrl && (
                  <a
                    href={portal.loginUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                    title="Open Portal Login"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <AddPortalModal
        isOpen={isAddPortalOpen}
        onClose={() => setIsAddPortalOpen(false)}
      />
    </div>
  );
};
