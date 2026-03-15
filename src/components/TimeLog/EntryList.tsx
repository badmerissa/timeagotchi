import { useTimeStore } from '../../store/useTimeStore'
import { EntryRow } from './EntryRow'
import { getWeekBounds, isInWeek, formatDate, groupByDay } from '../../utils/dateHelpers'

export function EntryList() {
  const { entries, settings } = useTimeStore()
  const { start, end } = getWeekBounds(new Date(), settings.weekStartsOn)
  const weekEntries = entries
    .filter((e) => isInWeek(e.date, start, end))
    .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))

  const totalHours = weekEntries.reduce((sum, e) => sum + e.hours, 0)
  const grouped = groupByDay(weekEntries)
  const sortedDays = [...grouped.keys()].sort((a, b) => b.localeCompare(a))

  if (weekEntries.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 font-pixel" style={{ fontSize: '9px', lineHeight: 2 }}>
          <div className="text-3xl mb-4">🍽</div>
          No entries this week yet.
          <br />
          Feed your pet by logging time!
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Weekly total */}
      <div className="flex justify-between items-center pixel-panel p-3">
        <span className="text-gray-400 font-pixel" style={{ fontSize: '8px' }}>WEEK TOTAL</span>
        <span className="text-tama-green font-pixel" style={{ fontSize: '11px' }}>
          {totalHours.toFixed(2)}h
        </span>
      </div>

      {/* Grouped by day */}
      {sortedDays.map((day) => {
        const dayEntries = grouped.get(day)!
        const dayTotal = dayEntries.reduce((sum, e) => sum + e.hours, 0)
        return (
          <div key={day}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 font-pixel" style={{ fontSize: '8px' }}>
                {formatDate(day)}
              </span>
              <span className="text-tama-yellow font-pixel" style={{ fontSize: '8px' }}>
                {dayTotal.toFixed(2)}h
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {dayEntries.map((e) => (
                <EntryRow key={e.id} entry={e} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
