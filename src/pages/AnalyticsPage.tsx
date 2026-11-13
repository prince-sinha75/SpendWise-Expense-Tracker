import { useMemo, useState } from 'react';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';
import { useApp } from '@/hooks/useApp';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { RangeFilter } from '@/components/RangeFilter';
import { TrendChart } from '@/components/charts/TrendChart';
import { ComparisonChart } from '@/components/charts/ComparisonChart';
import { DonutChart } from '@/components/charts/DonutChart';
import { SummaryCard } from '@/components/SummaryCard';
import { filterByRange, dailySeries, monthlySeries, categoryTotals, sumBy, savingsRate, formatMoney } from '@/utils/finance';
import { CategoryIcon } from '@/components/ui/CategoryIcon';
import { getCategory, getCategoryColor, getCategoryLabel } from '@/data/categories';
import type { RangeKey } from '@/types';
import { ArrowDownLeft, ArrowUpRight, PiggyBank } from 'lucide-react';

export function AnalyticsPage() {
  const { transactions, prefs } = useApp();
  const [range, setRange] = useState<RangeKey>('90d');

  const ranged = useMemo(() => filterByRange(transactions, range), [transactions, range]);
  const income = sumBy(ranged, 'income');
  const expenses = sumBy(ranged, 'expense');
  const rate = savingsRate(income, expenses);

  const days = range === '7d' ? 7 : range === '30d' || range === 'month' ? 30 : range === '90d' ? 90 : 30;
  const expenseTrend = useMemo(() => dailySeries(ranged, days, 'expense'), [ranged, days]);
  const monthly = useMemo(() => monthlySeries(transactions, 6), [transactions]);
  const catData = useMemo(() => categoryTotals(ranged), [ranged]);

  const topCategory = catData[0];
  const avgDailyExpense = expenses / days;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-sm text-secondary">Analyzing {ranged.length} transactions</p>
        <RangeFilter value={range} onChange={setRange} />
      </div>

      {/* Mini summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard label="Income" value={income} format={(n) => formatMoney(n, prefs.currency)} icon={<ArrowDownLeft className="w-[18px] h-[18px]" />} accent="income" delay={0} />
        <SummaryCard label="Expenses" value={expenses} format={(n) => formatMoney(n, prefs.currency)} icon={<ArrowUpRight className="w-[18px] h-[18px]" />} accent="expense" delay={0.06} />
        <SummaryCard label="Savings Rate" value={rate} format={(n) => `${n.toFixed(1)}%`} icon={<PiggyBank className="w-[18px] h-[18px]" />} accent="blue" delay={0.12} />
      </div>

      {/* Income vs Expense */}
      <Card className="p-5" delay={0.18}>
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-primary">Income vs Expenses</h3>
          <p className="text-xs text-muted">Last 6 months comparison</p>
        </div>
        {monthly.some((m) => m.income > 0 || m.expense > 0) ? (
          <ComparisonChart data={monthly} />
        ) : (
          <EmptyState icon={<BarChart3 className="w-7 h-7" />} title="Not enough data" message="Add transactions across multiple months to see comparisons." />
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Expense trend */}
        <Card className="p-5" delay={0.24}>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-primary">Expense Trend</h3>
            <p className="text-xs text-muted">Daily expenses this period</p>
          </div>
          {expenses > 0 ? (
            <TrendChart data={expenseTrend} />
          ) : (
            <EmptyState icon={<TrendingUp className="w-7 h-7" />} title="No expenses" message="No expense data in this range." />
          )}
        </Card>

        {/* Category donut */}
        <Card className="p-5" delay={0.3}>
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-primary">Category Breakdown</h3>
            <p className="text-xs text-muted">Where your money goes</p>
          </div>
          <DonutChart data={catData} />
        </Card>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5" delay={0.36}>
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-accent" />
            <h3 className="text-sm font-semibold text-primary">Avg Daily Spending</h3>
          </div>
          <p className="text-2xl font-semibold text-primary tabular-nums">{formatMoney(avgDailyExpense, prefs.currency)}</p>
          <p className="text-xs text-muted mt-1">over {days} days</p>
        </Card>

        <Card className="p-5" delay={0.42}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-expense" />
            <h3 className="text-sm font-semibold text-primary">Top Category</h3>
          </div>
          {topCategory ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${getCategoryColor(topCategory.category)}1f` }}>
                <CategoryIcon name={getCategory(topCategory.category)?.icon ?? 'MoreHorizontal'} className="w-5 h-5" style={{ color: getCategoryColor(topCategory.category) }} />
              </div>
              <div>
                <p className="text-sm font-medium text-primary">{getCategoryLabel(topCategory.category)}</p>
                <p className="text-xs text-muted">{formatMoney(topCategory.total, prefs.currency)}</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted">No expense data</p>
          )}
        </Card>

        <Card className="p-5" delay={0.48}>
          <div className="flex items-center gap-2 mb-3">
            <PiggyBank className="w-4 h-4 text-income" />
            <h3 className="text-sm font-semibold text-primary">Net Savings</h3>
          </div>
          <p className={`text-2xl font-semibold tabular-nums ${income - expenses >= 0 ? 'text-income' : 'text-expense'}`}>
            {formatMoney(income - expenses, prefs.currency)}
          </p>
          <p className="text-xs text-muted mt-1">income minus expenses</p>
        </Card>
      </div>
    </div>
  );
}
