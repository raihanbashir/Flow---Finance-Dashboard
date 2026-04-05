import type { Transaction } from '../types/finance'

/**
 * Simulates a network request for dashboard data (optional assignment enhancement).
 */
export function fetchTransactionsMock(data: Transaction[], delayMs = 400): Promise<Transaction[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(structuredClone(data))
    }, delayMs)
  })
}
