import {
  startOfWeek,
  endOfWeek,
  format,
  parseISO,
  isWithinInterval,
  isSameDay,
  getISOWeek,
  getYear,
} from 'date-fns'

export function getWeekBounds(date: Date, weekStartsOn: 0 | 1): { start: Date; end: Date } {
  const start = startOfWeek(date, { weekStartsOn })
  const end = endOfWeek(date, { weekStartsOn })
  return { start, end }
}

export function todayISO(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function formatDate(isoDate: string): string {
  return format(parseISO(isoDate), 'EEE dd MMM')
}

export function formatWeekRange(start: Date, end: Date): string {
  return `${format(start, 'dd MMM')} – ${format(end, 'dd MMM yyyy')}`
}

export function isInCurrentWeek(isoDate: string, weekStartsOn: 0 | 1): boolean {
  const { start, end } = getWeekBounds(new Date(), weekStartsOn)
  const date = parseISO(isoDate)
  return isWithinInterval(date, { start, end })
}

export function isInWeek(isoDate: string, weekStart: Date, weekEnd: Date): boolean {
  const date = parseISO(isoDate)
  return isWithinInterval(date, { start: weekStart, end: weekEnd })
}

export function isSameDayISO(isoDate: string, other: string): boolean {
  return isSameDay(parseISO(isoDate), parseISO(other))
}

export function groupByDay<T extends { date: string }>(items: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>()
  for (const item of items) {
    const existing = map.get(item.date) ?? []
    map.set(item.date, [...existing, item])
  }
  return map
}

/** Returns a stable week key like "2026-W11" */
export function weekKey(date: Date): string {
  return `${getYear(date)}-W${String(getISOWeek(date)).padStart(2, '0')}`
}

export function getPreviousWeekBounds(weekStartsOn: 0 | 1): { start: Date; end: Date } {
  const lastWeek = new Date()
  lastWeek.setDate(lastWeek.getDate() - 7)
  return getWeekBounds(lastWeek, weekStartsOn)
}
