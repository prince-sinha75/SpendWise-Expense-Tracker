import { Search, Moon, Sun, Plus, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '@/hooks/useApp';
import type { PageKey } from './Sidebar';
import { NAV_ITEMS } from './Sidebar';

interface TopbarProps {
  page: PageKey;
  onAddTransaction: () => void;
  onOpenMobileNav: () => void;
  search: string;
  onSearch: (s: string) => void;
  showSearch: boolean;
}

export function Topbar({ page, onAddTransaction, onOpenMobileNav, search, onSearch, showSearch }: TopbarProps) {
  const { prefs, toggleTheme } = useApp();
  const meta = NAV_ITEMS.find((n) => n.key === page)!;

  return (
    <header className="sticky top-0 z-30 glass border-b border-subtle">
      <div className="flex items-center gap-3 px-4 sm:px-6 py-4">
        <button
          onClick={onOpenMobileNav}
          aria-label="Open menu"
          className="lg:hidden text-secondary hover:text-primary"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <motion.h1
            key={page}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-lg sm:text-xl font-semibold text-primary truncate"
          >
            {meta.label}
          </motion.h1>
          <p className="text-xs sm:text-sm text-secondary truncate">{meta.subtitle}</p>
        </div>

        {showSearch && (
          <div className="hidden md:flex relative items-center">
            <Search className="absolute left-3 w-4 h-4 text-muted pointer-events-none" />
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search transactions..."
              className="bg-surface-2 border border-subtle rounded-lg pl-9 pr-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent w-48 lg:w-64 transition-all"
            />
          </div>
        )}

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="w-9 h-9 rounded-lg border border-subtle flex items-center justify-center text-secondary hover:text-primary hover:border-strong transition-colors shrink-0"
        >
          {prefs.theme === 'dark' ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
        </button>

        <button
          onClick={onAddTransaction}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-medium hover:opacity-90 active:scale-95 transition-all shrink-0 shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Transaction</span>
        </button>
      </div>
    </header>
  );
}
