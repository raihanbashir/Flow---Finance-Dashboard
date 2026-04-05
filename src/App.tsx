import { Header } from './components/Header'
import { Insights } from './components/Insights'
import { SummaryCards } from './components/SummaryCards'
import { BalanceTrend } from './components/charts/BalanceTrend'
import { SpendingBreakdown } from './components/charts/SpendingBreakdown'
import { TransactionList } from './components/transactions/TransactionList'
import { useMockBootstrap } from './hooks/useMockBootstrap'
import { useThemeClass } from './hooks/useThemeClass'
import { useFinanceStore } from './store/useFinanceStore'

function App() {
  useThemeClass()
  const ready = useMockBootstrap()
  const transactions = useFinanceStore((s) => s.transactions)
  const role = useFinanceStore((s) => s.role)
  const apiLoaded = useFinanceStore((s) => s.apiLoaded)

  const loading = !ready

  return (
    <div className="min-h-dvh bg-[var(--color-surface)] text-[var(--color-foreground)]">
      <Header />

      <main className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:space-y-12 lg:px-8 lg:py-10">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-muted)]">
            Overview
          </p>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Your money at a glance</h1>
          <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-muted)]">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                role === 'admin'
                  ? 'bg-[var(--color-accent-muted)] text-[var(--color-accent)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-muted)] ring-1 ring-[var(--color-border)]'
              }`}
            >
              {role === 'admin' ? 'Admin — full access' : 'Viewer — read only'}
            </span>
            {apiLoaded ? (
              <span className="text-xs text-[var(--color-muted)]">Mock API sync complete</span>
            ) : null}
          </div>
        </div>

        <SummaryCards transactions={transactions} loading={loading} />

        <div className="grid gap-6 lg:grid-cols-2">
          <BalanceTrend transactions={transactions} loading={loading} />
          <SpendingBreakdown transactions={transactions} loading={loading} />
        </div>

        <Insights transactions={transactions} loading={loading} />

        <TransactionList />
      </main>

      <footer className="border-t border-[var(--color-border)] py-8 text-center text-xs text-[var(--color-muted)]">
        Flow · mock data & frontend-only · built for portfolio review
      </footer>
    </div>
  )
}

export default App
