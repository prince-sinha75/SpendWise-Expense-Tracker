import type { Transaction, Budget, Preferences, ThemeMode } from '@/types';
import { SAMPLE_TRANSACTIONS, SAMPLE_BUDGETS } from '@/data/sampleData';

const TX_KEY = 'spendwise.transactions.v1';
const BUDGET_KEY = 'spendwise.budgets.v1';
const PREFS_KEY = 'spendwise.prefs.v1';
const SEED_KEY = 'spendwise.seeded.v1';

export const DEFAULT_PREFS: Preferences = {
  theme: 'dark',
  currency: 'USD',
  startingBalance: 0,
  reduceMotion: false,
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function loadTransactions(): Transaction[] {
  const seeded = localStorage.getItem(SEED_KEY);
  if (seeded === null) {
    localStorage.setItem(TX_KEY, JSON.stringify(SAMPLE_TRANSACTIONS));
    localStorage.setItem(BUDGET_KEY, JSON.stringify(SAMPLE_BUDGETS));
    localStorage.setItem(SEED_KEY, '1');
    return SAMPLE_TRANSACTIONS;
  }
  const raw = localStorage.getItem(TX_KEY);
  const arr = safeParse<Transaction[]>(raw, []);
  if (!Array.isArray(arr)) return [];
  return arr.filter((t) => t && typeof t.id === 'string' && typeof t.amount === 'number');
}

export function saveTransactions(txs: Transaction[]): void {
  try {
    localStorage.setItem(TX_KEY, JSON.stringify(txs));
  } catch {
    /* storage unavailable */
  }
}

export function loadBudgets(): Budget[] {
  const raw = localStorage.getItem(BUDGET_KEY);
  const arr = safeParse<Budget[]>(raw, []);
  if (!Array.isArray(arr)) return [];
  return arr.filter((b) => b && typeof b.id === 'string' && typeof b.limit === 'number');
}

export function saveBudgets(budgets: Budget[]): void {
  try {
    localStorage.setItem(BUDGET_KEY, JSON.stringify(budgets));
  } catch {
    /* storage unavailable */
  }
}

export function loadPrefs(): Preferences {
  const raw = localStorage.getItem(PREFS_KEY);
  const parsed = safeParse<Partial<Preferences>>(raw, {});
  return { ...DEFAULT_PREFS, ...parsed };
}

export function savePrefs(prefs: Preferences): void {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    /* storage unavailable */
  }
}

export function applyTheme(mode: ThemeMode): void {
  const root = document.documentElement;
  if (mode === 'light') {
    root.classList.add('theme-light');
    root.classList.remove('theme-dark');
  } else {
    root.classList.add('theme-dark');
    root.classList.remove('theme-light');
  }
  root.style.colorScheme = mode;
}

export function clearAllData(): void {
  localStorage.removeItem(TX_KEY);
  localStorage.removeItem(BUDGET_KEY);
  localStorage.removeItem(SEED_KEY);
}
