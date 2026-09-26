/**
 * Multi-Day & Historical 4-Pillar Data Model for Jan Seva Kendra Daily Hisab
 * Stores daily snapshots of Portals, Bank Accounts, Jama and Liya for Today and Past Dates
 */
import { getOffsetDateString } from '../utils/formatters';

export const TODAY_KEY = getOffsetDateString(0);
export const YESTERDAY_KEY = getOffsetDateString(-1);
export const DAY_BEFORE_KEY = getOffsetDateString(-2);

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

// Unified customer master list
export const INITIAL_CUSTOMERS = [
  { id: 'c1', name: 'Ramesh Kumar Verma (Dairy)', phone: '9839123456', category: 'Dairy Vendor', address: 'Market Road' },
  { id: 'c2', name: 'Sunita Devi (Kirana Store)', phone: '9415234567', category: 'Shopkeeper', address: 'Chowk Bazar' },
  { id: 'c3', name: 'Rajesh Yadav (Transport)', phone: '9935345678', category: 'Transporter', address: 'Highway Bypass' },
  { id: 'c4', name: 'Mohd. Imran (Auto Garage)', phone: '9335567890', category: 'Auto Garage', address: 'Station Road' },
  { id: 'c5', name: 'Pooja Sharma (Teacher)', phone: '9889456789', category: 'Govt Teacher', address: 'Civil Lines' },
  { id: 'c6', name: 'Santosh Rawat (Farmer)', phone: '9450129988', category: 'Farmer', address: 'Gram Rampur' },
  { id: 'c7', name: 'Vikas Gupta (Mobile Shop)', phone: '9792112233', category: 'Retailer', address: 'Main Bazar' },
  { id: 'c8', name: 'Kavita Singh (Asha Worker)', phone: '9415887766', category: 'Asha Worker', address: 'Hospital Road' },
  { id: 'c9', name: 'Sunil Pandey (Contractor)', phone: '9839554433', category: 'Contractor', address: 'Indiranagar' },
  { id: 'c10', name: 'Dinesh Chandra (Hotel Shivam)', phone: '9450678901', category: 'Hotel Owner', address: 'Station Road' },
  { id: 'c11', name: 'Anita Maurya (SHG Group)', phone: '9125789012', category: 'SHG Leader', address: 'Gram Kalyanpur' }
];

