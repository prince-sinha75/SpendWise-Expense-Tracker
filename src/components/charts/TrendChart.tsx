import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useApp } from '@/hooks/useApp';
import { formatCompact, formatMoney } from '@/utils/finance';

interface TrendChartProps {
  data: { label: string; date: string; value: number }[];
}

export function TrendChart({ data }: TrendChartProps) {
  const { prefs } = useApp();
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 12, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} interval="preserveStartEnd" minTickGap={24} />
        <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => formatCompact(Number(v), prefs.currency)} width={56} />
        <Tooltip
          formatter={(v) => [formatMoney(Number(v), prefs.currency), 'Spending']}
          contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '0.6rem' }}
          labelStyle={{ color: 'var(--text-secondary)', fontSize: 12 }}
          itemStyle={{ color: 'var(--text-primary)' }}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke="var(--accent)"
          strokeWidth={2.5}
          fill="url(#trendGrad)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
          isAnimationActive
          animationDuration={600}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
