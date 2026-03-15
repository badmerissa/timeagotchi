import { useState } from 'react'
import { useTimeStore } from '../store/useTimeStore'
import { downloadCsv } from '../utils/csv'
import { getWeekBounds, isInWeek } from '../utils/dateHelpers'
import { format } from 'date-fns'

export function ExportButton() {
  const { entries, settings } = useTimeStore()
  const [weekOnly, setWeekOnly] = useState(false)

  function handleExport() {
    let toExport = entries
    let filename = `timeagotchi-export-${format(new Date(), 'yyyy-MM-dd')}.csv`

    if (weekOnly) {
      const { start, end } = getWeekBounds(new Date(), settings.weekStartsOn)
      toExport = entries.filter((e) => isInWeek(e.date, start, end))
      filename = `timeagotchi-week-${format(start, 'yyyy-MM-dd')}.csv`
    }

    if (toExport.length === 0) {
      alert('No entries to export.')
      return
    }

    downloadCsv(toExport, filename)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setWeekOnly(!weekOnly)}
          className={`pixel-btn font-pixel transition-colors ${
            weekOnly ? 'border-tama-blue text-tama-blue' : 'border-tama-border text-gray-400'
          }`}
          style={{ fontSize: '8px', padding: '6px 10px' }}
        >
          {weekOnly ? '✔ THIS WEEK' : '○ THIS WEEK'}
        </button>
        <button
          onClick={handleExport}
          className="pixel-btn border-tama-green text-tama-green hover:bg-tama-green hover:text-tama-bg font-pixel"
          style={{ fontSize: '9px', padding: '8px 12px' }}
        >
          ⬇ EXPORT CSV
        </button>
      </div>
      <div className="text-gray-600 font-pixel" style={{ fontSize: '7px' }}>
        {entries.length} total entries
      </div>
    </div>
  )
}
