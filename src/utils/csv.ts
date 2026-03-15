import type { TimeEntry } from '../types'

function escapeCsvField(value: string | number): string {
  const str = String(value)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function entriesToCsv(entries: TimeEntry[]): string {
  const header = 'Date,Project,Description,Hours'
  const rows = entries.map((e) =>
    [
      escapeCsvField(e.date),
      escapeCsvField(e.project),
      escapeCsvField(e.description),
      escapeCsvField(e.hours),
    ].join(','),
  )
  return [header, ...rows].join('\n')
}

export function downloadCsv(entries: TimeEntry[], filename = 'timeagotchi-export.csv'): void {
  const csv = entriesToCsv(entries)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}
