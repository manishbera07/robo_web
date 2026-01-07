"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { Play, RotateCcw, Brain } from "lucide-react"

interface MemoryMatrixProps {
  onScoreUpdate: (score: number) => void
}

export function MemoryMatrix({ onScoreUpdate }: MemoryMatrixProps) {
  const { accentColor, secondaryColor } = useTheme()
  const [gameState, setGameState] = useState<"idle" | "showing" | "playing" | "gameover">("idle")
  const [gridSize, setGridSize] = useState(3)
  const [pattern, setPattern] = useState<number[]>([])
  const [playerPattern, setPlayerPattern] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [showingIndex, setShowingIndex] = useState(-1)

  const totalCells = gridSize * gridSize
  const patternLength = Math.min(level + 2, Math.floor(totalCells * 0.6))

  const generatePattern = useCallback(() => {
    const newPattern: number[] = []
    while (newPattern.length < patternLength) {
      const cell = Math.floor(Math.random() * totalCells)
      if (!newPattern.includes(cell)) {
        newPattern.push(cell)
      }
    }
    return newPattern
  }, [patternLength, totalCells])

  const startGame = () => {
    setScore(0)
    setLevel(1)
    setGridSize(3)
    startRound()
  }

  const startRound = useCallback(() => {
    const newPattern = generatePattern()
    setPattern(newPattern)
    setPlayerPattern([])
    setGameState("showing")

    // Show pattern one by one
    newPattern.forEach((_, index) => {
      setTimeout(() => {
        setShowingIndex(index)
      }, index * 600)
    })

    // After showing all, switch to playing
    setTimeout(
      () => {
        setShowingIndex(-1)
        setGameState("playing")
      },
      newPattern.length * 600 + 500,
    )
  }, [generatePattern])

  const handleCellClick = (index: number) => {
    if (gameState !== "playing") return

    const newPlayerPattern = [...playerPattern, index]
    setPlayerPattern(newPlayerPattern)

    // Check if correct
    if (!pattern.includes(index)) {
      // Wrong - game over
      setGameState("gameover")
      onScoreUpdate(score)
      return
    }

    // Check if completed pattern
    if (newPlayerPattern.length === pattern.length) {
      const newScore = score + level * 100
      setScore(newScore)

      // Level up
      const newLevel = level + 1
      setLevel(newLevel)

      // Increase grid size every 3 levels
      if (newLevel % 3 === 0 && gridSize < 6) {
        setGridSize((prev) => prev + 1)
      }

      // Start next round after delay
      setTimeout(() => {
        startRound()
      }, 1000)
    }
  }

  useEffect(() => {
    if (gameState === "showing" && pattern.length > 0) {
      startRound()
    }
  }, [gridSize])

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs uppercase tracking-widest mb-4"
          style={{ color: secondaryColor }}
        >
          <Brain size={16} />
          Memory Training
        </motion.div>
        <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}>
          MEMORY MATRIX
        </h2>
        <p className="text-sm opacity-50">Remember the pattern and recreate it</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: accentColor }}>
            {score}
          </p>
          <p className="text-xs uppercase opacity-50">Score</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: secondaryColor }}>
            {level}
          </p>
          <p className="text-xs uppercase opacity-50">Level</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: accentColor }}>
            {gridSize}x{gridSize}
          </p>
          <p className="text-xs uppercase opacity-50">Grid</p>
        </div>
      </div>

      {/* Game Grid */}
      <motion.div className="glass rounded-3xl p-6 relative" layout>
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}>
          {Array.from({ length: totalCells }).map((_, index) => {
            const isInPattern = pattern.includes(index)
            const isShowing = gameState === "showing" && pattern.indexOf(index) <= showingIndex && isInPattern
            const isSelected = playerPattern.includes(index)
            const isCorrect = isSelected && isInPattern
            const isWrong = isSelected && !isInPattern

            return (
              <motion.button
                key={index}
                className="aspect-square rounded-xl relative overflow-hidden"
                style={{
                  background:
                    isShowing || isCorrect
                      ? `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`
                      : isWrong
                        ? "#ff4444"
                        : "rgba(255,255,255,0.05)",
                  border: `2px solid ${isShowing || isCorrect ? accentColor : "rgba(255,255,255,0.1)"}`,
                }}
                onClick={() => handleCellClick(index)}
                disabled={gameState !== "playing"}
                whileHover={gameState === "playing" ? { scale: 1.05 } : {}}
                whileTap={gameState === "playing" ? { scale: 0.95 } : {}}
                animate={{
                  boxShadow: isShowing ? `0 0 30px ${accentColor}60` : "none",
                }}
              />
            )
          })}
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
              className="absolute inset-x-0 bottom-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-sm uppercase tracking-wider" style={{ color: secondaryColor }}>
                Memorize the pattern...
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
                <p className="text-sm opacity-50 mb-6">Final Score - Level {level}</p>
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

      {/* Instructions */}
      {gameState === "playing" && (
        <motion.p className="text-center text-sm opacity-50 mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Click all the cells that lit up ({playerPattern.length}/{pattern.length})
        </motion.p>
      )}
    </div>
  )
}
