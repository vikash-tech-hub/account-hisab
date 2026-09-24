import React, { useState } from 'react';
import {
  LayoutDashboard,
  CreditCard,
  Landmark,
  Users,
  Receipt,
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  History,
  RotateCcw,
  Sparkles,
  Building2,
  Layers,
  X
} from 'lucide-react';
import { useHisab } from '../../context/HisabContext';
import { ResetModal } from '../common/ResetModal';
import { ThemeToggle } from '../common/ThemeToggle';

export const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const {
    resetAllData,
    branches,
    selectedBranchId,
    setSelectedBranchId,
    isAllShops
  } = useHisab();

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const navItems = [
    {
      id: 'all',
      label: 'Complete Daily Hisab',
      sublabel: 'All 4 Pillars on One Screen',
      icon: LayoutDashboard,
      badge: 'All-in-1'
    },
    {
      id: 'portals',
      label: '1. All Portals Balance',
      sublabel: 'Spice, PayNearby, Fino & More',
      icon: CreditCard,
      badge: '10 IDs'
    },
    {
      id: 'accounts',
      label: '2. Bank Accounts & Cash',
      sublabel: 'SBI, HDFC & Drawer Cash',
      icon: Landmark,
      badge: 'Cash/Bank'
    },
    {
      id: 'people',
      label: '3 & 4. Party & People Master',
      sublabel: 'Customer Ledger (Jama & Liya)',
      icon: Users,
      badge: 'Master'
    },
    {
      id: 'incomes',
      label: 'Other Income & Services',
      sublabel: 'AEPS, DMT, PF, Photo Copy (कमाई)',
      icon: Coins,
      badge: '+₹ Kamai'
    },
    {
      id: 'expenses',
      label: 'Shop Expenses & Spend',
      sublabel: 'Tea, Paper, Bills (दुकान खर्च)',
      icon: Receipt,
      badge: 'Kharcha'
    },
    {
      id: 'profit',
      label: 'Profit & Earnings Chart',
      sublabel: 'Daily Profit & Commission Analytics',
      icon: TrendingUp,
      badge: '₹ Profit'
    },
    {
      id: 'history',
      label: 'Daily History Archive',
      sublabel: 'View Past Days & Previous Records',
      icon: History,
      badge: 'Past Data'
    }
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
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all duration-200 group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 font-semibold'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold leading-tight truncate">
                        {item.label}
                      </div>
                      <div
                        className={`text-[10px] truncate leading-tight mt-0.5 ${
                          isActive ? 'text-indigo-100' : 'text-slate-400'
                        }`}
                      >
                        {item.sublabel}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 uppercase tracking-wider ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom utility: Theme Toggle + Reset & Fresh Start */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2 mt-4">
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs font-semibold text-slate-300">थीम मोड (Theme)</span>
            <ThemeToggle variant="compact" />
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>4-Pillar Daily Tally Active</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1 leading-snug">
              Portals + Bank & Cash + Liya - Jama = Net Hisab
            </p>
          </div>

          <button
            onClick={() => setIsResetModalOpen(true)}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 text-xs font-bold border border-rose-500/30 transition-all cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>🔄 रीसेट व फ्रेश शुरुआत (Reset)</span>
          </button>
        </div>
      </aside>

      {/* Reset Modal */}
      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />
    </>
  );
};
