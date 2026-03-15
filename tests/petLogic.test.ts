import { describe, it, expect } from 'vitest'
import { calcHealth, calcMood, getMoodMessage, calcEvolution, getLevelLabel } from '../src/utils/petLogic'
import type { PetEvolution } from '../src/types'

describe('calcHealth', () => {
  it('returns 100 when target is 0', () => {
    expect(calcHealth(0, 0)).toBe(100)
    expect(calcHealth(40, 0)).toBe(100)
  })

  it('returns 0 when no hours logged', () => {
    expect(calcHealth(0, 40)).toBe(0)
  })

  it('returns correct percentage', () => {
    expect(calcHealth(20, 40)).toBe(50)
    expect(calcHealth(40, 40)).toBe(100)
    expect(calcHealth(32, 40)).toBe(80)
  })

  it('caps at 100 when hours exceed target', () => {
    expect(calcHealth(50, 40)).toBe(100)
    expect(calcHealth(80, 40)).toBe(100)
  })

  it('rounds to nearest integer', () => {
    expect(calcHealth(1, 3)).toBe(33)
    expect(calcHealth(2, 3)).toBe(67)
  })
})

describe('calcMood', () => {
  it('returns thriving at 85+', () => {
    expect(calcMood(85)).toBe('thriving')
    expect(calcMood(100)).toBe('thriving')
    expect(calcMood(90)).toBe('thriving')
  })

  it('returns happy at 65–84', () => {
    expect(calcMood(65)).toBe('happy')
    expect(calcMood(84)).toBe('happy')
    expect(calcMood(70)).toBe('happy')
  })

  it('returns neutral at 40–64', () => {
    expect(calcMood(40)).toBe('neutral')
    expect(calcMood(64)).toBe('neutral')
    expect(calcMood(50)).toBe('neutral')
  })

  it('returns hungry at 20–39', () => {
    expect(calcMood(20)).toBe('hungry')
    expect(calcMood(39)).toBe('hungry')
    expect(calcMood(30)).toBe('hungry')
  })

  it('returns critical at 0–19', () => {
    expect(calcMood(0)).toBe('critical')
    expect(calcMood(19)).toBe('critical')
    expect(calcMood(10)).toBe('critical')
  })
})

describe('getMoodMessage', () => {
  it('returns a non-empty string for all moods', () => {
    const moods = ['thriving', 'happy', 'neutral', 'hungry', 'critical'] as const
    for (const mood of moods) {
      const msg = getMoodMessage(mood, 'Tama')
      expect(msg).toBeTruthy()
      expect(typeof msg).toBe('string')
    }
  })

  it('includes pet name in message', () => {
    const msg = getMoodMessage('thriving', 'Pixel')
    expect(msg).toContain('Pixel')
  })
})

describe('calcEvolution', () => {
  const baseEvolution: PetEvolution = {
    level: 1,
    consecutiveGoodWeeks: 0,
    unlockedAccessories: [],
    activeAccessory: null,
  }

  it('increments consecutiveGoodWeeks on great week', () => {
    const result = calcEvolution(baseEvolution, 90)
    expect(result.consecutiveGoodWeeks).toBe(1)
  })

  it('resets consecutiveGoodWeeks on bad week', () => {
    const withStreak = { ...baseEvolution, consecutiveGoodWeeks: 3 }
    const result = calcEvolution(withStreak, 50)
    expect(result.consecutiveGoodWeeks).toBe(0)
  })

  it('levels up after 2 consecutive great weeks', () => {
    const withOne = calcEvolution(baseEvolution, 90)
    const withTwo = calcEvolution(withOne, 90)
    expect(withTwo.level).toBe(2)
  })

  it('does not exceed max level 5', () => {
    let evo = { ...baseEvolution, level: 5, consecutiveGoodWeeks: 8 }
    evo = calcEvolution(evo, 90)
    expect(evo.level).toBe(5)
  })

  it('unlocks an accessory after 2 consecutive great weeks', () => {
    const withOne = calcEvolution(baseEvolution, 90)
    const withTwo = calcEvolution(withOne, 90)
    expect(withTwo.unlockedAccessories.length).toBe(1)
  })

  it('does not unlock duplicate accessories', () => {
    let evo = baseEvolution
    for (let i = 0; i < 6; i++) {
      evo = calcEvolution(evo, 90)
    }
    const unique = new Set(evo.unlockedAccessories)
    expect(unique.size).toBe(evo.unlockedAccessories.length)
  })
})

describe('getLevelLabel', () => {
  it('returns correct labels', () => {
    expect(getLevelLabel(0)).toBe('Egg')
    expect(getLevelLabel(1)).toBe('Baby')
    expect(getLevelLabel(2)).toBe('Child')
    expect(getLevelLabel(3)).toBe('Teen')
    expect(getLevelLabel(4)).toBe('Adult')
    expect(getLevelLabel(5)).toBe('Legend')
  })
})
