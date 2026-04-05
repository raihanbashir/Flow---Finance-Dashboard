import clsx from 'clsx'
import { format } from 'date-fns'
import { Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { filterTransactions, uniqueCategories } from '../../lib/financeMath'
import { formatCurrency } from '../../lib/format'
import { useFinanceStore } from '../../store/useFinanceStore'
import type { Transaction } from '../../types/finance'
import { TransactionModal } from './TransactionModal'

export function TransactionList() {
  const transactions = useFinanceStore((s) => s.transactions)
  const role = useFinanceStore((s) => s.role)
  const filterType = useFinanceStore((s) => s.filterType)
  const filterCategory = useFinanceStore((s) => s.filterCategory)
  const searchQuery = useFinanceStore((s) => s.searchQuery)
  const sortField = useFinanceStore((s) => s.sortField)
  const sortDir = useFinanceStore((s) => s.sortDir)
  const setFilterType = useFinanceStore((s) => s.setFilterType)
  const setFilterCategory = useFinanceStore((s) => s.setFilterCategory)
  const setSearchQuery = useFinanceStore((s) => s.setSearchQuery)
  const setSort = useFinanceStore((s) => s.setSort)
  const toggleSortDir = useFinanceStore((s) => s.toggleSortDir)
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction)

  const [modalOpen, setModalOpen] = useState(false)
  const [modalSession, setModalSession] = useState(0)
  const [editing, setEditing] = useState<Transaction | null>(null)

  const categories = useMemo(() => uniqueCategories(transactions), [transactions])

  const filtered = useMemo(
    () =>
      filterTransactions(transactions, {
        filterType,
        filterCategory,
        searchQuery,
        sortField,
        sortDir,
      }),
    [transactions, filterType, filterCategory, searchQuery, sortField, sortDir],
  )

  const isAdmin = role === 'admin'

  const openAdd = () => {
    setEditing(null)
    setModalSession((s) => s + 1)
    setModalOpen(true)
  }

  const openEdit = (t: Transaction) => {
    setEditing(t)
    setModalSession((s) => s + 1)
    setModalOpen(true)
  }

  return (
    <section aria-labelledby="tx-heading" className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-[var(--shadow-card)]">
      <div className="flex flex-col gap-4 border-b border-[var(--color-border)] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="tx-heading" className="text-lg font-semibold text-[var(--color-foreground)]">
            Transactions
          </h2>
          <p className="text-sm text-[var(--color-muted)]">
            {isAdmin ? 'Filter, search, and manage entries.' : 'Viewer role: data is read-only.'}
          </p>
        </div>
        {isAdmin ? (
          <button
            type="button"
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-accent)] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-95"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Add transaction
          </button>
        ) : (
          <span className="inline-flex items-center rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-muted)]">
            Read-only
          </span>
        )}
      </div>

      <div className="flex flex-col gap-3 p-5 lg:flex-row lg:flex-wrap lg:items-center">
        <div className="relative min-w-[200px] flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]"
            aria-hidden
          />
          <input
            type="search"
            placeholder="Search description or category…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pr-3 pl-10 text-sm text-[var(--color-foreground)] outline-none placeholder:text-[var(--color-muted)] focus:ring-2 focus:ring-[var(--color-accent)]"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as typeof filterType)}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            aria-label="Filter by type"
          >
            <option value="all">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={sortField}
            onChange={(e) => setSort(e.target.value as typeof sortField)}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-foreground)] outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            aria-label="Sort by"
          >
            <option value="date">Sort by date</option>
            <option value="amount">Sort by amount</option>
          </select>

          <button
            type="button"
            onClick={toggleSortDir}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-accent-muted)]"
            title="Toggle sort direction"
          >
            {sortDir === 'desc' ? 'Descending' : 'Ascending'}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto px-2 pb-5 sm:px-5">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-14 text-center">
            <p className="text-sm font-medium text-[var(--color-foreground)]">No transactions match</p>
            <p className="mt-1 text-sm text-[var(--color-muted)]">
              Try clearing search or filters — or add a new entry as Admin.
            </p>
          </div>
        ) : (
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-[var(--color-muted)]">
                <th className="py-3 pr-3 font-medium">Date</th>
                <th className="py-3 pr-3 font-medium">Description</th>
                <th className="py-3 pr-3 font-medium">Category</th>
                <th className="py-3 pr-3 font-medium">Type</th>
                <th className="py-3 pr-3 text-right font-medium">Amount</th>
                {isAdmin ? <th className="py-3 pl-3 text-right font-medium">Actions</th> : null}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-[var(--color-border)]/70 transition hover:bg-[var(--color-surface)]/80"
                >
                  <td className="py-3 pr-3 whitespace-nowrap text-[var(--color-foreground)]">
                    {format(new Date(t.date + 'T12:00:00'), 'MMM d, yyyy')}
                  </td>
                  <td className="py-3 pr-3 text-[var(--color-foreground)]">{t.description}</td>
                  <td className="py-3 pr-3 text-[var(--color-muted)]">{t.category}</td>
                  <td className="py-3 pr-3">
                    <span
                      className={clsx(
                        'inline-flex rounded-full px-2 py-0.5 text-xs font-semibold',
                        t.type === 'income'
                          ? 'bg-[var(--color-income)]/15 text-[var(--color-income)]'
                          : 'bg-[var(--color-expense)]/15 text-[var(--color-expense)]',
                      )}
                    >
                      {t.type}
                    </span>
                  </td>
                  <td
                    className={clsx(
                      'py-3 pr-3 text-right font-semibold tabular-nums',
                      t.type === 'income' ? 'text-[var(--color-income)]' : 'text-[var(--color-expense)]',
                    )}
                  >
                    {t.type === 'income' ? '+' : '−'}
                    {formatCurrency(t.amount)}
                  </td>
                  {isAdmin ? (
                    <td className="py-3 pl-3 text-right">
                      <div className="inline-flex gap-1">
                        <button
                          type="button"
                          onClick={() => openEdit(t)}
                          className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-accent-muted)] hover:text-[var(--color-accent)]"
                          aria-label={`Edit ${t.description}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('Delete this transaction?')) deleteTransaction(t.id)
                          }}
                          className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-red-500/10 hover:text-red-500"
                          aria-label={`Delete ${t.description}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <TransactionModal
        key={modalSession}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editing={editing}
        categoryOptions={categories}
      />
    </section>
  )
}
