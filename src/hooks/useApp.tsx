import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Preferences, ThemeMode, Transaction, Budget } from '@/types';
import { loadPrefs, savePrefs, applyTheme, loadTransactions, saveTransactions, loadBudgets, saveBudgets } from '@/lib/storage';
import { uid } from '@/utils/finance';

interface AppContextValue {
  prefs: Preferences;
  setTheme: (m: ThemeMode) => void;
  toggleTheme: () => void;
  setPrefs: (p: Partial<Preferences>) => void;
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, t: Omit<Transaction, 'id' | 'createdAt'>) => void;
  deleteTransaction: (id: string) => void;
  budgets: Budget[];
  setBudgets: (b: Budget[]) => void;
  addBudget: (b: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, b: Omit<Budget, 'id'>) => void;
  deleteBudget: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefsState] = useState<Preferences>(() => loadPrefs());
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadTransactions());
  const [budgets, setBudgetsState] = useState<Budget[]>(() => loadBudgets());

  useEffect(() => {
    applyTheme(prefs.theme);
    savePrefs(prefs);
  }, [prefs]);

  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    saveBudgets(budgets);
  }, [budgets]);

  const setTheme = (m: ThemeMode) => setPrefsState((p) => ({ ...p, theme: m }));
  const toggleTheme = () => setPrefsState((p) => ({ ...p, theme: p.theme === 'dark' ? 'light' : 'dark' }));
  const setPrefs = (partial: Partial<Preferences>) => setPrefsState((p) => ({ ...p, ...partial }));

  const addTransaction = (t: Omit<Transaction, 'id' | 'createdAt'>) => {
    setTransactions((prev) => [{ ...t, id: uid(), createdAt: Date.now() }, ...prev]);
  };
  const updateTransaction = (id: string, t: Omit<Transaction, 'id' | 'createdAt'>) => {
    setTransactions((prev) => prev.map((x) => (x.id === id ? { ...x, ...t } : x)));
  };
  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((x) => x.id !== id));
  };

  const setBudgets = (b: Budget[]) => setBudgetsState(b);
  const addBudget = (b: Omit<Budget, 'id'>) => setBudgetsState((prev) => [...prev, { ...b, id: uid() }]);
  const updateBudget = (id: string, b: Omit<Budget, 'id'>) =>
    setBudgetsState((prev) => prev.map((x) => (x.id === id ? { ...x, ...b } : x)));
  const deleteBudget = (id: string) => setBudgetsState((prev) => prev.filter((x) => x.id !== id));

  const value: AppContextValue = {
    prefs,
    setTheme,
    toggleTheme,
    setPrefs,
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    budgets,
    setBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
