import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  INITIAL_BRANCHES,
  INITIAL_CUSTOMERS,
  INITIAL_DAILY_PORTALS,
  INITIAL_DAILY_ACCOUNTS,
  INITIAL_JAMA_RECORDS,
  INITIAL_LIYA_RECORDS,
  INITIAL_EXPENSES,
  INITIAL_INCOMES
} from '../data/initialData';
import { getTodayDateString, getOffsetDateString, getPreviousDateString } from '../utils/formatters';

const HisabContext = createContext(null);

const STORAGE_KEYS = {
  BRANCHES: 'jsk_v4_branches',
  CUSTOMERS: 'jsk_v4_customers',
  DAILY_PORTALS: 'jsk_v4_daily_portals',
  DAILY_ACCOUNTS: 'jsk_v4_daily_accounts',
  JAMA: 'jsk_v4_jama',
  LIYA: 'jsk_v4_liya',
  EXPENSES: 'jsk_v4_expenses',
  INCOMES: 'jsk_v4_incomes',
  SELECTED_BRANCH: 'jsk_v4_selected_branch',
  SELECTED_DATE: 'jsk_v4_selected_date',
  SUMMARY_VIEW_MODE: 'jsk_v4_summary_view_mode',
  THEME: 'jsk_v4_theme'
};

