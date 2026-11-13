import type { RangeKey } from '@/types';

interface RangeFilterProps {
  value: RangeKey;
  onChange: (r: RangeKey) => void;
  options?: { key: RangeKey; label: string }[];
}

const DEFAULT_OPTIONS: { key: RangeKey; label: string }[] = [
  { key: '7d', label: '7D' },
  { key: '30d', label: '30D' },
  { key: '90d', label: '90D' },
  { key: 'month', label: 'This Month' },
  { key: 'year', label: 'This Year' },
  { key: 'all', label: 'All Time' },
];

export function RangeFilter({ value, onChange, options = DEFAULT_OPTIONS }: RangeFilterProps) {
  return (
    <div className="inline-flex items-center gap-0.5 p-0.5 bg-surface-2 rounded-lg border border-subtle">
      {options.map((o) => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={`px-2.5 sm:px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            value === o.key ? 'bg-elevated text-primary shadow-sm' : 'text-secondary hover:text-primary'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
