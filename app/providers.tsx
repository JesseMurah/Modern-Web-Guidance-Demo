"use client"

import { useEffect } from "react"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    async function loadPolyfills() {
      if (!("anchorName" in document.documentElement.style)) {
        await import("@oddbird/css-anchor-positioning")
      }
      if (!HTMLElement.prototype.hasOwnProperty("popover")) {
        await import("@oddbird/popover-polyfill")
      }
      if (!(HTMLButtonElement.prototype as unknown as Record<string, unknown>)["interestForElement"]) {
        await import("interestfor")
      }
    }
    loadPolyfills()
  }, [])
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  )
}
