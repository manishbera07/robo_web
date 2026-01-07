"use client"

import type * as React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

type Theme = "cyber" | "stealth"

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  accentColor: string
  secondaryColor: string
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("cyber")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("robotics-club-theme") as Theme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("robotics-club-theme", theme)
      const root = document.documentElement
      if (theme === "cyber") {
        root.style.setProperty("--background", "#030303")
        root.style.setProperty("--primary", "#f5a623")
        root.style.setProperty("--secondary", "#00ff88")
        root.style.setProperty("--foreground", "#f0f0f0")
      } else {
        root.style.setProperty("--background", "#0a0a0a")
        root.style.setProperty("--primary", "#ffffff")
        root.style.setProperty("--secondary", "#666666")
        root.style.setProperty("--foreground", "#e0e0e0")
      }
    }
  }, [theme, mounted])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "cyber" ? "stealth" : "cyber"))
  }, [])

  const accentColor = theme === "cyber" ? "#f5a623" : "#ffffff"
  const secondaryColor = theme === "cyber" ? "#00ff88" : "#666666"

  if (!mounted) {
    return <div className="min-h-screen bg-[#030303]" />
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, accentColor, secondaryColor }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
