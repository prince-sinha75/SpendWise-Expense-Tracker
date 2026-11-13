import { motion } from 'framer-motion';
import { Pencil, Trash2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import type { Transaction } from '@/types';
import { getCategoryColor, getCategoryLabel, getCategory } from '@/data/categories';
import { formatMoney } from '@/utils/finance';
import { fmtDate } from '@/utils/dates';
import { useApp } from '@/hooks/useApp';
import { CategoryIcon } from '@/components/ui/CategoryIcon';

interface TransactionRowProps {
  tx: Transaction;
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
  index?: number;
}

export function TransactionRow({ tx, onEdit, onDelete, index = 0 }: TransactionRowProps) {
  const { prefs } = useApp();
  const isIncome = tx.type === 'income';
  const cat = getCategory(tx.category);

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.2) }}
      className="group border-b border-subtle last:border-0 hover:bg-surface-2/50 transition-colors"
    >
      <td className="py-3 pl-4 pr-2">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${getCategoryColor(tx.category)}1f` }}
          >
            <CategoryIcon name={cat?.icon ?? 'MoreHorizontal'} className="w-[18px] h-[18px]" style={{ color: getCategoryColor(tx.category) }} />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-primary truncate">{tx.title}</div>
            <div className="text-xs text-muted">{getCategoryLabel(tx.category)}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-2 hidden sm:table-cell">
        <span className="text-sm text-secondary">{fmtDate(tx.date)}</span>
      </td>
      <td className="py-3 px-2 hidden md:table-cell">
        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
          isIncome ? 'bg-income/10 text-income' : 'bg-expense/10 text-expense'
        }`}>
          {isIncome ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {isIncome ? 'Income' : 'Expense'}
        </span>
      </td>
      <td className="py-3 px-2 text-right">
        <span className={`text-sm font-semibold tabular-nums ${isIncome ? 'text-income' : 'text-expense'}`}>
          {isIncome ? '+' : '−'}{formatMoney(tx.amount, prefs.currency)}
        </span>
      </td>
      <td className="py-3 pl-2 pr-4 text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(tx)}
            aria-label="Edit transaction"
            className="w-8 h-8 rounded-lg text-muted hover:text-primary hover:bg-surface-2 flex items-center justify-center transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(tx)}
            aria-label="Delete transaction"
            className="w-8 h-8 rounded-lg text-muted hover:text-expense hover:bg-expense/10 flex items-center justify-center transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

export function TransactionCard({ tx, onEdit, onDelete }: TransactionRowProps) {
  const { prefs } = useApp();
  const isIncome = tx.type === 'income';
  const cat = getCategory(tx.category);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      className="card-surface p-3 flex items-center gap-3"
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${getCategoryColor(tx.category)}1f` }}
      >
        <CategoryIcon name={cat?.icon ?? 'MoreHorizontal'} className="w-5 h-5" style={{ color: getCategoryColor(tx.category) }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-primary truncate">{tx.title}</div>
        <div className="text-xs text-muted">{getCategoryLabel(tx.category)} · {fmtDate(tx.date)}</div>
      </div>
      <div className="text-right">
        <div className={`text-sm font-semibold tabular-nums ${isIncome ? 'text-income' : 'text-expense'}`}>
          {isIncome ? '+' : '−'}{formatMoney(tx.amount, prefs.currency)}
        </div>
        <div className="flex gap-1 mt-1 justify-end">
          <button onClick={() => onEdit(tx)} aria-label="Edit" className="w-7 h-7 rounded-md text-muted hover:text-primary flex items-center justify-center">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onDelete(tx)} aria-label="Delete" className="w-7 h-7 rounded-md text-muted hover:text-expense flex items-center justify-center">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
