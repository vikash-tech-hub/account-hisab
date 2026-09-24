import React, { useState, useMemo, useEffect } from 'react';
import { useHisab } from '../../context/HisabContext';
import { formatINR, formatDate } from '../../utils/formatters';
import {
  Users,
  UserPlus,
  ArrowDownLeft,
  ArrowUpRight,
  Search,
  BookOpen,
  Trash2,
  Phone,
  Plus,
  X,
  Pin,
  Pencil,
  Calendar,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Scale,
  Sparkles,
  Wallet,
  Printer,
  ChevronRight,
  Filter,
  Columns2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';

export const PeopleMasterPillar = ({ onNext, onPrev }) => {
  const {
    customers,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    toggleCustomerPin,
    customerLedgers,
    activeJamaList,
    activeLiyaList,
    totalJamaAmount,
    totalLiyaAmount,
    addJamaRecord,
    deleteJamaRecord,
    addLiyaRecord,
    deleteLiyaRecord,
    activeBankAccounts,
    activePortals,
    selectedDate,
    showToast,
    triggerLoader
  } = useHisab();

  // Primary View Mode: 'khatabook' (Customer List + Split Ledger) or 'split_all' (Today's Side-by-Side Green/Red)
  const [viewMode, setViewMode] = useState('khatabook'); // 'khatabook' | 'split_all'
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'JAMA_PLUS' | 'UDHAR_MINUS' | 'SETTLED'

  // Selected Customer in KhataBook View
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    customers[0]?.id || customerLedgers[0]?.id || null
  );

  // Add New Party Modal
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);
  const [newCustName, setNewCustName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustCategory, setNewCustCategory] = useState('');
  const [newCustPincode, setNewCustPincode] = useState('');
  const [isPinned, setIsPinned] = useState(false);

  // Edit Party Modal
  const [editingCustomer, setEditingCustomer] = useState(null);

  // Quick Action Modal for Jama / Liya
  const [activeTxModal, setActiveTxModal] = useState(null); // { type: 'JAMA' | 'LIYA', customer: object }
  const [txAmount, setTxAmount] = useState('');
  const [txAccount, setTxAccount] = useState('Cash in Hand');
  const [txNote, setTxNote] = useState('');

  // Fast Inline Inputs for Split View
  const [inlineJamaName, setInlineJamaName] = useState('');
  const [inlineJamaAmount, setInlineJamaAmount] = useState('');
  const [inlineJamaAccount, setInlineJamaAccount] = useState('Cash in Hand');
  const [inlineJamaNote, setInlineJamaNote] = useState('');

  const [inlineLiyaName, setInlineLiyaName] = useState('');
  const [inlineLiyaAmount, setInlineLiyaAmount] = useState('');
  const [inlineLiyaAccount, setInlineLiyaAccount] = useState('Cash in Hand');
  const [inlineLiyaNote, setInlineLiyaNote] = useState('');

  // Filtered Customers for sidebar (Pinned customers float to the top)
  const filteredCustomers = useMemo(() => {
    return customerLedgers
      .filter((c) => {
        const matchSearch =
          !search ||
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          (c.phone && c.phone.includes(search)) ||
          (c.pincode && c.pincode.includes(search)) ||
          (c.category && c.category.toLowerCase().includes(search.toLowerCase()));

        const matchFilter =
          filterType === 'ALL' ||
          (filterType === 'JAMA_PLUS' && c.netBalance > 0) ||
          (filterType === 'UDHAR_MINUS' && c.netBalance < 0) ||
          (filterType === 'SETTLED' && c.netBalance === 0);

        return matchSearch && matchFilter;
      })
      .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
  }, [customerLedgers, search, filterType]);

  // Active selected customer object
  const activeCustomer = useMemo(() => {
    return (
      customerLedgers.find((c) => c.id === selectedCustomerId) ||
      filteredCustomers[0] ||
      customerLedgers[0] ||
      null
    );
  }, [customerLedgers, selectedCustomerId, filteredCustomers]);

  // Smooth auto focus without blinking when modal opens
  useEffect(() => {
    if (isAddingCustomer) {
      const timer = setTimeout(() => {
        document.getElementById('new-cust-name-input')?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isAddingCustomer]);

  useEffect(() => {
    if (editingCustomer) {
      const timer = setTimeout(() => {
        document.getElementById('edit-cust-name-input')?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [editingCustomer?.id]);

  // Handle Add New Customer
  const handleSaveNewCustomer = (e, addAnother = false) => {
    if (e) e.preventDefault();
    if (!newCustName.trim()) {
      showToast('कृपया ग्राहक/पार्टी का नाम भरें', 'error');
      document.getElementById('new-cust-name-input')?.focus();
      return;
    }
    const created = addCustomer({
      name: newCustName.trim(),
      phone: newCustPhone.trim(),
      category: newCustCategory.trim() || 'General Customer',
      pincode: newCustPincode.trim(),
      address: '',
      isPinned: Boolean(isPinned)
    });
    setSelectedCustomerId(created.id);
    showToast(`✅ पार्टी "${created.name}" सफलतापूर्वक जोड़ी गई!`);

    if (addAnother) {
      setNewCustName('');
      setNewCustPhone('');
      setNewCustCategory('');
      setNewCustPincode('');
      setIsPinned(false);
      setTimeout(() => {
        document.getElementById('new-cust-name-input')?.focus();
      }, 50);
    } else {
      setNewCustName('');
      setNewCustPhone('');
      setNewCustCategory('');
      setNewCustPincode('');
      setIsPinned(false);
      setIsAddingCustomer(false);
    }
  };

  // Handle Update Customer
  const handleUpdateCustomer = (e) => {
    if (e) e.preventDefault();
    if (!editingCustomer || !editingCustomer.name.trim()) {
      showToast('कृपया ग्राहक/पार्टी का नाम भरें', 'error');
      return;
    }
    updateCustomer(editingCustomer.id, {
      name: editingCustomer.name.trim(),
      phone: editingCustomer.phone ? editingCustomer.phone.trim() : '',
      category: editingCustomer.category ? editingCustomer.category.trim() : 'General Customer',
      pincode: editingCustomer.pincode ? editingCustomer.pincode.trim() : '',
      isPinned: Boolean(editingCustomer.isPinned)
    });
    setEditingCustomer(null);
  };

  // Handle Transaction Submit (from Modal)
  const handleTxSubmit = (e) => {
    e.preventDefault();
    if (!activeTxModal || !txAmount) return;
    const { type, customer } = activeTxModal;
    if (type === 'JAMA') {
      addJamaRecord({
        name: customer.name,
        phone: customer.phone,
        amount: Number(txAmount),
        portalOrAccount: txAccount,
        note: txNote
      });
    } else {
      addLiyaRecord({
        name: customer.name,
        phone: customer.phone,
        amount: Number(txAmount),
        portalOrAccount: txAccount,
        note: txNote
      });
    }
    setActiveTxModal(null);
    setTxAmount('');
    setTxNote('');
  };

  // Handle Inline Jama Add
  const handleInlineJamaSubmit = (e) => {
    e.preventDefault();
    if (!inlineJamaName || !inlineJamaAmount) return;
    addJamaRecord({
      name: inlineJamaName,
      phone: customers.find((c) => c.name.toLowerCase() === inlineJamaName.toLowerCase())?.phone || '',
      amount: Number(inlineJamaAmount),
      portalOrAccount: inlineJamaAccount,
      note: inlineJamaNote
    });
    setInlineJamaName('');
    setInlineJamaAmount('');
    setInlineJamaNote('');
  };

  // Handle Inline Liya Add
  const handleInlineLiyaSubmit = (e) => {
    e.preventDefault();
    if (!inlineLiyaName || !inlineLiyaAmount) return;
    addLiyaRecord({
      name: inlineLiyaName,
      phone: customers.find((c) => c.name.toLowerCase() === inlineLiyaName.toLowerCase())?.phone || '',
      amount: Number(inlineLiyaAmount),
      portalOrAccount: inlineLiyaAccount,
      note: inlineLiyaNote
    });
    setInlineLiyaName('');
    setInlineLiyaAmount('');
    setInlineLiyaNote('');
  };

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-2xl space-y-4">
      {/* Top Main Banner & Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
                <span>3 & 4. ग्राहक व पार्टी खाता (KhataBook & Split Ledger)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                एक ही पार्टी का जमा (Jama) और दिया (Liya) का हिसाब | साफ़ डिजिटल बहीखाता
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons & View Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
            <button
              onClick={() => setViewMode('khatabook')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'khatabook'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>📖 खाता वही (KhataBook)</span>
            </button>
            <button
              onClick={() => setViewMode('split_all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 ${
                viewMode === 'split_all'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Columns2 className="w-3.5 h-3.5" />
              <span>🟢 🔴 2-Column Split</span>
            </button>
          </div>

          {/* New Customer Button */}
          <button
            onClick={() => setIsAddingCustomer(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ New Party (नया नाम)</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW MODE 1: KHATABOOK HYBRID (Left Customer List + Right 2-Sided Ledger) */}
      {/* ========================================================================= */}
      {viewMode === 'khatabook' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* LEFT COLUMN: Customer Master List (4 Cols) */}
          <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800 rounded-2xl p-3.5 flex flex-col space-y-3 h-[680px]">
            {/* Search and Filters */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search party by name, phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-8 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Filter Chips */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] font-semibold text-slate-400">
                <button
                  onClick={() => setFilterType('ALL')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition-all ${
                    filterType === 'ALL'
                      ? 'bg-slate-800 text-white border border-slate-700 font-bold'
                      : 'hover:bg-slate-900'
                  }`}
                >
                  All ({customerLedgers.length})
                </button>
                <button
                  onClick={() => setFilterType('UDHAR_MINUS')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition-all ${
                    filterType === 'UDHAR_MINUS'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold'
                      : 'hover:bg-slate-900 text-rose-400'
                  }`}
                >
                  🔴 लेना है (उधार)
                </button>
                <button
                  onClick={() => setFilterType('JAMA_PLUS')}
                  className={`px-2.5 py-1 rounded-lg shrink-0 transition-all ${
                    filterType === 'JAMA_PLUS'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold'
                      : 'hover:bg-slate-900 text-emerald-400'
                  }`}
                >
                  🟢 देना है (जमा)
                </button>
              </div>
            </div>

            {/* Customers Scrollable List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {filteredCustomers.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No party found. Click "+ New Party" to add.
                </div>
              ) : (
                filteredCustomers.map((c) => {
                  const isSelected = activeCustomer?.id === c.id;
                  const isAdvance = c.netBalance > 0;
                  const isUdhar = c.netBalance < 0;

                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedCustomerId(c.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 group ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500/60 shadow-md ring-1 ring-indigo-500/40'
                          : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {/* Avatar Initial */}
                        <div
                          className={`w-8 h-8 rounded-xl font-bold flex items-center justify-center text-xs shrink-0 ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : isAdvance
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : isUdhar
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {c.name.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                            <span className="truncate">{c.name}</span>
                            {c.isPinned && (
                              <Pin className="w-3 h-3 text-amber-500 fill-amber-500 rotate-45 shrink-0" title="Pinned Party" />
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCustomer({
                                  id: c.id,
                                  name: c.name,
                                  phone: c.phone || '',
                                  pincode: c.pincode || '',
                                  category: c.category || 'General Customer',
                                  isPinned: Boolean(c.isPinned)
                                });
                              }}
                              className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition-all cursor-pointer opacity-70 group-hover:opacity-100"
                              title="✏️ पार्टी विवरण बदलें (Edit Party)"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono truncate flex items-center gap-1.5">
                            <span>{c.phone || c.category || 'General'}</span>
                            {c.pincode && <span>• PIN: {c.pincode}</span>}
                          </div>
                        </div>
                      </div>

                      {/* Net Balance Pill on List */}
                      <div className="text-right shrink-0">
                        <div
                          className={`text-xs font-mono font-black ${
                            isAdvance ? 'text-emerald-400' : isUdhar ? 'text-rose-400' : 'text-slate-400'
                          }`}
                        >
                          {isAdvance
                            ? `+${formatINR(c.netBalance)}`
                            : isUdhar
                            ? `-${formatINR(Math.abs(c.netBalance))}`
                            : '₹0'}
                        </div>
                        <div className="text-[9px] uppercase font-bold text-slate-500">
                          {isAdvance ? 'जमा है' : isUdhar ? 'उधार' : 'बराबर'}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* List Bottom Quick Add Bar */}
            <button
              onClick={() => setIsAddingCustomer(true)}
              className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-dashed border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>+ Add Customer / Party</span>
            </button>
          </div>

          {/* RIGHT COLUMN: Selected Party's Digital Ledger & Green/Red Breakdown (8 Cols) */}
          <div className="lg:col-span-8 bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4 h-[680px]">
            {activeCustomer ? (
              <>
                {/* 1. Customer Top Profile Hero Banner */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/50 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-indigo-600/30 shrink-0">
                      {activeCustomer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-white">{activeCustomer.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCustomerPin(activeCustomer.id);
                          }}
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 cursor-pointer ${
                            activeCustomer.isPinned
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-amber-400 hover:border-amber-400/40'
                          }`}
                          title={activeCustomer.isPinned ? '📌 Pinned Party (क्लिक करके अनपिन करें)' : '📌 Pin Party (क्लिक करके ऊपर पिन करें)'}
                        >
                          <Pin className={`w-3 h-3 ${activeCustomer.isPinned ? 'fill-amber-400 text-amber-400 rotate-45' : 'rotate-45'}`} />
                          <span>{activeCustomer.isPinned ? 'Pinned' : 'Pin'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingCustomer({
                              id: activeCustomer.id,
                              name: activeCustomer.name,
                              phone: activeCustomer.phone || '',
                              pincode: activeCustomer.pincode || '',
                              category: activeCustomer.category || 'General Customer',
                              isPinned: Boolean(activeCustomer.isPinned)
                            });
                          }}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 cursor-pointer bg-slate-800 text-slate-300 border-slate-700 hover:text-indigo-400 hover:border-indigo-500/50"
                          title="✏️ पार्टी का नाम, फ़ोन, पिन कोड बदलें (Edit Details)"
                        >
                          <Pencil className="w-3 h-3 text-indigo-400" />
                          <span>Edit</span>
                        </button>
                      </div>
                      <div className="text-xs text-slate-400 font-mono flex items-center gap-2 mt-0.5">
                        {activeCustomer.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-500" />
                            {activeCustomer.phone}
                          </span>
                        )}
                        <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-indigo-300">
                          {activeCustomer.category}
                        </span>
                        {activeCustomer.pincode && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                            PIN: {activeCustomer.pincode}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Net Balance Hero Display */}
                  <div className="text-left sm:text-right bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 shrink-0">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {activeCustomer.netBalance > 0
                        ? '🟢 आपको देना है (Customer Deposit)'
                        : activeCustomer.netBalance < 0
                        ? '🔴 आपको लेना है (Customer Udhar)'
                        : '⚪ हिसाब चुकता (Settled)'}
                    </span>
                    <span
                      className={`text-xl font-black font-mono tracking-tight ${
                        activeCustomer.netBalance > 0
                          ? 'text-emerald-400'
                          : activeCustomer.netBalance < 0
                          ? 'text-rose-400'
                          : 'text-slate-300'
                      }`}
                    >
                      {activeCustomer.netBalance > 0
                        ? `+${formatINR(activeCustomer.netBalance)}`
                        : activeCustomer.netBalance < 0
                        ? `-${formatINR(Math.abs(activeCustomer.netBalance))}`
                        : '₹0 (बराबर)'}
                    </span>
                  </div>
                </div>

                {/* 2. Side-by-Side 2-Column Ledger for THIS Customer */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 overflow-hidden min-h-0">
                  
                  {/* Left Box: Customer Jama (+ Received from them) */}
                  <div className="bg-slate-900/60 border border-emerald-500/20 rounded-xl p-3 flex flex-col h-full overflow-hidden">
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20 shrink-0">
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                        <ArrowDownLeft className="w-4 h-4" />
                        <span>जमा (Total Jama: +{formatINR(activeCustomer.totalJama)})</span>
                      </span>
                      <button
                        onClick={() => setActiveTxModal({ type: 'JAMA', customer: activeCustomer })}
                        className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold shadow transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>+ जमा</span>
                      </button>
                    </div>

                    {/* Scrollable Jama List */}
                    <div className="flex-1 overflow-y-auto space-y-1.5 pt-2 pr-1">
                      {activeCustomer.jamaList.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-500">
                          कोई जमा एंट्री नहीं है
                        </div>
                      ) : (
                        activeCustomer.jamaList.map((j) => (
                          <div
                            key={j.id}
                            className="p-2.5 rounded-lg bg-slate-950/90 border border-emerald-950/40 hover:border-emerald-500/30 flex items-start justify-between gap-3 text-xs group transition-all"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-100">
                                  {j.portalOrAccount || 'Cash in Hand'}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                <span>{j.date}</span>
                                {j.time && <span className="text-slate-500">• {j.time}</span>}
                                {j.note && (
                                  <span className="text-emerald-300/80 bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-800/30">
                                    {j.note}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-mono font-black text-emerald-400 text-sm">
                                +{formatINR(j.amount)}
                              </span>
                              <button
                                onClick={() => deleteJamaRecord(j.id)}
                                title="डिलीट करें"
                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 rounded transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Right Box: Customer Liya (- Given to them / Udhar) */}
                  <div className="bg-slate-900/60 border border-rose-500/20 rounded-xl p-3 flex flex-col h-full overflow-hidden">
                    <div className="flex items-center justify-between pb-2 border-b border-rose-500/20 shrink-0">
                      <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                        <ArrowUpRight className="w-4 h-4" />
                        <span>दिया/उधार (Total Liya: -{formatINR(activeCustomer.totalLiya)})</span>
                      </span>
                      <button
                        onClick={() => setActiveTxModal({ type: 'LIYA', customer: activeCustomer })}
                        className="px-2 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold shadow transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>- दिया</span>
                      </button>
                    </div>

                    {/* Scrollable Liya List */}
                    <div className="flex-1 overflow-y-auto space-y-1.5 pt-2 pr-1">
                      {activeCustomer.liyaList.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-500">
                          कोई निकासी / उधार एंट्री नहीं है
                        </div>
                      ) : (
                        activeCustomer.liyaList.map((l) => (
                          <div
                            key={l.id}
                            className="p-2.5 rounded-lg bg-slate-950/90 border border-rose-950/40 hover:border-rose-500/30 flex items-start justify-between gap-3 text-xs group transition-all"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-100">
                                  {l.portalOrAccount || 'Cash in Hand'}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                                <span>{l.date}</span>
                                {l.time && <span className="text-slate-500">• {l.time}</span>}
                                {l.note && (
                                  <span className="text-rose-300/80 bg-rose-950/40 px-1.5 py-0.2 rounded border border-rose-800/30">
                                    {l.note}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="font-mono font-black text-rose-400 text-sm">
                                -{formatINR(l.amount)}
                              </span>
                              <button
                                onClick={() => deleteLiyaRecord(l.id)}
                                title="डिलीट करें"
                                className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 rounded transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                </div>

                {/* 3. Bottom 2 Big KhataBook Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2 shrink-0">
                  <button
                    onClick={() => setActiveTxModal({ type: 'JAMA', customer: activeCustomer })}
                    className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <ArrowDownLeft className="w-5 h-5" />
                    <span>🟢 ₹ मैंने लिए (+ JAMA / जमा)</span>
                  </button>

                  <button
                    onClick={() => setActiveTxModal({ type: 'LIYA', customer: activeCustomer })}
                    className="py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-sm shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <ArrowUpRight className="w-5 h-5" />
                    <span>🔴 ₹ मैंने दिए (- LIYA / दिया)</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 space-y-2">
                <Users className="w-10 h-10 text-slate-600" />
                <p className="text-sm font-semibold">Please select a party from the left list</p>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODE 2: 2-COLUMN GREEN/RED SPLIT (All Customers for Today side-by-side) */}
      {/* ========================================================================= */}
      {viewMode === 'split_all' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 animate-fadeIn">
          
          {/* COLUMN 1: ALL JAMA (GREEN) */}
          <div className="bg-slate-950/80 border border-emerald-500/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-500/20">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                  <ArrowDownLeft className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    3. ग्राहक जमा (Today's Jama Inflow)
                  </h4>
                  <p className="text-[11px] text-slate-400">Cash & DMT received from customers</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-bold block">Total Jama</span>
                <span className="text-base font-mono font-black text-emerald-400">
                  +{formatINR(totalJamaAmount)}
                </span>
              </div>
            </div>

            {/* Quick Inline Row Addition for Jama */}
            <form onSubmit={handleInlineJamaSubmit} className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="text"
                required
                placeholder="Party Name *"
                list="customer-master-list-jama"
                value={inlineJamaName}
                onChange={(e) => setInlineJamaName(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
              <datalist id="customer-master-list-jama">
                {customers.map((c) => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
              <input
                type="number"
                required
                min="1"
                placeholder="Amount (₹) *"
                value={inlineJamaAmount}
                onChange={(e) => setInlineJamaAmount(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
              <select
                value={inlineJamaAccount}
                onChange={(e) => setInlineJamaAccount(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Cash in Hand">Cash in Hand</option>
                {activeBankAccounts.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
                {activePortals.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg py-1.5 transition-colors flex items-center justify-center gap-1 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Jama</span>
              </button>
            </form>

            {/* Jama Entries Table */}
            <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-bold uppercase text-slate-400 bg-slate-900/80 sticky top-0">
                    <th className="py-2 px-2.5">Time</th>
                    <th className="py-2 px-2.5">Customer Name</th>
                    <th className="py-2 px-2.5">Account</th>
                    <th className="py-2 px-2.5 text-right">Jama Amount</th>
                    <th className="py-2 px-2.5 text-right">Del</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {activeJamaList.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/40">
                      <td className="py-2 px-2.5 font-mono text-[11px] text-slate-400">{r.time}</td>
                      <td className="py-2 px-2.5 font-bold text-white">{r.name}</td>
                      <td className="py-2 px-2.5 text-emerald-300/80">{r.portalOrAccount}</td>
                      <td className="py-2 px-2.5 text-right font-mono font-black text-emerald-400">
                        +{formatINR(r.amount)}
                      </td>
                      <td className="py-2 px-2.5 text-right">
                        <button
                          onClick={() => deleteJamaRecord(r.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* COLUMN 2: ALL LIYA (RED) */}
          <div className="bg-slate-950/80 border border-rose-500/30 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-rose-500/20">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                    4. ग्राहक निकासी / उधार (Today's Liya Outflow)
                  </h4>
                  <p className="text-[11px] text-slate-400">AEPS payouts & customer cash withdrawal</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 font-bold block">Total Liya</span>
                <span className="text-base font-mono font-black text-rose-400">
                  -{formatINR(totalLiyaAmount)}
                </span>
              </div>
            </div>

            {/* Quick Inline Row Addition for Liya */}
            <form onSubmit={handleInlineLiyaSubmit} className="p-2.5 rounded-xl bg-slate-900 border border-rose-500/30 grid grid-cols-1 sm:grid-cols-4 gap-2">
              <input
                type="text"
                required
                placeholder="Party Name *"
                list="customer-master-list-liya"
                value={inlineLiyaName}
                onChange={(e) => setInlineLiyaName(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
              />
              <datalist id="customer-master-list-liya">
                {customers.map((c) => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
              <input
                type="number"
                required
                min="1"
                placeholder="Amount (₹) *"
                value={inlineLiyaAmount}
                onChange={(e) => setInlineLiyaAmount(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-rose-400 focus:outline-none focus:border-rose-500"
              />
              <select
                value={inlineLiyaAccount}
                onChange={(e) => setInlineLiyaAccount(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Cash in Hand">Cash in Hand</option>
                {activePortals.map((p) => (
                  <option key={p.id} value={p.name}>{p.name}</option>
                ))}
                {activeBankAccounts.map((b) => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg py-1.5 transition-colors flex items-center justify-center gap-1 shadow"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Liya</span>
              </button>
            </form>

            {/* Liya Entries Table */}
            <div className="overflow-x-auto max-h-[420px] overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[10px] font-bold uppercase text-slate-400 bg-slate-900/80 sticky top-0">
                    <th className="py-2 px-2.5">Time</th>
                    <th className="py-2 px-2.5">Customer Name</th>
                    <th className="py-2 px-2.5">Account</th>
                    <th className="py-2 px-2.5 text-right">Liya Amount</th>
                    <th className="py-2 px-2.5 text-right">Del</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {activeLiyaList.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/40">
                      <td className="py-2 px-2.5 font-mono text-[11px] text-slate-400">{r.time}</td>
                      <td className="py-2 px-2.5 font-bold text-white">{r.name}</td>
                      <td className="py-2 px-2.5 text-rose-300/80">{r.portalOrAccount}</td>
                      <td className="py-2 px-2.5 text-right font-mono font-black text-rose-400">
                        -{formatINR(r.amount)}
                      </td>
                      <td className="py-2 px-2.5 text-right">
                        <button
                          onClick={() => deleteLiyaRecord(r.id)}
                          className="p-1 text-slate-500 hover:text-rose-400 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: ADD NEW PARTY / CUSTOMER TO MASTER                                */}
      {/* ========================================================================= */}
      {isAddingCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-500/40 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 animate-scaleIn">
            {/* Header with Title + Pin Party Button + Close */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>Add New Party to Khata (नया ग्राहक/पार्टी)</span>
              </h3>

              <div className="flex items-center gap-2">
                {/* 📌 Pin Party to Top Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsPinned(!isPinned)}
                  className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                    isPinned
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-400/40'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:text-amber-600 dark:hover:text-amber-400 hover:border-amber-400'
                  }`}
                  title={isPinned ? '📌 Party is Pinned to top of Khata (क्लिक करके अनपिन करें)' : '📌 Pin Party to top of Khata (लिस्ट में सबसे ऊपर रखें)'}
                >
                  <Pin className={`w-4 h-4 ${isPinned ? 'fill-white text-white rotate-45' : 'text-amber-500 rotate-45'}`} />
                  <span>{isPinned ? '📌 Pinned (पिन है)' : '📌 Pin (पिन करें)'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddingCustomer(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={(e) => handleSaveNewCustomer(e, false)} className="space-y-3.5" autoComplete="off">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Customer / Party Full Name *
                </label>
                <input
                  id="new-cust-name-input"
                  name="cust_full_name_no_autofill"
                  type="text"
                  required
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-form-type="other"
                  placeholder="e.g. Ramesh Kumar Verma (Dairy)"
                  value={newCustName}
                  onChange={(e) => setNewCustName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      document.getElementById('new-cust-phone-input')?.focus();
                    }
                  }}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Number (Optional)
                  </label>
                  <input
                    id="new-cust-phone-input"
                    name="cust_phone_no_autofill"
                    type="tel"
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    data-form-type="other"
                    placeholder="e.g. 9839123456"
                    value={newCustPhone}
                    onChange={(e) => setNewCustPhone(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        document.getElementById('new-cust-pin-input')?.focus();
                      }
                    }}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Area PIN Code / पिन कोड
                  </label>
                  <input
                    id="new-cust-pin-input"
                    name="cust_pin_no_autofill"
                    type="text"
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    data-form-type="other"
                    placeholder="e.g. 226001"
                    value={newCustPincode}
                    onChange={(e) => setNewCustPincode(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        document.getElementById('new-cust-category-input')?.focus();
                      }
                    }}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category / Business Type
                </label>
                <input
                  id="new-cust-category-input"
                  name="cust_category_no_autofill"
                  type="text"
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-form-type="other"
                  placeholder="e.g. Dairy / Mobile Shop / Farmer"
                  value={newCustCategory}
                  onChange={(e) => setNewCustCategory(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSaveNewCustomer(null, true);
                    }
                  }}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCustomer(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveNewCustomer(null, true)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition-all shadow-md flex items-center gap-1 cursor-pointer border border-amber-500/30"
                  title="पार्टी सेव करके तुरंत अगला नाम जोड़ें"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>+ Save & Add Next</span>
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  Save Party to Khata
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT PARTY / CUSTOMER DETAILS                                     */}
      {/* ========================================================================= */}
      {editingCustomer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-indigo-500/40 rounded-3xl p-5 max-w-md w-full shadow-2xl space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Pencil className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span>पार्टी विवरण बदलें (Edit Party Details)</span>
              </h3>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCustomer(prev => ({ ...prev, isPinned: !prev.isPinned }))}
                  className={`px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer ${
                    editingCustomer.isPinned
                      ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-400/40'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:text-amber-600 dark:hover:text-amber-400'
                  }`}
                  title={editingCustomer.isPinned ? '📌 Party is Pinned to top' : '📌 Click to Pin'}
                >
                  <Pin className={`w-4 h-4 ${editingCustomer.isPinned ? 'fill-white text-white rotate-45' : 'text-amber-500 rotate-45'}`} />
                  <span>{editingCustomer.isPinned ? '📌 Pinned' : '📌 Pin'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setEditingCustomer(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdateCustomer} className="space-y-3.5" autoComplete="off">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Customer / Party Full Name *
                </label>
                <input
                  id="edit-cust-name-input"
                  name="edit_cust_name"
                  type="text"
                  required
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-form-type="other"
                  placeholder="e.g. Ramesh Kumar Verma"
                  value={editingCustomer.name}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, name: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      document.getElementById('edit-cust-phone-input')?.focus();
                    }
                  }}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mobile Number
                  </label>
                  <input
                    id="edit-cust-phone-input"
                    name="edit_cust_phone"
                    type="tel"
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    data-form-type="other"
                    placeholder="e.g. 9839123456"
                    value={editingCustomer.phone}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, phone: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        document.getElementById('edit-cust-pin-input')?.focus();
                      }
                    }}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Area PIN Code
                  </label>
                  <input
                    id="edit-cust-pin-input"
                    name="edit_cust_pin"
                    type="text"
                    autoComplete="new-password"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                    data-lpignore="true"
                    data-1p-ignore="true"
                    data-form-type="other"
                    placeholder="e.g. 226001"
                    value={editingCustomer.pincode}
                    onChange={(e) => setEditingCustomer({ ...editingCustomer, pincode: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        document.getElementById('edit-cust-category-input')?.focus();
                      }
                    }}
                    className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Category / Business Type
                </label>
                <input
                  id="edit-cust-category-input"
                  name="edit_cust_category"
                  type="text"
                  autoComplete="new-password"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  data-lpignore="true"
                  data-1p-ignore="true"
                  data-form-type="other"
                  placeholder="e.g. Dairy / Mobile Shop / Farmer"
                  value={editingCustomer.category}
                  onChange={(e) => setEditingCustomer({ ...editingCustomer, category: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleUpdateCustomer(e);
                    }
                  }}
                  className="w-full bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`क्या आप वाकई "${editingCustomer.name}" को हटाना चाहते हैं?`)) {
                      deleteCustomer(editingCustomer.id);
                      setEditingCustomer(null);
                    }
                  }}
                  className="px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Party</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingCustomer(null)}
                    className="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>अपडेट सुरक्षित करें (Save Changes)</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: 1-CLICK QUICK JAMA / LIYA ENTRY FOR CUSTOMER                     */}
      {/* ========================================================================= */}
      {activeTxModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4 animate-scaleIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">
                  {activeTxModal.type === 'JAMA'
                    ? '🟢 ₹ मैंने लिए (+ JAMA / जमा)'
                    : '🔴 ₹ मैंने दिए (- LIYA / दिया)'}
                </h3>
                <p className="text-xs text-indigo-300 mt-0.5">
                  Party: <span className="font-bold">{activeTxModal.customer.name}</span>
                </p>
              </div>
              <button
                onClick={() => setActiveTxModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTxSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Amount (रकम ₹) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    ₹
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="Enter amount"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-sm font-mono font-bold text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {activeTxModal.type === 'JAMA' ? 'Received In (खाता/पोर्टल)' : 'Paid Out From (खाता/पोर्टल)'}
                </label>
                <select
                  value={txAccount}
                  onChange={(e) => setTxAccount(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Cash in Hand">Cash in Hand (गल्ला कैश)</option>
                  {activePortals.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} (Portal)
                    </option>
                  ))}
                  {activeBankAccounts.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Remarks / Note
                </label>
                <input
                  type="text"
                  placeholder="e.g. Milk collection / DMT advance"
                  value={txNote}
                  onChange={(e) => setTxNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTxModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 rounded-xl text-white text-xs font-bold shadow-lg ${
                    activeTxModal.type === 'JAMA'
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : 'bg-rose-600 hover:bg-rose-500'
                  }`}
                >
                  {activeTxModal.type === 'JAMA' ? 'Save Jama Entry' : 'Save Liya Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bottom Save & Next Action Footer */}
      <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {onPrev && (
            <button
              onClick={onPrev}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>⬅️ पिछला: बैंक व गल्ला</span>
            </button>
          )}

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div>
              <span>कुल जमा:</span>{' '}
              <span className="font-mono font-bold text-emerald-400">{formatINR(totalJamaAmount)}</span>
            </div>
            <span>•</span>
            <div>
              <span>कुल उधार:</span>{' '}
              <span className="font-mono font-bold text-rose-400">{formatINR(totalLiyaAmount)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 justify-end">
          <button
            onClick={() => {
              triggerLoader({
                duration: 2200,
                subtitle: '👥 ग्राहक खाता बही (Jama/Liya) सुरक्षित हो रही है...',
                onFinish: () => showToast('✅ सभी ग्राहक खाता रिकॉर्ड सुरक्षित हो गए!')
              });
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <span>💾 सेव करें (Save)</span>
          </button>

          <button
            onClick={() => {
              triggerLoader({
                duration: 2400,
                subtitle: '👥 ग्राहक खाता सुरक्षित! 💰 अन्य सेवा कमाई लोड हो रही है...',
                onFinish: () => {
                  showToast('✨ ग्राहक खाता सुरक्षित! अगला: अन्य सेवा कमाई (Income)');
                  if (onNext) onNext();
                }
              });
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer group"
          >
            <span>💾 सेव करें और अगला: अन्य कमाई (Save & Next)</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

    </div>
  );
};
