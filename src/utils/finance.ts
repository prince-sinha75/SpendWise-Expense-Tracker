import type { Transaction, RangeKey, TransactionType } from '@/types';
import { isExpenseCategory } from '@/data/categories';

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  INR: '₹',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'CHF',
};

export function currencySymbol(currency: string): string {
  return CURRENCY_SYMBOLS[currency] ?? currency + ' ';
}

export function formatMoney(amount: number, currency = 'USD'): string {
  const sym = currencySymbol(currency);
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);
  const formatted = abs.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sign}${sym}${formatted}`;
}

export function formatCompact(amount: number, currency = 'USD'): string {
  const sym = currencySymbol(currency);
  const abs = Math.abs(amount);
  if (abs >= 1000) {
    const v = (abs / 1000).toLocaleString('en-US', { maximumFractionDigits: 1 });
    return `${sym}${v}k`;
  }
  return `${sym}${abs.toFixed(0)}`;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function sumBy(txs: Transaction[], type: TransactionType): number {
  return txs.filter((t) => t.type === type).reduce((acc, t) => acc + t.amount, 0);
}

export function totalBalance(txs: Transaction[], startingBalance = 0): number {
  const income = sumBy(txs, 'income');
  const expenses = sumBy(txs, 'expense');
  return startingBalance + income - expenses;
}

export function savingsRate(income: number, expenses: number): number {
  if (income <= 0) return 0;
  return Math.max(0, ((income - expenses) / income) * 100);
}

export function rangeStartDate(range: RangeKey): Date | null {
  const now = new Date();
  switch (range) {
    case '7d':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6);
    case '30d':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
    case '90d':
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() - 89);
    case 'month':
      return new Date(now.getFullYear(), now.getMonth(), 1);
    case 'year':
      return new Date(now.getFullYear(), 0, 1);
    case 'all':
      return null;
    default:
      return null;
  }
}

export function filterByRange(txs: Transaction[], range: RangeKey): Transaction[] {
  const start = rangeStartDate(range);
  if (!start) return txs;
  return txs.filter((t) => new Date(t.date) >= start);
}

export function isSameMonth(dateStr: string, ref = new Date()): boolean {
  const d = new Date(dateStr);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

export function categoryTotals(txs: Transaction[]): { category: string; total: number }[] {
  const map = new Map<string, number>();
  for (const t of txs) {
    if (t.type !== 'expense') continue;
    if (!isExpenseCategory(t.category)) continue;
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount);
  }
  return Array.from(map.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

export function dailySeries(txs: Transaction[], days: number, type?: TransactionType): { label: string; date: string; value: number }[] {
  const out: { label: string; date: string; value: number }[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    const value = txs
      .filter((t) => t.date === ds && (type ? t.type === type : true))
      .reduce((acc, t) => acc + t.amount, 0);
    out.push({ label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), date: ds, value });
  }
  return out;
}

export function monthlySeries(txs: Transaction[], months: number): { label: string; income: number; expense: number }[] {
  const out: { label: string; income: number; expense: number }[] = [];
  const now = new Date();
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthTxs = txs.filter((t) => {
      const td = new Date(t.date);
      return td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth();
    });
    out.push({
      label: d.toLocaleDateString('en-US', { month: 'short' }),
      income: monthTxs.filter((t) => t.type === 'income').reduce((a, t) => a + t.amount, 0),
      expense: monthTxs.filter((t) => t.type === 'expense').reduce((a, t) => a + t.amount, 0),
    });
  }
  return out;
}

export function downloadCSV(txs: Transaction[], filename = 'spendwise-transactions.csv'): boolean {
  try {
    const headers = ['Date', 'Description', 'Type', 'Category', 'Amount', 'Notes'];
    const escape = (val: unknown): string => {
      const s = String(val ?? '');
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return '"' + s.replace(/"/g, '""') + '"';
      }
      return s;
    };
    const rows = txs.map((t) =>
      [t.date, t.title, t.type, t.category, t.amount.toFixed(2), t.notes ?? ''].map(escape).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
}
