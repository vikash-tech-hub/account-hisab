/**
 * Multi-Day & Historical 4-Pillar Data Model for Jan Seva Kendra Daily Hisab
 * Stores daily snapshots of Portals, Bank Accounts, Jama and Liya for Today and Past Dates
 */

export const INITIAL_BRANCHES = [
  {
    id: 'branch-1',
    name: 'Main Market Kendra',
    code: 'JSK-01',
    manager: 'Rajesh Sharma'
  },
  {
    id: 'branch-2',
    name: 'Station Road Kendra',
    code: 'JSK-02',
    manager: 'Amit Verma'
  }
];

// Portals by `${branchId}_${date}`
export const INITIAL_DAILY_PORTALS = {
  // Today (2026-09-16) - Branch 1
  'branch-1_2026-09-16': [
    { id: 'p1', name: 'Spice Money', code: 'SM-984321', opening: 25000, inAmount: 8000, outAmount: 15000, color: '#f97316' },
    { id: 'p2', name: 'PayNearby', code: 'PN-776201', opening: 18000, inAmount: 10000, outAmount: 6000, color: '#0284c7' },
    { id: 'p3', name: 'CSC DigiPay', code: 'CSC-441982', opening: 22000, inAmount: 5000, outAmount: 4000, color: '#4f46e5' },
    { id: 'p4', name: 'Fino Payments Bank', code: 'FINO-55209', opening: 35000, inAmount: 12000, outAmount: 20000, color: '#b91c1c' },
    { id: 'p5', name: 'Airtel Payments Bank', code: 'APB-11983', opening: 14000, inAmount: 3000, outAmount: 4500, color: '#dc2626' },
    { id: 'p6', name: 'Rapipay', code: 'RAPI-33821', opening: 9500, inAmount: 4000, outAmount: 2000, color: '#059669' },
    { id: 'p7', name: 'RNFI Relipay', code: 'RNFI-88210', opening: 8000, inAmount: 2000, outAmount: 3000, color: '#8b5cf6' },
    { id: 'p8', name: 'Bankit', code: 'BKT-22910', opening: 6500, inAmount: 1500, outAmount: 2000, color: '#0891b2' },
    { id: 'p9', name: 'Payworld', code: 'PW-66329', opening: 5500, inAmount: 0, outAmount: 1500, color: '#d97706' },
    { id: 'p10', name: 'EKO Financial', code: 'EKO-90412', opening: 7200, inAmount: 2500, outAmount: 1000, color: '#0d9488' }
  ],
  // Yesterday (2026-09-15) - Branch 1
  'branch-1_2026-09-15': [
    { id: 'p1', name: 'Spice Money', code: 'SM-984321', opening: 30000, inAmount: 10000, outAmount: 15000, color: '#f97316' },
    { id: 'p2', name: 'PayNearby', code: 'PN-776201', opening: 15000, inAmount: 8000, outAmount: 5000, color: '#0284c7' },
    { id: 'p3', name: 'CSC DigiPay', code: 'CSC-441982', opening: 20000, inAmount: 6000, outAmount: 4000, color: '#4f46e5' },
    { id: 'p4', name: 'Fino Payments Bank', code: 'FINO-55209', opening: 40000, inAmount: 15000, outAmount: 20000, color: '#b91c1c' },
    { id: 'p5', name: 'Airtel Payments Bank', code: 'APB-11983', opening: 12000, inAmount: 5000, outAmount: 3000, color: '#dc2626' },
    { id: 'p6', name: 'Rapipay', code: 'RAPI-33821', opening: 8000, inAmount: 3500, outAmount: 2000, color: '#059669' },
    { id: 'p7', name: 'RNFI Relipay', code: 'RNFI-88210', opening: 7500, inAmount: 2500, outAmount: 2000, color: '#8b5cf6' },
    { id: 'p8', name: 'Bankit', code: 'BKT-22910', opening: 6000, inAmount: 1500, outAmount: 1000, color: '#0891b2' },
    { id: 'p9', name: 'Payworld', code: 'PW-66329', opening: 5000, inAmount: 1000, outAmount: 500, color: '#d97706' },
    { id: 'p10', name: 'EKO Financial', code: 'EKO-90412', opening: 6500, inAmount: 2000, outAmount: 1300, color: '#0d9488' }
  ],
  // Day Before Yesterday (2026-09-14) - Branch 1
  'branch-1_2026-09-14': [
    { id: 'p1', name: 'Spice Money', code: 'SM-984321', opening: 28000, inAmount: 12000, outAmount: 10000, color: '#f97316' },
    { id: 'p2', name: 'PayNearby', code: 'PN-776201', opening: 16000, inAmount: 7000, outAmount: 8000, color: '#0284c7' },
    { id: 'p3', name: 'CSC DigiPay', code: 'CSC-441982', opening: 18000, inAmount: 5000, outAmount: 3000, color: '#4f46e5' },
    { id: 'p4', name: 'Fino Payments Bank', code: 'FINO-55209', opening: 35000, inAmount: 18000, outAmount: 13000, color: '#b91c1c' },
    { id: 'p5', name: 'Airtel Payments Bank', code: 'APB-11983', opening: 10000, inAmount: 4000, outAmount: 2000, color: '#dc2626' },
    { id: 'p6', name: 'Rapipay', code: 'RAPI-33821', opening: 7000, inAmount: 3000, outAmount: 2000, color: '#059669' },
    { id: 'p7', name: 'RNFI Relipay', code: 'RNFI-88210', opening: 6500, inAmount: 2000, outAmount: 1000, color: '#8b5cf6' },
    { id: 'p8', name: 'Bankit', code: 'BKT-22910', opening: 5500, inAmount: 1500, outAmount: 1000, color: '#0891b2' },
    { id: 'p9', name: 'Payworld', code: 'PW-66329', opening: 4500, inAmount: 1000, outAmount: 500, color: '#d97706' },
    { id: 'p10', name: 'EKO Financial', code: 'EKO-90412', opening: 6000, inAmount: 1500, outAmount: 1000, color: '#0d9488' }
  ],
  // Branch 2 Today
  'branch-2_2026-09-16': [
    { id: 'p1-b2', name: 'Spice Money (Br 2)', code: 'SM-551299', opening: 15000, inAmount: 5000, outAmount: 8000, color: '#f97316' },
    { id: 'p2-b2', name: 'PayNearby (Br 2)', code: 'PN-443102', opening: 20000, inAmount: 6000, outAmount: 12000, color: '#0284c7' },
    { id: 'p3-b2', name: 'CSC DigiPay (Br 2)', code: 'CSC-331201', opening: 12000, inAmount: 4000, outAmount: 3000, color: '#4f46e5' },
    { id: 'p4-b2', name: 'Fino Bank (Br 2)', code: 'FINO-99104', opening: 28000, inAmount: 8000, outAmount: 14000, color: '#b91c1c' },
    { id: 'p5-b2', name: 'Airtel Bank (Br 2)', code: 'APB-66321', opening: 10000, inAmount: 2000, outAmount: 4000, color: '#dc2626' },
    { id: 'p6-b2', name: 'Rapipay (Br 2)', code: 'RAPI-11204', opening: 7500, inAmount: 1500, outAmount: 2500, color: '#059669' },
    { id: 'p7-b2', name: 'RNFI Relipay (Br 2)', code: 'RNFI-44219', opening: 6000, inAmount: 1000, outAmount: 1500, color: '#8b5cf6' },
    { id: 'p8-b2', name: 'Bankit (Br 2)', code: 'BKT-88310', opening: 5000, inAmount: 1000, outAmount: 1200, color: '#0891b2' }
  ]
};

