"use client"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { Play, RotateCcw, Zap } from "lucide-react"

interface ReactionTestProps {
  onScoreUpdate: (score: number) => void
}

type GameState = "idle" | "waiting" | "ready" | "clicked" | "too-early"

export function ReactionTest({ onScoreUpdate }: ReactionTestProps) {
  const { accentColor, secondaryColor } = useTheme()
  const [gameState, setGameState] = useState<GameState>("idle")
  const [reactionTime, setReactionTime] = useState<number | null>(null)
  const [attempts, setAttempts] = useState<number[]>([])
  const [round, setRound] = useState(0)
  const startTimeRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const maxRounds = 5

  const startRound = () => {
    setGameState("waiting")
    setReactionTime(null)

    // Random delay between 1.5 and 5 seconds
    const delay = 1500 + Math.random() * 3500

    timeoutRef.current = setTimeout(() => {
      setGameState("ready")
      startTimeRef.current = performance.now()
    }, delay)
  }

  const handleClick = () => {
    if (gameState === "idle") {
      setAttempts([])
      setRound(1)
      startRound()
      return
    }

    if (gameState === "waiting") {
      // Clicked too early
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setGameState("too-early")
      return
    }

    if (gameState === "ready") {
      const time = Math.round(performance.now() - startTimeRef.current)
      setReactionTime(time)
      setGameState("clicked")

      const newAttempts = [...attempts, time]
      setAttempts(newAttempts)

      if (newAttempts.length >= maxRounds) {
        // Calculate average (lower is better, so we invert for score)
        const avg = newAttempts.reduce((a, b) => a + b, 0) / newAttempts.length
        const score = Math.max(0, Math.round(1000 - avg))
        onScoreUpdate(score)
      }
    }

    if (gameState === "clicked" || gameState === "too-early") {
      if (round < maxRounds) {
        setRound((r) => r + 1)
        startRound()
      } else {
        setGameState("idle")
      }
    }
  }

  const averageTime = attempts.length > 0 ? Math.round(attempts.reduce((a, b) => a + b, 0) / attempts.length) : null

  const getBackgroundColor = () => {
    switch (gameState) {
      case "waiting":
        return "#ff4444"
      case "ready":
        return "#00ff88"
      case "too-early":
        return "#ffaa00"
      default:
        return "rgba(255,255,255,0.05)"
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs uppercase tracking-widest mb-4"
          style={{ color: secondaryColor }}
        >
          <Zap size={16} />
          Reflex Training
        </motion.div>
        <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}>
          REACTION TEST
        </h2>
        <p className="text-sm opacity-50">Click as fast as you can when it turns green</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: accentColor }}>
            {round}/{maxRounds}
          </p>
          <p className="text-xs uppercase opacity-50">Round</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: secondaryColor }}>
            {reactionTime ? `${reactionTime}ms` : "-"}
          </p>
          <p className="text-xs uppercase opacity-50">Last</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: accentColor }}>
            {averageTime ? `${averageTime}ms` : "-"}
          </p>
          <p className="text-xs uppercase opacity-50">Average</p>
        </div>
      </div>

      {/* Game Area */}
      <motion.div
        className="rounded-3xl h-80 flex items-center justify-center cursor-pointer select-none overflow-hidden relative"
        style={{ background: getBackgroundColor() }}
        onClick={handleClick}
        whileTap={{ scale: 0.98 }}
        animate={{
          background: getBackgroundColor(),
        }}
        transition={{ duration: 0.1 }}
      >
        <AnimatePresence mode="wait">
          {gameState === "idle" && (
            <motion.div
              key="idle"
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {attempts.length >= maxRounds ? (
                <>
                  <h3 className="text-4xl font-bold mb-2" style={{ color: accentColor }}>
                    {averageTime}ms
                  </h3>
                  <p className="text-sm opacity-60 mb-4">Average Reaction Time</p>
                  <div className="flex items-center justify-center gap-2">
                    <RotateCcw size={18} style={{ color: accentColor }} />
                    <span style={{ color: accentColor }}>Click to try again</span>
                  </div>
                </>
              ) : (
                <>
                  <Play size={48} style={{ color: accentColor }} className="mx-auto mb-4" />
                  <p className="text-lg font-bold" style={{ color: accentColor }}>
                    Click to Start
                  </p>
                </>
              )}
            </motion.div>
          )}

          {gameState === "waiting" && (
            <motion.div
              key="waiting"
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-2xl font-bold text-white">Wait for green...</p>
            </motion.div>
          )}

          {gameState === "ready" && (
            <motion.div
              key="ready"
              className="text-center"
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-4xl font-bold text-background">CLICK NOW!</p>
            </motion.div>
          )}

          {gameState === "clicked" && (
            <motion.div
              key="clicked"
              className="text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-5xl font-bold mb-2" style={{ color: accentColor }}>
                {reactionTime}ms
              </p>
              <p className="text-sm opacity-60">{round < maxRounds ? "Click to continue" : "Click to see results"}</p>
            </motion.div>
          )}

          {gameState === "too-early" && (
            <motion.div
              key="too-early"
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <p className="text-3xl font-bold text-background mb-2">Too Early!</p>
              <p className="text-sm text-background/70">Click to try again</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Attempt History */}
      {attempts.length > 0 && (
        <motion.div
          className="mt-6 glass rounded-xl p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs uppercase tracking-wider opacity-50 mb-3">Attempts</p>
          <div className="flex gap-2 flex-wrap">
            {attempts.map((time, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-lg text-sm"
                style={{
                  background:
                    time < 250 ? `${secondaryColor}20` : time < 350 ? `${accentColor}20` : "rgba(255,68,68,0.2)",
                  color: time < 250 ? secondaryColor : time < 350 ? accentColor : "#ff4444",
                }}
              >
                {time}ms
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
