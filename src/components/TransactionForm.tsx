import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Transaction, TransactionType, PaymentMethod } from '@/types';
import { categoriesForType } from '@/data/categories';
import { todayISO } from '@/utils/dates';

interface TransactionFormProps {
  initial?: Transaction;
  onSubmit: (data: Omit<Transaction, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: 'card', label: 'Card' },
  { value: 'cash', label: 'Cash' },
  { value: 'bank', label: 'Bank Transfer' },
  { value: 'wallet', label: 'Digital Wallet' },
  { value: 'other', label: 'Other' },
];

export function TransactionForm({ initial, onSubmit, onCancel }: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>(initial?.type ?? 'expense');
  const [title, setTitle] = useState(initial?.title ?? '');
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '');
  const [category, setCategory] = useState(initial?.category ?? 'food');
  const [date, setDate] = useState(initial?.date ?? todayISO());
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initial?.paymentMethod ?? 'card');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = categoriesForType(type);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = 'Description is required';
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) e.amount = 'Enter a valid amount greater than zero';
    if (!date) e.date = 'Date is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit({
      title: title.trim(),
      type,
      amount: parseFloat(amount),
      category,
      date,
      notes: notes.trim() || undefined,
      paymentMethod,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Type toggle */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-surface-2 rounded-xl border border-subtle">
        {(['expense', 'income'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setType(t);
              setCategory(categoriesForType(t)[0].name);
            }}
            className={`relative py-2.5 rounded-lg text-sm font-medium transition-colors ${
              type === t ? 'text-white' : 'text-secondary hover:text-primary'
            }`}
          >
            {type === t && (
              <motion.div
                layoutId="type-toggle"
                className={`absolute inset-0 rounded-lg ${t === 'income' ? 'bg-income' : 'bg-expense'}`}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10 capitalize">{t}</span>
          </button>
        ))}
      </div>

      <Field label="Description" error={errors.title}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Grocery shopping"
          className="input-base"
          autoFocus
        />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Amount" error={errors.amount}>
          <input
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="input-base"
          />
        </Field>
        <Field label="Date" error={errors.date}>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-base" />
        </Field>
      </div>

      <Field label="Category">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-base">
          {categories.map((c) => (
            <option key={c.name} value={c.name}>
              {c.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Payment Method">
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)} className="input-base">
          {PAYMENT_METHODS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Notes (optional)">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add a note..."
          rows={2}
          className="input-base resize-none"
        />
      </Field>

      <div className="flex gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-ghost flex-1">
          Cancel
        </button>
        <button type="submit" className="btn-primary flex-1">
          {initial ? 'Save Changes' : 'Add Transaction'}
        </button>
      </div>

      <style>{`
        .input-base {
          width: 100%;
          background: var(--bg-surface-2);
          border: 1px solid var(--border-subtle);
          border-radius: 0.6rem;
          padding: 0.6rem 0.8rem;
          color: var(--text-primary);
          font-size: 0.875rem;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .input-base:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent);
        }
        .input-base::placeholder { color: var(--text-muted); }
        .btn-primary {
          background: linear-gradient(135deg, var(--accent), var(--accent-2));
          color: white;
          font-weight: 600;
          padding: 0.65rem 1rem;
          border-radius: 0.6rem;
          font-size: 0.875rem;
          transition: opacity 0.15s, transform 0.1s;
        }
        .btn-primary:hover { opacity: 0.92; }
        .btn-primary:active { transform: scale(0.98); }
        .btn-ghost {
          color: var(--text-secondary);
          font-weight: 500;
          padding: 0.65rem 1rem;
          border-radius: 0.6rem;
          border: 1px solid var(--border-subtle);
          font-size: 0.875rem;
          transition: color 0.15s, border-color 0.15s;
        }
        .btn-ghost:hover { color: var(--text-primary); border-color: var(--border-strong); }
      `}</style>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-secondary mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
      {error && <p className="text-xs text-expense mt-1.5">{error}</p>}
    </div>
  );
}
