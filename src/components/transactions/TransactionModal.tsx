import clsx from 'clsx'
import { X } from 'lucide-react'
import { useState } from 'react'
import { useFinanceStore } from '../../store/useFinanceStore'
import type { Transaction, TransactionType } from '../../types/finance'

interface TransactionModalProps {
  open: boolean
  onClose: () => void
  editing: Transaction | null
  categoryOptions: string[]
}

const emptyForm = {
  date: new Date().toISOString().slice(0, 10),
  amount: '',
  category: '',
  type: 'expense' as TransactionType,
  description: '',
}

function buildForm(editing: Transaction | null) {
  if (editing) {
    return {
      date: editing.date,
      amount: String(editing.amount),
      category: editing.category,
      type: editing.type,
      description: editing.description,
    }
  }
  return {
    ...emptyForm,
    date: new Date().toISOString().slice(0, 10),
  }
}

export function TransactionModal({ open, onClose, editing, categoryOptions }: TransactionModalProps) {
  const addTransaction = useFinanceStore((s) => s.addTransaction)
  const updateTransaction = useFinanceStore((s) => s.updateTransaction)

  const [form, setForm] = useState(() => buildForm(editing))
  const [error, setError] = useState<string | null>(null)

  if (!open) return null

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number.parseFloat(form.amount)
    if (!form.date || Number.isNaN(amount) || amount <= 0) {
      setError('Enter a valid date and a positive amount.')
      return
    }
    if (!form.category.trim()) {
      setError('Category is required.')
      return
    }
    if (!form.description.trim()) {
      setError('Description is required.')
      return
    }

    const payload = {
      date: form.date,
      amount,
      category: form.category.trim(),
      type: form.type,
      description: form.description.trim(),
    }

    if (editing) {
      updateTransaction(editing.id, payload)
    } else {
      addTransaction(payload)
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tx-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-lg rounded-t-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-2xl sm:rounded-2xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 id="tx-modal-title" className="text-lg font-semibold text-[var(--color-foreground)]">
              {editing ? 'Edit transaction' : 'Add transaction'}
            </h2>
            <p className="text-sm text-[var(--color-muted)]">Amounts are stored as positive values.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--color-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="text-[var(--color-muted)]">Date</span>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-foreground)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </label>
            <label className="block text-sm">
              <span className="text-[var(--color-muted)]">Amount (INR)</span>
              <input
                type="number"
                min={0.01}
                step="0.01"
                required
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-foreground)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
            </label>
          </div>

          <label className="block text-sm">
            <span className="text-[var(--color-muted)]">Type</span>
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as TransactionType }))}
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-foreground)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </label>

          <label className="block text-sm">
            <span className="text-[var(--color-muted)]">Category</span>
            <input
              list="cat-suggestions"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-foreground)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              placeholder="e.g. Groceries"
            />
            <datalist id="cat-suggestions">
              {categoryOptions.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>

          <label className="block text-sm">
            <span className="text-[var(--color-muted)]">Description</span>
            <input
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[var(--color-foreground)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              placeholder="Short note"
            />
          </label>

          {error ? <p className="text-sm text-[var(--color-expense)]">{error}</p> : null}

          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-surface)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={clsx(
                'rounded-lg px-4 py-2 text-sm font-semibold text-white',
                'bg-[var(--color-accent)] hover:opacity-95',
              )}
            >
              {editing ? 'Save changes' : 'Add transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
