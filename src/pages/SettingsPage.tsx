import { useState } from 'react';
import { Download, Trash2, Moon, Sun, Sparkles, Coins, AlertTriangle } from 'lucide-react';
import { useApp } from '@/hooks/useApp';
import { useToast } from '@/hooks/useToast';
import { Card } from '@/components/ui/Card';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { downloadCSV, formatMoney } from '@/utils/finance';
import { clearAllData } from '@/lib/storage';
import type { ThemeMode } from '@/types';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'CAD', 'AUD', 'CHF'];

export function SettingsPage() {
  const { prefs, setPrefs, transactions, toggleTheme } = useApp();
  const { notify } = useToast();
  const [confirmClear, setConfirmClear] = useState(false);

  const handleExport = () => {
    if (transactions.length === 0) {
      notify('No transactions to export', 'error');
      return;
    }
    const ok = downloadCSV(transactions);
    notify(ok ? `Exported ${transactions.length} transactions` : 'Export failed', ok ? 'success' : 'error');
  };

  const handleClear = () => {
    clearAllData();
    notify('All data cleared. Reloading...', 'info');
    setTimeout(() => window.location.reload(), 800);
  };

  return (
    <div className="max-w-3xl space-y-6">
      {/* Appearance */}
      <Card className="p-6" delay={0} hover={false}>
        <h3 className="text-sm font-semibold text-primary mb-1">Appearance</h3>
        <p className="text-xs text-muted mb-5">Choose how SpendWise looks</p>

        <div className="grid grid-cols-2 gap-3">
          {(['dark', 'light'] as ThemeMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => { if (prefs.theme !== mode) toggleTheme(); }}
              className={`relative p-4 rounded-xl border text-left transition-all ${
                prefs.theme === mode ? 'border-accent bg-accent/5' : 'border-subtle hover:border-strong'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                {mode === 'dark' ? <Moon className="w-5 h-5 text-accent" /> : <Sun className="w-5 h-5 text-accent" />}
                <span className="text-sm font-medium text-primary capitalize">{mode} Mode</span>
              </div>
              <div className={`h-16 rounded-lg overflow-hidden ${mode === 'dark' ? 'bg-[#0d111c]' : 'bg-slate-100'}`}>
                <div className="flex gap-1.5 p-3">
                  <div className={`w-6 h-6 rounded ${mode === 'dark' ? 'bg-indigo-500' : 'bg-indigo-600'}`} />
                  <div className={`flex-1 h-6 rounded ${mode === 'dark' ? 'bg-white/10' : 'bg-black/5'}`} />
                </div>
                <div className="px-3 flex gap-1.5">
                  <div className={`w-1.5 h-1.5 rounded-full ${mode === 'dark' ? 'bg-emerald-400' : 'bg-emerald-600'}`} />
                  <div className={`w-1.5 h-1.5 rounded-full ${mode === 'dark' ? 'bg-rose-400' : 'bg-rose-600'}`} />
                </div>
              </div>
            </button>
          ))}
        </div>

        <label className="flex items-center justify-between mt-5 py-3 border-t border-subtle cursor-pointer">
          <div>
            <div className="text-sm font-medium text-primary">Reduce motion</div>
            <div className="text-xs text-muted">Minimize animations and transitions</div>
          </div>
          <Toggle checked={prefs.reduceMotion} onChange={(v) => setPrefs({ reduceMotion: v })} />
        </label>
      </Card>

      {/* Preferences */}
      <Card className="p-6" delay={0.06} hover={false}>
        <h3 className="text-sm font-semibold text-primary mb-1">Preferences</h3>
        <p className="text-xs text-muted mb-5">Currency and starting balance</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-secondary mb-1.5 uppercase tracking-wide">
              <Coins className="w-3.5 h-3.5" /> Currency
            </label>
            <select
              value={prefs.currency}
              onChange={(e) => { setPrefs({ currency: e.target.value }); notify('Currency updated'); }}
              className="w-full bg-surface-2 border border-subtle rounded-lg px-3 py-2.5 text-sm text-primary focus:outline-none focus:border-accent"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-xs font-medium text-secondary mb-1.5 uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5" /> Starting Balance
            </label>
            <input
              type="number"
              step="0.01"
              value={prefs.startingBalance}
              onChange={(e) => setPrefs({ startingBalance: parseFloat(e.target.value) || 0 })}
              className="w-full bg-surface-2 border border-subtle rounded-lg px-3 py-2.5 text-sm text-primary focus:outline-none focus:border-accent"
            />
            <p className="text-xs text-muted mt-1.5">Added to your total balance calculation</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-surface-2 rounded-lg border border-subtle">
          <div className="flex items-center justify-between text-sm">
            <span className="text-secondary">Current balance</span>
            <span className="text-primary font-semibold tabular-nums">
              {formatMoney(
                prefs.startingBalance + transactions.reduce((a, t) => a + (t.type === 'income' ? t.amount : -t.amount), 0),
                prefs.currency
              )}
            </span>
          </div>
        </div>
      </Card>

      {/* Data */}
      <Card className="p-6" delay={0.12} hover={false}>
        <h3 className="text-sm font-semibold text-primary mb-1">Data Management</h3>
        <p className="text-xs text-muted mb-5">Export or clear your local data</p>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-subtle text-sm font-medium text-secondary hover:text-primary hover:border-strong transition-colors flex-1"
          >
            <Download className="w-4 h-4" /> Export all transactions
          </button>
          <button
            onClick={() => setConfirmClear(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-expense/30 text-sm font-medium text-expense hover:bg-expense/10 transition-colors flex-1"
          >
            <Trash2 className="w-4 h-4" /> Clear all data
          </button>
        </div>

        <div className="mt-4 flex items-start gap-2 p-3 bg-expense/5 border border-expense/20 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-expense shrink-0 mt-0.5" />
          <p className="text-xs text-secondary">
            Clearing data removes all transactions, budgets, and preferences from this browser. This cannot be undone.
          </p>
        </div>
      </Card>

      <p className="text-center text-xs text-muted py-2">
        SpendWise stores data locally in your browser. No cloud sync, no account required.
      </p>

      <ConfirmDialog
        open={confirmClear}
        title="Clear All Data"
        message="This will permanently delete all your transactions, budgets, and preferences. Continue?"
        confirmLabel="Clear Everything"
        onConfirm={handleClear}
        onCancel={() => setConfirmClear(false)}
      />
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-surface-2 border border-subtle'}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : ''}`}
      />
    </button>
  );
}