// Bank Accounts by `${branchId}_${date}`
export const INITIAL_DAILY_ACCOUNTS = {
  // Today - Branch 1
  'branch-1_2026-09-16': [
    { id: 'acc-1', name: 'Cash in Hand (गल्ला कैश)', type: 'CASH', opening: 45000, deposits: 32000, withdrawals: 28000, color: '#10b981' },
    { id: 'acc-2', name: 'SBI Main Current A/C (3098****44)', type: 'BANK', opening: 85000, deposits: 25000, withdrawals: 15000, color: '#0284c7' },
    { id: 'acc-3', name: 'HDFC CSP Settlement A/C (5020****11)', type: 'BANK', opening: 50000, deposits: 20000, withdrawals: 10000, color: '#4f46e5' },
    { id: 'acc-4', name: 'PNB Savings A/C (0045****99)', type: 'BANK', opening: 25000, deposits: 5000, withdrawals: 0, color: '#dc2626' }
  ],
  // Yesterday - Branch 1
  'branch-1_2026-09-15': [
    { id: 'acc-1', name: 'Cash in Hand (गल्ला कैश)', type: 'CASH', opening: 42000, deposits: 28000, withdrawals: 25000, color: '#10b981' },
    { id: 'acc-2', name: 'SBI Main Current A/C (3098****44)', type: 'BANK', opening: 75000, deposits: 30000, withdrawals: 20000, color: '#0284c7' },
    { id: 'acc-3', name: 'HDFC CSP Settlement A/C (5020****11)', type: 'BANK', opening: 45000, deposits: 15000, withdrawals: 10000, color: '#4f46e5' },
    { id: 'acc-4', name: 'PNB Savings A/C (0045****99)', type: 'BANK', opening: 20000, deposits: 5000, withdrawals: 0, color: '#dc2626' }
  ],
  // Day Before Yesterday - Branch 1
  'branch-1_2026-09-14': [
    { id: 'acc-1', name: 'Cash in Hand (गल्ला कैश)', type: 'CASH', opening: 38000, deposits: 30000, withdrawals: 26000, color: '#10b981' },
    { id: 'acc-2', name: 'SBI Main Current A/C (3098****44)', type: 'BANK', opening: 70000, deposits: 25000, withdrawals: 20000, color: '#0284c7' },
    { id: 'acc-3', name: 'HDFC CSP Settlement A/C (5020****11)', type: 'BANK', opening: 40000, deposits: 12000, withdrawals: 7000, color: '#4f46e5' },
    { id: 'acc-4', name: 'PNB Savings A/C (0045****99)', type: 'BANK', opening: 18000, deposits: 4000, withdrawals: 2000, color: '#dc2626' }
  ],
  // Branch 2 Today
  'branch-2_2026-09-16': [
    { id: 'acc-1-b2', name: 'Cash in Hand (गल्ला कैश)', type: 'CASH', opening: 30000, deposits: 20000, withdrawals: 18000, color: '#10b981' },
    { id: 'acc-2-b2', name: 'SBI Station Road Branch A/C', type: 'BANK', opening: 60000, deposits: 15000, withdrawals: 10000, color: '#0284c7' },
    { id: 'acc-3-b2', name: 'Canara Bank Current A/C', type: 'BANK', opening: 35000, deposits: 10000, withdrawals: 5000, color: '#f59e0b' }
  ]
};

