import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Wallet, Plus, Pencil, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/hooks/useApp';
import { useToast } from '@/hooks/useToast';
import { Card } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { EmptyState } from '@/components/ui/EmptyState';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { EXPENSE_CATEGORIES, getCategory, getCategoryColor, getCategoryLabel } from '@/data/categories';
import { formatMoney, isSameMonth } from '@/utils/finance';
import type { Budget } from '@/types';

export function BudgetsPage() {
  const { transactions, budgets, prefs, addBudget, updateBudget, deleteBudget } = useApp();
  const { notify } = useToast();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Budget | null>(null);
  const [deleting, setDeleting] = useState<Budget | null>(null);
  const [category, setCategory] = useState('food');
  const [limit, setLimit] = useState('');
  const [error, setError] = useState('');

  const spentByCategory = useMemo(() => {
    const map = new Map<string, number>();
    for (const t of transactions) {
      if (t.type !== 'expense') continue;
      if (!isSameMonth(t.date)) continue;
      map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
    }
    return map;
  }, [transactions]);

  const totalLimit = budgets.reduce((a, b) => a + b.limit, 0);
  const totalSpent = budgets.reduce((a, b) => a + (spentByCategory.get(b.category) ?? 0), 0);

  const openAdd = () => {
    const used = new Set(budgets.map((b) => b.category));
    const available = EXPENSE_CATEGORIES.find((c) => !used.has(c.name));
    setEditing(null);
    setCategory(available?.name ?? 'other');
    setLimit('');
    setError('');
    setFormOpen(true);
  };

  const openEdit = (b: Budget) => {
    setEditing(b);
    setCategory(b.category);
    setLimit(String(b.limit));
    setError('');
    setFormOpen(true);
  };

  const handleSubmit = () => {
    const amt = parseFloat(limit);
    if (isNaN(amt) || amt <= 0) {
      setError('Enter a valid amount greater than zero');
      return;
    }
    if (editing) {
      updateBudget(editing.id, { category, limit: amt });
      notify('Budget updated');
    } else {
      if (budgets.some((b) => b.category === category)) {
        setError('A budget for this category already exists');
        return;
      }
      addBudget({ category, limit: amt });
      notify('Budget created');
    }
    setFormOpen(false);
  };

  const availableCategories = editing
    ? EXPENSE_CATEGORIES
    : EXPENSE_CATEGORIES.filter((c) => !budgets.some((b) => b.category === c.name));

  return (
    <div className="space-y-6">
      {/* Overall progress */}
      <Card className="p-5" delay={0}>
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-primary">Monthly Budget Overview</h3>
            <p className="text-xs text-muted">Total spent vs total limit this month</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-medium hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add Budget
          </button>
        </div>
        <div className="flex items-end justify-between mb-2">
          <span className="text-2xl font-semibold text-primary tabular-nums">{formatMoney(totalSpent, prefs.currency)}</span>
          <span className="text-sm text-secondary">of {formatMoney(totalLimit, prefs.currency)}</span>
        </div>
        <ProgressBar spent={totalSpent} limit={totalLimit} />
      </Card>

      {/* Budget cards */}
      {budgets.length === 0 ? (
        <Card className="p-2" hover={false}>
          <EmptyState
            icon={<Wallet className="w-7 h-7" />}
            title="No budgets set"
            message="Create category budgets to track your monthly spending limits."
            action={
              <button onClick={openAdd} className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-medium">
                Create Budget
              </button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <AnimatePresence>
            {budgets.map((b, i) => {
              const spent = spentByCategory.get(b.category) ?? 0;
              const cat = getCategory(b.category);
              return (
                <motion.div
                  key={b.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                >
                  <Card className="p-5" hover={false}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${getCategoryColor(b.category)}1f` }}>
                          <CategoryIcon name={cat?.icon ?? 'MoreHorizontal'} className="w-5 h-5" style={{ color: getCategoryColor(b.category) }} />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-primary">{getCategoryLabel(b.category)}</h4>
                          <p className="text-xs text-muted">Monthly limit</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(b)} aria-label="Edit budget" className="w-8 h-8 rounded-lg text-muted hover:text-primary hover:bg-surface-2 flex items-center justify-center transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleting(b)} aria-label="Delete budget" className="w-8 h-8 rounded-lg text-muted hover:text-expense hover:bg-expense/10 flex items-center justify-center transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-end justify-between mb-2">
                      <span className="text-xl font-semibold text-primary tabular-nums">{formatMoney(spent, prefs.currency)}</span>
                      <span className="text-sm text-secondary">of {formatMoney(b.limit, prefs.currency)}</span>
                    </div>

                    <ProgressBar spent={spent} limit={b.limit} />

                    <div className="flex items-center justify-between mt-2.5">
                        <BudgetStatus spent={spent} limit={b.limit} />
                        <span className="text-xs text-muted">
                          {spent >= b.limit ? 'Over by ' : 'Remaining '}
                          {formatMoney(Math.abs(b.limit - spent), prefs.currency)}
                        </span>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Form modal */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit Budget' : 'Create Budget'}
        subtitle={editing ? 'Update your spending limit' : 'Set a monthly spending limit for a category'}
      >
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-secondary mb-1.5 uppercase tracking-wide">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={!!editing}
              className="w-full bg-surface-2 border border-subtle rounded-lg px-3 py-2.5 text-sm text-primary focus:outline-none focus:border-accent disabled:opacity-50"
            >
              {availableCategories.map((c) => (
                <option key={c.name} value={c.name}>{c.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-secondary mb-1.5 uppercase tracking-wide">Monthly Limit</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              placeholder="0.00"
              autoFocus
              className="w-full bg-surface-2 border border-subtle rounded-lg px-3 py-2.5 text-sm text-primary focus:outline-none focus:border-accent"
            />
            {error && <p className="text-xs text-expense mt-1.5">{error}</p>}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setFormOpen(false)} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-secondary border border-subtle hover:text-primary hover:border-strong transition-colors">
              Cancel
            </button>
            <button onClick={handleSubmit} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-600 hover:opacity-90 transition-opacity">
              {editing ? 'Save' : 'Create'}
            </button>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleting}
        title="Delete Budget"
        message={`Remove the budget for ${getCategoryLabel(deleting?.category ?? '')}?`}
        onConfirm={() => { if (deleting) { deleteBudget(deleting.id); notify('Budget deleted', 'info'); setDeleting(null); } }}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}

function ProgressBar({ spent, limit }: { spent: number; limit: number }) {
  const pct = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;
  const over = spent > limit;
  const near = pct >= 80 && !over;
  const color = over ? 'var(--expense)' : near ? 'var(--accent)' : 'var(--income)';
  return (
    <div className="h-2.5 bg-surface-2 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  );
}

function BudgetStatus({ spent, limit }: { spent: number; limit: number }) {
  const over = spent > limit;
  const near = spent / limit >= 0.8 && !over;
  if (over) {
    return (
      <span className="flex items-center gap-1 text-xs text-expense font-medium">
        <AlertTriangle className="w-3.5 h-3.5" /> Over budget
      </span>
    );
  }
  if (near) {
    return (
      <span className="flex items-center gap-1 text-xs text-accent font-medium">
        <AlertTriangle className="w-3.5 h-3.5" /> Approaching limit
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs text-income font-medium">
      <CheckCircle2 className="w-3.5 h-3.5" /> On track
    </span>
  );
}
