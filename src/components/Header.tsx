import clsx from 'clsx'
import {
  Download,
  Moon,
  RefreshCw,
  Shield,
  Sparkles,
  Sun,
} from 'lucide-react'
import { downloadTextFile, transactionsToCSV } from '../lib/exportData'
import { useFinanceStore } from '../store/useFinanceStore'
import type { UserRole } from '../types/finance'

const roles: { value: UserRole; label: string; hint: string }[] = [
  { value: 'viewer', label: 'Viewer', hint: 'View only' },
  { value: 'admin', label: 'Admin', hint: 'Add & edit' },
]

export function Header() {
  const transactions = useFinanceStore((s) => s.transactions)
  const role = useFinanceStore((s) => s.role)
  const setRole = useFinanceStore((s) => s.setRole)
  const theme = useFinanceStore((s) => s.theme)
  const toggleTheme = useFinanceStore((s) => s.toggleTheme)
  const resetToSeed = useFinanceStore((s) => s.resetToSeed)

  const exportCsv = () => {
    downloadTextFile(
      `flow-transactions-${new Date().toISOString().slice(0, 10)}.csv`,
      transactionsToCSV(transactions),
      'text/csv;charset=utf-8',
    )
  }

  const exportJson = () => {
    downloadTextFile(
      `flow-transactions-${new Date().toISOString().slice(0, 10)}.json`,
      JSON.stringify(transactions, null, 2),
      'application/json',
    )
  }

  return (
    <header className="border-b border-[var(--color-border)] bg-[var(--color-surface-elevated)]/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent-muted)] text-[var(--color-accent)]"
            aria-hidden
          >
            <Sparkles className="h-5 w-5" strokeWidth={2} />
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold tracking-tight text-[var(--color-foreground)]">
              Flow
            </p>
            <p className="text-xs text-[var(--color-muted)]">Finance dashboard</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          <div className="flex items-center gap-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
            <Shield className="ml-1 h-4 w-4 text-[var(--color-muted)]" aria-hidden />
            <label htmlFor="role-select" className="sr-only">
              Role
            </label>
            <select
              id="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className={clsx(
                'rounded-md bg-transparent py-1.5 pr-8 pl-1 text-sm font-medium text-[var(--color-foreground)]',
                'cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]',
              )}
            >
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label} — {r.hint}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            className={clsx(
              'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)]',
              'bg-[var(--color-surface)] text-[var(--color-foreground)] transition hover:bg-[var(--color-accent-muted)]',
            )}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <div className="hidden h-6 w-px bg-[var(--color-border)] sm:block" aria-hidden />

          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:bg-[var(--color-accent-muted)]"
          >
            <Download className="h-4 w-4" />
            CSV
          </button>
          <button
            type="button"
            onClick={exportJson}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:bg-[var(--color-accent-muted)]"
          >
            <Download className="h-4 w-4" />
            JSON
          </button>

          <button
            type="button"
            onClick={() => {
              if (confirm('Reset all transactions to demo data?')) resetToSeed()
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-[var(--color-foreground)] transition hover:bg-[var(--color-accent-muted)]"
            title="Restore demo dataset"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset demo</span>
          </button>
        </div>
      </div>
    </header>
  )
}
