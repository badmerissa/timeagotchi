import type { PetMood, PetEvolution } from '../types'

export function calcHealth(weekHours: number, targetHours: number): number {
  if (targetHours === 0) return 100
  return Math.min(100, Math.round((weekHours / targetHours) * 100))
}

export function calcMood(healthPct: number): PetMood {
  if (healthPct >= 85) return 'thriving'
  if (healthPct >= 65) return 'happy'
  if (healthPct >= 40) return 'neutral'
  if (healthPct >= 20) return 'hungry'
  return 'critical'
}

export function getMoodMessage(mood: PetMood, petName: string): string {
  const messages: Record<PetMood, string[]> = {
    thriving: [
      `${petName} is glowing with productivity!`,
      `${petName} has never felt better!`,
      `Amazing work! ${petName} is thriving!`,
    ],
    happy: [
      `${petName} is happy with your progress!`,
      `Keep it up! ${petName} is pleased.`,
      `${petName} smiles at your dedication.`,
    ],
    neutral: [
      `${petName} is doing okay. Keep logging!`,
      `${petName} could use a bit more feeding.`,
      `${petName} is waiting for more time logs.`,
    ],
    hungry: [
      `${petName} is getting hungry! Log more time.`,
      `${petName} needs feeding — log your hours!`,
      `${petName} droops sadly. Time to log!`,
    ],
    critical: [
      `${petName} is in critical condition! Log time NOW!`,
      `Emergency! ${petName} is fading away!`,
      `${petName} cries for attention — please log hours!`,
    ],
  }
  const list = messages[mood]
  return list[Math.floor(Date.now() / 60000) % list.length]
}

export function getWeeklyEncouragement(mood: PetMood): string {
  const messages: Record<PetMood, string> = {
    thriving: 'Outstanding week! You crushed your target. Keep the streak alive!',
    happy: 'Great week! You are well on track. Just a little more to go!',
    neutral: 'Decent week. Push a bit harder next week to keep your pet happy!',
    hungry: 'Your pet is struggling. Try to hit at least 70% of your target next week.',
    critical: 'Rough week. Your pet needs you — small consistent logs go a long way!',
  }
  return messages[mood]
}

export const ACCESSORIES = ['hat', 'sunglasses', 'bow', 'crown', 'cape'] as const
export type Accessory = (typeof ACCESSORIES)[number]

export function calcEvolution(evolution: PetEvolution, weekHealthPct: number): PetEvolution {
  const goodWeek = weekHealthPct >= 85
  const newConsecutive = goodWeek ? evolution.consecutiveGoodWeeks + 1 : 0
  const newLevel = Math.min(5, 1 + Math.floor(newConsecutive / 2))

  // Unlock a new accessory every 2 consecutive good weeks
  const unlocked = [...evolution.unlockedAccessories]
  if (goodWeek && newConsecutive > 0 && newConsecutive % 2 === 0) {
    const nextAccessory = ACCESSORIES[Math.min(unlocked.length, ACCESSORIES.length - 1)]
    if (!unlocked.includes(nextAccessory)) {
      unlocked.push(nextAccessory)
    }
  }

  return {
    ...evolution,
    level: newLevel,
    consecutiveGoodWeeks: newConsecutive,
    unlockedAccessories: unlocked,
  }
}

export function getLevelLabel(level: number): string {
  const labels = ['Egg', 'Baby', 'Child', 'Teen', 'Adult', 'Legend']
  return labels[Math.min(level, 5)]
}
