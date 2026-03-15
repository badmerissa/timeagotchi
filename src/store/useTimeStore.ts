import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { TimeEntry, Settings, PetEvolution } from '../types'

interface TimeStore {
  entries: TimeEntry[]
  settings: Settings
  evolution: PetEvolution
  lastReportWeekKey: string | null

  addEntry: (entry: Omit<TimeEntry, 'id' | 'createdAt'>) => void
  deleteEntry: (id: string) => void
  updateSettings: (patch: Partial<Settings>) => void
  updateEvolution: (patch: Partial<PetEvolution>) => void
  setLastReportWeekKey: (key: string) => void
}

const DEFAULT_SETTINGS: Settings = {
  version: 1,
  weeklyTargetHours: 40,
  petName: 'Tama',
  weekStartsOn: 1,
}

const DEFAULT_EVOLUTION: PetEvolution = {
  level: 1,
  consecutiveGoodWeeks: 0,
  unlockedAccessories: [],
  activeAccessory: null,
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const useTimeStore = create<TimeStore>()(
  persist(
    (set) => ({
      entries: [],
      settings: DEFAULT_SETTINGS,
      evolution: DEFAULT_EVOLUTION,
      lastReportWeekKey: null,

      addEntry: (entry) =>
        set((state) => ({
          entries: [
            ...state.entries,
            { ...entry, id: generateId(), createdAt: new Date().toISOString() },
          ],
        })),

      deleteEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),

      updateSettings: (patch) =>
        set((state) => ({
          settings: { ...state.settings, ...patch },
        })),

      updateEvolution: (patch) =>
        set((state) => ({
          evolution: { ...state.evolution, ...patch },
        })),

      setLastReportWeekKey: (key) => set({ lastReportWeekKey: key }),
    }),
    {
      name: 'tama_store',
      // Migrate from older versions
      version: 1,
    },
  ),
)
