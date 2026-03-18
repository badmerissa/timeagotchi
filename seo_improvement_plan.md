# SEO Improvement Plan for Timeagotchi

**Date**: 2026-03-18
**Analyst**: SEO Expert & Full Stack Developer
**App**: Timeagotchi — a Tamagotchi-style time-tracking web app
**Stack**: React 18 + TypeScript + Vite + Zustand + Tailwind CSS, deployed on Vercel

---

## Executive Summary

Timeagotchi is a pure Client-Side Rendered (CSR) Single-Page Application (SPA) with almost no SEO infrastructure. The current state makes the app effectively invisible to search engines. This plan identifies 10 priority improvement areas, ordered by impact and implementation effort.

---

## Current SEO Audit

### Critical Issues

| Issue | Severity | Impact |
|-------|----------|--------|
| No meta description tag | Critical | Search engines show poor snippet; low CTR |
| No Open Graph / Twitter Card tags | Critical | Unfurling broken on social media shares |
| No structured data (JSON-LD) | Critical | No rich snippets eligibility |
| No `robots.txt` | Critical | Crawlers have no guidance |
| No `sitemap.xml` | Critical | Pages may not be indexed |
| No canonical URL tag | High | Risk of duplicate content penalties |
| Pure CSR — no SSR/SSG | High | Content hidden behind JS execution |
| No semantic heading hierarchy (`<h1>`–`<h3>`) | High | Search engines cannot determine page topics |
| No URL routing (single `/` for all tabs) | High | Only one URL is indexable |
| Button-based navigation (no `<a>` links) | High | Crawlers cannot follow internal navigation |
| No `lang` attribute on `<html>` | Medium | Accessibility and localisation signalling lost |
| SVG pet has no accessible label | Medium | Screen readers & crawlers find no alt text |
| No web app manifest (`manifest.json`) | Medium | Poor PWA and mobile SEO signals |
| No theme-color meta tag | Low | Chrome address bar not branded |
| Google Analytics absent | Low | Richer conversion data unavailable |

---

## Improvement Plan

### 1. Meta Tags & Document Head (Priority: Critical)

**Current state**: `index.html` contains only `charset`, `viewport`, `title`, and font preconnects.

**Actions**:

1.1. **Title tag** — Expand from bare "Timeagotchi" to keyword-rich format:
```
Timeagotchi – Gamify Your Time Tracking | Virtual Pet Productivity App
```

1.2. **Meta description** — Add a compelling 150–160 character description:
```html
<meta name="description" content="Timeagotchi turns time tracking into a game. Log hours, grow your virtual pet, and see weekly productivity reports — all in your browser, free." />
```

1.3. **Open Graph tags** — Required for correct link previews on Slack, Facebook, LinkedIn:
```html
<meta property="og:type"        content="website" />
<meta property="og:site_name"   content="Timeagotchi" />
<meta property="og:title"       content="Timeagotchi – Gamify Your Time Tracking" />
<meta property="og:description" content="Log hours, grow your virtual pet, and see weekly productivity reports. Free, browser-based." />
<meta property="og:image"       content="https://timeagotchi.vercel.app/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:url"         content="https://timeagotchi.vercel.app/" />
```

1.4. **Twitter Card tags**:
```html
<meta name="twitter:card"        content="summary_large_image" />
<meta name="twitter:title"       content="Timeagotchi – Gamify Your Time Tracking" />
<meta name="twitter:description" content="Log hours, grow your virtual pet, and see weekly productivity reports." />
<meta name="twitter:image"       content="https://timeagotchi.vercel.app/og-image.png" />
```

1.5. **Canonical URL**:
```html
<link rel="canonical" href="https://timeagotchi.vercel.app/" />
```

1.6. **Language declaration**:
```html
<html lang="en">
```

1.7. **Theme color**:
```html
<meta name="theme-color" content="#1a1a2e" />
```

---

