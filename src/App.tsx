import type { RouteRecord } from 'vite-react-ssg'
import Layout from './Layout'
import { PetDashboard } from './components/Pet/PetDashboard'
import { EvolutionPanel } from './components/EvolutionPanel'
import { FeedForm } from './components/TimeLog/FeedForm'
import { EntryList } from './components/TimeLog/EntryList'
import { HistoryView } from './components/HistoryView'
import { Settings } from './components/Settings'
import { WeeklyReportPage } from './pages/WeeklyReportPage'
import { useAppContext } from './Layout'

function PetPage() {
  const { isFeeding, onFeedClick } = useAppContext()
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <PetDashboard onFeedClick={onFeedClick} isFeeding={isFeeding} />
      <div className="w-full max-w-sm">
        <EvolutionPanel />
      </div>
    </div>
  )
}

function LogPage() {
  useAppContext()
  return (
    <div className="max-w-sm mx-auto flex flex-col gap-6 py-4">
      <FeedForm onSubmit={() => {}} />
      <div className="border-t border-tama-border pt-4">
        <div className="font-pixel text-gray-400 mb-3" style={{ fontSize: '8px' }}>THIS WEEK</div>
        <EntryList />
      </div>
    </div>
  )
}

function HistoryPage() {
  return (
    <div className="max-w-sm mx-auto py-4">
      <HistoryView />
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="max-w-sm mx-auto py-4">
      <Settings />
    </div>
  )
}

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <Layout />,
    entry: 'src/Layout.tsx',
    children: [
      {
        index: true,
        element: <PetPage />,
      },
      {
        path: 'log',
        element: <LogPage />,
      },
      {
        path: 'history',
        element: <HistoryPage />,
      },
      {
        path: 'report',
        element: <WeeklyReportPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]
