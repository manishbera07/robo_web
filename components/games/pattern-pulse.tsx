"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { Play, RotateCcw, Music } from "lucide-react"

interface PatternPulseProps {
  onScoreUpdate: (score: number) => void
}

const COLORS = ["#ff4444", "#00ff88", "#ffaa00", "#44aaff"]

export function PatternPulse({ onScoreUpdate }: PatternPulseProps) {
  const { accentColor, secondaryColor } = useTheme()
  const [gameState, setGameState] = useState<"idle" | "showing" | "playing" | "gameover">("idle")
  const [pattern, setPattern] = useState<number[]>([])
  const [playerIndex, setPlayerIndex] = useState(0)
  const [activeButton, setActiveButton] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const audioContextRef = useRef<AudioContext | null>(null)

  const playTone = useCallback((index: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext()
    }

    const ctx = audioContextRef.current
    const oscillator = ctx.createOscillator()
    const gainNode = ctx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(ctx.destination)

    const frequencies = [261.63, 329.63, 392.0, 523.25] // C4, E4, G4, C5
    oscillator.frequency.value = frequencies[index]
    oscillator.type = "sine"

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)

    oscillator.start(ctx.currentTime)
    oscillator.stop(ctx.currentTime + 0.3)
  }, [])

  const flashButton = useCallback(
    (index: number, duration = 300) => {
      setActiveButton(index)
      playTone(index)
      setTimeout(() => setActiveButton(null), duration)
    },
    [playTone],
  )

  const showPattern = useCallback(async () => {
    setGameState("showing")

    for (let i = 0; i < pattern.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 600))
      flashButton(pattern[i], 400)
    }

    await new Promise((resolve) => setTimeout(resolve, 500))
    setGameState("playing")
    setPlayerIndex(0)
  }, [pattern, flashButton])

  const startGame = () => {
    const firstStep = Math.floor(Math.random() * 4)
    setPattern([firstStep])
    setScore(0)
    setPlayerIndex(0)
  }

  const addToPattern = useCallback(() => {
    const nextStep = Math.floor(Math.random() * 4)
    setPattern((prev) => [...prev, nextStep])
  }, [])

  useEffect(() => {
    if (pattern.length > 0 && gameState !== "gameover") {
      showPattern()
    }
  }, [pattern.length])

  const handleButtonClick = (index: number) => {
    if (gameState !== "playing") return

    flashButton(index, 200)

    if (index !== pattern[playerIndex]) {
      // Wrong - game over
      setGameState("gameover")
      onScoreUpdate(score)
      return
    }

    const nextIndex = playerIndex + 1
    setPlayerIndex(nextIndex)

    if (nextIndex === pattern.length) {
      // Completed pattern - add new step
      const newScore = score + pattern.length * 10
      setScore(newScore)

      setTimeout(() => {
        addToPattern()
      }, 1000)
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
          <Music size={16} />
          Sequence Memory
        </motion.div>
        <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}>
          PATTERN PULSE
        </h2>
        <p className="text-sm opacity-50">Watch the sequence and repeat it</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: accentColor }}>
            {score}
          </p>
          <p className="text-xs uppercase opacity-50">Score</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: secondaryColor }}>
            {pattern.length}
          </p>
          <p className="text-xs uppercase opacity-50">Level</p>
        </div>
      </div>

      {/* Game Area */}
      <motion.div className="glass rounded-3xl p-8 relative">
        <div className="grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((index) => (
            <motion.button
              key={index}
              className="aspect-square rounded-2xl relative overflow-hidden"
              style={{
                background: activeButton === index ? COLORS[index] : `${COLORS[index]}30`,
                boxShadow: activeButton === index ? `0 0 40px ${COLORS[index]}` : "none",
              }}
              onClick={() => handleButtonClick(index)}
              disabled={gameState !== "playing"}
              whileHover={gameState === "playing" ? { scale: 1.02 } : {}}
              whileTap={gameState === "playing" ? { scale: 0.95 } : {}}
              animate={{
                opacity: gameState === "playing" ? 1 : 0.7,
              }}
            />
          ))}
        </div>

        {/* Game States */}
        <AnimatePresence>
          {gameState === "idle" && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center rounded-3xl"
              style={{ background: "rgba(3,3,3,0.9)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                onClick={startGame}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
                  color: "#030303",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play size={20} />
                START GAME
              </motion.button>
            </motion.div>
          )}

          {gameState === "showing" && (
            <motion.div
              className="absolute inset-x-0 bottom-4 text-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-sm uppercase tracking-wider" style={{ color: secondaryColor }}>
                Watch carefully...
              </p>
            </motion.div>
          )}

          {gameState === "gameover" && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center rounded-3xl"
              style={{ background: "rgba(3,3,3,0.95)" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="text-center">
                <h3
                  className="text-3xl font-bold mb-2"
                  style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}
                >
                  GAME OVER
                </h3>
                <p className="text-4xl font-bold mb-2" style={{ color: secondaryColor }}>
                  {score}
                </p>
                <p className="text-sm opacity-50 mb-6">Reached level {pattern.length}</p>
                <motion.button
                  onClick={startGame}
                  className="flex items-center gap-3 px-6 py-3 rounded-xl font-bold mx-auto"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
                    color: "#030303",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <RotateCcw size={18} />
                  Play Again
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Progress */}
      {gameState === "playing" && (
        <motion.div className="mt-6 glass rounded-xl p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider opacity-50">Progress</span>
            <span className="text-sm" style={{ color: accentColor }}>
              {playerIndex}/{pattern.length}
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${secondaryColor}, ${accentColor})` }}
              animate={{ width: `${(playerIndex / pattern.length) * 100}%` }}
            />
          </div>
        </motion.div>
      )}
    </div>
  )
}
