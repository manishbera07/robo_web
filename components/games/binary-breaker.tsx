"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { Play, RotateCcw, Binary } from "lucide-react"

interface BinaryBreakerProps {
  onScoreUpdate: (score: number) => void
}

export function BinaryBreaker({ onScoreUpdate }: BinaryBreakerProps) {
  const { accentColor, secondaryColor } = useTheme()
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle")
  const [currentNumber, setCurrentNumber] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null)
  const [maxNumber, setMaxNumber] = useState(15) // Start with 4-bit numbers

  const generateNumber = useCallback(() => {
    const num = Math.floor(Math.random() * maxNumber) + 1
    setCurrentNumber(num)
    setUserInput("")
  }, [maxNumber])

  const startGame = () => {
    setScore(0)
    setStreak(0)
    setTimeLeft(60)
    setMaxNumber(15)
    setGameState("playing")
    generateNumber()
  }

  // Timer
  useEffect(() => {
    if (gameState !== "playing") return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("gameover")
          onScoreUpdate(score)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState, score, onScoreUpdate])

  const checkAnswer = () => {
    const correctAnswer = currentNumber.toString(2)

    if (userInput === correctAnswer) {
      // Correct
      const points = 10 + streak * 5 + Math.floor((maxNumber - 15) / 10) * 5
      setScore((prev) => prev + points)
      setStreak((prev) => prev + 1)
      setFeedback("correct")

      // Increase difficulty every 5 correct answers
      if ((streak + 1) % 5 === 0) {
        setMaxNumber((prev) => Math.min(prev * 2, 255))
      }

      setTimeout(() => {
        setFeedback(null)
        generateNumber()
      }, 500)
    } else {
      // Wrong
      setStreak(0)
      setFeedback("wrong")
      setTimeout(() => {
        setFeedback(null)
      }, 500)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      checkAnswer()
    }
  }

  const toggleBit = (position: number) => {
    const bits = userInput.padStart(8, "0").split("")
    const index = 7 - position
    bits[index] = bits[index] === "1" ? "0" : "1"
    setUserInput(bits.join("").replace(/^0+/, "") || "0")
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs uppercase tracking-widest mb-4"
          style={{ color: secondaryColor }}
        >
          <Binary size={16} />
          Binary Training
        </motion.div>
        <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}>
          BINARY BREAKER
        </h2>
        <p className="text-sm opacity-50">Convert decimal to binary as fast as you can</p>
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
            {streak}
          </p>
          <p className="text-xs uppercase opacity-50">Streak</p>
        </div>
        <div className="glass rounded-xl p-4 text-center">
          <p className="text-2xl font-bold" style={{ color: timeLeft <= 10 ? "#ff4444" : accentColor }}>
            {timeLeft}s
          </p>
          <p className="text-xs uppercase opacity-50">Time</p>
        </div>
      </div>

      {/* Game Area */}
      <motion.div
        className="glass rounded-3xl p-8 relative"
        animate={{
          borderColor: feedback === "correct" ? "#00ff88" : feedback === "wrong" ? "#ff4444" : "transparent",
          boxShadow:
            feedback === "correct"
              ? "0 0 30px rgba(0,255,136,0.3)"
              : feedback === "wrong"
                ? "0 0 30px rgba(255,68,68,0.3)"
                : "none",
        }}
        transition={{ duration: 0.2 }}
        style={{ border: "2px solid transparent" }}
      >
        <AnimatePresence mode="wait">
          {gameState === "idle" && (
            <motion.div
              key="idle"
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                onClick={startGame}
                className="flex items-center gap-3 px-8 py-4 rounded-2xl font-bold mx-auto"
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

          {gameState === "playing" && (
            <motion.div key="playing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Decimal Number */}
              <div className="text-center mb-8">
                <p className="text-xs uppercase tracking-wider opacity-50 mb-2">Convert to binary</p>
                <motion.p
                  key={currentNumber}
                  className="text-6xl font-bold"
                  style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {currentNumber}
                </motion.p>
              </div>

              {/* Bit Toggles */}
              <div className="flex justify-center gap-2 mb-6">
                {[7, 6, 5, 4, 3, 2, 1, 0].map((pos) => {
                  const bit = userInput.padStart(8, "0")[7 - pos]
                  return (
                    <motion.button
                      key={pos}
                      onClick={() => toggleBit(pos)}
                      className="w-10 h-14 rounded-lg flex flex-col items-center justify-center"
                      style={{
                        background: bit === "1" ? `${accentColor}30` : "rgba(255,255,255,0.05)",
                        border: `2px solid ${bit === "1" ? accentColor : "rgba(255,255,255,0.1)"}`,
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="text-lg font-bold" style={{ color: bit === "1" ? accentColor : "inherit" }}>
                        {bit || "0"}
                      </span>
                      <span className="text-xs opacity-40">{Math.pow(2, pos)}</span>
                    </motion.button>
                  )
                })}
              </div>

              {/* Text Input */}
              <div className="flex gap-3">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value.replace(/[^01]/g, ""))}
                  onKeyDown={handleKeyDown}
                  placeholder="Enter binary..."
                  className="flex-1 px-4 py-3 rounded-xl text-center text-xl font-mono"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: `1px solid ${accentColor}30`,
                  }}
                  autoFocus
                />
                <motion.button
                  onClick={checkAnswer}
                  className="px-6 py-3 rounded-xl font-bold"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
                    color: "#030303",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Check
                </motion.button>
              </div>
            </motion.div>
          )}

          {gameState === "gameover" && (
            <motion.div
              key="gameover"
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3
                className="text-3xl font-bold mb-2"
                style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}
              >
                TIME'S UP!
              </h3>
              <p className="text-5xl font-bold mb-2" style={{ color: secondaryColor }}>
                {score}
              </p>
              <p className="text-sm opacity-50 mb-6">Final Score</p>
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
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Hint */}
      {gameState === "playing" && (
        <motion.p className="text-center text-xs opacity-40 mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Tip: Click the bit toggles or type directly. Press Enter to submit.
        </motion.p>
      )}
    </div>
  )
}
