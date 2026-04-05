import type { Transaction } from '../types/finance'

export function transactionsToCSV(rows: Transaction[]): string {
  const header = ['id', 'date', 'amount', 'category', 'type', 'description']
  const lines = [
    header.join(','),
    ...rows.map((r) =>
      [
        r.id,
        r.date,
        String(r.amount),
        escapeCsv(r.category),
        r.type,
        escapeCsv(r.description),
      ].join(','),
    ),
  ]
  return lines.join('\n')
}

function escapeCsv(s: string): string {
  if (/[",\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export function downloadTextFile(filename: string, content: string, mime: string): void {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
