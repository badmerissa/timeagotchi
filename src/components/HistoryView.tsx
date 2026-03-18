import { useState } from 'react'
import { useTimeStore } from '../store/useTimeStore'
import { EntryRow } from './TimeLog/EntryRow'
import { getWeekBounds, formatWeekRange, isInWeek, groupByDay, formatDate } from '../utils/dateHelpers'
import { calcHealth } from '../utils/petLogic'
import { subWeeks } from 'date-fns'
import { ExportButton } from './ExportButton'

const WEEKS_TO_SHOW = 8

export function HistoryView() {
  const { entries, settings } = useTimeStore()
  const [selectedWeekOffset, setSelectedWeekOffset] = useState(0) // 0 = current, 1 = last, etc.

  // Build list of weeks
  const weeks = Array.from({ length: WEEKS_TO_SHOW }, (_, i) => {
    const ref = subWeeks(new Date(), i)
    const { start, end } = getWeekBounds(ref, settings.weekStartsOn)
    const weekEntries = entries.filter((e) => isInWeek(e.date, start, end))
    const totalHours = weekEntries.reduce((s, e) => s + e.hours, 0)
    const healthPct = calcHealth(totalHours, settings.weeklyTargetHours)
    return { start, end, weekEntries, totalHours, healthPct, offset: i }
  })

  const selected = weeks[selectedWeekOffset]
  const grouped = groupByDay(selected.weekEntries)
  const sortedDays = [...grouped.keys()].sort((a, b) => b.localeCompare(a))

  // All-time stats
  const allTimeHours = entries.reduce((s, e) => s + e.hours, 0)
  const projectMap = new Map<string, number>()
  for (const e of entries) {
    projectMap.set(e.project, (projectMap.get(e.project) ?? 0) + e.hours)
  }
  const topProjects = [...projectMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)

  const healthColor = (h: number) =>
    h >= 65 ? 'bg-tama-green' : h >= 35 ? 'bg-tama-yellow' : 'bg-tama-red'

  return (
    <div className="flex flex-col gap-6">
      {/* All-time summary */}
      <div className="pixel-panel p-3">
        <h2 className="font-pixel text-gray-400 mb-3" style={{ fontSize: '8px' }}>ALL-TIME STATS</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center">
            <div className="text-tama-green font-pixel" style={{ fontSize: '16px' }}>{allTimeHours.toFixed(1)}</div>
            <div className="text-gray-500 font-pixel" style={{ fontSize: '7px' }}>TOTAL HOURS</div>
          </div>
          <div className="text-center">
            <div className="text-tama-blue font-pixel" style={{ fontSize: '16px' }}>{entries.length}</div>
            <div className="text-gray-500 font-pixel" style={{ fontSize: '7px' }}>LOG ENTRIES</div>
          </div>
        </div>
        {topProjects.length > 0 && (
          <div className="mt-3 border-t border-tama-border pt-3">
            <div className="font-pixel text-gray-500 mb-2" style={{ fontSize: '7px' }}>TOP PROJECTS (ALL TIME)</div>
            {topProjects.map(([project, hours], i) => (
              <div key={project} className="flex justify-between font-pixel mb-1" style={{ fontSize: '8px' }}>
                <span className="text-gray-300 truncate flex gap-1">
                  <span className="text-tama-yellow">{i + 1}.</span> {project}
                </span>
                <span className="text-tama-green ml-2 shrink-0">{hours.toFixed(1)}h</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Week picker */}
      <div>
        <h3 className="font-pixel text-gray-400 mb-2" style={{ fontSize: '8px' }}>WEEK HISTORY</h3>
        <div className="flex gap-1 flex-wrap">
          {weeks.map((w) => (
            <button
              key={w.offset}
              onClick={() => setSelectedWeekOffset(w.offset)}
              className={`pixel-btn font-pixel flex flex-col items-center gap-0.5 transition-colors ${
                selectedWeekOffset === w.offset
                  ? 'border-tama-green text-tama-green'
                  : 'border-tama-border text-gray-500 hover:border-tama-green'
              }`}
              style={{ fontSize: '6px', padding: '4px 6px', minWidth: 44 }}
            >
              <span>{w.offset === 0 ? 'NOW' : `-${w.offset}w`}</span>
              <div className={`h-1 w-full rounded ${healthColor(w.healthPct)}`} />
            </button>
          ))}
        </div>
      </div>

      {/* Selected week detail */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <div className="font-pixel text-gray-300" style={{ fontSize: '8px' }}>
            {formatWeekRange(selected.start, selected.end)}
          </div>
          <div className="font-pixel text-tama-green" style={{ fontSize: '9px' }}>
            {selected.totalHours.toFixed(1)}h
          </div>
        </div>

        {selected.weekEntries.length === 0 ? (
          <div className="text-center py-6 text-gray-600 font-pixel" style={{ fontSize: '8px' }}>
            No entries for this week.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {sortedDays.map((day) => {
              const dayEntries = grouped.get(day)!
              const dayTotal = dayEntries.reduce((s, e) => s + e.hours, 0)
              return (
                <div key={day}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500 font-pixel" style={{ fontSize: '7px' }}>{formatDate(day)}</span>
                    <span className="text-tama-yellow font-pixel" style={{ fontSize: '7px' }}>{dayTotal.toFixed(2)}h</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    {dayEntries.map((e) => <EntryRow key={e.id} entry={e} />)}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Export */}
      <div className="border-t border-tama-border pt-4">
        <ExportButton />
      </div>
    </div>
  )
}
