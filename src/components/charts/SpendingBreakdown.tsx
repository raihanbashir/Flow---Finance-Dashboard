import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { formatCurrency } from '../../lib/format'
import { spendingByCategory } from '../../lib/financeMath'
import type { Transaction } from '../../types/finance'

interface SpendingBreakdownProps {
  transactions: Transaction[]
  loading?: boolean
}

export function SpendingBreakdown({ transactions, loading }: SpendingBreakdownProps) {
  const data = spendingByCategory(transactions)

  if (loading) {
    return (
      <div className="h-[320px] animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6">
        <div className="mb-4 h-4 w-48 rounded bg-[var(--color-border)]" />
        <div className="mx-auto h-[200px] max-w-[200px] rounded-full bg-[var(--color-border)]/60" />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-card)]">
        <h2 className="text-base font-semibold text-[var(--color-foreground)]">Spending by category</h2>
        <p className="mt-1 text-sm text-[var(--color-muted)]">Expense distribution</p>
        <p className="py-16 text-center text-sm text-[var(--color-muted)]">
          No expense transactions to visualize.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-card)]">
      <div className="mb-2">
        <h2 className="text-base font-semibold text-[var(--color-foreground)]">Spending by category</h2>
        <p className="text-sm text-[var(--color-muted)]">Where your money goes (expenses)</p>
      </div>

      <div className="flex flex-col items-center gap-4 lg:flex-row lg:items-center">
        <div className="h-[220px] w-full max-w-[280px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="category"
                cx="50%"
                cy="50%"
                innerRadius={56}
                outerRadius={88}
                paddingAngle={2.5}
                stroke="none"
                strokeWidth={0}
              >
                {data.map((entry) => (
                  <Cell key={`cell-${entry.category}`} fill={entry.fill} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 12,
                  fontSize: 12,
                }}
                formatter={(value) => formatCurrency(Number(value ?? 0))}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <ul className="w-full max-w-md space-y-2 text-sm">
          {data.map((d) => (
            <li
              key={d.category}
              className="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-border)]/80 bg-[var(--color-surface)] px-3 py-2"
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: d.fill }}
                  aria-hidden
                />
                <span className="font-medium text-[var(--color-foreground)]">{d.category}</span>
              </span>
              <span className="tabular-nums text-[var(--color-muted)]">{formatCurrency(d.value)}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
