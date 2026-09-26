import React, { useMemo } from 'react';
import { useHisab } from '../../context/HisabContext';
import { formatINR } from '../../utils/formatters';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  CreditCard,
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  Coins,
  Layers,
  CalendarDays,
  Globe2
} from 'lucide-react';

const compactAxis = (value) => {
  const amount = Number(value) || 0;
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);
  if (abs >= 100000) {
    const lakhs = abs / 100000;
    const text = lakhs >= 10 ? String(Math.round(lakhs)) : String(Math.round(lakhs * 10) / 10);
    return `${sign}${text}L`;
  }
  if (abs >= 1000) {
    const thousands = abs / 1000;
    const text = thousands >= 10 ? String(Math.round(thousands)) : String(Math.round(thousands * 10) / 10);
    return `${sign}${text}k`;
  }
  return `${sign}${Math.round(abs)}`;
};

const parseDateKey = (dateStr) => {
  const [year, month, day] = String(dateStr).split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
};

const toDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-xs shadow-lg dark:border-slate-700 dark:bg-slate-950">
      <div className="mb-1 font-semibold text-slate-700 dark:text-slate-200">{label}</div>
      {payload.map((item) => (
        <div key={item.dataKey} className="font-mono" style={{ color: item.color }}>
          {item.name}: {formatINR(item.value)}
        </div>
      ))}
    </div>
  );
};