// Portals by `${branchId}_${date}`
export const INITIAL_DAILY_PORTALS = {
  // Today - Branch 1
  [`branch-1_${TODAY_KEY}`]: [
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
  // Yesterday - Branch 1
  [`branch-1_${YESTERDAY_KEY}`]: [
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
  // Day Before Yesterday - Branch 1
  [`branch-1_${DAY_BEFORE_KEY}`]: [
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
  [`branch-2_${TODAY_KEY}`]: [
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
  [`branch-1_${TODAY_KEY}`]: [
    { id: 'acc-1', name: 'Cash in Hand', type: 'CASH', opening: 45000, deposits: 32000, withdrawals: 28000, color: '#10b981' },
    { id: 'acc-2', name: 'SBI Main Current A/C (3098****44)', type: 'BANK', opening: 85000, deposits: 25000, withdrawals: 15000, color: '#0284c7' },
    { id: 'acc-3', name: 'HDFC CSP Settlement A/C (5020****11)', type: 'BANK', opening: 50000, deposits: 20000, withdrawals: 10000, color: '#4f46e5' },
    { id: 'acc-4', name: 'PNB Savings A/C (0045****99)', type: 'BANK', opening: 25000, deposits: 5000, withdrawals: 0, color: '#dc2626' }
  ],
  // Yesterday - Branch 1
  [`branch-1_${YESTERDAY_KEY}`]: [
    { id: 'acc-1', name: 'Cash in Hand', type: 'CASH', opening: 42000, deposits: 28000, withdrawals: 25000, color: '#10b981' },
    { id: 'acc-2', name: 'SBI Main Current A/C (3098****44)', type: 'BANK', opening: 75000, deposits: 30000, withdrawals: 20000, color: '#0284c7' },
    { id: 'acc-3', name: 'HDFC CSP Settlement A/C (5020****11)', type: 'BANK', opening: 45000, deposits: 15000, withdrawals: 10000, color: '#4f46e5' },
    { id: 'acc-4', name: 'PNB Savings A/C (0045****99)', type: 'BANK', opening: 20000, deposits: 5000, withdrawals: 0, color: '#dc2626' }
  ],
  // Day Before Yesterday - Branch 1
  [`branch-1_${DAY_BEFORE_KEY}`]: [
    { id: 'acc-1', name: 'Cash in Hand', type: 'CASH', opening: 38000, deposits: 30000, withdrawals: 26000, color: '#10b981' },
    { id: 'acc-2', name: 'SBI Main Current A/C (3098****44)', type: 'BANK', opening: 70000, deposits: 25000, withdrawals: 20000, color: '#0284c7' },
    { id: 'acc-3', name: 'HDFC CSP Settlement A/C (5020****11)', type: 'BANK', opening: 40000, deposits: 12000, withdrawals: 7000, color: '#4f46e5' },
    { id: 'acc-4', name: 'PNB Savings A/C (0045****99)', type: 'BANK', opening: 18000, deposits: 4000, withdrawals: 2000, color: '#dc2626' }
  ],
  // Branch 2 Today
  [`branch-2_${TODAY_KEY}`]: [
    { id: 'acc-1-b2', name: 'Cash in Hand', type: 'CASH', opening: 30000, deposits: 20000, withdrawals: 18000, color: '#10b981' },
    { id: 'acc-2-b2', name: 'SBI Station Road Branch A/C', type: 'BANK', opening: 60000, deposits: 15000, withdrawals: 10000, color: '#0284c7' },
    { id: 'acc-3-b2', name: 'Canara Bank Current A/C', type: 'BANK', opening: 35000, deposits: 10000, withdrawals: 5000, color: '#f59e0b' }
  ]
};

// Jama records with date
export const INITIAL_JAMA_RECORDS = [
  // Today
  {
    id: 'jama-1',
    branchId: 'branch-1',
    date: TODAY_KEY,
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
    date: TODAY_KEY,
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
    date: TODAY_KEY,
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
    date: TODAY_KEY,
    name: 'Mohd. Imran (Auto Garage)',
    phone: '9335567890',
    amount: 15000,
    portalOrAccount: 'Cash in Hand',
    time: '03:20 PM',
    note: 'Spare parts online payment advance'
  },
  // Yesterday
  {
    id: 'jama-prev-1',
    branchId: 'branch-1',
    date: YESTERDAY_KEY,
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
    date: YESTERDAY_KEY,
    name: 'Vikas Gupta (Mobile Shop)',
    phone: '9792112233',
    amount: 55000,
    portalOrAccount: 'PayNearby',
    time: '02:00 PM',
    note: 'Recharge & bill payment wallet transfer'
  },
  // Day Before Yesterday
  {
    id: 'jama-prev-3',
    branchId: 'branch-1',
    date: DAY_BEFORE_KEY,
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
    date: TODAY_KEY,
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
  // Today
  {
    id: 'liya-1',
    branchId: 'branch-1',
    date: TODAY_KEY,
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
    date: TODAY_KEY,
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
    date: TODAY_KEY,
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
    date: TODAY_KEY,
    name: 'Mohd. Imran (Auto Garage)',
    phone: '9335567890',
    amount: 22500,
    portalOrAccount: 'Cash in Hand (credit)',
    time: '04:00 PM',
    note: 'Emergency parts cash withdrawal on credit'
  },
  // Yesterday
  {
    id: 'liya-prev-1',
    branchId: 'branch-1',
    date: YESTERDAY_KEY,
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
    date: YESTERDAY_KEY,
    name: 'Sunil Pandey (Contractor)',
    phone: '9839554433',
    amount: 45000,
    portalOrAccount: 'Cash in Hand',
    time: '03:15 PM',
    note: 'Labour daily cash wages payout'
  },
  // Day Before Yesterday
  {
    id: 'liya-prev-3',
    branchId: 'branch-1',
    date: DAY_BEFORE_KEY,
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
    date: TODAY_KEY,
    name: 'Anita Maurya (SHG Group)',
    phone: '9125789012',
    amount: 8000,
    portalOrAccount: 'Fino Bank (Br 2)',
    time: '11:30 AM',
    note: 'SHG savings withdrawal payout'
  }
];

// Daily shop expense records
export const INITIAL_EXPENSES = [
  // Today - Branch 1
  {
    id: 'exp-1',
    branchId: 'branch-1',
    date: TODAY_KEY,
    title: 'Morning Tea & Samosa Refreshment',
    amount: 180,
    category: 'CHAI_SNACKS',
    paymentMode: 'Cash in Hand',
    vendor: 'Pappu Tea Stall',
    remark: 'For shop operator & customer hospitality',
    time: '10:15 AM'
  },
  {
    id: 'exp-2',
    branchId: 'branch-1',
    date: TODAY_KEY,
    title: 'JK Copier A4 Paper Bundle (1 Box / 500 Sheets)',
    amount: 320,
    category: 'STATIONERY',
    paymentMode: 'Cash in Hand',
    vendor: 'Gupta Stationery Mart',
    remark: 'For customer receipts & printouts',
    time: '12:30 PM'
  },
  {
    id: 'exp-3',
    branchId: 'branch-1',
    date: TODAY_KEY,
    title: 'Broadband Fiber Internet Recharge (300 Mbps)',
    amount: 599,
    category: 'ELECTRICITY_INTERNET',
    paymentMode: 'SBI Main Current A/C',
    vendor: 'Airtel Xstream Fiber',
    remark: 'Monthly high-speed connection for portals',
    time: '02:00 PM'
  },
  {
    id: 'exp-4',
    branchId: 'branch-1',
    date: TODAY_KEY,
    title: 'Shop Cleaning & Waste Disposal',
    amount: 100,
    category: 'OTHER',
    paymentMode: 'Cash in Hand',
    vendor: 'Local Cleaner',
    remark: 'Daily shop upkeep',
    time: '06:00 PM'
  },
  // Yesterday - Branch 1
  {
    id: 'exp-prev-1',
    branchId: 'branch-1',
    date: YESTERDAY_KEY,
    title: 'Tea & Refreshments',
    amount: 140,
    category: 'CHAI_SNACKS',
    paymentMode: 'Cash in Hand',
    vendor: 'Pappu Tea Stall',
    remark: '',
    time: '11:00 AM'
  },
  {
    id: 'exp-prev-2',
    branchId: 'branch-1',
    date: YESTERDAY_KEY,
    title: 'Thermal Printer Paper Rolls (Pack of 5)',
    amount: 250,
    category: 'STATIONERY',
    paymentMode: 'Cash in Hand',
    vendor: 'City Mart',
    remark: 'POS slip printing rolls',
    time: '03:15 PM'
  },
  // Day Before Yesterday
  {
    id: 'exp-prev-3',
    branchId: 'branch-1',
    date: DAY_BEFORE_KEY,
    title: 'Electricity Power Backup / Inverter Battery Water',
    amount: 200,
    category: 'ELECTRICITY_INTERNET',
    paymentMode: 'Cash in Hand',
    vendor: 'Battery Shop',
    remark: 'Distilled water refill',
    time: '01:00 PM'
  },
  {
    id: 'exp-prev-4',
    branchId: 'branch-1',
    date: DAY_BEFORE_KEY,
    title: 'Tea & Snacks',
    amount: 150,
    category: 'CHAI_SNACKS',
    paymentMode: 'Cash in Hand',
    vendor: 'Pappu Tea Stall',
    remark: '',
    time: '11:30 AM'
  },
  // Branch 2 Today
  {
    id: 'exp-b2-1',
    branchId: 'branch-2',
    date: TODAY_KEY,
    title: 'Tea & Biscuits',
    amount: 120,
    category: 'CHAI_SNACKS',
    paymentMode: 'Cash in Hand',
    vendor: 'Station Tea Stall',
    remark: '',
    time: '10:30 AM'
  }
];

// Daily other income and service fee records (AEPS, DMT, PF, photocopy, and more)
export const INITIAL_INCOMES = [
  // Today - Branch 1
  {
    id: 'inc-1',
    branchId: 'branch-1',
    date: TODAY_KEY,
    title: 'AEPS Biometric Cash Out Commission',
    amount: 650,
    category: 'AEPS',
    paymentMode: 'Cash in Hand',
    customerName: 'Multiple Biometric Cash Payouts',
    remark: 'AEPS commission + customer cash fee',
    time: '11:00 AM'
  },
  {
    id: 'inc-2',
    branchId: 'branch-1',
    date: TODAY_KEY,
    title: 'DMT Money Transfer Service Fee',
    amount: 480,
    category: 'DMT',
    paymentMode: 'Cash in Hand',
    customerName: 'Transport & Vendor Transfers',
    remark: '1% fee collected on urgent bank transfer',
    time: '01:30 PM'
  },
  {
    id: 'inc-3',
    branchId: 'branch-1',
    date: TODAY_KEY,
    title: 'PF / EPFO Online Form & Claim Apply',
    amount: 500,
    category: 'PF',
    paymentMode: 'Cash in Hand',
    customerName: 'Santosh Rawat & Factory Workers (2 Claims)',
    remark: 'PF Form 19 & 10C online submission charge',
    time: '02:45 PM'
  },
  {
    id: 'inc-4',
    branchId: 'branch-1',
    date: TODAY_KEY,
    title: 'Photo Copy, Xerox & Printout (50 Pages + 4 Lamination)',
    amount: 320,
    category: 'PHOTOCOPY',
    paymentMode: 'Cash in Hand',
    customerName: 'Daily Counter Xerox Walk-ins',
    remark: 'Black & white photocopy, color prints & certificate lamination',
    time: '04:15 PM'
  },
  {
    id: 'inc-5',
    branchId: 'branch-1',
    date: TODAY_KEY,
    title: 'New PAN Card Application & Correction',
    amount: 300,
    category: 'PAN_PASSPORT',
    paymentMode: 'UPI / Online',
    customerName: 'Vikas Gupta (2 Applications)',
    remark: 'Instant e-KYC PAN apply service charge',
    time: '05:00 PM'
  },
  {
    id: 'inc-6',
    branchId: 'branch-1',
    date: TODAY_KEY,
    title: 'Electricity & Water Bill Payment Fee',
    amount: 150,
    category: 'BILL_PAYMENT',
    paymentMode: 'Cash in Hand',
    customerName: 'UPPCL Bill Deposits (5 Bills)',
    remark: '₹30 per electricity bill service charge',
    time: '05:40 PM'
  },
  // Yesterday - Branch 1
  {
    id: 'inc-prev-1',
    branchId: 'branch-1',
    date: YESTERDAY_KEY,
    title: 'AEPS Withdrawal Commission',
    amount: 580,
    category: 'AEPS',
    paymentMode: 'Cash in Hand',
    customerName: 'Aadhaar Biometric Payouts',
    remark: '',
    time: '12:00 PM'
  },
  {
    id: 'inc-prev-2',
    branchId: 'branch-1',
    date: YESTERDAY_KEY,
    title: 'DMT Money Transfer Fee',
    amount: 420,
    category: 'DMT',
    paymentMode: 'Cash in Hand',
    customerName: 'Labour Salary Transfers',
    remark: '',
    time: '02:15 PM'
  },
  {
    id: 'inc-prev-3',
    branchId: 'branch-1',
    date: YESTERDAY_KEY,
    title: 'PF KYC & Passbook Download',
    amount: 250,
    category: 'PF',
    paymentMode: 'Cash in Hand',
    customerName: 'Sunil Pandey Worker',
    remark: '',
    time: '03:30 PM'
  },
  {
    id: 'inc-prev-4',
    branchId: 'branch-1',
    date: YESTERDAY_KEY,
    title: 'Photo Copy & Lamination',
    amount: 280,
    category: 'PHOTOCOPY',
    paymentMode: 'Cash in Hand',
    customerName: 'Counter Printouts',
    remark: '',
    time: '05:10 PM'
  },
  // Branch 2 Today
  {
    id: 'inc-b2-1',
    branchId: 'branch-2',
    date: TODAY_KEY,
    title: 'AEPS & DMT Counter Income',
    amount: 600,
    category: 'AEPS',
    paymentMode: 'Cash in Hand',
    customerName: 'Station Road Customers',
    remark: '',
    time: '01:00 PM'
  },
  {
    id: 'inc-b2-2',
    branchId: 'branch-2',
    date: TODAY_KEY,
    title: 'Photo Copy & Forms Filling',
    amount: 350,
    category: 'PHOTOCOPY',
    paymentMode: 'Cash in Hand',
    customerName: 'Student Exam Forms & Xerox',
    remark: '',
    time: '03:00 PM'
  }
];
