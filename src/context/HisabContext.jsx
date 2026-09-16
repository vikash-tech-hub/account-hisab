import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  INITIAL_BRANCHES,
  INITIAL_DAILY_PORTALS,
  INITIAL_DAILY_ACCOUNTS,
  INITIAL_JAMA_RECORDS,
  INITIAL_LIYA_RECORDS
} from '../data/initialData';
import { getTodayDateString } from '../utils/formatters';

const HisabContext = createContext(null);

const STORAGE_KEYS = {
  BRANCHES: 'jsk_v4_branches',
  DAILY_PORTALS: 'jsk_v4_daily_portals',
  DAILY_ACCOUNTS: 'jsk_v4_daily_accounts',
  JAMA: 'jsk_v4_jama',
  LIYA: 'jsk_v4_liya',
  SELECTED_BRANCH: 'jsk_v4_selected_branch',
  SELECTED_DATE: 'jsk_v4_selected_date'
};

export const HisabProvider = ({ children }) => {
  const [branches, setBranches] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BRANCHES);
    return saved ? JSON.parse(saved) : INITIAL_BRANCHES;
  });

  const [selectedBranchId, setSelectedBranchId] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_BRANCH);
    return saved || 'branch-1';
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SELECTED_DATE);
    return saved || '2026-09-16';
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

  const [toast, setToast] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BRANCHES, JSON.stringify(branches));
  }, [branches]);

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
    localStorage.setItem(STORAGE_KEYS.SELECTED_BRANCH, selectedBranchId);
  }, [selectedBranchId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_DATE, selectedDate);
  }, [selectedDate]);

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
    const fallbackTemplate = dailyPortals[`${selectedBranchId}_2026-09-16`] || INITIAL_DAILY_PORTALS['branch-1_2026-09-16'];
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
        const bAccs = dailyAccounts[key] || dailyAccounts[`${b.id}_2026-09-16`] || [];
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
    const fallbackTemplate = dailyAccounts[`${selectedBranchId}_2026-09-16`] || INITIAL_DAILY_ACCOUNTS['branch-1_2026-09-16'];
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

  // Available History Dates
  const availableHistoryDates = useMemo(() => {
    const datesSet = new Set(['2026-09-16', '2026-09-15', '2026-09-14']);
    Object.keys(dailyPortals).forEach(k => {
      const parts = k.split('_');
      if (parts[1]) datesSet.add(parts[1]);
    });
    jamaRecords.forEach(r => {
      if (r.date) datesSet.add(r.date);
    });
    liyaRecords.forEach(r => {
      if (r.date) datesSet.add(r.date);
    });
    return Array.from(datesSet).sort().reverse();
  }, [dailyPortals, jamaRecords, liyaRecords]);

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

  // 3. Total People Jama
  const totalJamaAmount = useMemo(() => {
    return activeJamaList.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  }, [activeJamaList]);

  // 4. Total People Liya
  const totalLiyaAmount = useMemo(() => {
    return activeLiyaList.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  }, [activeLiyaList]);

  // Net Total Hisab / Available Capital
  const netTotalCapital = useMemo(() => {
    return totalPortalsBalance + totalBankBalance + totalLiyaAmount - totalJamaAmount;
  }, [totalPortalsBalance, totalBankBalance, totalLiyaAmount, totalJamaAmount]);

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

  // Add Jama (Deposit)
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
    showToast(`Added Jama of ₹${record.amount} for ${record.name}`);
  };

  const deleteJamaRecord = (id) => {
    setJamaRecords(prev => prev.filter(r => r.id !== id));
    showToast('Jama entry removed', 'info');
  };

  // Add Liya (Withdrawal)
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
    showToast(`Added Liya of ₹${record.amount} for ${record.name}`);
  };

  const deleteLiyaRecord = (id) => {
    setLiyaRecords(prev => prev.filter(r => r.id !== id));
    showToast('Liya entry removed', 'info');
  };

  const resetAllData = () => {
    if (window.confirm('Reset all multi-shop hisab records back to default demo data?')) {
      localStorage.clear();
      setBranches(INITIAL_BRANCHES);
      setSelectedBranchId('branch-1');
      setSelectedDate('2026-09-16');
      setDailyPortals(INITIAL_DAILY_PORTALS);
      setDailyAccounts(INITIAL_DAILY_ACCOUNTS);
      setJamaRecords(INITIAL_JAMA_RECORDS);
      setLiyaRecords(INITIAL_LIYA_RECORDS);
      showToast('All Hisab data reset to default demo');
    }
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
        activeJamaList,
        activeLiyaList,
        totalPortalsBalance,
        totalBankBalance,
        totalJamaAmount,
        totalLiyaAmount,
        netTotalCapital,
        toast,
        showToast,
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
        resetAllData
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
