import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { AnimatedNumber } from '@/components/ui/AnimatedNumber';

interface SummaryCardProps {
  label: string;
  value: number;
  format: (n: number) => string;
  icon: ReactNode;
  accent: 'violet' | 'income' | 'expense' | 'blue';
  hint?: string;
  trend?: { up: boolean; text: string };
  delay?: number;
}

const ACCENT_STYLES = {
  violet: { bg: 'from-indigo-500/20 to-violet-500/10', icon: 'text-indigo-400', glow: 'shadow-indigo-500/10' },
  income: { bg: 'from-emerald-500/20 to-teal-500/10', icon: 'text-emerald-400', glow: 'shadow-emerald-500/10' },
  expense: { bg: 'from-rose-500/20 to-pink-500/10', icon: 'text-rose-400', glow: 'shadow-rose-500/10' },
  blue: { bg: 'from-sky-500/20 to-blue-500/10', icon: 'text-sky-400', glow: 'shadow-sky-500/10' },
} as const;

export function SummaryCard({ label, value, format, icon, accent, hint, trend, delay = 0 }: SummaryCardProps) {
  const reduce = useReducedMotion();
  const a = ACCENT_STYLES[accent];
  return (
    <Card delay={delay} className="p-5 overflow-hidden relative">
      <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${a.bg} blur-2xl opacity-60`} />
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <span className="text-xs uppercase tracking-widest text-secondary font-medium">{label}</span>
          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${a.bg} flex items-center justify-center ${a.icon}`}>
            {icon}
          </div>
        </div>
        <AnimatedNumber value={value} format={format} className="text-2xl sm:text-3xl font-semibold text-primary tabular-nums tracking-tight block" />
        <div className="mt-2 flex items-center gap-2">
          {trend && (
            <span className={`flex items-center gap-1 text-xs font-medium ${trend.up ? 'text-income' : 'text-expense'}`}>
              {trend.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend.text}
            </span>
          )}
          {hint && <span className="text-xs text-muted">{hint}</span>}
        </div>
      </div>
      {!reduce && (
        <motion.div
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent opacity-0"
          whileHover={{ opacity: 0.5 }}
        />
      )}
    </Card>
  );
}
