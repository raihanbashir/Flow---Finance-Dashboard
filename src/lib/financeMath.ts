import {
  endOfMonth,
  isWithinInterval,
  parseISO,
  startOfMonth,
  subMonths,
} from 'date-fns'
import type { FilterType, SortDir, SortField, Transaction } from '../types/finance'

export function sumIncome(transactions: Transaction[]): number {
  return transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
}

export function sumExpenses(transactions: Transaction[]): number {
  return transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
}

export function totalBalance(transactions: Transaction[]): number {
  return transactions.reduce((acc, t) => {
    return t.type === 'income' ? acc + t.amount : acc - t.amount
  }, 0)
}

export interface MonthPoint {
  month: string
  label: string
  balance: number
  income: number
  expenses: number
}

/** Last N calendar months with net and running balance for area chart. */
export function balanceTrendByMonth(transactions: Transaction[], monthsBack = 8): MonthPoint[] {
  const now = new Date()
  const points: MonthPoint[] = []
  let running = 0

  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = subMonths(now, i)
    const start = startOfMonth(d)
    const end = endOfMonth(d)
    const label = start.toLocaleDateString(undefined, { month: 'short', year: '2-digit' })
    const monthKey = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`

    const inMonth = transactions.filter((t) =>
      isWithinInterval(parseISO(t.date), { start, end }),
    )
    const income = sumIncome(inMonth)
    const expenses = sumExpenses(inMonth)
    running += income - expenses

    points.push({
      month: monthKey,
      label,
      balance: running,
      income,
      expenses,
    })
  }

  return points
}

export interface CategorySlice {
  category: string
  value: number
  fill: string
}

const CHART_COLORS = [
  '#6366f1',
  '#14b8a6',
  '#f59e0b',
  '#ec4899',
  '#8b5cf6',
  '#06b6d4',
  '#f97316',
  '#84cc16',
  '#64748b',
]

export function spendingByCategory(transactions: Transaction[]): CategorySlice[] {
  const map = new Map<string, number>()
  for (const t of transactions) {
    if (t.type !== 'expense') continue
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
  }
  const entries = [...map.entries()].sort((a, b) => b[1] - a[1])
  return entries.map(([category, value], i) => ({
    category,
    value,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }))
}

export function highestExpenseCategory(transactions: Transaction[]): {
  category: string
  amount: number
} | null {
  const slices = spendingByCategory(transactions)
  if (!slices.length) return null
  return { category: slices[0].category, amount: slices[0].value }
}

export function monthOverMonthExpense(transactions: Transaction[]): {
  currentMonth: number
  previousMonth: number
  deltaPct: number
} {
  const now = new Date()
  const curStart = startOfMonth(now)
  const curEnd = endOfMonth(now)
  const prevStart = startOfMonth(subMonths(now, 1))
  const prevEnd = endOfMonth(subMonths(now, 1))

  const currentMonth = sumExpenses(
    transactions.filter((t) => isWithinInterval(parseISO(t.date), { start: curStart, end: curEnd })),
  )
  const previousMonth = sumExpenses(
    transactions.filter((t) => isWithinInterval(parseISO(t.date), { start: prevStart, end: prevEnd })),
  )
  const deltaPct =
    previousMonth === 0 ? (currentMonth > 0 ? 1 : 0) : (currentMonth - previousMonth) / previousMonth

  return { currentMonth, previousMonth, deltaPct }
}

export function filterTransactions(
  transactions: Transaction[],
  opts: {
    filterType: FilterType
    filterCategory: string
    searchQuery: string
    sortField: SortField
    sortDir: SortDir
  },
): Transaction[] {
  let list = [...transactions]
  const { filterType, filterCategory, searchQuery, sortField, sortDir } = opts

  if (filterType !== 'all') {
    list = list.filter((t) => t.type === filterType)
  }
  if (filterCategory !== 'all') {
    list = list.filter((t) => t.category === filterCategory)
  }
  const q = searchQuery.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (t) =>
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.amount.toString().includes(q),
    )
  }

  const mult = sortDir === 'asc' ? 1 : -1
  list.sort((a, b) => {
    if (sortField === 'date') {
      return (parseISO(a.date).getTime() - parseISO(b.date).getTime()) * mult
    }
    return (a.amount - b.amount) * mult
  })

  return list
}

export function uniqueCategories(transactions: Transaction[]): string[] {
  return [...new Set(transactions.map((t) => t.category))].sort()
}
