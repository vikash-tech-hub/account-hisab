import React, { useState } from 'react';
import { useHisab } from '../../context/HisabContext';
import { formatINR } from '../../utils/formatters';
import { AddBranchModal } from '../branches/AddBranchModal';
import { ResetModal } from '../common/ResetModal';
import { ThemeToggle } from '../common/ThemeToggle';
import {
  Building2,
  Calendar,
  Printer,
  ChevronDown,
  Menu,
  Plus,
  Layers,
  Sparkles,
  Store,
  RotateCcw
} from 'lucide-react';

export const Navbar = ({ onOpenPrintModal, onToggleSidebar }) => {
  const {
    branches,
    selectedBranchId,
    setSelectedBranchId,
    activeBranch,
    isAllShops,
    selectedDate,
    setSelectedDate,
    totalPortalsBalance,
    totalBankBalance,
    netTotalCapital
  } = useHisab();

  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-3">
            
            {/* Left: Mobile menu button + Brand + Branch Selector */}
            <div className="flex items-center gap-3">
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Logo */}
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 font-black text-sm tracking-tighter">
                  MVE
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                    Maa Vaishno Enterprises
                    <span className="text-[10px] uppercase tracking-wider bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-md border border-emerald-500/30">
                      4-Pillars
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Portals • Bank Accounts • Jama • Liya
                  </div>
                </div>
              </div>

              {/* Branch Selector Dropdown & Multi-Shop Manager */}
              <div className="relative ml-2 sm:ml-4">
                <button
                  onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                    isAllShops
                      ? 'bg-gradient-to-r from-amber-500/20 to-indigo-500/20 border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/10'
                      : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 text-white'
                  }`}
                >
                  {isAllShops ? (
                    <Layers className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <Building2 className="w-4 h-4 text-indigo-400 shrink-0" />
                  )}
                  <span className="max-w-[140px] sm:max-w-[200px] truncate font-semibold">
                    {activeBranch.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {isBranchDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsBranchDropdownOpen(false)}
                    />
                    <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-20 animate-scaleIn">
                      <div className="px-3 py-1.5 text-[11px] font-semibold uppercase text-slate-400 tracking-wider flex items-center justify-between">
                        <span>Select Shop / View</span>
                        <span className="text-[10px] text-slate-500 font-normal">{branches.length} Shops</span>
                      </div>

                      {/* 1. All Shops Combined Option */}
                      <button
                        onClick={() => {
                          setSelectedBranchId('ALL_SHOPS');
                          setIsBranchDropdownOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 mb-2 ${
                          isAllShops
                            ? 'bg-gradient-to-r from-amber-500/20 to-indigo-500/20 text-white border border-amber-500/40 shadow-sm'
                            : 'hover:bg-slate-800 text-slate-200 border border-slate-800'
                        }`}
                      >
                        <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                          <Layers className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-extrabold text-amber-300 flex items-center gap-1.5">
                            <span>All Shops Combined</span>
                            <span className="text-[9px] bg-amber-500/30 text-amber-200 px-1.5 py-0.2 rounded font-bold">
                              TOTAL
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            सभी दुकानों का कुल हिसाब ({branches.length} Shops)
                          </div>
                        </div>
                      </button>

                      <div className="h-px bg-slate-800 my-1" />

                      {/* 2. Individual Branches */}
                      <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                        {branches.map(branch => {
                          const isSelected = branch.id === selectedBranchId;
                          return (
                            <button
                              key={branch.id}
                              onClick={() => {
                                setSelectedBranchId(branch.id);
                                setIsBranchDropdownOpen(false);
                              }}
                              className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                                isSelected
                                  ? 'bg-indigo-600/20 text-white border border-indigo-500/30'
                                  : 'hover:bg-slate-800 text-slate-300'
                              }`}
                            >
                              <Building2 className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-bold truncate">{branch.name}</div>
                                <div className="text-[10px] text-slate-400 truncate">
                                  {branch.code} • {branch.manager}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* 3. CTA to Add / Create New Shop */}
                      <div className="pt-2 mt-2 border-t border-slate-800">
                        <button
                          onClick={() => {
                            setIsBranchDropdownOpen(false);
                            setIsAddBranchModalOpen(true);
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 border border-indigo-500/30 transition-all"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>+ Create New Shop (नई दुकान जोड़ें)</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Center: Live Quick Tally Summary Pill */}
            <div className="hidden xl:flex items-center gap-4 bg-slate-950/80 border border-slate-800 px-4 py-1.5 rounded-2xl">
              <div className="text-xs">
                <span className="text-slate-400">
                  {isAllShops ? 'All Shops Portals: ' : '10 Portals Total: '}
                </span>
                <span className="font-mono font-bold text-amber-400">
                  {formatINR(totalPortalsBalance)}
                </span>
              </div>
              <div className="h-4 w-px bg-slate-800" />
              <div className="text-xs">
                <span className="text-slate-400">Bank & Cash: </span>
                <span className="font-mono font-bold text-sky-400">
                  {formatINR(totalBankBalance)}
                </span>
              </div>
              <div className="h-4 w-px bg-slate-800" />
              <div className="text-xs">
                <span className="text-slate-400">Net Total Hisab: </span>
                <span className="font-mono font-extrabold text-emerald-400">
                  {formatINR(netTotalCapital)}
                </span>
              </div>
            </div>

            {/* Right: Theme Toggle + Reset Fresh Button + Add Shop CTA + Date Picker & Print CTA */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* ☀️ / 🌙 Light & Dark Theme Toggle Button */}
              <ThemeToggle />

              {/* 🔄 Reset & Fresh Start Button (Exact location of red box) */}
              <button
                onClick={() => setIsResetModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 hover:text-rose-200 text-xs font-bold transition-all shadow-sm cursor-pointer"
                title="नया फ्रेश हिसाब शुरू करें या डेटा रीसेट करें"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">🔄 रीसेट (Reset)</span>
                <span className="sm:hidden">रीसेट</span>
              </button>

              <button
                onClick={() => setIsAddBranchModalOpen(true)}
                className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-indigo-300 text-xs font-semibold hover:text-white transition-all cursor-pointer"
                title="नई दुकान / नया खाता प्रोफाइल जोड़ें"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Shop</span>
              </button>

              <div className="flex items-center bg-slate-800/80 border border-slate-700/80 rounded-xl px-2.5 py-1.5">
                <Calendar className="w-4 h-4 text-indigo-400 mr-2 shrink-0" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-white text-xs font-medium focus:outline-none cursor-pointer"
                />
              </div>

              <button
                onClick={onOpenPrintModal}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Slip</span>
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* Add New Shop Modal */}
      <AddBranchModal
        isOpen={isAddBranchModalOpen}
        onClose={() => setIsAddBranchModalOpen(false)}
      />

      {/* 🔄 Reset & Fresh Start Modal */}
      <ResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />
    </>
  );
};
