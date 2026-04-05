import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react'
import { formatCurrency } from '../lib/format'
import { sumExpenses, sumIncome, totalBalance } from '../lib/financeMath'
import type { Transaction } from '../types/finance'

interface SummaryCardsProps {
  transactions: Transaction[]
  loading?: boolean
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-card)]">
      <div className="mb-3 h-3 w-24 rounded bg-[var(--color-border)]" />
      <div className="h-8 w-36 rounded bg-[var(--color-border)]" />
    </div>
  )
}

export function SummaryCards({ transactions, loading }: SummaryCardsProps) {
  const income = sumIncome(transactions)
  const expenses = sumExpenses(transactions)
  const balance = totalBalance(transactions)

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    )
  }

  const cards = [
    {
      title: 'Total balance',
      value: formatCurrency(balance),
      icon: Wallet,
      accent: 'text-[var(--color-foreground)]',
      sub: 'Income minus expenses (all time)',
    },
    {
      title: 'Income',
      value: formatCurrency(income),
      icon: ArrowUpRight,
      accent: 'text-[var(--color-income)]',
      sub: 'Recorded inflows',
    },
    {
      title: 'Expenses',
      value: formatCurrency(expenses),
      icon: ArrowDownRight,
      accent: 'text-[var(--color-expense)]',
      sub: 'Recorded outflows',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {cards.map((c) => (
        <article
          key={c.title}
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-card)] transition hover:shadow-lg"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
                {c.title}
              </p>
              <p className={`mt-2 text-2xl font-semibold tracking-tight ${c.accent}`}>{c.value}</p>
              <p className="mt-1 text-xs text-[var(--color-muted)]">{c.sub}</p>
            </div>
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-muted)] text-[var(--color-accent)]"
              aria-hidden
            >
              <c.icon className="h-5 w-5" strokeWidth={2} />
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
