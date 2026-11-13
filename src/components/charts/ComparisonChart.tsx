import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useApp } from '@/hooks/useApp';
import { formatCompact, formatMoney } from '@/utils/finance';

interface ComparisonChartProps {
  data: { label: string; income: number; expense: number }[];
}

export function ComparisonChart({ data }: ComparisonChartProps) {
  const { prefs } = useApp();
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 12, left: -10, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => formatCompact(Number(v), prefs.currency)} width={56} />
        <Tooltip
          formatter={(v, name) => [formatMoney(Number(v), prefs.currency), name === 'income' ? 'Income' : 'Expense']}
          contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '0.6rem' }}
          labelStyle={{ color: 'var(--text-secondary)', fontSize: 12 }}
          itemStyle={{ color: 'var(--text-primary)' }}
          cursor={{ fill: 'rgba(129,140,248,0.06)' }}
        />
        <Bar dataKey="income" fill="var(--income)" radius={[4, 4, 0, 0]} maxBarSize={26} animationDuration={600} />
        <Bar dataKey="expense" fill="var(--expense)" radius={[4, 4, 0, 0]} maxBarSize={26} animationDuration={600} />
      </BarChart>
    </ResponsiveContainer>
  );
}