// Jama records with date
export const INITIAL_JAMA_RECORDS = [
  // Today (2026-09-16)
  {
    id: 'jama-1',
    branchId: 'branch-1',
    date: '2026-09-16',
    name: 'Ramesh Kumar Verma (Dairy)',
    phone: '9839123456',
    amount: 45000,
    portalOrAccount: 'Cash in Hand',
    time: '09:30 AM',
    note: 'Daily milk collection cash deposited'
  },
  {
    id: 'jama-2',
    branchId: 'branch-1',
    date: '2026-09-16',
    name: 'Sunita Devi (Kirana Store)',
    phone: '9415234567',
    amount: 25000,
    portalOrAccount: 'SBI Main Current A/C',
    time: '11:15 AM',
    note: 'Online bill payments deposit'
  },
  {
    id: 'jama-3',
    branchId: 'branch-1',
    date: '2026-09-16',
    name: 'Rajesh Yadav (Transport)',
    phone: '9935345678',
    amount: 120000,
    portalOrAccount: 'Spice Money',
    time: '01:45 PM',
    note: 'Drivers salary transfer funds'
  },
  {
    id: 'jama-4',
    branchId: 'branch-1',
    date: '2026-09-16',
    name: 'Mohd. Imran (Auto Garage)',
    phone: '9335567890',
    amount: 15000,
    portalOrAccount: 'Cash in Hand',
    time: '03:20 PM',
    note: 'Spare parts online payment advance'
  },
  // Yesterday (2026-09-15)
  {
    id: 'jama-prev-1',
    branchId: 'branch-1',
    date: '2026-09-15',
    name: 'Ramesh Kumar Verma (Dairy)',
    phone: '9839123456',
    amount: 38000,
    portalOrAccount: 'Cash in Hand',
    time: '09:40 AM',
    note: 'Milk payout cash deposit'
  },
  {
    id: 'jama-prev-2',
    branchId: 'branch-1',
    date: '2026-09-15',
    name: 'Vikas Gupta (Mobile Shop)',
    phone: '9792112233',
    amount: 55000,
    portalOrAccount: 'PayNearby',
    time: '02:00 PM',
    note: 'Recharge & bill payment wallet transfer'
  },
  // Day Before Yesterday (2026-09-14)
  {
    id: 'jama-prev-3',
    branchId: 'branch-1',
    date: '2026-09-14',
    name: 'Rajesh Yadav (Transport)',
    phone: '9935345678',
    amount: 80000,
    portalOrAccount: 'Spice Money',
    time: '11:00 AM',
    note: 'Fleet driver expenses money transfer'
  },
  // Branch 2 Today
  {
    id: 'jama-5',
    branchId: 'branch-2',
    date: '2026-09-16',
    name: 'Dinesh Chandra (Hotel Shivam)',
    phone: '9450678901',
    amount: 60000,
    portalOrAccount: 'Cash in Hand',
    time: '10:00 AM',
    note: 'Daily hotel cash deposit for DMT'
  }
];

