import { useState, useEffect } from 'react'
import { PetDashboard } from './components/Pet/PetDashboard'
import { FeedForm } from './components/TimeLog/FeedForm'
import { EntryList } from './components/TimeLog/EntryList'
import { WeeklyReport } from './components/WeeklyReport'
import { Settings } from './components/Settings'
import { HistoryView } from './components/HistoryView'
import { EvolutionPanel } from './components/EvolutionPanel'
import { useTimeStore } from './store/useTimeStore'
import { usePetState, useCurrentWeekKey } from './store/petSelectors'
import { calcEvolution } from './utils/petLogic'
import type { TabId } from './types'

const TABS: { id: TabId; label: string; icon: string }[] = [
  { id: 'pet', label: 'PET', icon: '★' },
  { id: 'log', label: 'LOG', icon: '+' },
  { id: 'history', label: 'HIST', icon: '◷' },
  { id: 'report', label: 'RPT', icon: '◈' },
  { id: 'settings', label: 'SET', icon: '⚙' },
]

export default function App() {
  const [tab, setTab] = useState<TabId>('pet')
  const [showReport, setShowReport] = useState(false)
  const [isFeeding, setIsFeeding] = useState(false)
  const [showLogModal, setShowLogModal] = useState(false)
  const pet = usePetState()
  const currentWeekKey = useCurrentWeekKey()
  const { lastReportWeekKey, setLastReportWeekKey, evolution, updateEvolution } = useTimeStore()

  // Auto-show weekly report on new week
  useEffect(() => {
    if (lastReportWeekKey && lastReportWeekKey !== currentWeekKey) {
      setShowReport(true)
      setLastReportWeekKey(currentWeekKey)
      // Trigger evolution update for the week that just ended
      const updated = calcEvolution(evolution, pet.healthPct)
      updateEvolution(updated)
    } else if (!lastReportWeekKey) {
      setLastReportWeekKey(currentWeekKey)
    }
  }, [currentWeekKey, lastReportWeekKey, setLastReportWeekKey, evolution, pet.healthPct, updateEvolution])

  function handleFeedClick() {
    setShowLogModal(true)
  }

  function handleLogSubmit() {
    setShowLogModal(false)
    setIsFeeding(true)
    setTimeout(() => setIsFeeding(false), 600)
  }

  return (
    <div className="min-h-screen bg-tama-bg flex flex-col">
      {/* Header */}
      <header className="border-b border-tama-border bg-tama-panel px-4 py-3 flex items-center justify-between">
        <div className="font-pixel text-tama-green" style={{ fontSize: '12px' }}>
          TIMEAGOTCHI
        </div>
        <div className="font-pixel text-gray-600" style={{ fontSize: '7px' }}>
          v1.0
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4">
        {tab === 'pet' && (
          <div className="flex flex-col items-center gap-6 py-4">
            <PetDashboard onFeedClick={handleFeedClick} isFeeding={isFeeding} />
            {/* Quick access evolution panel on pet tab */}
            <div className="w-full max-w-sm">
              <EvolutionPanel />
            </div>
          </div>
        )}
        {tab === 'log' && (
          <div className="max-w-sm mx-auto flex flex-col gap-6 py-4">
            <FeedForm onSubmit={() => {
              setIsFeeding(true)
              setTimeout(() => setIsFeeding(false), 600)
            }} />
            <div className="border-t border-tama-border pt-4">
              <div className="font-pixel text-gray-400 mb-3" style={{ fontSize: '8px' }}>THIS WEEK</div>
              <EntryList />
            </div>
          </div>
        )}
        {tab === 'history' && (
          <div className="max-w-sm mx-auto py-4">
            <HistoryView />
          </div>
        )}
        {tab === 'report' && (
          <div className="max-w-sm mx-auto py-4">
            <WeeklyReport />
          </div>
        )}
        {tab === 'settings' && (
          <div className="max-w-sm mx-auto py-4">
            <Settings />
          </div>
        )}
      </main>

      {/* Bottom nav */}
      <nav className="border-t border-tama-border bg-tama-panel flex">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center py-3 gap-1 font-pixel transition-colors ${
              tab === t.id
                ? 'text-tama-green border-t-2 border-tama-green'
                : 'text-gray-600 hover:text-gray-400 border-t-2 border-transparent'
            }`}
            style={{ fontSize: '6px' }}
          >
            <span style={{ fontSize: '14px', lineHeight: 1 }}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      {/* Feed modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/80 flex items-end sm:items-center justify-center z-50 p-4">
          <div className="pixel-panel w-full max-w-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-pixel text-tama-green" style={{ fontSize: '10px' }}>LOG TIME</span>
              <button
                onClick={() => setShowLogModal(false)}
                className="text-tama-red font-pixel"
                style={{ fontSize: '12px' }}
              >
                ✖
              </button>
            </div>
            <FeedForm onSubmit={handleLogSubmit} />
          </div>
        </div>
      )}

      {/* Weekly report modal */}
      {showReport && (
        <WeeklyReport showPrevious onClose={() => setShowReport(false)} />
      )}
    </div>
  )
}
