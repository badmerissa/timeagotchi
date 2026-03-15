# Timeagotchi — Implementation Plan

## Overview

A browser-based, fully local time-tracking app wrapped in a tamagotchi experience. Users log
work time as "feeding" sessions; a virtual pet's health and mood reflect how close they are
to their weekly hour target. No backend, no accounts — data lives in `localStorage`.

---

## Clarified Decisions

| Question | Decision |
|---|---|
| Platform | Web app (SPA, runs in the browser) |
| Pet health model | Target-hours-based — pet health = % of weekly target reached |
| Data persistence | Fully local via `localStorage` — no signup, no server |

---

## Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **React + Vite** | Fast DX, huge ecosystem, easy static deployment |
| Styling | **Tailwind CSS** | Utility-first; suits pixel/retro aesthetic |
| State | **Zustand** | Lightweight global store; easy localStorage sync |
| Date math | **date-fns** | Tiny, tree-shakeable, no side effects |
| CSV export | Native `Blob` + `URL.createObjectURL` | No dependency needed |
| Animation | **CSS keyframes / Lottie** | Pixel sprite animations for the pet |
| Testing | **Vitest + React Testing Library** | Co-located with Vite, fast |

No backend. No auth. Deployable as a static site (Vercel, Netlify, GitHub Pages).

---

## Core Entities

### `TimeEntry`
```ts
{
  id: string          // uuid
  date: string        // ISO date "YYYY-MM-DD"
  project: string     // free-text label
  description: string // optional note
  hours: number       // positive decimal, e.g. 2.5
  createdAt: string   // ISO datetime
}
```

### `Settings`
```ts
{
  weeklyTargetHours: number   // default 40
  petName: string             // user-chosen, default "Tama"
  weekStartsOn: 0 | 1        // 0 = Sunday, 1 = Monday
}
```

### `PetState` (derived, not stored — computed from entries + settings)
```ts
{
  healthPct: number     // 0–100, drives sprite selection
  mood: 'thriving' | 'happy' | 'neutral' | 'hungry' | 'critical'
  weekHoursLogged: number
  weekHoursTarget: number
  lastFedAt: string | null
}
```

Health tiers:

| `healthPct` | Mood | Sprite |
|---|---|---|
| 85–100 % | thriving | bouncing, sparkles |
| 65–84 % | happy | idle, blinks |
| 40–64 % | neutral | slow idle |
| 20–39 % | hungry | drooping, slow |
| 0–19 % | critical | lying down, red tint |

`healthPct` resets every Monday (or Sunday) when a new week begins — the pet is "reborn" at
neutral (50 %) to give users a fresh start.

---

## Feature Scope

### MVP (Phase 1)

1. **Log Time ("Feed Pet")**
   - Form: project name, description (optional), hours
   - Submitting triggers a feeding animation on the pet sprite
   - Entry saved to `localStorage`

2. **Pet Dashboard**
   - Animated pixel sprite reflecting current mood
   - Health bar (% of weekly target)
   - Hours logged this week / target display (e.g. "24 / 40 hrs")
   - Pet name displayed above sprite

3. **Time Entry List**
   - Current week's entries, grouped by day
   - Inline delete per entry
   - Running daily and weekly totals

4. **Settings Panel**
   - Set weekly hour target
   - Name the pet
   - Choose week start day

5. **CSV Export**
   - Export all entries (or current week) as `timeagotchi-export.csv`
   - Columns: `Date, Project, Description, Hours`

### Phase 2

6. **Weekly Review Report**
   - End-of-week modal (auto-triggered on week change, or manually opened)
   - Summary: total hours, hours per project (pie/bar chart), health score achieved
   - Shareable as PNG screenshot (via `html2canvas`)

7. **Pet Evolution / Milestones**
   - Pet levels up after consecutive weeks at ≥ 85 % health
   - Unlockable sprite variants (hats, accessories) stored in `localStorage`

