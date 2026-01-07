"use client"

import { useState, useCallback } from "react"
import { BootSequence } from "@/components/boot-sequence"
import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { MissionGrid } from "@/components/mission-grid"
import { ParticleNetwork } from "@/components/particle-network"
import { RobotWatcher } from "@/components/robot-watcher"
import { Footer } from "@/components/footer"

export default function Home() {
  const [isBooting, setIsBooting] = useState(true)

  const handleBootComplete = useCallback(() => {
    setIsBooting(false)
  }, [])

  return (
    <>
      {isBooting && <BootSequence onComplete={handleBootComplete} />}
      {!isBooting && (
        <div className="relative min-h-screen overflow-x-hidden">
          {/* Background effects */}
          <div className="noise-overlay" />
          <div className="scan-line" />
          <ParticleNetwork />

          {/* Content */}
          <Navbar />
          <main className="relative z-10">
            <HeroSection />
            <MissionGrid />
          </main>
          <Footer />
          <RobotWatcher />
        </div>
      )}
    </>
  )
}
