import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { balanceTrendByMonth } from '../../lib/financeMath'
import { formatCompactCurrency } from '../../lib/format'
import type { Transaction } from '../../types/finance'

interface BalanceTrendProps {
  transactions: Transaction[]
  loading?: boolean
}

export function BalanceTrend({ transactions, loading }: BalanceTrendProps) {
  const data = balanceTrendByMonth(transactions, 8)

  if (loading) {
    return (
      <div className="h-[320px] animate-pulse rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6">
        <div className="mb-4 h-4 w-40 rounded bg-[var(--color-border)]" />
        <div className="h-[220px] rounded-lg bg-[var(--color-border)]/60" />
      </div>
    )
  }

  const empty = data.length === 0 || data.every((d) => d.income === 0 && d.expenses === 0)

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-card)]">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold text-[var(--color-foreground)]">Balance trend</h2>
          <p className="text-sm text-[var(--color-muted)]">Running balance by month</p>
        </div>
      </div>

      {empty ? (
        <p className="py-16 text-center text-sm text-[var(--color-muted)]">
          Not enough dated activity to plot a trend yet.
        </p>
      ) : (
        <div className="h-[280px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="fillBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="4 6" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
                axisLine={{ stroke: 'var(--color-border)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'var(--color-muted)', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => formatCompactCurrency(Number(v))}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--color-surface-elevated)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 12,
                  fontSize: 12,
                }}
                labelStyle={{ color: 'var(--color-foreground)', fontWeight: 600 }}
                formatter={(value, name) => {
                  const v = Number(value ?? 0)
                  const label = String(name) === 'balance' ? 'Balance' : String(name)
                  return [formatCompactCurrency(v), label]
                }}
              />
              <Area
                type="monotone"
                dataKey="balance"
                name="balance"
                stroke="var(--color-accent)"
                strokeWidth={2}
                fill="url(#fillBalance)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
