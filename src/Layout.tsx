import { useState, useEffect } from 'react'
import { Outlet, NavLink, useOutletContext } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { ClientOnly } from 'vite-react-ssg'
import { Analytics } from "@vercel/analytics/next"
import { WeeklyReport } from './components/WeeklyReport'
import { FeedForm } from './components/TimeLog/FeedForm'
import { useTimeStore } from './store/useTimeStore'
import { usePetState, useCurrentWeekKey } from './store/petSelectors'
import { calcEvolution } from './utils/petLogic'

export interface AppContext {
  isFeeding: boolean
  onFeedClick: () => void
}

const TABS = [
  { path: '/',         label: 'PET',  icon: '★', title: 'Timeagotchi – Virtual Pet Dashboard' },
  { path: '/log',      label: 'LOG',  icon: '+', title: 'Log Time – Timeagotchi' },
  { path: '/history',  label: 'HIST', icon: '◷', title: 'History – Timeagotchi' },
  { path: '/report',   label: 'RPT',  icon: '◈', title: 'Weekly Report – Timeagotchi' },
  { path: '/settings', label: 'SET',  icon: '⚙', title: 'Settings – Timeagotchi' },
]

export function useAppContext() {
  return useOutletContext<AppContext>()
}

export default function Layout() {
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

  const context: AppContext = {
    isFeeding,
    onFeedClick: handleFeedClick,
  }

  return (
    <HelmetProvider>
    <div className="min-h-screen bg-tama-bg flex flex-col">
      <Helmet defaultTitle="Timeagotchi – Gamify Your Time Tracking | Virtual Pet Productivity App" />

      {/* Skip navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-3 focus:py-2 focus:bg-tama-green focus:text-tama-bg font-pixel"
        style={{ fontSize: '10px' }}
      >
        Skip to content
      </a>

      {/* Header */}
      <header className="border-b border-tama-border bg-tama-panel px-4 py-3 flex items-center justify-between">
        <h1 className="font-pixel text-tama-green" style={{ fontSize: '12px' }}>
          TIMEAGOTCHI
        </h1>
        <div className="font-pixel text-gray-600" style={{ fontSize: '7px' }}>
          v1.0
        </div>
      </header>

      {/* Main content */}
      <main id="main-content" className="flex-1 overflow-y-auto p-4">
        <Outlet context={context} />
      </main>

      {/* Bottom nav */}
      <nav className="border-t border-tama-border bg-tama-panel flex" role="tablist" aria-label="Main navigation">
        {TABS.map((t) => (
          <NavLink
            key={t.path}
            to={t.path}
            end={t.path === '/'}
            role="tab"
            aria-label={t.label}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-3 gap-1 font-pixel transition-colors border-t-2 ${
                isActive
                  ? 'text-tama-green border-tama-green'
                  : 'text-gray-600 hover:text-gray-400 border-transparent'
              }`
            }
            style={{ fontSize: '6px' }}
          >
            <span style={{ fontSize: '14px', lineHeight: 1 }}>{t.icon}</span>
            <span>{t.label}</span>
          </NavLink>
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

      <ClientOnly>
        {() => <Analytics />}
      </ClientOnly>
    </div>
    </HelmetProvider>
  )
}
