/**
 * Financial and reconciliation calculation formulas for Jan Seva Kendra Hisab
 */

/**
 * Calculate full daily summary based on register, transactions, and expenses
 */
export const calculateDailySummary = (register, transactions = [], expenses = []) => {
  if (!register) {
    return {
      openingCash: 0,
      totalJamaCash: 0,
      totalLiyaCash: 0,
      totalExpenses: 0,
      totalTransfersIn: 0,
      totalTransfersOut: 0,
      expectedClosingCash: 0,
      totalPortalOpening: 0,
      totalPortalClosing: 0,
      totalDmtSent: 0,
      totalAepsReceived: 0,
      totalCommissionEarned: 0,
      netDailyProfit: 0,
      portalSummaries: {}
    };
  }

  const openingCash = Number(register.openingCash || 0);

  // Initialize portal summaries from register.openingPortals
  const portalSummaries = {};
  let totalPortalOpening = 0;

  Object.entries(register.openingPortals || {}).forEach(([portalId, bal]) => {
    const opening = Number(bal || 0);
    totalPortalOpening += opening;
    portalSummaries[portalId] = {
      opening,
      dmtOut: 0,
      aepsIn: 0,
      loadIn: 0,
      transferOut: 0,
      commission: 0,
      closing: opening
    };
  });

  let totalJamaCash = 0;       // Cash in hand from customer deposits/DMT cash received
  let totalLiyaCash = 0;       // Cash paid out to customer for AEPS/Liya
  let totalDmtSent = 0;        // DMT money transferred out of portals
  let totalAepsReceived = 0;   // AEPS money received into portals
  let totalCommissionEarned = 0;
  let totalTransfersIn = 0;    // Cash In via Bank/ATM withdrawal
  let totalTransfersOut = 0;   // Cash Out to load portal wallet

  // Process today's transactions
  transactions.forEach((tx) => {
    const amount = Number(tx.amount || 0);
    const comm = Number(tx.commission || 0);
    totalCommissionEarned += comm;

    switch (tx.type) {
      case 'DMT': // Customer gave cash, Kendra sent from Portal
        totalJamaCash += amount + comm; // customer pays transfer amount + fee in cash
        totalDmtSent += amount;
        if (portalSummaries[tx.portalId]) {
          portalSummaries[tx.portalId].dmtOut += amount;
          portalSummaries[tx.portalId].commission += comm;
        }
        break;

      case 'AEPS': // Customer swiped finger, Kendra gave physical cash
        totalLiyaCash += amount; // Kendra gave physical cash to customer
        totalAepsReceived += amount;
        if (portalSummaries[tx.portalId]) {
          portalSummaries[tx.portalId].aepsIn += amount;
          portalSummaries[tx.portalId].commission += comm;
        }
        break;

      case 'JAMA': // Direct cash deposit by customer to shop khata / savings
        totalJamaCash += amount;
        break;

      case 'LIYA': // Cash withdrawn / taken by customer on credit or from khata
        totalLiyaCash += amount;
        break;

      case 'PORTAL_LOAD': // Kendra used cash to load portal wallet
        totalTransfersOut += amount; // Cash goes out to distributor/bank
        if (portalSummaries[tx.portalId]) {
          portalSummaries[tx.portalId].loadIn += amount;
        }
        break;

      case 'BANK_WITHDRAWAL': // Owner withdrew cash from bank into drawer
        totalTransfersIn += amount;
        break;

      case 'PORTAL_TO_PORTAL': // Transfer between portal A to portal B
        if (portalSummaries[tx.fromPortalId]) {
          portalSummaries[tx.fromPortalId].transferOut += amount;
        }
        if (portalSummaries[tx.toPortalId]) {
          portalSummaries[tx.toPortalId].loadIn += amount;
        }
        break;

      default:
        break;
    }
  });

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

  // Calculate closing balances for each portal
  let totalPortalClosing = 0;
  Object.keys(portalSummaries).forEach((portalId) => {
    const p = portalSummaries[portalId];
    p.closing = p.opening + p.aepsIn + p.loadIn - p.dmtOut - p.transferOut;
    totalPortalClosing += p.closing;
  });

  // Expected Closing Cash Formula
  // Closing Cash = Opening Cash + (Cash in from DMT + Jama + Bank Withdrawal) - (Cash out to AEPS + Liya + Portal Topups + Expenses)
  const expectedClosingCash =
    openingCash + totalJamaCash + totalTransfersIn - totalLiyaCash - totalTransfersOut - totalExpenses;

  // Net Profit = Total Commission - Shop Expenses
  const netDailyProfit = totalCommissionEarned - totalExpenses;

  return {
    openingCash,
    totalJamaCash,
    totalLiyaCash,
    totalExpenses,
    totalTransfersIn,
    totalTransfersOut,
    expectedClosingCash,
    totalPortalOpening,
    totalPortalClosing,
    totalDmtSent,
    totalAepsReceived,
    totalCommissionEarned,
    netDailyProfit,
    portalSummaries
  };
};

/**
 * Denomination calculator total
 */
export const calculateDenominationsTotal = (denominations = {}) => {
  const values = {
    500: 500,
    200: 200,
    100: 100,
    50: 50,
    20: 20,
    10: 10,
    5: 5,
    coins: 1
  };

  let total = 0;
  const breakdown = {};

  Object.entries(values).forEach(([denom, val]) => {
    const count = Number(denominations[denom] || 0);
    const subtotal = count * val;
    breakdown[denom] = {
      count,
      subtotal
    };
    total += subtotal;
  });

  return { total, breakdown };
};
