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
      textColor: 'text-amber-400',
      badgeBg: 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
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
      textColor: 'text-sky-400',
      badgeBg: 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
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
      textColor: 'text-emerald-400',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
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
      textColor: 'text-rose-400',
      badgeBg: 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
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
      textColor: 'text-teal-400',
      badgeBg: 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
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
      textColor: 'text-pink-400',
      badgeBg: 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
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
              className={`p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br bg-slate-900/90 border transition-all duration-200 cursor-pointer shadow-lg relative overflow-hidden group ${
                isSelected
                  ? c.activeBorder
                  : `border-slate-800 ${c.border}`
              }`}
            >
              <div className="flex items-start justify-between gap-1.5">
                <div className="min-w-0">
                  <div className="text-xs font-bold text-slate-200 truncate flex items-center gap-1">
                    {c.title}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5 truncate font-medium">
                    {c.hindi}
                  </div>
                </div>

                <div className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 shrink-0 group-hover:scale-110 transition-transform">
                  <Icon className={`w-3.5 h-3.5 ${c.textColor}`} />
                </div>
              </div>

              <div className="mt-3 flex items-baseline justify-between gap-1">
                <div className={`text-lg sm:text-xl font-black font-mono tracking-tight truncate ${c.textColor}`}>
                  {formatINR(c.amount)}
                </div>

                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${c.badgeBg}`}>
                  {c.count}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grand Net Total & Formula Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-950/90 via-slate-900 to-indigo-950/90 border border-indigo-500/40 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 text-white shadow-lg shadow-indigo-600/30 shrink-0">
            <WalletCards className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-indigo-200">
                Total Available Capital / Net Hisab (कुल पूँजी & शुद्ध हिसाब)
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Tally
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              <span className="text-amber-300 font-semibold">पोर्टल ({formatINR(totalPortalsBalance)})</span> +{' '}
              <span className="text-sky-300 font-semibold">बैंक/कैश ({formatINR(totalBankBalance)})</span> +{' '}
              <span className="text-rose-300 font-semibold">बाजार उधार ({formatINR(totalLiyaAmount)})</span> -{' '}
              <span className="text-emerald-300 font-semibold">ग्राहक जमा ({formatINR(totalJamaAmount)})</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-slate-950/90 px-4 sm:px-6 py-3 rounded-xl border border-indigo-500/30 shrink-0">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Total Net Capital</div>
            <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
              {formatINR(netTotalCapital)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