8. **Project History**
   - All-time entry list with week filter
   - Per-project totals chart

---

## File & Folder Structure

```
timeagotchi/
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── src/
│   ├── main.tsx                  # React root
│   ├── App.tsx                   # Shell, tab routing
│   ├── store/
│   │   ├── useTimeStore.ts       # Zustand store: entries + settings
│   │   └── petSelectors.ts       # Derived pet state (health, mood)
│   ├── components/
│   │   ├── Pet/
│   │   │   ├── PetSprite.tsx     # Animated sprite wrapper
│   │   │   ├── HealthBar.tsx
│   │   │   └── PetDashboard.tsx  # Assembles sprite + stats
│   │   ├── TimeLog/
│   │   │   ├── FeedForm.tsx      # Log time form
│   │   │   ├── EntryList.tsx     # This week's entries
│   │   │   └── EntryRow.tsx
│   │   ├── WeeklyReport.tsx
│   │   ├── Settings.tsx
│   │   └── ExportButton.tsx
│   ├── utils/
│   │   ├── csv.ts                # CSV serialisation
│   │   ├── dateHelpers.ts        # Week boundaries, formatting
│   │   └── petLogic.ts          # healthPct + mood calculation
│   └── assets/
│       └── sprites/              # PNG sprite sheets per mood
├── public/
└── tests/
    ├── petLogic.test.ts
    ├── csv.test.ts
    └── dateHelpers.test.ts
```

---

## Data Persistence Strategy

All data stored under two `localStorage` keys:

| Key | Value |
|---|---|
| `tama_entries` | `JSON.stringify(TimeEntry[])` |
| `tama_settings` | `JSON.stringify(Settings)` |

Zustand middleware (`persist`) handles serialisation automatically.

Migration strategy: store a `version` field in settings; run migrations on load if version
is outdated.

---

## Pet Health Calculation

```ts
// petLogic.ts
export function calcHealth(weekHours: number, targetHours: number): number {
  if (targetHours === 0) return 100;
  return Math.min(100, Math.round((weekHours / targetHours) * 100));
}

export function calcMood(healthPct: number): PetMood {
  if (healthPct >= 85) return 'thriving';
  if (healthPct >= 65) return 'happy';
  if (healthPct >= 40) return 'neutral';
  if (healthPct >= 20) return 'hungry';
  return 'critical';
}
```

Recalculated live on every store read — no stale state.

---

## CSV Export Format

```csv
Date,Project,Description,Hours
2026-03-09,Client A,Discovery call,1.5
2026-03-09,Internal,Standup,0.25
2026-03-10,Client A,Design review,2.0
```

Export covers all entries by default; an optional "this week only" toggle for the export
button.

---

## Weekly Review Report Contents

Generated every time the user opens the report (or auto-shown on first open of a new week):

- Week date range
- Total hours logged vs target + health score
- Hours per project (horizontal bar chart — CSS only, no chart library for MVP)
- Top 3 most-worked projects
- Encouragement message tied to mood tier
- "Export this week" shortcut button

---

## Build & Deployment

```bash
npm create vite@latest timeagotchi -- --template react-ts
npm install zustand date-fns tailwindcss
npm run build   # outputs dist/
```

Deploy `dist/` to any static host. No env vars, no server.

---

## Phased Delivery

| Phase | Scope | Output |
|---|---|---|
| 1 — Core | Pet dashboard, log time form, entry list, settings, CSV export | Usable MVP |
| 2 — Reports | Weekly review modal, charts, PNG share | Full feature set |
| 3 — Delight | Pet evolution, sprite unlocks, history view | Retention layer |

---

## Out of Scope (for now)

- Team / multi-user features
- Native mobile / desktop app
- Timer / Pomodoro auto-tracker (manual entry only in MVP)
- Backend, cloud sync, or auth
- Invoicing or billing rate calculation
