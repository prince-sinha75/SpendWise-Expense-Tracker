import { useMemo, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Wallet, ArrowDownLeft, ArrowUpRight, PiggyBank, ArrowUpRight as ArrowUp } from 'lucide-react';
import { useApp } from '@/hooks/useApp';
import { useTransactionModals } from '@/hooks/useTransactionModals';
import { SummaryCard } from '@/components/SummaryCard';
import { Card } from '@/components/ui/Card';
import { TrendChart } from '@/components/charts/TrendChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { TransactionRow, TransactionCard } from '@/components/TransactionRow';
import { EmptyState } from '@/components/ui/EmptyState';
import { RangeFilter } from '@/components/RangeFilter';
import { formatMoney, sumBy, totalBalance, savingsRate, filterByRange, dailySeries, categoryTotals } from '@/utils/finance';
import type { RangeKey } from '@/types';
import { Receipt } from 'lucide-react';

export function DashboardPage() {
  const { transactions, prefs } = useApp();
  const { openAdd, openEdit, requestDelete, modals } = useTransactionModals();
  const [range, setRange] = useState<RangeKey>('30d');

  const ranged = useMemo(() => filterByRange(transactions, range), [transactions, range]);
  const income = sumBy(ranged, 'income');
  const expenses = sumBy(ranged, 'expense');
  const balance = totalBalance(transactions, prefs.startingBalance);
  const rate = savingsRate(income, expenses);

  const days = range === '7d' ? 7 : range === '30d' || range === 'month' ? 30 : range === '90d' ? 90 : 30;
  const trendData = useMemo(() => dailySeries(ranged, days, 'expense'), [ranged, days]);
  const catData = useMemo(() => categoryTotals(ranged), [ranged]);
  const recent = useMemo(() => [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6), [transactions]);

  return (
    <div className="space-y-6">
      {/* Range filter row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-secondary">
          {ranged.length} transaction{ranged.length !== 1 ? 's' : ''} in this period
        </p>
        <RangeFilter value={range} onChange={setRange} />
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <SummaryCard
          label="Total Balance"
          value={balance}
          format={(n) => formatMoney(n, prefs.currency)}
          icon={<Wallet className="w-[18px] h-[18px]" />}
          accent="violet"
          hint="across all time"
          delay={0}
        />
        <SummaryCard
          label="Total Income"
          value={income}
          format={(n) => formatMoney(n, prefs.currency)}
          icon={<ArrowDownLeft className="w-[18px] h-[18px]" />}
          accent="income"
          hint="this period"
          delay={0.06}
        />
        <SummaryCard
          label="Total Expenses"
          value={expenses}
          format={(n) => formatMoney(n, prefs.currency)}
          icon={<ArrowUpRight className="w-[18px] h-[18px]" />}
          accent="expense"
          hint="this period"
          delay={0.12}
        />
        <SummaryCard
          label="Savings Rate"
          value={rate}
          format={(n) => `${n.toFixed(1)}%`}
          icon={<PiggyBank className="w-[18px] h-[18px]" />}
          accent="blue"
          hint={income > 0 ? 'of income kept' : 'no income yet'}
          delay={0.18}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2" delay={0.24}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-primary">Expense Trend</h3>
              <p className="text-xs text-muted">Daily spending over time</p>
            </div>
          </div>
          {expenses > 0 ? (
            <TrendChart data={trendData} />
          ) : (
            <EmptyState icon={<Receipt className="w-7 h-7" />} title="No expenses yet" message="Add a transaction to see your spending trend." />
          )}
        </Card>

        <Card className="p-5" delay={0.3}>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-primary">Category Breakdown</h3>
            <p className="text-xs text-muted">Spending by category</p>
          </div>
          <DonutChart data={catData} />
        </Card>
      </div>

      {/* Recent transactions */}
      <Card className="p-5" delay={0.36} hover={false}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-semibold text-primary">Recent Activity</h3>
            <p className="text-xs text-muted">Your latest transactions</p>
          </div>
          <button onClick={openAdd} className="flex items-center gap-1.5 text-xs text-accent hover:underline font-medium">
            <ArrowUp className="w-3 h-3" /> Add new
          </button>
        </div>

        {recent.length === 0 ? (
          <EmptyState
            icon={<Wallet className="w-7 h-7" />}
            title="No transactions yet"
            message="Start by adding your first income or expense."
            action={
              <button onClick={openAdd} className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-medium">
                Add Transaction
              </button>
            }
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-muted uppercase tracking-wider">
                    <th className="py-2 pl-4 pr-2 font-medium">Description</th>
                    <th className="py-2 px-2 font-medium">Date</th>
                    <th className="py-2 px-2 font-medium">Type</th>
                    <th className="py-2 px-2 font-medium text-right">Amount</th>
                    <th className="py-2 pl-2 pr-4" />
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {recent.map((tx, i) => (
                      <TransactionRow key={tx.id} tx={tx} onEdit={openEdit} onDelete={requestDelete} index={i} />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="md:hidden space-y-2">
              <AnimatePresence>
                {recent.map((tx) => (
                  <TransactionCard key={tx.id} tx={tx} onEdit={openEdit} onDelete={requestDelete} />
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </Card>

      {modals}
    </div>
  );
}
