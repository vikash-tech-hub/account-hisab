import React from 'react';
import { useHisab } from '../../context/HisabContext';
import { formatINR } from '../../utils/formatters';
import {
  CreditCard,
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  WalletCards,
  Sparkles
} from 'lucide-react';

export const HisabSummaryOverview = ({ activeSection, setActiveSection }) => {
  const {
    totalPortalsBalance,
    totalBankBalance,
    totalJamaAmount,
    totalLiyaAmount,
    netTotalCapital,
    activePortals,
    activeBankAccounts,
    activeJamaList,
    activeLiyaList
  } = useHisab();

  const cards = [
    {
      id: 'portals',
      title: '1. All Portals Balance',
      subtitle: 'सभी 10 पोर्टलों का कुल बैलेंस',
      amount: totalPortalsBalance,
      count: `${activePortals.length} Portals`,
      icon: CreditCard,
      color: 'from-orange-500/10 to-amber-500/10 border-amber-500/30 text-amber-400',
      badgeColor: 'bg-amber-500/20 text-amber-300'
    },
    {
      id: 'accounts',
      title: '2. Bank Accounts & Cash',
      subtitle: 'बैंक खातों व गल्ला कैश का बैलेंस',
      amount: totalBankBalance,
      count: `${activeBankAccounts.length} Accounts`,
      icon: Landmark,
      color: 'from-sky-500/10 to-blue-500/10 border-sky-500/30 text-sky-400',
      badgeColor: 'bg-sky-500/20 text-sky-300'
    },
    {
      id: 'jama',
      title: '3. People Deposited (Jama)',
      subtitle: 'लोगों का कुल जमा (ग्राहक जमा)',
      amount: totalJamaAmount,
      count: `${activeJamaList.length} Entries`,
      icon: ArrowDownLeft,
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/30 text-emerald-400',
      badgeColor: 'bg-emerald-500/20 text-emerald-300'
    },
    {
      id: 'liya',
      title: '4. People Took (Liya)',
      subtitle: 'लोगों ने कुल कितना लिया (निकासी/उधार)',
      amount: totalLiyaAmount,
      count: `${activeLiyaList.length} Entries`,
      icon: ArrowUpRight,
      color: 'from-rose-500/10 to-red-500/10 border-rose-500/30 text-rose-400',
      badgeColor: 'bg-rose-500/20 text-rose-300'
    }
  ];

  return (
    <div className="space-y-4">
      {/* 4 Core Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          const isSelected = activeSection === c.id;

          return (
            <div
              key={c.id}
              onClick={() => setActiveSection && setActiveSection(c.id)}
              className={`p-5 rounded-2xl bg-gradient-to-br bg-slate-900 border transition-all duration-200 cursor-pointer shadow-xl relative overflow-hidden ${
                c.color
              } ${
                isSelected
                  ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-950 scale-[1.01]'
                  : 'hover:border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    {c.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {c.subtitle}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-950/80 border border-white/10 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <div className="text-2xl font-black font-mono tracking-tight text-white">
                  {formatINR(c.amount)}
                </div>

                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${c.badgeColor}`}>
                  {c.count}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grand Net Total Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/90 via-slate-900 to-indigo-950/90 border border-indigo-500/40 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 shrink-0">
            <WalletCards className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-300">
                Total Available Capital / Net Hisab (कुल पूँजी & शुद्ध हिसाब)
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                Live
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              [Total Portals ({formatINR(totalPortalsBalance)}) + Total Bank & Cash ({formatINR(totalBankBalance)}) + Market Liya ({formatINR(totalLiyaAmount)})] - Customer Jama ({formatINR(totalJamaAmount)})
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right bg-slate-950/80 px-5 py-2.5 rounded-xl border border-indigo-500/30 shrink-0">
          <div className="text-[10px] uppercase font-bold text-slate-400">Net Total Hisab</div>
          <div className="text-2xl font-black font-mono text-emerald-400">
            {formatINR(netTotalCapital)}
          </div>
        </div>
      </div>
    </div>
  );
};
