import type { Transaction } from '@/types';
import { addDays, subDays } from 'date-fns';

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const today = new Date();

export const SAMPLE_TRANSACTIONS: Transaction[] = [
  { id: 's1', title: 'Monthly Salary', type: 'income', amount: 5200, category: 'salary', date: isoDate(subDays(today, 2)), notes: 'October payroll', paymentMethod: 'bank', createdAt: Date.now() - 200000 },
  { id: 's2', title: 'Freelance Project', type: 'income', amount: 850, category: 'freelance', date: isoDate(subDays(today, 5)), notes: 'Logo design', paymentMethod: 'wallet', createdAt: Date.now() - 210000 },
  { id: 's3', title: 'Grocery Store', type: 'expense', amount: 124.6, category: 'food', date: isoDate(subDays(today, 1)), notes: 'Weekly groceries', paymentMethod: 'card', createdAt: Date.now() - 220000 },
  { id: 's4', title: 'Electric Bill', type: 'expense', amount: 86.4, category: 'bills', date: isoDate(subDays(today, 3)), paymentMethod: 'bank', createdAt: Date.now() - 230000 },
  { id: 's5', title: 'Subway Pass', type: 'expense', amount: 42, category: 'transport', date: isoDate(subDays(today, 4)), paymentMethod: 'cash', createdAt: Date.now() - 240000 },
  { id: 's6', title: 'Movie Night', type: 'expense', amount: 28.5, category: 'entertainment', date: isoDate(subDays(today, 6)), paymentMethod: 'card', createdAt: Date.now() - 250000 },
  { id: 's7', title: 'Coffee Shop', type: 'expense', amount: 6.75, category: 'food', date: isoDate(subDays(today, 1)), paymentMethod: 'card', createdAt: Date.now() - 260000 },
  { id: 's8', title: 'Online Course', type: 'expense', amount: 59.99, category: 'education', date: isoDate(subDays(today, 8)), paymentMethod: 'card', createdAt: Date.now() - 270000 },
  { id: 's9', title: 'Pharmacy', type: 'expense', amount: 23.4, category: 'healthcare', date: isoDate(subDays(today, 10)), paymentMethod: 'cash', createdAt: Date.now() - 280000 },
  { id: 's10', title: 'New Headphones', type: 'expense', amount: 199, category: 'shopping', date: isoDate(subDays(today, 12)), paymentMethod: 'card', createdAt: Date.now() - 290000 },
  { id: 's11', title: 'Dividend Income', type: 'income', amount: 120, category: 'investments', date: isoDate(subDays(today, 14)), paymentMethod: 'bank', createdAt: Date.now() - 300000 },
  { id: 's12', title: 'Restaurant Dinner', type: 'expense', amount: 64.2, category: 'food', date: isoDate(subDays(today, 7)), paymentMethod: 'card', createdAt: Date.now() - 310000 },
  { id: 's13', title: 'Internet Bill', type: 'expense', amount: 49.99, category: 'bills', date: isoDate(subDays(today, 9)), paymentMethod: 'bank', createdAt: Date.now() - 320000 },
  { id: 's14', title: 'Gift for Friend', type: 'expense', amount: 35, category: 'other', date: isoDate(subDays(today, 11)), paymentMethod: 'cash', createdAt: Date.now() - 330000 },
  { id: 's15', title: 'Ride Share', type: 'expense', amount: 18.3, category: 'transport', date: isoDate(subDays(today, 2)), paymentMethod: 'wallet', createdAt: Date.now() - 340000 },
];

export const SAMPLE_BUDGETS = [
  { id: 'b1', category: 'food', limit: 400 },
  { id: 'b2', category: 'transport', limit: 150 },
  { id: 'b3', category: 'bills', limit: 300 },
  { id: 'b4', category: 'entertainment', limit: 100 },
];

export { addDays };
