import React, { useState } from 'react';
import { HisabProvider, useHisab } from './context/HisabContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Toast } from './components/common/Toast';

import { DateNavigator } from './components/common/DateNavigator';
import { HisabSummaryOverview } from './components/dashboard/HisabSummaryOverview';
import { PortalsPillar } from './components/pillars/PortalsPillar';
import { BankAccountsPillar } from './components/pillars/BankAccountsPillar';
import { PeopleMasterPillar } from './components/pillars/PeopleMasterPillar';
import { ExpenseTracker } from './components/expenses/ExpenseTracker';
import { JamaPillar } from './components/pillars/JamaPillar';
import { LiyaPillar } from './components/pillars/LiyaPillar';
import { ProfitChartSection } from './components/analytics/ProfitChartSection';
import { PastHistoryView } from './components/history/PastHistoryView';
import { QuickHisabParchi } from './components/pillars/QuickHisabParchi';

const MainContent = () => {
  const { toast } = useHisab();
  const [activeTab, setActiveTab] = useState('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
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

        {/* Main Content Area - Full width */}
        <main className="flex-1 lg:pl-64 p-4 sm:p-6 lg:p-8 w-full space-y-6 min-w-0">
          
          {/* Interactive Date & History Switcher (Today, Yesterday, Custom Date) */}
          <DateNavigator />

          {/* 4-Pillar Summary Cards & Net Capital Banner */}
          <HisabSummaryOverview
            activeSection={activeTab}
            setActiveSection={(tab) => setActiveTab(tab)}
          />

          {/* Tab Views */}
          {activeTab === 'all' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Pillar 1: Portals */}
              <PortalsPillar />

              {/* Pillar 2: Bank Accounts & Cash */}
              <BankAccountsPillar />

              {/* Pillar 3 & 4: Unified People & Party Master (Jama & Liya) */}
              <PeopleMasterPillar />

              {/* Daily Shop Expenses Tracker */}
              <ExpenseTracker />

              {/* Profit & Earnings Chart on Dashboard */}
              <ProfitChartSection />
            </div>
          )}

          {activeTab === 'portals' && (
            <div className="animate-fadeIn">
              <PortalsPillar />
            </div>
          )}

          {activeTab === 'accounts' && (
            <div className="animate-fadeIn">
              <BankAccountsPillar />
            </div>
          )}

          {(activeTab === 'people' || activeTab === 'jama' || activeTab === 'liya') && (
            <div className="animate-fadeIn">
              <PeopleMasterPillar />
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="animate-fadeIn">
              <ExpenseTracker />
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