// Liya records with date
export const INITIAL_LIYA_RECORDS = [
  // Today (2026-09-16)
  {
    id: 'liya-1',
    branchId: 'branch-1',
    date: '2026-09-16',
    name: 'Pooja Sharma (Teacher)',
    phone: '9889456789',
    amount: 10000,
    portalOrAccount: 'PayNearby (AEPS)',
    time: '10:15 AM',
    note: 'Aadhaar biometric cash payout'
  },
  {
    id: 'liya-2',
    branchId: 'branch-1',
    date: '2026-09-16',
    name: 'Santosh Rawat (Farmer)',
    phone: '9450129988',
    amount: 5000,
    portalOrAccount: 'CSC DigiPay (AEPS)',
    time: '11:45 AM',
    note: 'Gramin Bank biometric withdrawal'
  },
  {
    id: 'liya-3',
    branchId: 'branch-1',
    date: '2026-09-16',
    name: 'Ramesh Kumar Verma (Dairy)',
    phone: '9839123456',
    amount: 38000,
    portalOrAccount: 'Fino Payments Bank',
    time: '02:10 PM',
    note: 'Supplier bank payout from Fino'
  },
  {
    id: 'liya-4',
    branchId: 'branch-1',
    date: '2026-09-16',
    name: 'Mohd. Imran (Auto Garage)',
    phone: '9335567890',
    amount: 22500,
    portalOrAccount: 'Cash in Hand (Udhar)',
    time: '04:00 PM',
    note: 'Emergency parts cash withdrawal on credit'
  },
  // Yesterday (2026-09-15)
  {
    id: 'liya-prev-1',
    branchId: 'branch-1',
    date: '2026-09-15',
    name: 'Kavita Singh (Asha Worker)',
    phone: '9415887766',
    amount: 12000,
    portalOrAccount: 'Spice Money (AEPS)',
    time: '11:20 AM',
    note: 'Monthly honorarium biometric cash payout'
  },
  {
    id: 'liya-prev-2',
    branchId: 'branch-1',
    date: '2026-09-15',
    name: 'Sunil Pandey (Contractor)',
    phone: '9839554433',
    amount: 45000,
    portalOrAccount: 'Cash in Hand',
    time: '03:15 PM',
    note: 'Labour daily cash wages payout'
  },
  // Day Before Yesterday (2026-09-14)
  {
    id: 'liya-prev-3',
    branchId: 'branch-1',
    date: '2026-09-14',
    name: 'Pooja Sharma (Teacher)',
    phone: '9889456789',
    amount: 15000,
    portalOrAccount: 'CSC DigiPay (AEPS)',
    time: '10:30 AM',
    note: 'Festival advance biometric withdrawal'
  },
  // Branch 2 Today
  {
    id: 'liya-5',
    branchId: 'branch-2',
    date: '2026-09-16',
    name: 'Anita Maurya (SHG Group)',
    phone: '9125789012',
    amount: 8000,
    portalOrAccount: 'Fino Bank (Br 2)',
    time: '11:30 AM',
    note: 'SHG savings withdrawal payout'
  }
];