### 2. Open Graph Social Share Image (Priority: Critical)

**Current state**: No OG image exists.

**Actions**:

2.1. Create a 1200×630 px PNG at `public/og-image.png` featuring:
- The pixel-art Tamagotchi pet centred on screen
- Tagline: "Gamify Your Time Tracking"
- Brand name "Timeagotchi" in the pixel font
- Dark background matching the app's colour theme (`#1a1a2e`)

2.2. Create a smaller 512×512 square version for Twitter summary card if needed.

2.3. Host both images in `public/` so Vite outputs them to `/og-image.png` at root.

---

### 3. `robots.txt` (Priority: Critical)

**Current state**: File does not exist.

**Actions**:

3.1. Create `public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://timeagotchi.vercel.app/sitemap.xml
```

This instructs all bots to crawl the site and points them to the sitemap.

---

### 4. `sitemap.xml` (Priority: Critical)

**Current state**: File does not exist.

**Actions**:

4.1. Create `public/sitemap.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://timeagotchi.vercel.app/</loc>
    <lastmod>2026-03-18</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

4.2. If URL routing is implemented (see Item 7), expand the sitemap to include one `<url>` entry per route (`/log`, `/history`, `/settings`, etc.).

4.3. Submit the sitemap to **Google Search Console** and **Bing Webmaster Tools** after deployment.

---

### 5. Structured Data / JSON-LD (Priority: High)

**Current state**: No structured data exists.

**Actions**:

5.1. Add `WebApplication` schema to `index.html` inside a `<script type="application/ld+json">` block:
```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Timeagotchi",
  "url": "https://timeagotchi.vercel.app/",
  "description": "A gamified time tracking app where you grow a virtual pet by logging your working hours.",
  "applicationCategory": "ProductivityApplication",
  "operatingSystem": "Any",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Person",
    "name": "Merissa"
  },
  "screenshot": "https://timeagotchi.vercel.app/og-image.png",
  "featureList": [
    "Time tracking",
    "Virtual pet",
    "Weekly productivity reports",
    "CSV export",
    "Pet evolution system"
  ]
}
```

5.2. This enables Google to display **rich results** for searches like "free time tracking app" and "gamified productivity tool".

---

### 6. Semantic Heading Hierarchy (Priority: High)

**Current state**: All visual "headings" are `<div>` elements with pixel-font styling. No `<h1>`–`<h3>` tags exist anywhere in the app.

**Actions**:

6.1. Add a single `<h1>` to `App.tsx` header — visible to crawlers but can be styled to fit the design:
```jsx
<h1 className="font-pixel text-tama-green text-xl">TIMEAGOTCHI</h1>
```

6.2. Replace `<div>` visual headings in tab panels with semantic equivalents styled to match the pixel theme:

| Component | Current | Replace with |
|-----------|---------|-------------|
| `PetDashboard.tsx` – Pet name display | `<div>` | `<h2>` |
| `FeedForm.tsx` – "FEED YOUR PET" label | `<div>` | `<h2>` |
| `HistoryView.tsx` – section titles | `<div>` | `<h2>` / `<h3>` |
| `WeeklyReport.tsx` – report title | `<div>` | `<h2>` |
| `Settings.tsx` – setting group labels | `<div>` | `<h2>` / `<h3>` |
| `EvolutionPanel.tsx` – "EVOLUTION" label | `<div>` | `<h2>` |

6.3. Ensure one `<h1>` per page, with `<h2>` for major sections, `<h3>` for subsections — do not skip levels.

---

### 7. URL Routing & Deep Linking (Priority: High)

**Current state**: All navigation is tab-based React state switching. The URL never changes from `/`. Search engines index only one page.

**Actions**:

7.1. Install and configure **React Router v6**:
```bash
npm install react-router-dom
```

7.2. Define routes mapping each tab to a unique URL path:

| Tab | Route |
|-----|-------|
| Pet Dashboard | `/` (index) |
| Time Log / Feed | `/log` |
| History | `/history` |
| Weekly Report | `/report` |
| Settings | `/settings` |

7.3. Wrap the app in `<BrowserRouter>` and use `<Routes>` / `<Route>` to render each tab's content at its URL.

7.4. Update navigation buttons to use `<Link>` or `<NavLink>` instead of `onClick` state setters — this creates crawlable `<a>` tags:
```jsx
<NavLink to="/log" className={...}>LOG</NavLink>
```

7.5. Add per-route `<title>` and canonical `<link>` updates using a lightweight document-head library such as **react-helmet-async** or the native [Document API](https://developer.mozilla.org/en-US/docs/Web/API/Document).

7.6. Update `vercel.json` to handle client-side routing — redirect all unmatched routes to `index.html`:
```json
{
  "framework": "vite",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

7.7. Update `sitemap.xml` to include all route URLs.

---

### 8. Static Pre-rendering / SSG (Priority: High)

**Current state**: Pure CSR SPA. Search engines receive an empty `<div id="root">` until JavaScript loads and executes.

**Recommended approach**: Pre-render static HTML for each route using **vite-plugin-ssg** (or migrate to **Next.js** for full SSR capability).

**Actions (Option A — vite-plugin-ssg, minimal disruption)**:

8.1. Install:
```bash
npm install vite-plugin-ssg
```

8.2. Configure `vite.config.ts` to enable static generation for each route.

8.3. Export a `includedRoutes` array matching the routes defined in Item 7.

8.4. Each route will generate a pre-rendered HTML file containing the page's content — giving crawlers real HTML without JavaScript dependency.

**Actions (Option B — migrate to Next.js, long-term)**:

8.5. Migrate to Next.js App Router to gain:
- Per-page `<Metadata>` API (replaces react-helmet)
- Static generation (`export const dynamic = 'force-static'`)
- Image optimisation with `next/image`
- Incremental Static Regeneration if data ever becomes dynamic

*Option A is lower risk and effort; Option B is the industry standard for SEO-first React apps.*

---

### 9. Web App Manifest (Priority: Medium)

**Current state**: No `manifest.json` exists. Vite's default does not generate one.

**Actions**:

9.1. Create `public/manifest.json`:
```json
{
  "name": "Timeagotchi",
  "short_name": "Timeagotchi",
  "description": "Gamify your time tracking with a virtual pet",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#1a1a2e",
  "theme_color": "#1a1a2e",
  "orientation": "portrait",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

9.2. Add `<link rel="manifest" href="/manifest.json" />` to `index.html`.

9.3. Create icon assets at 192×192 and 512×512 pixels using the pixel-art pet as the focal point.

9.4. Benefits: PWA installability, improved mobile engagement, Google "install" suggestions in search results.

---

### 10. Accessibility Improvements That Boost SEO (Priority: Medium)

Google uses accessibility signals as ranking factors. Improving ARIA and semantics also benefits SEO.

**Actions**:

10.1. **SVG pet sprite** — Add an accessible label (`aria-label` or `<title>` inside SVG):
```jsx
<svg aria-label={`${petName} the ${petMood} virtual pet`} role="img" ...>
  <title>{petName} – virtual pet</title>
  ...
</svg>
```

10.2. **Navigation tabs** — Add `role="tablist"` / `role="tab"` and `aria-selected` attributes.

10.3. **Form inputs in FeedForm** — Verify all `<label>` elements are correctly associated with `<input>` via `htmlFor`.

10.4. **Health bar** — Add `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`.

10.5. **Colour contrast** — Audit all text against WCAG AA (4.5:1 ratio). The pixel-green-on-dark theme may have contrast issues for smaller text.

10.6. **Skip navigation link** — Add a visually-hidden `<a href="#main-content">Skip to content</a>` as the first element in `<body>`.

---

## Additional Recommendations

### Performance (Core Web Vitals)

Google's Core Web Vitals are a direct ranking factor. While Vercel Analytics tracks these, the following improvements will raise scores:

| Metric | Target | Recommendation |
|--------|--------|----------------|
| LCP (Largest Contentful Paint) | < 2.5s | Pre-render with SSG; preload critical CSS/fonts |
| CLS (Cumulative Layout Shift) | < 0.1 | Reserve space for font loading; avoid dynamic class injection |
| INP (Interaction to Next Paint) | < 200ms | Already fast; ensure no heavy calculations block main thread |
| FID / TBT | < 50ms | Reduce main-thread blocking during initial load |

- Add `<link rel="preload" as="style" href="...">` for the pixel font.
- Add `font-display: swap` in the Google Fonts URL to prevent FOIT.

### Google Search Console

- Verify the domain in **Google Search Console** after deployment.
- Submit `sitemap.xml` via the Search Console interface.
- Monitor the Coverage and Core Web Vitals reports weekly.

### Keyword Strategy

Target keywords to incorporate into copy, headings, and meta tags:

| Primary Keywords | Secondary Keywords |
|-----------------|-------------------|
| gamified time tracking | virtual pet productivity |
| time tracking app | tamagotchi work hours |
| productivity game | grow pet by working |
| free time tracker | browser time log |

### Content Marketing (Long-term)

Since the current app has no blog or content pages, consider adding:
- A `/about` page describing the concept and how it works
- A landing page with feature descriptions, screenshots, and a clear CTA
- FAQ section structured with `FAQPage` JSON-LD schema to target zero-click searches

---

## Implementation Priority Roadmap

| Phase | Item | Effort | SEO Impact |
|-------|------|--------|-----------|
| **Phase 1** (Week 1) | Meta tags & OG image | Low | Critical |
| **Phase 1** (Week 1) | `robots.txt` | Trivial | Critical |
| **Phase 1** (Week 1) | `sitemap.xml` | Trivial | Critical |
| **Phase 1** (Week 1) | `lang` attribute | Trivial | Medium |
| **Phase 2** (Week 2) | JSON-LD structured data | Low | High |
| **Phase 2** (Week 2) | Semantic headings (`h1`–`h3`) | Low | High |
| **Phase 2** (Week 2) | Web app manifest | Low | Medium |
| **Phase 2** (Week 2) | Accessibility (ARIA) | Medium | Medium |
| **Phase 3** (Week 3–4) | React Router + deep links | Medium | High |
| **Phase 3** (Week 3–4) | Per-route meta tags | Medium | High |
| **Phase 4** (Month 2) | Static pre-rendering (SSG) | High | High |
| **Phase 4** (Month 2) | Core Web Vitals tuning | Medium | Medium |
| **Phase 5** (Month 3+) | Landing page / content | High | High (long-term) |

---

## Files to Create / Modify

| Action | File |
|--------|------|
| Modify | `index.html` — meta tags, OG, JSON-LD, lang, manifest link |
| Create | `public/robots.txt` |
| Create | `public/sitemap.xml` |
| Create | `public/manifest.json` |
| Create | `public/og-image.png` (1200×630) |
| Create | `public/icon-192.png` |
| Create | `public/icon-512.png` |
| Modify | `src/App.tsx` — add `<h1>`, React Router, NavLink navigation |
| Modify | `src/main.tsx` — wrap with `BrowserRouter` |
| Modify | `src/components/Pet/PetSprite.tsx` — add `aria-label` to SVG |
| Modify | `src/components/Pet/HealthBar.tsx` — add `role="progressbar"` |
| Modify | `src/components/*.tsx` — replace `<div>` headings with `<h2>`/`<h3>` |
| Modify | `vercel.json` — add SPA rewrite rules |
| Install | `react-router-dom`, `react-helmet-async` (or `vite-plugin-ssg`) |

---

*End of SEO Improvement Plan*
