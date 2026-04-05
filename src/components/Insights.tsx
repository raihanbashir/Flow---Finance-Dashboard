import { TrendingDown, TrendingUp, Trophy, Wallet2 } from 'lucide-react'
import { formatCurrency, formatPercent } from '../lib/format'
import {
  highestExpenseCategory,
  monthOverMonthExpense,
  sumExpenses,
  sumIncome,
} from '../lib/financeMath'
import type { Transaction } from '../types/finance'

interface InsightsProps {
  transactions: Transaction[]
  loading?: boolean
}

export function Insights({ transactions, loading }: InsightsProps) {
  const top = highestExpenseCategory(transactions)
  const mom = monthOverMonthExpense(transactions)
  const income = sumIncome(transactions)
  const expenses = sumExpenses(transactions)
  const savingsRate = income > 0 ? (income - expenses) / income : 0

  if (loading) {
    return (
      <section className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5"
          >
            <div className="mb-3 h-3 w-28 rounded bg-[var(--color-border)]" />
            <div className="h-6 w-full rounded bg-[var(--color-border)]" />
          </div>
        ))}
      </section>
    )
  }

  const momUp = mom.deltaPct > 0
  const insightMom = {
    title: 'Monthly comparison',
    body:
      mom.previousMonth === 0 && mom.currentMonth === 0
        ? 'No expenses recorded for this month or last month.'
        : `This month’s spending is ${formatPercent(Math.abs(mom.deltaPct))} ${momUp ? 'higher' : 'lower'} than last month.`,
    detail: `${formatCurrency(mom.currentMonth)} vs ${formatCurrency(mom.previousMonth)}`,
    icon: momUp ? TrendingUp : TrendingDown,
    tone: momUp ? 'text-[var(--color-expense)]' : 'text-[var(--color-income)]',
  }

  const insightTop = {
    title: 'Top spending category',
    body: top
      ? `${top.category} leads your expenses at ${formatCurrency(top.amount)} total.`
      : 'Add expense transactions to see a category leader.',
    detail: top ? 'Across all recorded expenses' : '—',
    icon: Trophy,
    tone: 'text-[var(--color-accent)]',
  }

  const insightSavings = {
    title: 'Savings rate',
    body:
      income > 0
        ? `You’ve retained about ${formatPercent(Math.max(0, savingsRate))} of income after expenses (all-time).`
        : 'Add income entries to estimate how much you keep after spending.',
    detail: income > 0 ? `${formatCurrency(income - expenses)} net` : '—',
    icon: Wallet2,
    tone: savingsRate >= 0.2 ? 'text-[var(--color-income)]' : 'text-[var(--color-muted)]',
  }

  const items = [insightTop, insightMom, insightSavings]

  return (
    <section aria-labelledby="insights-heading">
      <h2 id="insights-heading" className="mb-3 text-lg font-semibold text-[var(--color-foreground)]">
        Insights
      </h2>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-start gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-accent-muted)] ${item.tone}`}
                aria-hidden
              >
                <item.icon className="h-5 w-5" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-[var(--color-foreground)]">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-muted)]">{item.body}</p>
                <p className="mt-2 text-xs font-medium text-[var(--color-foreground)]/80">{item.detail}</p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
