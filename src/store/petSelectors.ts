import { useTimeStore } from './useTimeStore'
import { calcHealth, calcMood } from '../utils/petLogic'
import { getWeekBounds, isInWeek, weekKey } from '../utils/dateHelpers'
import type { PetState, WeeklyStats } from '../types'

export function usePetState(): PetState {
  const { entries, settings } = useTimeStore()
  const { start, end } = getWeekBounds(new Date(), settings.weekStartsOn)

  const weekEntries = entries.filter((e) => isInWeek(e.date, start, end))
  const weekHoursLogged = weekEntries.reduce((sum, e) => sum + e.hours, 0)
  const healthPct = calcHealth(weekHoursLogged, settings.weeklyTargetHours)
  const mood = calcMood(healthPct)
  const lastEntry = [...weekEntries].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]

  return {
    healthPct,
    mood,
    weekHoursLogged,
    weekHoursTarget: settings.weeklyTargetHours,
    lastFedAt: lastEntry?.createdAt ?? null,
  }
}

export function useCurrentWeekStats(): WeeklyStats {
  const { entries, settings } = useTimeStore()
  return buildWeekStats(entries, settings.weeklyTargetHours, settings.weekStartsOn, new Date())
}

export function usePreviousWeekStats(): WeeklyStats {
  const { entries, settings } = useTimeStore()
  const lastWeek = new Date()
  lastWeek.setDate(lastWeek.getDate() - 7)
  return buildWeekStats(entries, settings.weeklyTargetHours, settings.weekStartsOn, lastWeek)
}

export function useCurrentWeekKey(): string {
  const { settings } = useTimeStore()
  return weekKey(getWeekBounds(new Date(), settings.weekStartsOn).start)
}

function buildWeekStats(
  entries: { id: string; date: string; project: string; description: string; hours: number; createdAt: string }[],
  targetHours: number,
  weekStartsOn: 0 | 1,
  refDate: Date,
): WeeklyStats {
  const { start, end } = getWeekBounds(refDate, weekStartsOn)
  const weekEntries = entries.filter((e) => isInWeek(e.date, start, end))
  const totalHours = weekEntries.reduce((sum, e) => sum + e.hours, 0)
  const healthPct = calcHealth(totalHours, targetHours)
  const mood = calcMood(healthPct)

  // Project breakdown
  const projectMap = new Map<string, number>()
  for (const e of weekEntries) {
    projectMap.set(e.project, (projectMap.get(e.project) ?? 0) + e.hours)
  }
  const projectBreakdown = [...projectMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([project, hours]) => ({
      project,
      hours,
      pct: totalHours > 0 ? Math.round((hours / totalHours) * 100) : 0,
    }))

  return { weekStart: start, weekEnd: end, entries: weekEntries, totalHours, targetHours, healthPct, mood, projectBreakdown }
}
