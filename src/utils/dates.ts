import {
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
  startOfYear,
  endOfYear,
  subMonths,
  format,
  parseISO,
  isWithinInterval,
} from 'date-fns';
import type { Transaction } from '@/types';

export function fmtDate(iso: string, pattern = 'MMM d, yyyy'): string {
  try {
    return format(parseISO(iso), pattern);
  } catch {
    return iso;
  }
}

export function fmtDateShort(iso: string): string {
  return fmtDate(iso, 'MMM d');
}

export interface DateRangeFilter {
  start: string | null;
  end: string | null;
}

export const DATE_RANGE_PRESETS = [
  { key: 'this-week', label: 'This Week', getRange: () => ({ start: toISO(startOfWeek(new Date(), { weekStartsOn: 1 })), end: toISO(endOfWeek(new Date(), { weekStartsOn: 1 })) }) },
  { key: 'this-month', label: 'This Month', getRange: () => ({ start: toISO(startOfMonth(new Date())), end: toISO(endOfMonth(new Date())) }) },
  { key: 'this-year', label: 'This Year', getRange: () => ({ start: toISO(startOfYear(new Date())), end: toISO(endOfYear(new Date())) }) },
  { key: 'last-3-months', label: 'Last 3 Months', getRange: () => ({ start: toISO(startOfMonth(subMonths(new Date(), 2))), end: toISO(endOfMonth(new Date())) }) },
] as const;

function toISO(d: Date): string {
  return format(d, 'yyyy-MM-dd');
}

export function applyDateRange(txs: Transaction[], range: DateRangeFilter): Transaction[] {
  if (!range.start && !range.end) return txs;
  return txs.filter((t) => {
    try {
      const d = parseISO(t.date);
      const start = range.start ? parseISO(range.start) : null;
      const end = range.end ? parseISO(range.end) : null;
      return isWithinInterval(d, { start: start ?? new Date(0), end: end ?? new Date(8640000000000000) });
    } catch {
      return false;
    }
  });
}

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd');
}
