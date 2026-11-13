import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Search, Download, SlidersHorizontal, X, Inbox } from 'lucide-react';
import { useApp } from '@/hooks/useApp';
import { useTransactionModals } from '@/hooks/useTransactionModals';
import { useToast } from '@/hooks/useToast';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { TransactionRow, TransactionCard } from '@/components/TransactionRow';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, ALL_CATEGORIES } from '@/data/categories';
import { downloadCSV } from '@/utils/finance';
import { applyDateRange, DATE_RANGE_PRESETS, type DateRangeFilter } from '@/utils/dates';
import type { TransactionType } from '@/types';

type SortKey = 'date-desc' | 'date-asc' | 'amount-desc' | 'amount-asc';

const PAGE_SIZE = 12;

export function TransactionsPage({ search, onSearch }: { search: string; onSearch: (s: string) => void }) {
  const { transactions } = useApp();
  const { openAdd, openEdit, requestDelete, modals } = useTransactionModals();
  const { notify } = useToast();

  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [rangeFilter, setRangeFilter] = useState<DateRangeFilter>({ start: null, end: null });
  const [rangePreset, setRangePreset] = useState<string>('all');
  const [sort, setSort] = useState<SortKey>('date-desc');
  const [showFilters, setShowFilters] = useState(false);
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) => t.title.toLowerCase().includes(q) || (t.notes?.toLowerCase().includes(q) ?? false));
    }
    if (typeFilter !== 'all') list = list.filter((t) => t.type === typeFilter);
    if (categoryFilter !== 'all') list = list.filter((t) => t.category === categoryFilter);
    list = applyDateRange(list, rangeFilter);
    list.sort((a, b) => {
      switch (sort) {
        case 'date-asc': return a.date.localeCompare(b.date);
        case 'date-desc': return b.date.localeCompare(a.date);
        case 'amount-asc': return a.amount - b.amount;
        case 'amount-desc': return b.amount - a.amount;
      }
    });
    return list;
  }, [transactions, search, typeFilter, categoryFilter, rangeFilter, sort]);

  const shown = filtered.slice(0, visible);
  const activeFilterCount =
    (typeFilter !== 'all' ? 1 : 0) +
    (categoryFilter !== 'all' ? 1 : 0) +
    (rangePreset !== 'all' ? 1 : 0);

  const handleExport = () => {
    if (filtered.length === 0) {
      notify('No transactions to export', 'error');
      return;
    }
    const ok = downloadCSV(filtered);
    notify(ok ? `Exported ${filtered.length} transactions to CSV` : 'Export failed', ok ? 'success' : 'error');
  };

  const applyPreset = (key: string) => {
    setRangePreset(key);
    if (key === 'all') {
      setRangeFilter({ start: null, end: null });
    } else {
      const preset = DATE_RANGE_PRESETS.find((p) => p.key === key);
      if (preset) setRangeFilter(preset.getRange());
    }
  };

  const clearFilters = () => {
    setTypeFilter('all');
    setCategoryFilter('all');
    setRangePreset('all');
    setRangeFilter({ start: null, end: null });
  };

  const categoriesForFilter = typeFilter === 'income' ? INCOME_CATEGORIES : typeFilter === 'expense' ? EXPENSE_CATEGORIES : ALL_CATEGORIES;

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="md:hidden relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search..."
            className="w-full bg-surface-2 border border-subtle rounded-lg pl-9 pr-3 py-2 text-sm text-primary placeholder:text-muted focus:outline-none focus:border-accent"
          />
        </div>

        <button
          onClick={() => setShowFilters((s) => !s)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
            showFilters || activeFilterCount > 0 ? 'border-accent text-accent bg-accent/5' : 'border-subtle text-secondary hover:text-primary'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-accent text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">{activeFilterCount}</span>
          )}
        </button>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-subtle text-sm font-medium text-secondary hover:text-primary hover:border-strong transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>

        <div className="ml-auto flex items-center gap-2">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="bg-surface-2 border border-subtle rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-accent"
          >
            <option value="date-desc">Newest first</option>
            <option value="date-asc">Oldest first</option>
            <option value="amount-desc">Highest amount</option>
            <option value="amount-asc">Lowest amount</option>
          </select>
        </div>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <Card className="p-4" hover={false}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5 uppercase tracking-wide">Type</label>
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as TransactionType | 'all')} className="w-full bg-surface-2 border border-subtle rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-accent">
                  <option value="all">All types</option>
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5 uppercase tracking-wide">Category</label>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full bg-surface-2 border border-subtle rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-accent">
                  <option value="all">All categories</option>
                  {categoriesForFilter.map((c) => (
                    <option key={c.name} value={c.name}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-secondary mb-1.5 uppercase tracking-wide">Date Range</label>
                <select value={rangePreset} onChange={(e) => applyPreset(e.target.value)} className="w-full bg-surface-2 border border-subtle rounded-lg px-3 py-2 text-sm text-primary focus:outline-none focus:border-accent">
                  <option value="all">All time</option>
                  {DATE_RANGE_PRESETS.map((p) => (
                    <option key={p.key} value={p.key}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="mt-3 flex items-center gap-1 text-xs text-secondary hover:text-primary">
                <X className="w-3 h-3" /> Clear all filters
              </button>
            )}
          </Card>
        )}
      </AnimatePresence>

      {/* Results count */}
      <p className="text-sm text-secondary">
        {filtered.length} transaction{filtered.length !== 1 ? 's' : ''} found
      </p>

      {/* List */}
      {filtered.length === 0 ? (
        <Card className="p-2" hover={false}>
          <EmptyState
            icon={<Inbox className="w-7 h-7" />}
            title={transactions.length === 0 ? 'No transactions yet' : 'No matching transactions'}
            message={transactions.length === 0 ? 'Add your first transaction to get started.' : 'Try adjusting your search or filters.'}
            action={transactions.length === 0 ? (
              <button onClick={openAdd} className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-medium">
                Add Transaction
              </button>
            ) : undefined}
          />
        </Card>
      ) : (
        <>
          <Card className="p-0 overflow-hidden" hover={false}>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-muted uppercase tracking-wider bg-surface-2/50">
                    <th className="py-3 pl-4 pr-2 font-medium">Description</th>
                    <th className="py-3 px-2 font-medium">Date</th>
                    <th className="py-3 px-2 font-medium">Type</th>
                    <th className="py-3 px-2 font-medium text-right">Amount</th>
                    <th className="py-3 pl-2 pr-4" />
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {shown.map((tx, i) => (
                      <TransactionRow key={tx.id} tx={tx} onEdit={openEdit} onDelete={requestDelete} index={i} />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-subtle">
              <AnimatePresence>
                {shown.map((tx) => (
                  <div key={tx.id} className="p-3">
                    <TransactionCard tx={tx} onEdit={openEdit} onDelete={requestDelete} />
                  </div>
                ))}
              </AnimatePresence>
            </div>
          </Card>

          {visible < filtered.length && (
            <div className="flex justify-center">
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="px-5 py-2.5 rounded-lg border border-subtle text-sm font-medium text-secondary hover:text-primary hover:border-strong transition-colors"
              >
                Load more ({filtered.length - visible} remaining)
              </button>
            </div>
          )}
        </>
      )}

      {modals}
    </div>
  );
}
