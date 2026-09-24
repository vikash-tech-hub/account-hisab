import React from 'react';
import { useHisab } from '../../context/HisabContext';
import { formatINR } from '../../utils/formatters';
import {
  CreditCard,
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  WalletCards,
  Coins,
  Sparkles,
  TrendingUp,
  HelpCircle
} from 'lucide-react';

export const HisabSummaryOverview = ({ activeSection, setActiveSection }) => {
  const {
    totalPortalsBalance,
    totalBankBalance,
    totalJamaAmount,
    totalLiyaAmount,
    totalExpenses,
    todaysExpenses,
    totalIncomes,
    todaysIncomes,
    netTotalCapital,
    activePortals,
    activeBankAccounts,
    activeJamaList,
    activeLiyaList
  } = useHisab();

  const cards = [
    {
      id: 'portals',
      title: '1. All Portals',
      hindi: 'सभी 10 पोर्टल बैलेंस',
      amount: totalPortalsBalance,
      count: `${activePortals.length} IDs`,
      icon: CreditCard,
      border: 'hover:border-amber-500/50',
      activeBorder: 'ring-2 ring-amber-500 bg-amber-500/10 border-amber-500/60',
      gradient: 'from-amber-500/10 via-slate-900 to-slate-900',
      textColor: 'text-amber-600 dark:text-amber-400',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30'
    },
    {
      id: 'accounts',
      title: '2. Bank & Cash',
      hindi: 'बैंक व गल्ला कैश',
      amount: totalBankBalance,
      count: `${activeBankAccounts.length} A/C`,
      icon: Landmark,
      border: 'hover:border-sky-500/50',
      activeBorder: 'ring-2 ring-sky-500 bg-sky-500/10 border-sky-500/60',
      gradient: 'from-sky-500/10 via-slate-900 to-slate-900',
      textColor: 'text-sky-600 dark:text-sky-400',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-500/20 dark:text-sky-300 dark:border-sky-500/30'
    },
    {
      id: 'jama',
      title: '3. People Jama',
      hindi: 'ग्राहकों का जमा कैश',
      amount: totalJamaAmount,
      count: `${activeJamaList.length} जमा`,
      icon: ArrowDownLeft,
      border: 'hover:border-emerald-500/50',
      activeBorder: 'ring-2 ring-emerald-500 bg-emerald-500/10 border-emerald-500/60',
      gradient: 'from-emerald-500/10 via-slate-900 to-slate-900',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30'
    },
    {
      id: 'liya',
      title: '4. People Liya',
      hindi: 'उधार / निकासी दिया',
      amount: totalLiyaAmount,
      count: `${activeLiyaList.length} निकासी`,
      icon: ArrowUpRight,
      border: 'hover:border-rose-500/50',
      activeBorder: 'ring-2 ring-rose-500 bg-rose-500/10 border-rose-500/60',
      gradient: 'from-rose-500/10 via-slate-900 to-slate-900',
      textColor: 'text-rose-600 dark:text-rose-400',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-500/20 dark:text-rose-300 dark:border-rose-500/30'
    },
    {
      id: 'incomes',
      title: '5. Other Income',
      hindi: 'AEPS/DMT/PF/Xerox कमाई',
      amount: totalIncomes,
      count: `${todaysIncomes.length} सेवा`,
      icon: Coins,
      border: 'hover:border-teal-500/50',
      activeBorder: 'ring-2 ring-teal-500 bg-teal-500/10 border-teal-500/60',
      gradient: 'from-teal-500/10 via-slate-900 to-slate-900',
      textColor: 'text-teal-600 dark:text-teal-400',
      badgeBg: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-500/20 dark:text-teal-300 dark:border-teal-500/30'
    },
    {
      id: 'expenses',
      title: '6. Shop Kharcha',
      hindi: 'चाय, पेपर व दुकान खर्च',
      amount: totalExpenses,
      count: `${todaysExpenses.length} खर्च`,
      icon: Receipt,
      border: 'hover:border-pink-500/50',
      activeBorder: 'ring-2 ring-pink-500 bg-pink-500/10 border-pink-500/60',
      gradient: 'from-pink-500/10 via-slate-900 to-slate-900',
      textColor: 'text-pink-600 dark:text-pink-400',
      badgeBg: 'bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-500/20 dark:text-pink-300 dark:border-pink-500/30'
    }
  ];

  return (
    <div className="space-y-4">
      {/* 6 Core Pillars Metric Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {cards.map((c) => {
          const Icon = c.icon;
          const isSelected = activeSection === c.id;

          return (
            <div
              key={c.id}
              onClick={() => setActiveSection && setActiveSection(c.id)}
              className={`p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900/90 border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md relative overflow-hidden group ${
                isSelected
                  ? c.activeBorder
                  : `border-slate-200 dark:border-slate-800 ${c.border}`
              }`}
            >
              <div className="flex items-start justify-between gap-1.5">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate flex items-center gap-1">
                    {c.title}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate font-medium">
                    {c.hindi}
                  </div>
                </div>

                <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shrink-0 group-hover:scale-110 transition-transform">
                  <Icon className={`w-3.5 h-3.5 ${c.textColor}`} />
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between gap-1">
                <div className={`text-lg sm:text-xl font-black font-mono tracking-tight truncate ${c.textColor}`}>
                  {formatINR(c.amount)}
                </div>

                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 border ${c.badgeBg}`}>
                  {c.count}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grand Net Total & Formula Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-50/90 via-white to-emerald-50/50 dark:from-slate-900 dark:via-indigo-950 dark:to-slate-900 border border-indigo-200 dark:border-indigo-500/40 shadow-sm dark:shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-md shadow-indigo-600/20 shrink-0">
            <WalletCards className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-indigo-950 dark:text-indigo-200">
                Total Available Capital / Net Hisab (कुल पूँजी & शुद्ध हिसाब)
              </span>
              <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse" />
                Live Tally
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 leading-relaxed font-medium flex flex-wrap items-center gap-1.5">
              <span className="bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-300 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-500/20 font-bold">
                पोर्टल ({formatINR(totalPortalsBalance)})
              </span>
              <span className="text-slate-400 font-bold">+</span>
              <span className="bg-sky-100 text-sky-900 dark:bg-sky-500/15 dark:text-sky-300 px-2 py-0.5 rounded-md border border-sky-200 dark:border-sky-500/20 font-bold">
                बैंक/कैश ({formatINR(totalBankBalance)})
              </span>
              <span className="text-slate-400 font-bold">+</span>
              <span className="bg-rose-100 text-rose-900 dark:bg-rose-500/15 dark:text-rose-300 px-2 py-0.5 rounded-md border border-rose-200 dark:border-rose-500/20 font-bold">
                बाजार उधार ({formatINR(totalLiyaAmount)})
              </span>
              <span className="text-slate-400 font-bold">-</span>
              <span className="bg-emerald-100 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/20 font-bold">
                ग्राहक जमा ({formatINR(totalJamaAmount)})
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white dark:bg-slate-950/90 px-4 sm:px-6 py-3 rounded-xl border border-indigo-200 dark:border-indigo-500/40 shrink-0 shadow-sm dark:shadow-lg">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Total Net Capital</div>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
              {formatINR(netTotalCapital)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
