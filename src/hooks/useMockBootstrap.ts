import { useEffect, useState } from 'react'
import { fetchTransactionsMock } from '../lib/mockApi'
import { useFinanceStore } from '../store/useFinanceStore'

/** Simulates initial data fetch from a mock API (optional enhancement). */
export function useMockBootstrap(): boolean {
  const [ready, setReady] = useState(false)
  const setApiLoaded = useFinanceStore((s) => s.setApiLoaded)

  useEffect(() => {
    let cancelled = false
    const txs = useFinanceStore.getState().transactions
    fetchTransactionsMock(txs).then(() => {
      if (!cancelled) {
        setApiLoaded(true)
        setReady(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [setApiLoaded])

  return ready
}
