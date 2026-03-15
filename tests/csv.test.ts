import { describe, it, expect, vi, afterEach } from 'vitest'
import { entriesToCsv, downloadCsv } from '../src/utils/csv'
import type { TimeEntry } from '../src/types'

const sampleEntries: TimeEntry[] = [
  { id: '1', date: '2026-03-09', project: 'Client A', description: 'Discovery call', hours: 1.5, createdAt: '2026-03-09T09:00:00Z' },
  { id: '2', date: '2026-03-09', project: 'Internal', description: 'Standup', hours: 0.25, createdAt: '2026-03-09T09:30:00Z' },
  { id: '3', date: '2026-03-10', project: 'Client A', description: 'Design review', hours: 2, createdAt: '2026-03-10T10:00:00Z' },
]

describe('entriesToCsv', () => {
  it('produces correct header', () => {
    const csv = entriesToCsv(sampleEntries)
    expect(csv.startsWith('Date,Project,Description,Hours')).toBe(true)
  })

  it('produces correct number of rows (header + data)', () => {
    const csv = entriesToCsv(sampleEntries)
    const lines = csv.split('\n')
    expect(lines).toHaveLength(4) // 1 header + 3 data
  })

  it('formats a row correctly', () => {
    const csv = entriesToCsv([sampleEntries[0]])
    const lines = csv.split('\n')
    expect(lines[1]).toBe('2026-03-09,Client A,Discovery call,1.5')
  })

  it('escapes fields containing commas', () => {
    const entry: TimeEntry = {
      ...sampleEntries[0],
      project: 'Client, A',
    }
    const csv = entriesToCsv([entry])
    expect(csv).toContain('"Client, A"')
  })

  it('escapes fields containing double quotes', () => {
    const entry: TimeEntry = {
      ...sampleEntries[0],
      description: 'Said "hello"',
    }
    const csv = entriesToCsv([entry])
    expect(csv).toContain('"Said ""hello"""')
  })

  it('returns only header for empty entries', () => {
    const csv = entriesToCsv([])
    expect(csv).toBe('Date,Project,Description,Hours')
  })
})

describe('downloadCsv', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('creates an anchor element and triggers click', () => {
    const mockClick = vi.fn()
    const mockCreateObjectURL = vi.fn().mockReturnValue('blob:mock')
    const mockRevokeObjectURL = vi.fn()

    ;(globalThis as typeof globalThis & { URL: typeof URL }).URL.createObjectURL = mockCreateObjectURL
    ;(globalThis as typeof globalThis & { URL: typeof URL }).URL.revokeObjectURL = mockRevokeObjectURL

    const mockAnchor = {
      href: '',
      download: '',
      click: mockClick,
    }
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as unknown as HTMLAnchorElement)

    downloadCsv(sampleEntries)

    expect(mockClick).toHaveBeenCalledOnce()
    expect(mockAnchor.download).toBe('timeagotchi-export.csv')
    expect(mockAnchor.href).toBe('blob:mock')
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock')
  })

  it('uses provided filename', () => {
    const mockClick = vi.fn()
    ;(globalThis as typeof globalThis & { URL: typeof URL }).URL.createObjectURL = vi.fn().mockReturnValue('blob:mock')
    ;(globalThis as typeof globalThis & { URL: typeof URL }).URL.revokeObjectURL = vi.fn()

    const mockAnchor = { href: '', download: '', click: mockClick }
    vi.spyOn(document, 'createElement').mockReturnValue(mockAnchor as unknown as HTMLAnchorElement)

    downloadCsv(sampleEntries, 'custom-name.csv')
    expect(mockAnchor.download).toBe('custom-name.csv')
  })
})
