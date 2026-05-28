# App Production-Ready Design

**Date:** 2026-05-28  
**Status:** Approved

## Goal

Make `demo-mwg/app/` production-ready. The dashboard components are already wired up in `app/dashboard/page.tsx`. This spec covers the missing shell infrastructure: root routing, layout providers, dark mode, a loading skeleton, and a 404 page.

## Files Changed

| File | Action |
|---|---|
| `app/page.tsx` | Replace default template with redirect to `/dashboard` |
| `app/layout.tsx` | Add `ThemeProvider`, `Toaster`, update `metadata` |
| `components/site-header.tsx` | Add Sun/Moon dark mode toggle on the far right |
| `app/dashboard/loading.tsx` | New — faithful skeleton matching dashboard layout |
| `app/not-found.tsx` | New — minimal centered 404 with link to dashboard |

## Detailed Design

### `app/page.tsx`

Replace the default Next.js template with a redirect to `/dashboard`. Use Next.js navigation's `redirect()` — no client component needed, no visible page content.

### `app/layout.tsx`

Three additions:

1. **`ThemeProvider`** from `next-themes` wraps `{children}`. Config: `attribute="class"`, `defaultTheme="system"`, `enableSystem`. This sets `class="dark"` on `<html>` — the existing `globals.css` already has a `.dark` variant block, so no CSS changes needed.
2. **`<Toaster />`** from `sonner` placed inside the body, sibling to `ThemeProvider`'s children. Use `theme="system"` so toasts match the active theme automatically.
3. **`metadata`** export updated with a real `title` ("Documents") and `description`.

### `components/site-header.tsx`

Becomes a `"use client"` component. Adds a `Button` (variant `ghost`, size `icon`) flush to the right side of the header using `ml-auto`. Uses `useTheme()` from `next-themes` to read the resolved theme and toggle between `"light"` / `"dark"`. Renders a `Sun` icon when in dark mode, `Moon` icon in light mode (both from `lucide-react`, already a project dependency).

The toggle calls `setTheme()` on click. No additional state needed.

### `app/dashboard/loading.tsx`

New file. Uses shadcn's `Skeleton` component (`components/ui/skeleton.tsx` — already present). Renders in the same content area padding/spacing as the real dashboard to prevent layout shift on hydration:

- **Row 1:** 4-column grid of card skeletons (`h-32` each), matching `SectionCards`
- **Row 2:** Single wide chart skeleton (`h-64`), matching `ChartAreaInteractive`
- **Row 3:** Table header bar skeleton (`h-10`)
- **Row 4:** 5 table row skeletons (`h-8` each), matching `DataTable`

No `"use client"` needed — `Skeleton` is a pure CSS component.

### `app/not-found.tsx`

New file. Full-height centered layout (`min-h-screen flex flex-col items-center justify-center`). Content:

- Large muted "404" heading (`text-8xl font-bold text-muted-foreground`)
- "Page not found" subtitle (`text-muted-foreground`)
- A `Button` (default variant) wrapping a `<Link href="/dashboard">` — "Go to Dashboard"

No sidebar dependency. Standalone page using the root layout.

## Non-Goals

- No new routes beyond what's listed
- No error boundary (`app/error.tsx`) — deferred until data-fetching boundaries exist
- No changes to dashboard content or components

## Implementation Notes

- `AGENTS.md` flags this Next.js version (16.2.6) has breaking API changes from standard Next.js. Before writing redirect/metadata/loading code, check `node_modules/next/dist/docs/` for the correct APIs.
- `ThemeProvider` must be inside a `"use client"` boundary. Wrap it in a thin `providers.tsx` client component if `layout.tsx` needs to stay a server component.
