import type { CategoryDef } from '@/types';

export const EXPENSE_CATEGORIES: CategoryDef[] = [
  { name: 'food', label: 'Food & Dining', color: '#fb7185', icon: 'Utensils' },
  { name: 'shopping', label: 'Shopping', color: '#f0abfc', icon: 'ShoppingBag' },
  { name: 'transport', label: 'Transport', color: '#60a5fa', icon: 'Car' },
  { name: 'bills', label: 'Bills & Utilities', color: '#fbbf24', icon: 'Receipt' },
  { name: 'entertainment', label: 'Entertainment', color: '#c4b5fd', icon: 'Clapperboard' },
  { name: 'healthcare', label: 'Healthcare', color: '#34d399', icon: 'HeartPulse' },
  { name: 'education', label: 'Education', color: '#22d3ee', icon: 'GraduationCap' },
  { name: 'travel', label: 'Travel', color: '#a78bfa', icon: 'Plane' },
  { name: 'other', label: 'Other', color: '#94a3b8', icon: 'MoreHorizontal' },
];

export const INCOME_CATEGORIES: CategoryDef[] = [
  { name: 'salary', label: 'Salary', color: '#34d399', icon: 'Banknote' },
  { name: 'freelance', label: 'Freelance', color: '#22d3ee', icon: 'Laptop' },
  { name: 'business', label: 'Business', color: '#60a5fa', icon: 'Briefcase' },
  { name: 'investments', label: 'Investments', color: '#c4b5fd', icon: 'TrendingUp' },
  { name: 'gifts', label: 'Gifts', color: '#f0abfc', icon: 'Gift' },
  { name: 'other', label: 'Other', color: '#94a3b8', icon: 'MoreHorizontal' },
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

const EXPENSE_NAMES = new Set(EXPENSE_CATEGORIES.map((c) => c.name));

export function isExpenseCategory(name: string): boolean {
  return EXPENSE_NAMES.has(name);
}

export function getCategory(name: string): CategoryDef | undefined {
  return ALL_CATEGORIES.find((c) => c.name === name);
}

export function getCategoryLabel(name: string): string {
  return getCategory(name)?.label ?? name;
}

export function getCategoryColor(name: string): string {
  return getCategory(name)?.color ?? '#94a3b8';
}

export function categoriesForType(type: 'income' | 'expense'): CategoryDef[] {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
}