export const HisabProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved || 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      document.body.classList.add('dark');
      document.body.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      document.body.classList.remove('dark');
      document.body.classList.add('light');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [branches, setBranches] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BRANCHES);
    return saved ? JSON.parse(saved) : INITIAL_BRANCHES;
  });

  const [customers, setCustomers] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
  });

  const [selectedBranchId, setSelectedBranchId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_BRANCH);
    return saved || 'branch-1';
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_DATE);
    // If the saved date was the legacy hardcoded date (2026-09-16), reset to current today
    if (saved && saved !== '2026-09-16') {
      return saved;
    }
    return getTodayDateString();
  });

  const [dailyPortals, setDailyPortals] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DAILY_PORTALS);
    return saved ? JSON.parse(saved) : INITIAL_DAILY_PORTALS;
  });

  const [dailyAccounts, setDailyAccounts] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DAILY_ACCOUNTS);
    return saved ? JSON.parse(saved) : INITIAL_DAILY_ACCOUNTS;
  });

  const [jamaRecords, setJamaRecords] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.JAMA);
    return saved ? JSON.parse(saved) : INITIAL_JAMA_RECORDS;
  });

  const [liyaRecords, setLiyaRecords] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LIYA);
    return saved ? JSON.parse(saved) : INITIAL_LIYA_RECORDS;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES);
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [incomes, setIncomes] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INCOMES);
    return saved ? JSON.parse(saved) : INITIAL_INCOMES;
  });

  const [summaryViewMode, setSummaryViewMode] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUMMARY_VIEW_MODE);
    return saved || 'daily';
  });

  const [toast, setToast] = useState(null);
  const [loaderState, setLoaderState] = useState({
    isOpen: true,
    duration: 2600,
    subtitle: '4-Pillars Daily Hisab लोड हो रहा है...'
  });

  const triggerLoader = ({ duration = 2400, subtitle = 'डेटा सुरक्षित हो रहा है...', onFinish } = {}) => {
    setLoaderState({
      isOpen: true,
      duration,
      subtitle,
      onFinish
    });
  };

  const closeLoader = () => {
    if (loaderState.onFinish) {
      try {
        loaderState.onFinish();
      } catch (e) {
        console.error(e);
      }
    }
    setLoaderState(prev => ({ ...prev, isOpen: false, onFinish: null }));
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DAILY_PORTALS, JSON.stringify(dailyPortals));
  }, [dailyPortals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DAILY_ACCOUNTS, JSON.stringify(dailyAccounts));
  }, [dailyAccounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.JAMA, JSON.stringify(jamaRecords));
  }, [jamaRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LIYA, JSON.stringify(liyaRecords));
  }, [liyaRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INCOMES, JSON.stringify(incomes));
  }, [incomes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_BRANCH, selectedBranchId);
  }, [selectedBranchId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_DATE, selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUMMARY_VIEW_MODE, summaryViewMode);
  }, [summaryViewMode]);

  const isAllShops = selectedBranchId === 'ALL_SHOPS';

  // Current active branch object
  const activeBranch = useMemo(() => {
    if (isAllShops) {
      return {
        id: 'ALL_SHOPS',
        name: 'All Shops Combined (सभी दुकानें)',
        code: `ALL (${branches.length} Shops)`,
        manager: 'Consolidated Hisab'
      };
    }
    return branches.find(b => b.id === selectedBranchId) || branches[0];
  }, [branches, selectedBranchId, isAllShops]);

  // Current Date Key `${branchId}_${date}`
  const currentDateKey = `${selectedBranchId}_${selectedDate}`;

  // Helper: Find previous date in YYYY-MM-DD format
  const getPreviousDateString = (dateStr) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() - 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Active Portals (If All Shops, combine all branches' portals)
  const activePortals = useMemo(() => {
    if (isAllShops) {
      const combined = [];
      branches.forEach(b => {
        const key = `${b.id}_${selectedDate}`;
        const bPortals = dailyPortals[key] || dailyPortals[`${b.id}_2026-09-16`] || [];
        bPortals.forEach(p => {
          combined.push({
            ...p,
            name: `${p.name} (${b.name.split(' ')[0]})`,
            branchName: b.name
          });
        });
      });
      return combined;
    }

    if (dailyPortals[currentDateKey]) {
      return dailyPortals[currentDateKey];
    }

    // Auto Carry-Forward: If today doesn't exist, check yesterday's closing
    const yesterdayDate = getPreviousDateString(selectedDate);
    const yesterdayKey = `${selectedBranchId}_${yesterdayDate}`;
    const yesterdayPortals = dailyPortals[yesterdayKey];

    if (yesterdayPortals && yesterdayPortals.length > 0) {
      return yesterdayPortals.map(p => {
        const yesterdayClosing = (Number(p.opening) || 0) + (Number(p.inAmount) || 0) - (Number(p.outAmount) || 0);
        return {
          ...p,
          opening: yesterdayClosing,
          inAmount: 0,
          outAmount: 0
        };
      });
    }

    const todayKeyStr = getTodayDateString();
    const fallbackTemplate = dailyPortals[`${selectedBranchId}_${todayKeyStr}`] || INITIAL_DAILY_PORTALS[`branch-1_${todayKeyStr}`] || Object.values(INITIAL_DAILY_PORTALS)[0];
    return (fallbackTemplate || []).map(p => ({
      ...p,
      opening: p.opening || 10000,
      inAmount: 0,
      outAmount: 0
    }));
  }, [dailyPortals, currentDateKey, selectedBranchId, isAllShops, branches, selectedDate]);

  // Active Bank Accounts & Cash in Hand (If All Shops, combine all branches' accounts)
  const activeBankAccounts = useMemo(() => {
    if (isAllShops) {
      const combined = [];
      branches.forEach(b => {
        const key = `${b.id}_${selectedDate}`;
        const bAccs = dailyAccounts[key] || dailyAccounts[`${b.id}_${getTodayDateString()}`] || Object.values(dailyAccounts)[0] || [];
        bAccs.forEach(a => {
          combined.push({
            ...a,
            name: `${a.name} (${b.name.split(' ')[0]})`,
            branchName: b.name
          });
        });
      });
      return combined;
    }

    if (dailyAccounts[currentDateKey]) {
      return dailyAccounts[currentDateKey];
    }

    // Auto Carry-Forward: If today doesn't exist, check yesterday's closing
    const yesterdayDate = getPreviousDateString(selectedDate);
    const yesterdayKey = `${selectedBranchId}_${yesterdayDate}`;
    const yesterdayAccounts = dailyAccounts[yesterdayKey];

    if (yesterdayAccounts && yesterdayAccounts.length > 0) {
      return yesterdayAccounts.map(a => {
        const yesterdayClosing = (Number(a.opening) || 0) + (Number(a.deposits) || 0) - (Number(a.withdrawals) || 0);
        return {
          ...a,
          opening: yesterdayClosing,
          deposits: 0,
          withdrawals: 0
        };
      });
    }

    const todayKeyStr = getTodayDateString();
    const fallbackTemplate = dailyAccounts[`${selectedBranchId}_${todayKeyStr}`] || INITIAL_DAILY_ACCOUNTS[`branch-1_${todayKeyStr}`] || Object.values(INITIAL_DAILY_ACCOUNTS)[0];
    return (fallbackTemplate || []).map(a => ({
      ...a,
      opening: a.opening || 20000,
      deposits: 0,
      withdrawals: 0
    }));
  }, [dailyAccounts, currentDateKey, selectedBranchId, isAllShops, branches, selectedDate]);

  // Active Jama (Deposits) for selectedDate
  const activeJamaList = useMemo(() => {
    if (isAllShops) {
      return jamaRecords.filter(r => r.date === selectedDate);
    }
    return jamaRecords.filter(r => r.branchId === selectedBranchId && r.date === selectedDate);
  }, [jamaRecords, selectedBranchId, selectedDate, isAllShops]);

  // Active Liya (Withdrawals) for selectedDate
  const activeLiyaList = useMemo(() => {
    if (isAllShops) {
      return liyaRecords.filter(r => r.date === selectedDate);
    }
    return liyaRecords.filter(r => r.branchId === selectedBranchId && r.date === selectedDate);
  }, [liyaRecords, selectedBranchId, selectedDate, isAllShops]);

  // Active Expenses for selectedDate
  const todaysExpenses = useMemo(() => {
    if (isAllShops) {
      return expenses.filter(e => e.date === selectedDate);
    }
    return expenses.filter(e => e.branchId === selectedBranchId && e.date === selectedDate);
  }, [expenses, selectedBranchId, selectedDate, isAllShops]);

  // Active Incomes & Service Fees for selectedDate (AEPS, DMT, PF, Photo Copy, etc.)
  const todaysIncomes = useMemo(() => {
    if (isAllShops) {
      return incomes.filter(i => i.date === selectedDate);
    }
    return incomes.filter(i => i.branchId === selectedBranchId && i.date === selectedDate);
  }, [incomes, selectedBranchId, selectedDate, isAllShops]);

  // Available History Dates
  const availableHistoryDates = useMemo(() => {
    const datesSet = new Set([getTodayDateString(), getOffsetDateString(-1), getOffsetDateString(-2)]);
    const isValidDateStr = (str) => typeof str === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(str);

    Object.keys(dailyPortals).forEach(k => {
      const parts = k.split('_');
      if (parts[1] && isValidDateStr(parts[1])) datesSet.add(parts[1]);
    });
    jamaRecords.forEach(r => {
      if (isValidDateStr(r.date)) datesSet.add(r.date);
    });
    liyaRecords.forEach(r => {
      if (isValidDateStr(r.date)) datesSet.add(r.date);
    });
    expenses.forEach(e => {
      if (isValidDateStr(e.date)) datesSet.add(e.date);
    });
    incomes.forEach(i => {
      if (isValidDateStr(i.date)) datesSet.add(i.date);
    });
    return Array.from(datesSet).filter(isValidDateStr).sort().reverse();
  }, [dailyPortals, jamaRecords, liyaRecords, expenses, incomes]);

  // 1. Total All Portals Closing Balance
  const totalPortalsBalance = useMemo(() => {
    return activePortals.reduce((sum, p) => {
      const closing = (Number(p.opening) || 0) + (Number(p.inAmount) || 0) - (Number(p.outAmount) || 0);
      return sum + closing;
    }, 0);
  }, [activePortals]);

  // 2. Total Bank Accounts & Cash in Hand Balance
  const totalBankBalance = useMemo(() => {
    return activeBankAccounts.reduce((sum, acc) => {
      const closing = (Number(acc.opening) || 0) + (Number(acc.deposits) || 0) - (Number(acc.withdrawals) || 0);
      return sum + closing;
    }, 0);
  }, [activeBankAccounts]);

  // 3. Total People Jama (Selected Date)
  const totalJamaAmount = useMemo(() => {
    return activeJamaList.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  }, [activeJamaList]);

  // 4. Total People Liya (Selected Date)
  const totalLiyaAmount = useMemo(() => {
    return activeLiyaList.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  }, [activeLiyaList]);

  // All-time Cumulative Jama (All dates)
  const allTimeJamaList = useMemo(() => {
    return isAllShops ? jamaRecords : jamaRecords.filter(r => r.branchId === selectedBranchId);
  }, [jamaRecords, selectedBranchId, isAllShops]);

  const allTimeJamaAmount = useMemo(() => {
    return allTimeJamaList.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  }, [allTimeJamaList]);

  // All-time Cumulative Liya (All dates)
  const allTimeLiyaList = useMemo(() => {
    return isAllShops ? liyaRecords : liyaRecords.filter(r => r.branchId === selectedBranchId);
  }, [liyaRecords, selectedBranchId, isAllShops]);

  const allTimeLiyaAmount = useMemo(() => {
    return allTimeLiyaList.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  }, [allTimeLiyaList]);

  // 5. Total Expenses (Selected Date)
  const totalExpenses = useMemo(() => {
    return todaysExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [todaysExpenses]);

  // All-time Cumulative Expenses
  const allTimeExpenses = useMemo(() => {
    const list = isAllShops ? expenses : expenses.filter(e => e.branchId === selectedBranchId);
    return list.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  }, [expenses, selectedBranchId, isAllShops]);

  // 6. Total Other Incomes & Service Fees (Selected Date)
  const totalIncomes = useMemo(() => {
    return todaysIncomes.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  }, [todaysIncomes]);

  // All-time Cumulative Incomes
  const allTimeIncomes = useMemo(() => {
    const list = isAllShops ? incomes : incomes.filter(i => i.branchId === selectedBranchId);
    return list.reduce((sum, i) => sum + (Number(i.amount) || 0), 0);
  }, [incomes, selectedBranchId, isAllShops]);

  // Daily Summary Object
  const dailySummary = useMemo(() => {
    return {
      totalExpenses,
      totalIncomes,
      netDailyProfit: totalIncomes - totalExpenses,
      totalPortalsBalance,
      totalBankBalance,
      totalJamaAmount,
      totalLiyaAmount,
      netTotalCapital: totalPortalsBalance + totalBankBalance + totalLiyaAmount - totalJamaAmount
    };
  }, [totalExpenses, totalIncomes, totalPortalsBalance, totalBankBalance, totalJamaAmount, totalLiyaAmount]);

  // Net Total Hisab / Available Capital (Daily vs Cumulative)
  const netTotalCapital = useMemo(() => {
    return totalPortalsBalance + totalBankBalance + totalLiyaAmount - totalJamaAmount;
  }, [totalPortalsBalance, totalBankBalance, totalLiyaAmount, totalJamaAmount]);

  const allTimeNetTotalCapital = useMemo(() => {
    return totalPortalsBalance + totalBankBalance + allTimeLiyaAmount - allTimeJamaAmount;
  }, [totalPortalsBalance, totalBankBalance, allTimeLiyaAmount, allTimeJamaAmount]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Date Navigation Helpers
  const shiftDateBy = (days) => {
    const current = new Date(selectedDate);
    current.setDate(current.getDate() + days);
    const y = current.getFullYear();
    const m = String(current.getMonth() + 1).padStart(2, '0');
    const d = String(current.getDate()).padStart(2, '0');
    setSelectedDate(`${y}-${m}-${d}`);
  };

  // Add / Create a New Shop / Branch
  const addBranch = (branchData) => {
    const newBranchId = `branch-${Date.now()}`;
    const newBranch = {
      id: newBranchId,
      name: branchData.name,
      code: branchData.code || `JSK-0${branches.length + 1}`,
      manager: branchData.manager || 'Operator',
      address: branchData.address || '',
      phone: branchData.phone || ''
    };

    // Default 10 standard portals for the new branch
    const defaultNewPortals = [
      { id: `p1-${newBranchId}`, name: 'Spice Money', code: 'SM-NEW', opening: Number(branchData.spiceOpening || 20000), inAmount: 0, outAmount: 0, color: '#f97316' },
      { id: `p2-${newBranchId}`, name: 'PayNearby', code: 'PN-NEW', opening: Number(branchData.paynearbyOpening || 15000), inAmount: 0, outAmount: 0, color: '#0284c7' },
      { id: `p3-${newBranchId}`, name: 'CSC DigiPay', code: 'CSC-NEW', opening: 10000, inAmount: 0, outAmount: 0, color: '#4f46e5' },
      { id: `p4-${newBranchId}`, name: 'Fino Payments Bank', code: 'FINO-NEW', opening: 25000, inAmount: 0, outAmount: 0, color: '#b91c1c' },
      { id: `p5-${newBranchId}`, name: 'Airtel Payments Bank', code: 'APB-NEW', opening: 10000, inAmount: 0, outAmount: 0, color: '#dc2626' },
      { id: `p6-${newBranchId}`, name: 'Rapipay', code: 'RAPI-NEW', opening: 8000, inAmount: 0, outAmount: 0, color: '#059669' },
      { id: `p7-${newBranchId}`, name: 'RNFI Relipay', code: 'RNFI-NEW', opening: 6000, inAmount: 0, outAmount: 0, color: '#8b5cf6' },
      { id: `p8-${newBranchId}`, name: 'Bankit', code: 'BKT-NEW', opening: 5000, inAmount: 0, outAmount: 0, color: '#0891b2' },
      { id: `p9-${newBranchId}`, name: 'Payworld', code: 'PW-NEW', opening: 5000, inAmount: 0, outAmount: 0, color: '#d97706' },
      { id: `p10-${newBranchId}`, name: 'EKO Financial', code: 'EKO-NEW', opening: 5000, inAmount: 0, outAmount: 0, color: '#0d9488' }
    ];

    // Default bank & cash accounts
    const defaultNewAccounts = [
      { id: `acc-cash-${newBranchId}`, name: 'Cash in Hand (गल्ला कैश)', type: 'CASH', opening: Number(branchData.cashOpening || 30000), deposits: 0, withdrawals: 0, color: '#10b981' },
      { id: `acc-bank-${newBranchId}`, name: 'Shop Primary Bank A/C', type: 'BANK', opening: Number(branchData.bankOpening || 50000), deposits: 0, withdrawals: 0, color: '#0284c7' }
    ];

    setBranches(prev => [...prev, newBranch]);

    const dateKey = `${newBranchId}_${selectedDate}`;
    setDailyPortals(prev => ({
      ...prev,
      [dateKey]: defaultNewPortals,
      [`${newBranchId}_2026-09-16`]: defaultNewPortals
    }));

    setDailyAccounts(prev => ({
      ...prev,
      [dateKey]: defaultNewAccounts,
      [`${newBranchId}_2026-09-16`]: defaultNewAccounts
    }));

    setSelectedBranchId(newBranchId);
    showToast(`New shop created: ${branchData.name}!`);
    return newBranch;
  };

  // Direct In-place Portal Updates
  const updatePortalBalance = (portalId, updates) => {
    setDailyPortals(prev => {
      const list = prev[currentDateKey] || activePortals;
      const updated = list.map(p => (p.id === portalId ? { ...p, ...updates } : p));
      return { ...prev, [currentDateKey]: updated };
    });
    showToast('Portal balance updated');
  };

  const addPortal = (portalData) => {
    const newP = {
      id: `p-${Date.now()}`,
      opening: Number(portalData.opening || 0),
      inAmount: 0,
      outAmount: 0,
      color: portalData.color || '#6366f1',
      ...portalData
    };
    setDailyPortals(prev => {
      const list = prev[currentDateKey] || activePortals;
      return { ...prev, [currentDateKey]: [...list, newP] };
    });
    showToast(`Added portal: ${portalData.name}`);
  };

  const deletePortal = (portalId) => {
    setDailyPortals(prev => {
      const list = prev[currentDateKey] || activePortals;
      return { ...prev, [currentDateKey]: list.filter(p => p.id !== portalId) };
    });
    showToast('Portal removed', 'info');
  };

  // Direct In-place Bank Account Updates
  const updateBankAccount = (accId, updates) => {
    setDailyAccounts(prev => {
      const list = prev[currentDateKey] || activeBankAccounts;
      const updated = list.map(a => (a.id === accId ? { ...a, ...updates } : a));
      return { ...prev, [currentDateKey]: updated };
    });
    showToast('Account balance updated');
  };

  const addBankAccount = (accData) => {
    const newAcc = {
      id: `acc-${Date.now()}`,
      opening: Number(accData.opening || 0),
      deposits: 0,
      withdrawals: 0,
      color: accData.color || '#0284c7',
      type: accData.type || 'BANK',
      ...accData
    };
    setDailyAccounts(prev => {
      const list = prev[currentDateKey] || activeBankAccounts;
      return { ...prev, [currentDateKey]: [...list, newAcc] };
    });
    showToast(`Added account: ${accData.name}`);
  };

  const deleteBankAccount = (accId) => {
    setDailyAccounts(prev => {
      const list = prev[currentDateKey] || activeBankAccounts;
      return { ...prev, [currentDateKey]: list.filter(a => a.id !== accId) };
    });
    showToast('Account removed', 'info');
  };

  // Customer Master Management
  const addCustomer = (data) => {
    const newCust = {
      id: `c-${Date.now()}`,
      name: data.name,
      phone: data.phone || '',
      category: data.category || 'Customer / Party',
      address: data.address || '',
      pincode: data.pincode || '',
      isPinned: Boolean(data.isPinned)
    };
    setCustomers(prev => [newCust, ...prev]);
    showToast(`Added to Party Master: ${data.name}`);
    return newCust;
  };

  const toggleCustomerPin = (id) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const nextState = !c.isPinned;
        showToast(nextState ? `📌 ${c.name} को ऊपर पिन किया गया` : `Unpinned ${c.name}`, 'info');
        return { ...c, isPinned: nextState };
      }
      return c;
    }));
  };

  const updateCustomer = (id, updates) => {
    let oldName = null;
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        oldName = c.name;
        return { ...c, ...updates };
      }
      return c;
    }));

    if (oldName && updates.name && updates.name.trim().toLowerCase() !== oldName.trim().toLowerCase()) {
      const newName = updates.name.trim();
      setJamaRecords(prev => prev.map(j => j.name.trim().toLowerCase() === oldName.trim().toLowerCase() ? { ...j, name: newName, phone: updates.phone || j.phone } : j));
      setLiyaRecords(prev => prev.map(l => l.name.trim().toLowerCase() === oldName.trim().toLowerCase() ? { ...l, name: newName, phone: updates.phone || l.phone } : l));
    }

    showToast(`✅ ${updates.name || 'पार्टी'} की जानकारी अपडेट हो गई!`);
  };

  const deleteCustomer = (id) => {
    setCustomers(prev => prev.filter(c => c.id !== id));
    showToast('Customer removed from Master', 'info');
  };

  // Add Jama (Deposit) with auto Master registry
  const addJamaRecord = (record) => {
    const targetBranch = isAllShops ? (branches[0]?.id || 'branch-1') : selectedBranchId;
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const newRecord = {
      id: `jama-${Date.now()}`,
      branchId: targetBranch,
      date: selectedDate,
      time,
      ...record,
      amount: Number(record.amount || 0)
    };
    setJamaRecords(prev => [newRecord, ...prev]);

    // Auto add to Customer Master if not already present
    if (record.name && !customers.some(c => c.name.toLowerCase().trim() === record.name.toLowerCase().trim())) {
      setCustomers(prev => [{
        id: `c-${Date.now()}`,
        name: record.name.trim(),
        phone: record.phone || '',
        category: 'Customer / Party',
        address: ''
      }, ...prev]);
    }

    showToast(`Added Jama of ₹${record.amount} for ${record.name}`);
  };

  const deleteJamaRecord = (id) => {
    setJamaRecords(prev => prev.filter(r => r.id !== id));
    showToast('Jama entry removed', 'info');
  };

  // Add Liya (Withdrawal) with auto Master registry
  const addLiyaRecord = (record) => {
    const targetBranch = isAllShops ? (branches[0]?.id || 'branch-1') : selectedBranchId;
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const newRecord = {
      id: `liya-${Date.now()}`,
      branchId: targetBranch,
      date: selectedDate,
      time,
      ...record,
      amount: Number(record.amount || 0)
    };
    setLiyaRecords(prev => [newRecord, ...prev]);

    // Auto add to Customer Master if not already present
    if (record.name && !customers.some(c => c.name.toLowerCase().trim() === record.name.toLowerCase().trim())) {
      setCustomers(prev => [{
        id: `c-${Date.now()}`,
        name: record.name.trim(),
        phone: record.phone || '',
        category: 'Customer / Party',
        address: ''
      }, ...prev]);
    }

    showToast(`Added Liya of ₹${record.amount} for ${record.name}`);
  };

  const deleteLiyaRecord = (id) => {
    setLiyaRecords(prev => prev.filter(r => r.id !== id));
    showToast('Liya entry removed', 'info');
  };

  // Comprehensive Customer Ledger Master (All Jama + Liya unified for each person)
  const customerLedgers = useMemo(() => {
    const custMap = new Map();

    // 1. Initial from master
    customers.forEach(c => {
      custMap.set(c.name.trim().toLowerCase(), {
        id: c.id,
        name: c.name,
        phone: c.phone || '',
        category: c.category || 'Customer / Party',
        address: c.address || '',
        pincode: c.pincode || '',
        isPinned: Boolean(c.isPinned),
        jamaList: [],
        liyaList: [],
        totalJama: 0,
        totalLiya: 0,
        todayJama: 0,
        todayLiya: 0
      });
    });

    // 2. Populate Jama records
    jamaRecords.forEach(j => {
      const key = (j.name || '').trim().toLowerCase();
      if (!custMap.has(key)) {
        custMap.set(key, {
          id: `c-auto-${key.replace(/\s+/g, '-')}`,
          name: j.name,
          phone: j.phone || '',
          category: 'Customer / Party',
          address: '',
          pincode: '',
          isPinned: false,
          jamaList: [],
          liyaList: [],
          totalJama: 0,
          totalLiya: 0,
          todayJama: 0,
          todayLiya: 0
        });
      }
      const entry = custMap.get(key);
      if (j.phone && !entry.phone) entry.phone = j.phone;
      entry.jamaList.push(j);
      entry.totalJama += Number(j.amount) || 0;
      if (j.date === selectedDate) {
        entry.todayJama += Number(j.amount) || 0;
      }
    });

    // 3. Populate Liya records
    liyaRecords.forEach(l => {
      const key = (l.name || '').trim().toLowerCase();
      if (!custMap.has(key)) {
        custMap.set(key, {
          id: `c-auto-${key.replace(/\s+/g, '-')}`,
          name: l.name,
          phone: l.phone || '',
          category: 'Customer / Party',
          address: '',
          pincode: '',
          isPinned: false,
          jamaList: [],
          liyaList: [],
          totalJama: 0,
          totalLiya: 0,
          todayJama: 0,
          todayLiya: 0
        });
      }
      const entry = custMap.get(key);
      if (l.phone && !entry.phone) entry.phone = l.phone;
      entry.liyaList.push(l);
      entry.totalLiya += Number(l.amount) || 0;
      if (l.date === selectedDate) {
        entry.todayLiya += Number(l.amount) || 0;
      }
    });

    // 4. Calculate Net Balance
    return Array.from(custMap.values()).map(c => {
      const netBalance = c.totalJama - c.totalLiya;
      return {
        ...c,
        netBalance,
        status: netBalance > 0 ? 'JAMA_PLUS' : netBalance < 0 ? 'UDHAR_MINUS' : 'SETTLED'
      };
    }).sort((a, b) => {
      if (a.isPinned !== b.isPinned) return (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0);
      return (b.todayJama + b.todayLiya) - (a.todayJama + a.todayLiya);
    });
  }, [customers, jamaRecords, liyaRecords, selectedDate]);

  // Carry Forward All Yesterday Balances (Portals + Banks/Cash)
  const carryForwardAllYesterday = () => {
    const yesterdayDate = getPreviousDateString(selectedDate);
    const yesterdayPortalsKey = `${selectedBranchId}_${yesterdayDate}`;
    const yesterdayAccountsKey = `${selectedBranchId}_${yesterdayDate}`;

    const yPortals = dailyPortals[yesterdayPortalsKey];
    const yAccounts = dailyAccounts[yesterdayAccountsKey];

    let updatedAny = false;

    if (yPortals && yPortals.length > 0) {
      const newPortals = yPortals.map(p => {
        const yesterdayClosing = (Number(p.opening) || 0) + (Number(p.inAmount) || 0) - (Number(p.outAmount) || 0);
        return {
          ...p,
          opening: yesterdayClosing,
          inAmount: 0,
          outAmount: 0
        };
      });
      setDailyPortals(prev => ({ ...prev, [currentDateKey]: newPortals }));
      updatedAny = true;
    } else {
      // If yesterday specifically didn't exist, use current active list with their closing as opening
      const newPortals = activePortals.map(p => {
        const closing = (Number(p.opening) || 0) + (Number(p.inAmount) || 0) - (Number(p.outAmount) || 0);
        return { ...p, opening: closing, inAmount: 0, outAmount: 0 };
      });
      setDailyPortals(prev => ({ ...prev, [currentDateKey]: newPortals }));
      updatedAny = true;
    }

    if (yAccounts && yAccounts.length > 0) {
      const newAccounts = yAccounts.map(a => {
        const yesterdayClosing = (Number(a.opening) || 0) + (Number(a.deposits) || 0) - (Number(a.withdrawals) || 0);
        return {
          ...a,
          opening: yesterdayClosing,
          deposits: 0,
          withdrawals: 0
        };
      });
      setDailyAccounts(prev => ({ ...prev, [currentDateKey]: newAccounts }));
      updatedAny = true;
    } else {
      const newAccounts = activeBankAccounts.map(a => {
        const closing = (Number(a.opening) || 0) + (Number(a.deposits) || 0) - (Number(a.withdrawals) || 0);
        return { ...a, opening: closing, deposits: 0, withdrawals: 0 };
      });
      setDailyAccounts(prev => ({ ...prev, [currentDateKey]: newAccounts }));
      updatedAny = true;
    }

    showToast(`⚡ कल (${yesterdayDate}) का क्लोजिंग बैलेंस आज के ओपनिंग में सेट हो गया!`);
  };

  // Direct Update Today's Portal Balance (Sets today's closing directly by calculating in/out)
  const setPortalDirectTodayBalance = (portalId, newTodayBalance) => {
    const val = Number(newTodayBalance) || 0;
    setDailyPortals(prev => {
      const list = prev[currentDateKey] || activePortals;
      const updated = list.map(p => {
        if (p.id !== portalId) return p;
        const opening = Number(p.opening) || 0;
        if (val >= opening) {
          return { ...p, inAmount: val - opening, outAmount: 0 };
        } else {
          return { ...p, inAmount: 0, outAmount: opening - val };
        }
      });
      return { ...prev, [currentDateKey]: updated };
    });
  };

  // Direct Update Today's Bank Account Balance
  const setBankAccountDirectTodayBalance = (accId, newTodayBalance) => {
    const val = Number(newTodayBalance) || 0;
    setDailyAccounts(prev => {
      const list = prev[currentDateKey] || activeBankAccounts;
      const updated = list.map(a => {
        if (a.id !== accId) return a;
        const opening = Number(a.opening) || 0;
        if (val >= opening) {
          return { ...a, deposits: val - opening, withdrawals: 0 };
        } else {
          return { ...a, deposits: 0, withdrawals: opening - val };
        }
      });
      return { ...prev, [currentDateKey]: updated };
    });
  };

  // Add Expense
  const addExpense = (data) => {
    const targetBranch = isAllShops ? (branches[0]?.id || 'branch-1') : selectedBranchId;
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const newExp = {
      id: `exp-${Date.now()}`,
      branchId: targetBranch,
      date: selectedDate,
      time,
      title: data.title,
      amount: Number(data.amount || 0),
      category: data.category || 'OTHER',
      paymentMode: data.paymentMode || 'Cash in Hand',
      vendor: data.vendor || '',
      remark: data.remark || ''
    };
    setExpenses(prev => [newExp, ...prev]);
    showToast(`Expense recorded: ₹${data.amount} for ${data.title}`);
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    showToast('Expense removed', 'info');
  };

  // Add Income & Service Fee (AEPS, DMT, PF, Photo Copy, etc.)
  const addIncome = (data) => {
    const targetBranch = isAllShops ? (branches[0]?.id || 'branch-1') : selectedBranchId;
    const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const newInc = {
      id: `inc-${Date.now()}`,
      branchId: targetBranch,
      date: selectedDate,
      time,
      title: data.title,
      amount: Number(data.amount || 0),
      category: data.category || 'OTHER',
      paymentMode: data.paymentMode || 'Cash in Hand',
      customerName: data.customerName || '',
      remark: data.remark || ''
    };
    setIncomes(prev => [newInc, ...prev]);
    showToast(`Income added: ₹${data.amount} for ${data.title}`);
  };

  const deleteIncome = (id) => {
    setIncomes(prev => prev.filter(i => i.id !== id));
    showToast('Income entry removed', 'info');
  };

  const updateIncome = (id, updates) => {
    setIncomes(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
    showToast('Income entry updated');
  };

  // 100% Clean Fresh Start with ₹0 balances & empty transactions
  const clearAllDataToFresh = () => {
    const today = getTodayDateString();
    
    // Clean Portals with ₹0 opening balance
    const cleanPortals = [
      { id: 'p1', name: 'Spice Money', code: 'SM-101', opening: 0, inAmount: 0, outAmount: 0, color: '#f97316' },
      { id: 'p2', name: 'PayNearby', code: 'PN-102', opening: 0, inAmount: 0, outAmount: 0, color: '#0284c7' },
      { id: 'p3', name: 'CSC DigiPay', code: 'CSC-103', opening: 0, inAmount: 0, outAmount: 0, color: '#4f46e5' },
      { id: 'p4', name: 'Fino Payments Bank', code: 'FINO-104', opening: 0, inAmount: 0, outAmount: 0, color: '#b91c1c' },
      { id: 'p5', name: 'Airtel Payments Bank', code: 'APB-105', opening: 0, inAmount: 0, outAmount: 0, color: '#dc2626' },
      { id: 'p6', name: 'Rapipay', code: 'RAPI-106', opening: 0, inAmount: 0, outAmount: 0, color: '#059669' },
      { id: 'p7', name: 'RNFI Relipay', code: 'RNFI-107', opening: 0, inAmount: 0, outAmount: 0, color: '#8b5cf6' },
      { id: 'p8', name: 'Bankit', code: 'BKT-108', opening: 0, inAmount: 0, outAmount: 0, color: '#0891b2' },
      { id: 'p9', name: 'Payworld', code: 'PW-109', opening: 0, inAmount: 0, outAmount: 0, color: '#d97706' },
      { id: 'p10', name: 'EKO Financial', code: 'EKO-110', opening: 0, inAmount: 0, outAmount: 0, color: '#0d9488' }
    ];

    // Clean Bank Accounts with ₹0 opening balance
    const cleanAccounts = [
      { id: 'acc-1', name: 'Cash in Hand (गल्ला कैश)', type: 'CASH', opening: 0, deposits: 0, withdrawals: 0, color: '#10b981' },
      { id: 'acc-2', name: 'Primary Current A/C', type: 'BANK', opening: 0, deposits: 0, withdrawals: 0, color: '#0284c7' },
      { id: 'acc-3', name: 'CSP Settlement A/C', type: 'BANK', opening: 0, deposits: 0, withdrawals: 0, color: '#4f46e5' },
      { id: 'acc-4', name: 'Savings A/C', type: 'BANK', opening: 0, deposits: 0, withdrawals: 0, color: '#dc2626' }
    ];

    const targetBranch = branches[0]?.id || 'branch-1';
    const cleanPortalsMap = { [`${targetBranch}_${today}`]: cleanPortals };
    const cleanAccountsMap = { [`${targetBranch}_${today}`]: cleanAccounts };

    localStorage.removeItem(STORAGE_KEYS.JAMA);
    localStorage.removeItem(STORAGE_KEYS.LIYA);
    localStorage.removeItem(STORAGE_KEYS.EXPENSES);
    localStorage.removeItem(STORAGE_KEYS.INCOMES);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);

    setSelectedDate(today);
    setDailyPortals(cleanPortalsMap);
    setDailyAccounts(cleanAccountsMap);
    setJamaRecords([]);
    setLiyaRecords([]);
    setExpenses([]);
    setIncomes([]);
    setCustomers([]);
  };

  // Reset to sample filled demo data
  const resetToDemoData = () => {
    const today = getTodayDateString();
    setSelectedDate(today);
    setBranches(INITIAL_BRANCHES);
    setSelectedBranchId('branch-1');
    setCustomers(INITIAL_CUSTOMERS);
    setDailyPortals(INITIAL_DAILY_PORTALS);
    setDailyAccounts(INITIAL_DAILY_ACCOUNTS);
    setJamaRecords(INITIAL_JAMA_RECORDS);
    setLiyaRecords(INITIAL_LIYA_RECORDS);
    setExpenses(INITIAL_EXPENSES);
    setIncomes(INITIAL_INCOMES);
  };

  const resetAllData = () => {
    resetToDemoData();
    showToast('All Hisab data reset to default demo');
  };

  return (
    <HisabContext.Provider
      value={{
        branches,
        selectedBranchId,
        setSelectedBranchId,
        isAllShops,
        activeBranch,
        selectedDate,
        setSelectedDate,
        shiftDateBy,
        availableHistoryDates,
        addBranch,
        activePortals,
        activeBankAccounts,
        customers,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        toggleCustomerPin,
        customerLedgers,
        activeJamaList,
        activeLiyaList,
        allTimeJamaList,
        allTimeLiyaList,
        expenses,
        todaysExpenses,
        totalExpenses,
        allTimeExpenses,
        incomes,
        todaysIncomes,
        totalIncomes,
        allTimeIncomes,
        dailySummary,
        totalPortalsBalance,
        totalBankBalance,
        totalJamaAmount,
        totalLiyaAmount,
        allTimeJamaAmount,
        allTimeLiyaAmount,
        summaryViewMode,
        setSummaryViewMode,
        netTotalCapital,
        allTimeNetTotalCapital,
        toast,
        showToast,
        carryForwardAllYesterday,
        setPortalDirectTodayBalance,
        setBankAccountDirectTodayBalance,
        getPreviousDateString,
        updatePortalBalance,
        addPortal,
        deletePortal,
        updateBankAccount,
        addBankAccount,
        deleteBankAccount,
        addJamaRecord,
        deleteJamaRecord,
        addLiyaRecord,
        deleteLiyaRecord,
        addExpense,
        deleteExpense,
        addIncome,
        deleteIncome,
        updateIncome,
        loaderState,
        triggerLoader,
        closeLoader,
        clearAllDataToFresh,
        resetToDemoData,
        resetAllData,
        theme,
        setTheme,
        toggleTheme
      }}
    >
      {children}
    </HisabContext.Provider>
  );
};

export const useHisab = () => {
  const context = useContext(HisabContext);
  if (!context) throw new Error('useHisab must be used within HisabProvider');
  return context;
};
