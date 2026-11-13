import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useApp } from '@/hooks/useApp';
import { formatMoney } from '@/utils/finance';
import { getCategory, getCategoryColor, getCategoryLabel } from '@/data/categories';
import { CategoryIcon } from '@/components/ui/CategoryIcon';

interface DonutChartProps {
  data: { category: string; total: number }[];
}

export function DonutChart({ data }: DonutChartProps) {
  const { prefs } = useApp();
  const total = data.reduce((a, d) => a + d.total, 0);

  if (data.length === 0) {
    return (
      <div className="h-[260px] flex items-center justify-center text-secondary text-sm">
        No expense data for this period
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative w-[200px] h-[200px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              innerRadius={62}
              outerRadius={92}
              paddingAngle={2}
              stroke="none"
              animationDuration={600}
            >
              {data.map((d) => (
                <Cell key={d.category} fill={getCategoryColor(d.category)} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v, name) => [formatMoney(Number(v), prefs.currency), getCategoryLabel(String(name))]}
              contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: '0.6rem' }}
              itemStyle={{ color: 'var(--text-primary)' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] uppercase tracking-widest text-muted">Total</span>
          <span className="text-lg font-semibold text-primary">{formatMoney(total, prefs.currency)}</span>
        </div>
      </div>

      <div className="flex-1 w-full space-y-2 max-h-[200px] overflow-y-auto scrollbar-thin">
        {data.map((d) => {
          const pct = total > 0 ? (d.total / total) * 100 : 0;
          return (
            <div key={d.category} className="flex items-center gap-3 text-sm">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `${getCategoryColor(d.category)}22` }}
              >
                <CategoryIcon name={getCategory(d.category)?.icon ?? 'MoreHorizontal'} className="w-4 h-4" style={{ color: getCategoryColor(d.category) }} />
              </div>
              <span className="text-secondary flex-1 truncate">{getCategoryLabel(d.category)}</span>
              <span className="text-primary font-medium tabular-nums">{pct.toFixed(0)}%</span>
              <span className="text-muted tabular-nums w-20 text-right">{formatMoney(d.total, prefs.currency)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
