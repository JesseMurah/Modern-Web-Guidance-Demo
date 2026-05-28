# App Production-Ready Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire up the app shell so it is production-ready: root redirects to `/dashboard`, layout has theme + toast providers, the header has a dark mode toggle, the dashboard shows a skeleton while loading, and unmatched routes show a custom 404.

**Architecture:** Six files are touched. A new `app/providers.tsx` client component owns `ThemeProvider` + `Toaster`, keeping `layout.tsx` as a server component so its `metadata` export keeps working. The remaining changes are additive: `site-header.tsx` gains a `useTheme` toggle, and two new Next.js file-convention files (`loading.tsx`, `not-found.tsx`) handle loading and 404 states.

**Tech Stack:** Next.js 16 App Router, React 19, next-themes, sonner, lucide-react, shadcn `Skeleton` component, TypeScript

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `app/page.tsx` | Replace | Redirect root to `/dashboard` |
| `app/providers.tsx` | Create | `"use client"` wrapper: `ThemeProvider` + `Toaster` |
| `app/layout.tsx` | Modify | Import `<Providers>`, update `metadata` |
| `components/site-header.tsx` | Modify | Add `"use client"`, Sun/Moon toggle button |
| `app/dashboard/loading.tsx` | Create | Faithful skeleton matching dashboard layout |
| `app/not-found.tsx` | Create | Minimal centered 404 with link to dashboard |

---

## Task 1: Replace root page with redirect

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
import { redirect } from "next/navigation"

export default function Home() {
  redirect("/dashboard")
}
```

- [ ] **Step 2: Type-check**

```bash
cd /path/to/demo-mwg && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat: redirect root to /dashboard"
```

---

## Task 2: Create providers client component

**Files:**
- Create: `app/providers.tsx`

- [ ] **Step 1: Create the file**

```tsx
"use client"

import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <Toaster />
    </ThemeProvider>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add app/providers.tsx
git commit -m "feat: add Providers client component with ThemeProvider and Toaster"
```

---

## Task 3: Update root layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Update the file**

Replace the existing contents with:

```tsx
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Documents",
  description: "Document management dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

> **Note:** `suppressHydrationWarning` on `<html>` is required because `next-themes` adds `class` and `style` attributes to `<html>` on the client, which causes a hydration mismatch warning without it.

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: add Providers to root layout, update metadata"
```

---

## Task 4: Add dark mode toggle to site header

**Files:**
- Modify: `components/site-header.tsx`

- [ ] **Step 1: Replace the file contents**

```tsx
"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Documents</h1>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Toggle dark mode"
        >
          {resolvedTheme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add components/site-header.tsx
git commit -m "feat: add dark mode toggle to site header"
```

---

## Task 5: Create dashboard loading skeleton

**Files:**
- Create: `app/dashboard/loading.tsx`

The `Skeleton` component is already at `components/ui/skeleton.tsx` — it uses `animate-pulse` and `bg-muted`.

- [ ] **Step 1: Create the file**

```tsx
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Section cards */}
          <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 lg:px-6">
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
          {/* Chart */}
          <div className="px-4 lg:px-6">
            <Skeleton className="h-64 rounded-xl" />
          </div>
          {/* Table */}
          <div className="px-4 lg:px-6">
            <Skeleton className="mb-3 h-10 rounded-xl" />
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 rounded-lg" />
              <Skeleton className="h-8 rounded-lg" />
              <Skeleton className="h-8 rounded-lg" />
              <Skeleton className="h-8 rounded-lg" />
              <Skeleton className="h-8 rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/loading.tsx
git commit -m "feat: add faithful loading skeleton for dashboard route"
```

---

## Task 6: Create custom 404 page

**Files:**
- Create: `app/not-found.tsx`

- [ ] **Step 1: Create the file**

```tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-8xl font-bold text-muted-foreground">404</h1>
      <p className="text-muted-foreground">Page not found</p>
      <Button asChild>
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  )
}
```

- [ ] **Step 2: Type-check**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add app/not-found.tsx
git commit -m "feat: add custom 404 page"
```

---

## Task 7: Build verification

- [ ] **Step 1: Run the production build**

```bash
npm run build
```

Expected: Build completes with no errors. Output shows routes for `/`, `/dashboard`, plus the `not-found` and `loading` files.

- [ ] **Step 2: Smoke-test the dev server**

```bash
npm run dev
```

Check these manually:
- `http://localhost:3000` → redirects to `/dashboard`
- `http://localhost:3000/dashboard` → dashboard loads, skeleton visible briefly
- `http://localhost:3000/nonexistent` → custom 404 page
- Dark mode toggle in header switches theme and persists on reload
- Toast notifications (triggered from the data table save actions) respect the active theme

- [ ] **Step 3: Final commit if any lint fixes needed**

```bash
npm run lint
# fix any lint issues, then:
git add -A
git commit -m "chore: fix lint warnings from production-ready changes"
```