export const HisabSummaryOverview = ({ activeSection, setActiveSection }) => {
  const {
    totalPortalsBalance,
    totalBankBalance,
    totalJamaAmount,
    totalLiyaAmount,
    allTimeJamaAmount,
    allTimeLiyaAmount,
    totalExpenses,
    allTimeExpenses,
    todaysExpenses,
    totalIncomes,
    allTimeIncomes,
    todaysIncomes,
    netTotalCapital,
    allTimeNetTotalCapital,
    activePortals,
    activeBankAccounts,
    activeJamaList,
    activeLiyaList,
    allTimeJamaList,
    allTimeLiyaList,
    summaryViewMode,
    setSummaryViewMode,
    selectedDate,
    incomes,
    expenses,
    isAllShops,
    selectedBranchId,
    getDateSummary,
    theme
  } = useHisab();

  const isDaily = summaryViewMode === 'daily';
  const axisColor = theme === 'dark' ? '#94a3b8' : '#64748b';
  const gridColor = theme === 'dark' ? '#334155' : '#e2e8f0';

  const cards = [
    {
      id: 'portals',
      title: 'Portals',
      hindi: 'Closing balance',
      amount: totalPortalsBalance,
      count: `${activePortals.length} IDs`,
      icon: CreditCard,
      border: 'hover:border-amber-400',
      activeBorder: 'ring-2 ring-amber-500 border-amber-400',
      textColor: 'text-amber-600 dark:text-amber-400'
    },
    {
      id: 'accounts',
      title: 'Bank and cash',
      hindi: 'Accounts plus drawer',
      amount: totalBankBalance,
      count: `${activeBankAccounts.length} A/C`,
      icon: Landmark,
      border: 'hover:border-sky-400',
      activeBorder: 'ring-2 ring-sky-500 border-sky-400',
      textColor: 'text-sky-600 dark:text-sky-400'
    },
    {
      id: 'jama',
      title: 'Deposits',
      hindi: 'Money received',
      amount: isDaily ? totalJamaAmount : allTimeJamaAmount,
      subAmount: isDaily ? allTimeJamaAmount : totalJamaAmount,
      subLabel: isDaily ? 'All-time' : 'Today',
      count: isDaily ? `${activeJamaList.length} today` : `${allTimeJamaList?.length || 0} total`,
      icon: ArrowDownLeft,
      border: 'hover:border-emerald-400',
      activeBorder: 'ring-2 ring-emerald-500 border-emerald-400',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      chip: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
    },
    {
      id: 'liya',
      title: 'Withdrawals',
      hindi: 'Money given',
      amount: isDaily ? totalLiyaAmount : allTimeLiyaAmount,
      subAmount: isDaily ? allTimeLiyaAmount : totalLiyaAmount,
      subLabel: isDaily ? 'All-time' : 'Today',
      count: isDaily ? `${activeLiyaList.length} today` : `${allTimeLiyaList?.length || 0} total`,
      icon: ArrowUpRight,
      border: 'hover:border-rose-400',
      activeBorder: 'ring-2 ring-rose-500 border-rose-400',
      textColor: 'text-rose-600 dark:text-rose-400',
      chip: 'bg-rose-500/15 text-rose-700 dark:text-rose-300'
    },
    {
      id: 'incomes',
      title: 'Income',
      hindi: 'Service fees',
      amount: isDaily ? totalIncomes : allTimeIncomes,
      subAmount: isDaily ? allTimeIncomes : totalIncomes,
      subLabel: isDaily ? 'All-time' : 'Today',
      count: isDaily ? `${todaysIncomes.length} today` : 'All services',
      icon: Coins,
      border: 'hover:border-teal-400',
      activeBorder: 'ring-2 ring-teal-500 border-teal-400',
      textColor: 'text-teal-600 dark:text-teal-400',
      chip: 'bg-teal-500/15 text-teal-700 dark:text-teal-300'
    },
    {
      id: 'expenses',
      title: 'Expenses',
      hindi: 'Shop spend',
      amount: isDaily ? totalExpenses : allTimeExpenses,
      subAmount: isDaily ? allTimeExpenses : totalExpenses,
      subLabel: isDaily ? 'All-time' : 'Today',
      count: isDaily ? `${todaysExpenses.length} today` : 'All expenses',
      icon: Receipt,
      border: 'hover:border-pink-400',
      activeBorder: 'ring-2 ring-pink-500 border-pink-400',
      textColor: 'text-pink-600 dark:text-pink-400',
      chip: 'bg-pink-500/15 text-pink-700 dark:text-pink-300'
    }
  ];

  const currentJamaVal = isDaily ? totalJamaAmount : allTimeJamaAmount;
  const currentLiyaVal = isDaily ? totalLiyaAmount : allTimeLiyaAmount;

  const weekData = useMemo(() => {
    const anchor = parseDateKey(selectedDate);
    const rows = [];
    for (let offset = 6; offset >= 0; offset -= 1) {
      const day = new Date(anchor);
      day.setDate(anchor.getDate() - offset);
      const dateKey = toDateKey(day);
      const summary = getDateSummary(dateKey);
      const inShop = (row) => isAllShops || row.branchId === selectedBranchId;
      const income = (incomes || [])
        .filter((row) => inShop(row) && row.date === dateKey)
        .reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
      const spend = (expenses || [])
        .filter((row) => inShop(row) && row.date === dateKey)
        .reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
      rows.push({
        label: day.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        deposits: summary.jama,
        withdrawals: summary.liya,
        income,
        expenses: spend
      });
    }
    return rows;
  }, [selectedDate, getDateSummary, incomes, expenses, isAllShops, selectedBranchId]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2 px-0.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-indigo-500" />
            Summary
          </span>
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
            {isDaily ? "This day's books" : 'All-time records'}
          </span>
        </div>

        <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg">
          <button
            type="button"
            onClick={() => setSummaryViewMode('daily')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              isDaily
                ? 'bg-indigo-600 text-white'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            This day
          </button>
          <button
            type="button"
            onClick={() => setSummaryViewMode('all_time')}
            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              !isDaily
                ? 'bg-emerald-600 text-white'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
            }`}
          >
            <Globe2 className="w-3.5 h-3.5" />
            All-time
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {cards.map((card) => {
          const Icon = card.icon;
          const isSelected = activeSection === card.id;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => setActiveSection && setActiveSection(card.id)}
              className={`text-left px-2.5 py-2 rounded-xl bg-white dark:bg-slate-900 border transition-all cursor-pointer shadow-sm hover:shadow ${
                isSelected
                  ? card.activeBorder
                  : `border-slate-200 dark:border-slate-800 ${card.border}`
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 truncate">
                  {card.title}
                </span>
                <Icon className={`w-3.5 h-3.5 shrink-0 ${card.textColor}`} />
              </div>
              <div className={`mt-1 text-sm sm:text-base font-black font-mono leading-none tracking-tight ${card.textColor}`}>
                {formatINR(card.amount)}
              </div>
              <div className="mt-1 text-[10px] text-slate-500 truncate">
                {card.hindi} · {card.count}
              </div>
              {card.subAmount != null && (
                <div className={`mt-1.5 inline-flex max-w-full items-baseline gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold leading-tight ${card.chip}`}>
                  <span className="font-semibold">{card.subLabel}</span>
                  <span className="font-mono">{formatINR(card.subAmount)}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="px-3 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            {isDaily ? 'Daily net capital' : 'All-time net capital'}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug">
            Portals {formatINR(totalPortalsBalance)} + Bank and cash {formatINR(totalBankBalance)} + {isDaily ? 'credit given' : 'all-time credit'} {formatINR(currentLiyaVal)} − {isDaily ? 'deposits' : 'all-time deposits'} {formatINR(currentJamaVal)}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setSummaryViewMode('daily')}
            className={`px-3 py-1.5 rounded-lg border text-left cursor-pointer ${
              isDaily
                ? 'border-indigo-400 bg-indigo-50 dark:bg-indigo-500/10'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-slate-500">Daily</div>
            <div className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">
              {formatINR(netTotalCapital)}
            </div>
          </button>
          <button
            type="button"
            onClick={() => setSummaryViewMode('all_time')}
            className={`px-3 py-1.5 rounded-lg border text-left cursor-pointer ${
              !isDaily
                ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-slate-500">All-time</div>
            <div className="text-sm font-black font-mono text-cyan-600 dark:text-cyan-400">
              {formatINR(allTimeNetTotalCapital)}
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
          <div className="mb-2">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Deposits and withdrawals</h3>
            <p className="text-[11px] text-slate-500">Bar chart for the last 7 days</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weekData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }} barGap={2}>
                <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={compactAxis} tick={{ fill: axisColor, fontSize: 11 }} width={42} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="deposits" name="Deposits" fill="#059669" radius={[4, 4, 0, 0]} maxBarSize={18} />
                <Bar dataKey="withdrawals" name="Withdrawals" fill="#e11d48" radius={[4, 4, 0, 0]} maxBarSize={18} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3">
          <div className="mb-2">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Income and expenses</h3>
            <p className="text-[11px] text-slate-500">Line graph for the last 7 days</p>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weekData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: axisColor, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={compactAxis} tick={{ fill: axisColor, fontSize: 11 }} width={42} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="income" name="Income" stroke="#0d9488" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#db2777" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
