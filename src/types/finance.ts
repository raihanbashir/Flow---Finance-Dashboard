export type UserRole = 'viewer' | 'admin'

export type TransactionType = 'income' | 'expense'

export type SortField = 'date' | 'amount'
export type SortDir = 'asc' | 'desc'

export type FilterType = 'all' | TransactionType

export interface Transaction {
  id: string
  date: string
  amount: number
  category: string
  type: TransactionType
  description: string
}
