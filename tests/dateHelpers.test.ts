import { describe, it, expect } from 'vitest'
import {
  getWeekBounds,
  formatDate,
  formatWeekRange,
  isInWeek,
  groupByDay,
  weekKey,
} from '../src/utils/dateHelpers'

describe('getWeekBounds', () => {
  it('starts on Monday when weekStartsOn is 1', () => {
    // 2026-03-11 is a Wednesday
    const ref = new Date('2026-03-11T12:00:00Z')
    const { start } = getWeekBounds(ref, 1)
    // Should be Monday 2026-03-09
    expect(start.getDay()).toBe(1)
  })

  it('starts on Sunday when weekStartsOn is 0', () => {
    const ref = new Date('2026-03-11T12:00:00Z')
    const { start } = getWeekBounds(ref, 0)
    expect(start.getDay()).toBe(0)
  })

  it('spans 7 days (start of Mon to end of Sun)', () => {
    const ref = new Date('2026-03-15T12:00:00Z')
    const { start, end } = getWeekBounds(ref, 1)
    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    expect(Math.round(diffDays)).toBe(7)
  })
})

describe('formatDate', () => {
  it('returns a readable date string', () => {
    const result = formatDate('2026-03-09')
    expect(result).toMatch(/Mon 09 Mar/)
  })
})

describe('formatWeekRange', () => {
  it('returns a range string', () => {
    const start = new Date('2026-03-09T00:00:00')
    const end = new Date('2026-03-15T23:59:59')
    const result = formatWeekRange(start, end)
    expect(result).toContain('09 Mar')
    expect(result).toContain('15 Mar')
    expect(result).toContain('2026')
  })
})

describe('isInWeek', () => {
  it('returns true for dates within the week', () => {
    const start = new Date('2026-03-09T00:00:00')
    const end = new Date('2026-03-15T23:59:59')
    expect(isInWeek('2026-03-09', start, end)).toBe(true)
    expect(isInWeek('2026-03-12', start, end)).toBe(true)
    expect(isInWeek('2026-03-15', start, end)).toBe(true)
  })

  it('returns false for dates outside the week', () => {
    const start = new Date('2026-03-09T00:00:00')
    const end = new Date('2026-03-15T23:59:59')
    expect(isInWeek('2026-03-08', start, end)).toBe(false)
    expect(isInWeek('2026-03-16', start, end)).toBe(false)
  })
})

describe('groupByDay', () => {
  it('groups items by date', () => {
    const items = [
      { id: '1', date: '2026-03-09', project: 'A', description: '', hours: 1, createdAt: '' },
      { id: '2', date: '2026-03-09', project: 'B', description: '', hours: 2, createdAt: '' },
      { id: '3', date: '2026-03-10', project: 'C', description: '', hours: 3, createdAt: '' },
    ]
    const grouped = groupByDay(items)
    expect(grouped.size).toBe(2)
    expect(grouped.get('2026-03-09')).toHaveLength(2)
    expect(grouped.get('2026-03-10')).toHaveLength(1)
  })

  it('returns empty map for empty input', () => {
    const grouped = groupByDay([])
    expect(grouped.size).toBe(0)
  })
})

describe('weekKey', () => {
  it('returns a string in YYYY-Www format', () => {
    const date = new Date('2026-03-09T12:00:00')
    const key = weekKey(date)
    expect(key).toMatch(/^\d{4}-W\d{2}$/)
  })

  it('returns a unique key per week', () => {
    const week1 = weekKey(new Date('2026-03-09'))
    const week2 = weekKey(new Date('2026-03-16'))
    expect(week1).not.toBe(week2)
  })
})
