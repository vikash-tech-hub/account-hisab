import React from 'react';
import { useHisab } from '../../context/HisabContext';
import { StatCard } from '../common/StatCard';
import { formatINR } from '../../utils/formatters';
import {
  Wallet,
  CreditCard,
  ArrowDownLeft,
  TrendingUp
} from 'lucide-react';

export const SummaryCards = ({ onSelectTab }) => {
  const { dailySummary, activePortals } = useHisab();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Cash In Hand */}
      <StatCard
        title="Closing Cash in Hand"
        titleHindi="Physical Drawer Cash"
        value={formatINR(dailySummary.expectedClosingCash)}
        subtitle={`Opening Cash: ${formatINR(dailySummary.openingCash)}`}
        icon={Wallet}
        color="emerald"
        actionLabel="Daily Register"
        onClick={() => onSelectTab && onSelectTab('daily-hisab')}
      />

      {/* 2. Total Portal Balances */}
      <StatCard
        title="Total Portal Liquidity"
        titleHindi="All 10 Portals Combined"
        value={formatINR(dailySummary.totalPortalClosing)}
        subtitle={`Active Portals: ${activePortals.length} IDs`}
        icon={CreditCard}
        color="sky"
        actionLabel="View Portals"
        onClick={() => onSelectTab && onSelectTab('portals')}
      />

      {/* 3. Today's Volume (Jama & Liya) */}
      <StatCard
        title="Today's Total Flow"
        titleHindi="Deposits vs Withdrawals"
        value={formatINR(dailySummary.totalJamaCash + dailySummary.totalLiyaCash)}
        subtitle={`Inflow: +${formatINR(dailySummary.totalJamaCash)} | Outflow: -${formatINR(dailySummary.totalLiyaCash)}`}
        icon={ArrowDownLeft}
        color="indigo"
        actionLabel="View Flow"
        onClick={() => onSelectTab && onSelectTab('daily-hisab')}
      />

      {/* 4. Net Commission / Daily Profit */}
      <StatCard
        title="Net Daily Profit"
        titleHindi="Commissions - Expenses"
        value={formatINR(dailySummary.netDailyProfit)}
        subtitle={`Commission: +${formatINR(dailySummary.totalCommissionEarned)} | Expenses: -${formatINR(dailySummary.totalExpenses)}`}
        icon={TrendingUp}
        color="purple"
        actionLabel="Expense Log"
        onClick={() => onSelectTab && onSelectTab('expenses')}
      />
    </div>
  );
};
