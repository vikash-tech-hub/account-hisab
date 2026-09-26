import React, { useState } from 'react';
import {
  LayoutDashboard,
  CreditCard,
  Landmark,
  Users,
  Receipt,
  Coins,
  TrendingUp,
  History,
  RotateCcw,
  Building2,
  Layers,
  X,
  Calculator
} from 'lucide-react';
import { useHisab } from '../../context/HisabContext';
import { formatINR } from '../../utils/formatters';
import { ResetModal } from '../common/ResetModal';
import { ThemeToggle } from '../common/ThemeToggle';
import { CashDenominationModal } from '../common/CashDenominationModal';

export const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const {
    resetAllData,
    branches,
    selectedBranchId,
    setSelectedBranchId,
    isAllShops,
    activeBankAccounts,
    setBankAccountDirectTodayBalance,
    showToast
  } = useHisab();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isCashCalcModalOpen, setIsCashCalcModalOpen] = useState(false);

  const navItems = [
    { id: 'all', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'portals', label: 'Portals', icon: CreditCard },
    { id: 'accounts', label: 'Bank and cash', icon: Landmark },
    { id: 'people', label: 'Customers', icon: Users },
    { id: 'incomes', label: 'Income', icon: Coins },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'profit', label: 'Profit', icon: TrendingUp },
    { id: 'history', label: 'History', icon: History }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-900/95 border-r border-slate-800 p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-5">
          {/* Mobile close button */}
          <div className="flex items-center justify-between lg:hidden pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Navigation Menu
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Shop Switcher in Sidebar */}
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Current Active Shop</span>
              <span className="text-indigo-400">{branches.length} Shops</span>
            </div>
            <button
              onClick={() => setSelectedBranchId(isAllShops ? branches[0]?.id : 'ALL_SHOPS')}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors border border-slate-700/50"
            >
              <div className="flex items-center gap-2 truncate">
                {isAllShops ? (
                  <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                ) : (
                  <Building2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                )}
                <span className="truncate">
                  {isAllShops ? '🌟 All Shops Combined' : branches.find(b => b.id === selectedBranchId)?.name || 'Shop'}
                </span>
              </div>
              <span className="text-[10px] text-indigo-400 font-normal shrink-0">Switch</span>
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onClose) onClose();
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-600 text-white font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom utility: Theme Toggle + Reset & Fresh Start */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2 mt-4">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs font-semibold text-slate-300">Theme</span>
            <ThemeToggle variant="compact" />
          </div>

          <button
            onClick={() => setIsCashCalcModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 hover:text-emerald-200 text-xs font-bold border border-emerald-500/30 transition-all cursor-pointer shadow-sm"
          >
            <Calculator className="w-3.5 h-3.5 text-emerald-400" />
            <span>Note calculator</span>
          </button>

          <button
            onClick={() => setIsResetModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 text-xs font-bold border border-rose-500/30 transition-all cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Reset and fresh start</span>
          </button>
        </div>
      </aside>

      {/* Reset Modal */}
      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />

      {/* 💵 Cash Denomination Modal */}
      {isCashCalcModalOpen && (
        <CashDenominationModal
          isOpen={isCashCalcModalOpen}
          onClose={() => setIsCashCalcModalOpen(false)}
          targetAccountName="Cash in Hand"
          onApplyCash={(totalCalculated) => {
            const cashAcc = activeBankAccounts.find(a => a.type === 'CASH') || activeBankAccounts[0];
            if (cashAcc) {
              setBankAccountDirectTodayBalance(cashAcc.id, totalCalculated);
              showToast && showToast(`✅ ₹${formatINR(totalCalculated)} set as cash in hand.`, 'success');
            }
          }}
        />
      )}
    </>
  );
};
