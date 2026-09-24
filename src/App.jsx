import React, { useState, useEffect } from 'react';
import { HisabProvider, useHisab } from './context/HisabContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Toast } from './components/common/Toast';

import { DateNavigator } from './components/common/DateNavigator';
import { HisabSummaryOverview } from './components/dashboard/HisabSummaryOverview';
import { PortalsPillar } from './components/pillars/PortalsPillar';
import { BankAccountsPillar } from './components/pillars/BankAccountsPillar';
import { PeopleMasterPillar } from './components/pillars/PeopleMasterPillar';
import { IncomeTracker } from './components/incomes/IncomeTracker';
import { ExpenseTracker } from './components/expenses/ExpenseTracker';
import { JamaPillar } from './components/pillars/JamaPillar';
import { LiyaPillar } from './components/pillars/LiyaPillar';
import { ProfitChartSection } from './components/analytics/ProfitChartSection';
import { PastHistoryView } from './components/history/PastHistoryView';
import { QuickHisabParchi } from './components/pillars/QuickHisabParchi';
import { ThagdaLoader } from './components/common/ThagdaLoader';

const MainContent = () => {
  const { toast, loaderState, closeLoader } = useHisab();

  // Default to Step 1 (Portals) or saved tab from localStorage
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('jsk_v4_active_tab') || 'portals';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('jsk_v4_active_tab', activeTab);
  }, [activeTab]);

  const quickTabs = [
    { id: 'portals', label: '1. 📱 10 पोर्टल (Portals)', color: 'bg-amber-600 text-white shadow-lg shadow-amber-600/30 ring-2 ring-amber-400/50' },
    { id: 'accounts', label: '2. 🏦 बैंक व गल्ला (Bank/Cash)', color: 'bg-sky-600 text-white shadow-lg shadow-sky-600/30 ring-2 ring-sky-400/50' },
    { id: 'people', label: '3. 👥 ग्राहक खाता (Jama/Liya)', color: 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 ring-2 ring-emerald-400/50' },
    { id: 'incomes', label: '4. 💰 अन्य कमाई (+Income)', color: 'bg-teal-600 text-white shadow-lg shadow-teal-600/30 ring-2 ring-teal-400/50' },
    { id: 'expenses', label: '5. ☕ दुकान खर्च (-Kharcha)', color: 'bg-pink-600 text-white shadow-lg shadow-pink-600/30 ring-2 ring-pink-400/50' },
    { id: 'profit', label: '6. 📊 मुनाफ़ा रिपोर्ट (Profit)', color: 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 ring-2 ring-purple-400/50' },
    { id: 'history', label: '7. 📜 इतिहास (Past Data)', color: 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 ring-2 ring-blue-400/50' },
    { id: 'all', label: '🌟 All-in-1 (सब एक साथ)', color: 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400/50' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative">
      {/* 🚀 Stunning Animated Center Logo Loader (2.5 - 3 seconds) */}
      {loaderState.isOpen && (
        <ThagdaLoader
          duration={loaderState.duration}
          subtitle={loaderState.subtitle}
          onFinish={closeLoader}
        />
      )}

      {/* Top Navbar */}
      <Navbar
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area - Full width with balanced spacing */}
        <main className="flex-1 lg:ml-64 p-3 sm:p-4 lg:p-5 w-full space-y-4 min-w-0">
          
          {/* Interactive Date & History Switcher (Today, Yesterday, Custom Date) */}
          <DateNavigator />

          {/* 6 Core Summary Cards & Net Capital Banner */}
          <HisabSummaryOverview
            activeSection={activeTab}
            setActiveSection={(tab) => setActiveTab(tab)}
          />

          {/* 🌟 User-Friendly Interactive Section Switcher & Quick Actions Bar */}
          <div className="sticky top-16 z-30 bg-slate-900/95 backdrop-blur-md p-2 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-2.5">
            {/* Filter Tabs Scrollable */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {quickTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shadow-sm ${
                      isActive
                        ? tab.color
                        : 'text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white bg-white dark:bg-slate-950/70 border border-slate-300 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Quick Actions Right Pill */}
            <div className="flex items-center gap-1.5 shrink-0 self-end md:self-auto">
              <button
                onClick={() => setIsPrintModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>🖨️ पर्ची प्रिंट</span>
              </button>
            </div>
          </div>

          {/* Tab Views */}
          {activeTab === 'all' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Pillar 1: Portals */}
              <PortalsPillar onNext={() => setActiveTab('accounts')} />

              {/* Pillar 2: Bank Accounts & Cash */}
              <BankAccountsPillar
                onNext={() => setActiveTab('people')}
                onPrev={() => setActiveTab('portals')}
              />

              {/* Pillar 3 & 4: Unified People & Party Master (Jama & Liya) */}
              <PeopleMasterPillar
                onNext={() => setActiveTab('incomes')}
                onPrev={() => setActiveTab('accounts')}
              />

              {/* Other Income & Service Fees (AEPS, DMT, PF, Photo Copy, etc.) */}
              <IncomeTracker
                onNext={() => setActiveTab('expenses')}
                onPrev={() => setActiveTab('people')}
              />

              {/* Daily Shop Expenses Tracker */}
              <ExpenseTracker
                onNext={() => setActiveTab('profit')}
                onPrev={() => setActiveTab('incomes')}
              />

              {/* Profit & Earnings Chart on Dashboard */}
              <ProfitChartSection />
            </div>
          )}

          {activeTab === 'portals' && (
            <div className="animate-fadeIn">
              <PortalsPillar onNext={() => setActiveTab('accounts')} />
            </div>
          )}

          {activeTab === 'accounts' && (
            <div className="animate-fadeIn">
              <BankAccountsPillar
                onNext={() => setActiveTab('people')}
                onPrev={() => setActiveTab('portals')}
              />
            </div>
          )}

          {(activeTab === 'people' || activeTab === 'jama' || activeTab === 'liya') && (
            <div className="animate-fadeIn">
              <PeopleMasterPillar
                onNext={() => setActiveTab('incomes')}
                onPrev={() => setActiveTab('accounts')}
              />
            </div>
          )}

          {activeTab === 'incomes' && (
            <div className="animate-fadeIn">
              <IncomeTracker
                onNext={() => setActiveTab('expenses')}
                onPrev={() => setActiveTab('people')}
              />
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="animate-fadeIn">
              <ExpenseTracker
                onNext={() => setActiveTab('profit')}
                onPrev={() => setActiveTab('incomes')}
              />
            </div>
          )}

          {activeTab === 'profit' && (
            <div className="animate-fadeIn">
              <ProfitChartSection />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="animate-fadeIn">
              <PastHistoryView onSelectDate={() => setActiveTab('all')} />
            </div>
          )}

        </main>
      </div>

      {/* Printable Hisab Slip Modal */}
      <QuickHisabParchi
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
      />

      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => {}} />
    </div>
  );
};

export default function App() {
  return (
    <HisabProvider>
      <MainContent />
    </HisabProvider>
  );
}
