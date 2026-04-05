/** Indian Rupees — grouped per en-IN (e.g. ₹12,34,567). */
const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

/** Shorter axis labels: k → L (lakh) → Cr (crore), common in India. */
export function formatCompactCurrency(value: number): string {
  const sign = value < 0 ? '−' : ''
  const abs = Math.abs(value)

  if (abs >= 1_00_00_000) {
    return `${sign}₹${(abs / 1_00_00_000).toFixed(1)} Cr`
  }
  if (abs >= 1_00_000) {
    return `${sign}₹${(abs / 1_00_000).toFixed(1)} L`
  }
  if (abs >= 1_000) {
    return `${sign}₹${(abs / 1_000).toFixed(1)} k`
  }
  return formatCurrency(value)
}

export function formatPercent(value: number, digits = 1): string {
  return `${(value * 100).toFixed(digits)}%`
}
