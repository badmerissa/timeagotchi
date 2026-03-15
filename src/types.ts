export interface TimeEntry {
  id: string
  date: string        // ISO date "YYYY-MM-DD"
  project: string
  description: string
  hours: number
  createdAt: string   // ISO datetime
}

export interface Settings {
  version: number
  weeklyTargetHours: number
  petName: string
  weekStartsOn: 0 | 1  // 0 = Sunday, 1 = Monday
}

export type PetMood = 'thriving' | 'happy' | 'neutral' | 'hungry' | 'critical'

export interface PetState {
  healthPct: number
  mood: PetMood
  weekHoursLogged: number
  weekHoursTarget: number
  lastFedAt: string | null
}

export interface WeeklyStats {
  weekStart: Date
  weekEnd: Date
  entries: TimeEntry[]
  totalHours: number
  targetHours: number
  healthPct: number
  mood: PetMood
  projectBreakdown: { project: string; hours: number; pct: number }[]
}

export type TabId = 'pet' | 'log' | 'history' | 'report' | 'settings'

export interface PetEvolution {
  level: number           // 1-5
  consecutiveGoodWeeks: number
  unlockedAccessories: string[]
  activeAccessory: string | null
}
