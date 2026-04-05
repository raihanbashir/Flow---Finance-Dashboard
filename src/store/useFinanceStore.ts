import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { SEED_TRANSACTIONS } from '../data/seedTransactions'
import type {
  FilterType,
  SortDir,
  SortField,
  Transaction,
  TransactionType,
  UserRole,
} from '../types/finance'

export type ThemeMode = 'light' | 'dark'

interface FinanceState {
  transactions: Transaction[]
  role: UserRole
  filterType: FilterType
  filterCategory: string
  searchQuery: string
  sortField: SortField
  sortDir: SortDir
  theme: ThemeMode
  apiLoaded: boolean

  setRole: (role: UserRole) => void
  setFilterType: (v: FilterType) => void
  setFilterCategory: (v: string) => void
  setSearchQuery: (v: string) => void
  setSort: (field: SortField, dir?: SortDir) => void
  toggleSortDir: () => void
  setTheme: (t: ThemeMode) => void
  toggleTheme: () => void
  setApiLoaded: (v: boolean) => void

  addTransaction: (t: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string, patch: Partial<Omit<Transaction, 'id'>>) => void
  deleteTransaction: (id: string) => void
  resetToSeed: () => void
}

function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set) => ({
      transactions: SEED_TRANSACTIONS,
      role: 'viewer',
      filterType: 'all',
      filterCategory: 'all',
      searchQuery: '',
      sortField: 'date',
      sortDir: 'desc',
      theme: 'light',
      apiLoaded: false,

      setRole: (role) => set({ role }),
      setFilterType: (filterType) => set({ filterType }),
      setFilterCategory: (filterCategory) => set({ filterCategory }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSort: (sortField, sortDir) =>
        set((s) => ({
          sortField,
          sortDir: sortDir ?? s.sortDir,
        })),
      toggleSortDir: () =>
        set((s) => ({
          sortDir: s.sortDir === 'asc' ? 'desc' : 'asc',
        })),
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
      setApiLoaded: (apiLoaded) => set({ apiLoaded }),

      addTransaction: (t) =>
        set((s) => ({
          transactions: [{ ...t, id: newId() }, ...s.transactions],
        })),
      updateTransaction: (id, patch) =>
        set((s) => ({
          transactions: s.transactions.map((x) => (x.id === id ? { ...x, ...patch } : x)),
        })),
      deleteTransaction: (id) =>
        set((s) => ({
          transactions: s.transactions.filter((x) => x.id !== id),
        })),
      resetToSeed: () => set({ transactions: [...SEED_TRANSACTIONS] }),
    }),
    {
      name: 'flow-finance-storage',
      partialize: (s) => ({
        transactions: s.transactions,
        theme: s.theme,
        role: s.role,
      }),
    },
  ),
)

export function isExpenseType(t: TransactionType): boolean {
  return t === 'expense'
}
