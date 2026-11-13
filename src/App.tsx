import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AppProvider, useApp } from '@/hooks/useApp';
import { ToastProvider } from '@/hooks/useToast';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Sidebar, type PageKey } from '@/layouts/Sidebar';
import { Topbar } from '@/layouts/Topbar';
import { DashboardPage } from '@/pages/DashboardPage';
import { TransactionsPage } from '@/pages/TransactionsPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';
import { BudgetsPage } from '@/pages/BudgetsPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { useTransactionModals } from '@/hooks/useTransactionModals';
import { useToast } from '@/hooks/useToast';
import { Modal } from '@/components/ui/Modal';
import { TransactionForm } from '@/components/TransactionForm';

function Shell() {
  const { prefs } = useApp();
  const [page, setPage] = useState<PageKey>('overview');
  const [mobileNav, setMobileNav] = useState(false);
  const [search, setSearch] = useState('');
  const [globalAddOpen, setGlobalAddOpen] = useState(false);
  const { modals } = useTransactionModals();

  const handleNavigate = (p: PageKey) => {
    setPage(p);
    setSearch('');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar current={page} onNavigate={handleNavigate} mobileOpen={mobileNav} onCloseMobile={() => setMobileNav(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar
          page={page}
          onAddTransaction={() => setGlobalAddOpen(true)}
          onOpenMobileNav={() => setMobileNav(true)}
          search={search}
          onSearch={setSearch}
          showSearch={page === 'transactions'}
        />
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto" data-reduce-motion={prefs.reduceMotion ? '' : undefined}>
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {page === 'overview' && <DashboardPage />}
              {page === 'transactions' && <TransactionsPage search={search} onSearch={setSearch} />}
              {page === 'analytics' && <AnalyticsPage />}
              {page === 'budgets' && <BudgetsPage />}
              {page === 'settings' && <SettingsPage />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Global add transaction modal (topbar button) */}
      <Modal
        open={globalAddOpen}
        onClose={() => setGlobalAddOpen(false)}
        title="Add Transaction"
        subtitle="Record a new income or expense"
      >
        <GlobalAddForm onSubmit={() => setGlobalAddOpen(false)} onCancel={() => setGlobalAddOpen(false)} />
      </Modal>

      {modals}
    </div>
  );
}

function GlobalAddForm({ onSubmit, onCancel }: { onSubmit: () => void; onCancel: () => void }) {
  const { addTransaction } = useApp();
  const { notify } = useToast();
  return (
    <TransactionForm
      onSubmit={(data) => {
        addTransaction(data);
        notify('Transaction added successfully');
        onSubmit();
      }}
      onCancel={onCancel}
    />
  );
}

export default function App() {
  return (
    <AppProvider>
      <ToastProvider>
        <AnimatedBackground />
        <Shell />
      </ToastProvider>
    </AppProvider>
  );
}
