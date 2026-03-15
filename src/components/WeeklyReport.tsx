import { useRef, useState } from 'react'
import { useCurrentWeekStats, usePreviousWeekStats } from '../store/petSelectors'
import { getWeeklyEncouragement } from '../utils/petLogic'
import { formatWeekRange } from '../utils/dateHelpers'
import { downloadCsv } from '../utils/csv'
import { format } from 'date-fns'

interface Props {
  onClose?: () => void
  showPrevious?: boolean
}

export function WeeklyReport({ onClose, showPrevious = false }: Props) {
  const currentStats = useCurrentWeekStats()
  const prevStats = usePreviousWeekStats()
  const [viewPrev, setViewPrev] = useState(showPrevious)
  const reportRef = useRef<HTMLDivElement>(null)
  const [capturing, setCapturing] = useState(false)

  const stats = viewPrev ? prevStats : currentStats

  const moodColor = {
    thriving: 'text-tama-green',
    happy: 'text-tama-blue',
    neutral: 'text-tama-purple',
    hungry: 'text-tama-yellow',
    critical: 'text-tama-red',
  }[stats.mood]

  const barColor = {
    thriving: 'bg-tama-green',
    happy: 'bg-tama-blue',
    neutral: 'bg-tama-purple',
    hungry: 'bg-tama-yellow',
    critical: 'bg-tama-red',
  }[stats.mood]

  async function handleSharePng() {
    if (!reportRef.current) return
    setCapturing(true)
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(reportRef.current, {
        backgroundColor: '#1a1a2e',
        scale: 2,
      })
      const link = document.createElement('a')
      link.download = `timeagotchi-report-${format(stats.weekStart, 'yyyy-MM-dd')}.png`
      link.href = canvas.toDataURL()
      link.click()
    } finally {
      setCapturing(false)
    }
  }

  function handleExportWeek() {
    downloadCsv(
      stats.entries,
      `timeagotchi-week-${format(stats.weekStart, 'yyyy-MM-dd')}.csv`,
    )
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="pixel-panel max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-tama-border">
          <div className="font-pixel text-tama-green" style={{ fontSize: '10px' }}>
            WEEKLY REPORT
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewPrev(!viewPrev)}
              className="pixel-btn border-tama-border text-gray-400 hover:border-tama-blue hover:text-tama-blue font-pixel"
              style={{ fontSize: '7px', padding: '4px 8px' }}
            >
              {viewPrev ? 'THIS WEEK' : 'PREV WEEK'}
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="pixel-btn border-tama-red text-tama-red font-pixel"
                style={{ fontSize: '9px', padding: '4px 8px' }}
              >
                ✖
              </button>
            )}
          </div>
        </div>

        {/* Report content */}
        <div ref={reportRef} className="p-4 flex flex-col gap-4 bg-tama-panel">
          {/* Week range */}
          <div className="text-center">
            <div className="text-gray-400 font-pixel" style={{ fontSize: '7px' }}>
              {viewPrev ? 'PREVIOUS WEEK' : 'CURRENT WEEK'}
            </div>
            <div className="text-white font-pixel mt-1" style={{ fontSize: '9px' }}>
              {formatWeekRange(stats.weekStart, stats.weekEnd)}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            <StatBox label="HOURS" value={stats.totalHours.toFixed(1)} unit="h" color="text-tama-green" />
            <StatBox label="TARGET" value={stats.targetHours.toFixed(0)} unit="h" color="text-gray-400" />
            <StatBox label="HEALTH" value={stats.healthPct.toString()} unit="%" color={moodColor} />
          </div>

          {/* Health bar */}
          <div>
            <div className="flex justify-between mb-1 font-pixel" style={{ fontSize: '7px' }}>
              <span className="text-gray-500">PROGRESS</span>
              <span className={moodColor}>{stats.mood.toUpperCase()}</span>
            </div>
            <div className="h-4 bg-tama-screen border border-tama-border rounded overflow-hidden">
              <div
                className={`h-full ${barColor} transition-all duration-500`}
                style={{ width: `${Math.min(100, stats.healthPct)}%` }}
              />
            </div>
          </div>

          {/* Project breakdown */}
          {stats.projectBreakdown.length > 0 && (
            <div>
              <div className="font-pixel text-gray-400 mb-2" style={{ fontSize: '7px' }}>
                TIME BY PROJECT
              </div>
              <div className="flex flex-col gap-2">
                {stats.projectBreakdown.map((p, i) => (
                  <div key={p.project}>
                    <div className="flex justify-between font-pixel mb-1" style={{ fontSize: '7px' }}>
                      <span className="text-white truncate flex items-center gap-1">
                        {i === 0 && <span className="text-tama-yellow">★</span>}
                        {i === 1 && <span className="text-gray-400">★</span>}
                        {i === 2 && <span className="text-orange-700">★</span>}
                        {i > 2 && <span className="text-gray-700">·</span>}
                        {p.project}
                      </span>
                      <span className="text-tama-green ml-2 shrink-0">{p.hours.toFixed(1)}h ({p.pct}%)</span>
                    </div>
                    <div className="h-3 bg-tama-screen border border-tama-border rounded overflow-hidden">
                      <div
                        className="h-full bg-tama-blue transition-all duration-500"
                        style={{ width: `${p.pct}%`, opacity: 0.6 + 0.4 * (1 - i / stats.projectBreakdown.length) }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Encouragement */}
          <div className="border border-tama-border bg-tama-screen p-3 rounded text-center font-pixel text-gray-400" style={{ fontSize: '8px', lineHeight: 1.8 }}>
            {getWeeklyEncouragement(stats.mood)}
          </div>

          {/* Top 3 projects */}
          {stats.projectBreakdown.length > 0 && (
            <div>
              <div className="font-pixel text-gray-500 mb-1" style={{ fontSize: '7px' }}>TOP PROJECTS</div>
              {stats.projectBreakdown.slice(0, 3).map((p, i) => (
                <div key={p.project} className="font-pixel text-gray-300 flex gap-2" style={{ fontSize: '8px' }}>
                  <span className="text-tama-yellow">#{i + 1}</span>
                  <span className="truncate">{p.project}</span>
                  <span className="ml-auto text-tama-green">{p.hours.toFixed(1)}h</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 p-4 border-t border-tama-border">
          <button
            onClick={handleExportWeek}
            className="flex-1 pixel-btn border-tama-green text-tama-green hover:bg-tama-green hover:text-tama-bg font-pixel"
            style={{ fontSize: '8px', padding: '8px' }}
          >
            ⬇ EXPORT CSV
          </button>
          <button
            onClick={handleSharePng}
            disabled={capturing}
            className="flex-1 pixel-btn border-tama-purple text-tama-purple hover:bg-tama-purple hover:text-white font-pixel disabled:opacity-50"
            style={{ fontSize: '8px', padding: '8px' }}
          >
            {capturing ? 'SAVING...' : '📷 SAVE PNG'}
          </button>
        </div>
      </div>
    </div>
  )
}

function StatBox({ label, value, unit, color }: { label: string; value: string; unit: string; color: string }) {
  return (
    <div className="pixel-panel p-2 text-center bg-tama-screen">
      <div className="text-gray-500 font-pixel mb-1" style={{ fontSize: '6px' }}>{label}</div>
      <div className={`font-pixel ${color}`} style={{ fontSize: '14px' }}>{value}<span style={{ fontSize: '8px' }}>{unit}</span></div>
    </div>
  )
}
