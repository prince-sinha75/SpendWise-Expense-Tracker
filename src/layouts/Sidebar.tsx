import { AnimatePresence, motion } from 'framer-motion';
import { LayoutDashboard, ArrowLeftRight, PieChart, Wallet, Settings, Sparkles, X } from 'lucide-react';

export type PageKey = 'overview' | 'transactions' | 'analytics' | 'budgets' | 'settings';

interface NavItem {
  key: PageKey;
  label: string;
  icon: typeof LayoutDashboard;
  subtitle: string;
}

export const NAV_ITEMS: NavItem[] = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard, subtitle: 'Your financial snapshot' },
  { key: 'transactions', label: 'Transactions', icon: ArrowLeftRight, subtitle: 'Manage your activity' },
  { key: 'analytics', label: 'Analytics', icon: PieChart, subtitle: 'Deep insights into spending' },
  { key: 'budgets', label: 'Budgets', icon: Wallet, subtitle: 'Plan and track your limits' },
  { key: 'settings', label: 'Settings', icon: Settings, subtitle: 'Preferences and data' },
];

interface SidebarProps {
  current: PageKey;
  onNavigate: (p: PageKey) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ current, onNavigate, mobileOpen, onCloseMobile }: SidebarProps) {
  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-subtle bg-surface/40 backdrop-blur-xl">
        <SidebarContent current={current} onNavigate={onNavigate} />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="lg:hidden fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCloseMobile} />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 360, damping: 32 }}
              className="absolute left-0 top-0 bottom-0 w-64 bg-surface border-r border-subtle flex flex-col"
            >
              <button
                onClick={onCloseMobile}
                aria-label="Close menu"
                className="absolute top-4 right-4 text-muted hover:text-primary"
              >
                <X className="w-5 h-5" />
              </button>
              <SidebarContent current={current} onNavigate={(p) => { onNavigate(p); onCloseMobile(); }} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({ current, onNavigate }: { current: PageKey; onNavigate: (p: PageKey) => void }) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <div className="font-semibold text-primary tracking-tight text-lg leading-none">SpendWise</div>
          <div className="text-[10px] text-muted uppercase tracking-widest mt-1">Finance OS</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = current === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                active ? 'text-primary' : 'text-secondary hover:text-primary'
              }`}
            >
              {active && (
                <motion.div
                  layoutId="nav-active"
                  className="absolute inset-0 rounded-xl bg-surface-2 border border-subtle"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-accent"
                />
              )}
              <item.icon className="w-[18px] h-[18px] relative z-10 shrink-0" />
              <span className="relative z-10">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="glass rounded-xl p-4">
          <p className="text-xs text-secondary leading-relaxed">
            Data is stored locally in your browser. No account needed.
          </p>
        </div>
      </div>
    </div>
  );
}
