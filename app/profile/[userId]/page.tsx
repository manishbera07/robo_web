"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ParticleNetwork } from "@/components/particle-network"
import { Trophy, Target, Gamepad2, Award, TrendingUp, Calendar, ArrowLeft, Medal } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { getUserStats, getGameStats, getAchievements, type UserStats, type GameStats } from "@/lib/user-stats"

const rankColors: Record<string, string> = {
  Legend: "#FFD700",
  Platinum: "#E5E4E2",
  Gold: "#FFD700",
  Silver: "#C0C0C0",
  Bronze: "#CD7F32",
}

const games = ["Memory Matrix", "Reaction Test", "Pattern Pulse", "Binary Breaker"]

export default function UserProfilePage() {
  const { accentColor, secondaryColor } = useTheme()
  const params = useParams()
  const userId = params.userId as string

  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [gameStats, setGameStats] = useState<Record<string, GameStats | null>>({})
  const [achievements, setAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [userId])

  const fetchUserData = async () => {
    setLoading(true)
    try {
      // Fetch user stats
      const stats = await getUserStats(userId)
      setUserStats(stats)

      if (stats) {
        // Fetch game stats for each game
        const gameStatsData: Record<string, GameStats | null> = {}
        for (const game of games) {
          const stats = await getGameStats(game, userId)
          gameStatsData[game] = stats
        }
        setGameStats(gameStatsData)

        // Fetch achievements
        const achievementsList = await getAchievements(userId)
        setAchievements(achievementsList)
      }
    } catch (err) {
      console.error("Error fetching user data:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-x-hidden flex items-center justify-center">
        <div className="noise-overlay" />
        <ParticleNetwork />
        <Navbar />
        <div className="text-center">
          <p className="opacity-50">Loading profile...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!userStats) {
    return (
      <div className="relative min-h-screen overflow-x-hidden">
        <div className="noise-overlay" />
        <ParticleNetwork />
        <Navbar />
        <main className="relative z-10 pt-28 pb-20 px-4">
          <div className="max-w-4xl mx-auto text-center py-20">
            <p className="opacity-50 mb-4">Player not found</p>
            <Link href="/leaderboard">
              <motion.button
                className="px-6 py-3 rounded-xl text-sm font-bold"
                style={{ background: `${accentColor}`, color: "#030303" }}
                whileHover={{ scale: 1.05 }}
              >
                Back to Leaderboard
              </motion.button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="noise-overlay" />
      <ParticleNetwork />
      <Navbar />

      <main className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link href="/leaderboard">
            <motion.button
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl glass mb-6"
              style={{ color: accentColor }}
              whileHover={{ scale: 1.05 }}
            >
              <ArrowLeft size={16} />
              Back to Leaderboard
            </motion.button>
          </Link>

          {/* Profile Header */}
          <motion.div
            className="glass rounded-3xl p-8 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start gap-6 mb-6">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl"
                style={{ background: `${accentColor}20` }}
              >
                👤
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{userStats.email.split("@")[0]}</h1>
                  <span
                    className="text-sm font-bold px-3 py-1 rounded-lg"
                    style={{ background: rankColors[userStats.rank] + "30", color: rankColors[userStats.rank] }}
                  >
                    {userStats.rank}
                  </span>
                </div>
                <p className="text-sm opacity-50">{userStats.email}</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-xs opacity-50 mb-1">Total XP</p>
                <p className="text-2xl font-bold" style={{ color: accentColor }}>
                  {userStats.totalXP}
                </p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-xs opacity-50 mb-1">Games Played</p>
                <p className="text-2xl font-bold" style={{ color: secondaryColor }}>
                  {userStats.totalGamesPlayed}
                </p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-xs opacity-50 mb-1">Highest Score</p>
                <p className="text-2xl font-bold" style={{ color: accentColor }}>
                  {userStats.highestScore}
                </p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <p className="text-xs opacity-50 mb-1">Average Score</p>
                <p className="text-2xl font-bold" style={{ color: secondaryColor }}>
                  {userStats.averageScore}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Game Performance */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4" style={{ color: accentColor }}>
              <Gamepad2 size={24} />
              Game Performance
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              {games.map((game, idx) => {
                const stats = gameStats[game]
                return (
                  <motion.div
                    key={game}
                    className="glass rounded-2xl p-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + idx * 0.05 }}
                  >
                    <h3 className="font-bold mb-4">{game}</h3>
                    {stats ? (
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="opacity-60">Plays</span>
                          <span className="font-bold">{stats.totalPlays}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="opacity-60">High Score</span>
                          <span className="font-bold" style={{ color: accentColor }}>
                            {stats.highestScore}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="opacity-60">Average</span>
                          <span className="font-bold">{stats.averageScore}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="opacity-60">Low Score</span>
                          <span className="font-bold">{stats.lowestScore}</span>
                        </div>
                        {stats.bestTime && (
                          <div className="flex justify-between items-center">
                            <span className="opacity-60">Best Time</span>
                            <span className="font-bold">{(stats.bestTime / 1000).toFixed(2)}s</span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs opacity-50">No data yet</p>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Achievements */}
          {achievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4" style={{ color: secondaryColor }}>
                <Award size={24} />
                Achievements ({achievements.length})
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {achievements.map((achievement, idx) => (
                  <motion.div
                    key={achievement.id}
                    className="glass rounded-2xl p-4 text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 + idx * 0.03 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <p className="text-3xl mb-2">{achievement.achievements?.badge_icon}</p>
                    <p className="font-bold text-xs mb-1">{achievement.achievements?.name}</p>
                    <p className="text-xs opacity-50">
                      {new Date(achievement.unlocked_at).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Event Stats */}
          <motion.div
            className="glass rounded-3xl p-6 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar size={24} style={{ color: secondaryColor }} />
                <div>
                  <p className="font-bold">Events Attended</p>
                  <p className="text-sm opacity-50">{userStats.eventsAttended} events</p>
                </div>
              </div>
              <p className="text-3xl font-bold" style={{ color: secondaryColor }}>
                {userStats.eventsAttended}
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
