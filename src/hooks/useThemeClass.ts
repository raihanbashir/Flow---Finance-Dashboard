import { useEffect } from 'react'
import { useFinanceStore } from '../store/useFinanceStore'

export function useThemeClass(): void {
  const theme = useFinanceStore((s) => s.theme)

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [theme])
}
