"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ParticleNetwork } from "@/components/particle-network"
import { RobotWatcher } from "@/components/robot-watcher"
import { Gamepad2, Trophy, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

// Game Components
import { MemoryMatrix } from "@/components/games/memory-matrix"
import { ReactionTest } from "@/components/games/reaction-test"
import { PatternPulse } from "@/components/games/pattern-pulse"
import { BinaryBreaker } from "@/components/games/binary-breaker"

type GameType = "menu" | "memory-matrix" | "reaction-test" | "pattern-pulse" | "binary-breaker"

const games = [
  {
    id: "memory-matrix" as GameType,
    name: "Memory Matrix",
    description: "Remember and recreate the pattern. Test your visual memory with increasing difficulty.",
    icon: "🧠",
    color: "#00ff88",
    difficulty: "Medium",
  },
  {
    id: "reaction-test" as GameType,
    name: "Reaction Test",
    description: "Test your reflexes! Click as fast as possible when the screen turns green.",
    icon: "⚡",
    color: "#ffaa00",
    difficulty: "Easy",
  },
  {
    id: "pattern-pulse" as GameType,
    name: "Pattern Pulse",
    description: "Follow the sequence of lights and sounds. How long can you remember?",
    icon: "🎵",
    color: "#ff4488",
    difficulty: "Hard",
  },
  {
    id: "binary-breaker" as GameType,
    name: "Binary Breaker",
    description: "Convert decimal numbers to binary before time runs out. Perfect for coders!",
    icon: "💻",
    color: "#44aaff",
    difficulty: "Expert",
  },
]

export default function ArcadePage() {
  const { accentColor, secondaryColor } = useTheme()
  const [currentGame, setCurrentGame] = useState<GameType>("menu")
  const [highScores, setHighScores] = useState<Record<string, number>>({})
  const supabase = createClient()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getUser()
  }, [])

  const updateHighScore = async (gameId: string, score: number) => {
    setHighScores((prev) => ({
      ...prev,
      [gameId]: Math.max(prev[gameId] || 0, score),
    }))

    // Save to database if user is logged in
    if (userId) {
      try {
        await supabase.from('game_scores').insert({
          user_id: userId,
          game_name: gameId,
          score: score,
          completed_at: new Date().toISOString(),
        })
      } catch (error) {
        console.error('Error saving score:', error)
      }
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="noise-overlay" />
      <ParticleNetwork />
      <Navbar />

      <main className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {currentGame === "menu" ? (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Header */}
                <div className="text-center mb-12">
                  <motion.div
                    className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass text-xs uppercase tracking-widest mb-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Gamepad2 size={16} style={{ color: secondaryColor }} />
                    <span style={{ color: secondaryColor }}>Neural Training Center</span>
                  </motion.div>

                  <h1
                    className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
                    style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}
                  >
                    THE ARCADE
                  </h1>

                  <p className="text-sm md:text-base opacity-50 max-w-xl mx-auto">
                    Train your cognitive abilities with these neural enhancement games from the Robotics Club of
                    Heritage Institute of Technology, Kolkata.
                  </p>
                </div>

                {/* Games Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {games.map((game, index) => (
                    <motion.div
                      key={game.id}
                      className="group glass rounded-3xl p-6 cursor-pointer overflow-hidden relative"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.02, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentGame(game.id)}
                    >
                      {/* Glow effect */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                        style={{ background: `radial-gradient(circle at center, ${game.color}, transparent 70%)` }}
                      />

                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                            style={{ background: `${game.color}20` }}
                          >
                            {game.icon}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span
                              className="px-3 py-1 rounded-full text-xs uppercase tracking-wider"
                              style={{ background: `${game.color}20`, color: game.color }}
                            >
                              {game.difficulty}
                            </span>
                            {highScores[game.id] && (
                              <span className="flex items-center gap-1 text-xs opacity-60">
                                <Trophy size={12} />
                                {highScores[game.id]}
                              </span>
                            )}
                          </div>
                        </div>

                        <h2 className="text-xl font-bold mb-2" style={{ color: game.color }}>
                          {game.name}
                        </h2>

                        <p className="text-sm opacity-60 leading-relaxed">{game.description}</p>

                        <motion.div
                          className="mt-4 flex items-center gap-2 text-sm font-medium"
                          style={{ color: game.color }}
                          initial={{ x: 0 }}
                          whileHover={{ x: 5 }}
                        >
                          Play Now
                          <motion.span
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                          >
                            →
                          </motion.span>
                        </motion.div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Global Leaderboard Teaser */}
                <motion.div
                  className="mt-12 glass rounded-3xl p-8 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Trophy size={32} style={{ color: accentColor }} className="mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2" style={{ color: accentColor }}>
                    Global Leaderboard Coming Soon
                  </h3>
                  <p className="text-sm opacity-50 max-w-md mx-auto">
                    Compete with other club members and see your rank on the global leaderboard. Login to save your
                    scores!
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key={currentGame}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Back Button */}
                <motion.button
                  onClick={() => setCurrentGame("menu")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm mb-8"
                  style={{ color: accentColor }}
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft size={18} />
                  Back to Games
                </motion.button>

                {/* Game Component */}
                {currentGame === "memory-matrix" && (
                  <MemoryMatrix onScoreUpdate={(score) => updateHighScore("memory-matrix", score)} />
                )}
                {currentGame === "reaction-test" && (
                  <ReactionTest onScoreUpdate={(score) => updateHighScore("reaction-test", score)} />
                )}
                {currentGame === "pattern-pulse" && (
                  <PatternPulse onScoreUpdate={(score) => updateHighScore("pattern-pulse", score)} />
                )}
                {currentGame === "binary-breaker" && (
                  <BinaryBreaker onScoreUpdate={(score) => updateHighScore("binary-breaker", score)} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
      <RobotWatcher />
    </div>
  )
}
