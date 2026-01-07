"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ParticleNetwork } from "@/components/particle-network"
import { Trophy, Flame, Medal, Gamepad2, Target, TrendingUp, Users, ArrowLeft, Search } from "lucide-react"
import Link from "next/link"
import { getAllUserStats, getWeeklyLeaderboard, type UserStats } from "@/lib/user-stats"

const games = ["Memory Matrix", "Reaction Test", "Pattern Pulse", "Binary Breaker"]

const rankColors: Record<string, string> = {
  Legend: "#FFD700",
  Platinum: "#E5E4E2",
  Gold: "#FFD700",
  Silver: "#C0C0C0",
  Bronze: "#CD7F32",
}

export default function LeaderboardPage() {
  const { accentColor, secondaryColor } = useTheme()
  const [activeTab, setActiveTab] = useState<"overall" | "game" | "weekly">("overall")
  const [selectedGame, setSelectedGame] = useState("Memory Matrix")
  const [userStats, setUserStats] = useState<UserStats[]>([])
  const [weeklyScores, setWeeklyScores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (activeTab === "overall") {
      fetchAllUserStats()
    } else if (activeTab === "weekly") {
      fetchWeeklyLeaderboard()
    }
  }, [activeTab, selectedGame])

  const fetchAllUserStats = async () => {
    setLoading(true)
    try {
      const stats = await getAllUserStats()
      setUserStats(stats)
    } catch (err) {
      console.error("Error fetching stats:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchWeeklyLeaderboard = async () => {
    setLoading(true)
    try {
      const scores = await getWeeklyLeaderboard(selectedGame)
      setWeeklyScores(scores)
    } catch (err) {
      console.error("Error fetching weekly leaderboard:", err)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = userStats.filter(user =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case "Legend":
        return "👑"
      case "Platinum":
        return "💎"
      case "Gold":
        return "🥇"
      case "Silver":
        return "🥈"
      case "Bronze":
        return "🥉"
      default:
        return "⭐"
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="noise-overlay" />
      <ParticleNetwork />
      <Navbar />

      <main className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link href="/dashboard">
              <motion.button
                className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl glass mb-4"
                style={{ color: accentColor }}
                whileHover={{ scale: 1.05 }}
              >
                <ArrowLeft size={16} />
                Back to Dashboard
              </motion.button>
            </Link>
            <h1
              className="text-4xl md:text-5xl font-bold flex items-center gap-3"
              style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}
            >
              <Trophy size={40} />
              Global Leaderboards
            </h1>
            <p className="text-sm opacity-50 mt-2">Compete and climb the rankings</p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            className="flex gap-4 mb-8 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            {["overall", "game", "weekly"].map((tab) => (
              <motion.button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className="px-6 py-3 rounded-xl font-bold uppercase text-sm transition-all"
                style={{
                  background: activeTab === tab ? `${accentColor}` : `${accentColor}15`,
                  color: activeTab === tab ? "#030303" : accentColor,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {tab === "overall" && <Users className="inline mr-2" size={16} />}
                {tab === "game" && <Gamepad2 className="inline mr-2" size={16} />}
                {tab === "weekly" && <Flame className="inline mr-2" size={16} />}
                {tab === "overall" ? "Overall Rankings" : tab === "game" ? "Game Stats" : "Weekly Challenge"}
              </motion.button>
            ))}
          </motion.div>

          {/* Overall Rankings Tab */}
          {activeTab === "overall" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Search */}
              <div className="relative mb-6">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
                <input
                  type="text"
                  placeholder="Search players..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl glass text-sm focus:outline-none"
                  style={{ border: `1px solid ${accentColor}20` }}
                />
              </div>

              {/* Rankings Grid */}
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-12 opacity-50">Loading rankings...</div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-12 opacity-50">No players found</div>
                ) : (
                  filteredUsers.map((user, rank) => (
                    <motion.div
                      key={user.userId}
                      className="glass rounded-2xl p-5 flex items-center justify-between"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: rank * 0.03 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <div className="flex items-center gap-4">
                        {/* Rank Badge */}
                        <div
                          className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl"
                          style={{
                            background: rankColors[user.rank] + "30",
                            border: `2px solid ${rankColors[user.rank]}`,
                          }}
                        >
                          {rank + 1 <= 3 ? <span className="text-2xl">{rank === 0 ? "🥇" : rank === 1 ? "🥈" : "🥉"}</span> : `#${rank + 1}`}
                        </div>

                        {/* Player Info */}
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold">{user.email.split("@")[0]}</p>
                            <span style={{ color: rankColors[user.rank] }} className="text-sm font-bold">
                              {getRankIcon(user.rank)} {user.rank}
                            </span>
                          </div>
                          <p className="text-xs opacity-50">
                            {user.totalGamesPlayed} games • {user.eventsAttended} events • {user.achievements} achievements
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-bold" style={{ color: secondaryColor }}>
                          {user.totalXP} XP
                        </p>
                        <p className="text-xs opacity-50">Score: {user.highestScore}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Game Stats Tab */}
          {activeTab === "game" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Game Selector */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {games.map((game) => (
                  <motion.button
                    key={game}
                    onClick={() => setSelectedGame(game)}
                    className="p-4 rounded-xl font-bold text-sm transition-all"
                    style={{
                      background: selectedGame === game ? `${accentColor}` : `${accentColor}15`,
                      color: selectedGame === game ? "#030303" : accentColor,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {game}
                  </motion.button>
                ))}
              </div>

              {/* Game Leaderboard */}
              <div className="glass rounded-3xl p-6">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: accentColor }}>
                  <Target size={24} />
                  Top Players - {selectedGame}
                </h3>

                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-12 opacity-50">Loading leaderboard...</div>
                  ) : (
                    userStats
                      .sort((a, b) => b.highestScore - a.highestScore)
                      .slice(0, 10)
                      .map((user, rank) => (
                        <motion.div
                          key={user.userId}
                          className="flex items-center justify-between p-4 rounded-xl"
                          style={{ background: "rgba(255,255,255,0.03)" }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: rank * 0.05 }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center gap-3">
                            <Medal size={20} style={{ color: rankColors[user.rank] }} />
                            <p className="font-medium">{user.email.split("@")[0]}</p>
                          </div>
                          <p className="text-lg font-bold" style={{ color: secondaryColor }}>
                            {user.highestScore}
                          </p>
                        </motion.div>
                      ))
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Weekly Challenge Tab */}
          {activeTab === "weekly" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Game Selector */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {games.map((game) => (
                  <motion.button
                    key={game}
                    onClick={() => setSelectedGame(game)}
                    className="p-4 rounded-xl font-bold text-sm transition-all"
                    style={{
                      background: selectedGame === game ? `${secondaryColor}` : `${secondaryColor}15`,
                      color: selectedGame === game ? "#030303" : secondaryColor,
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {game}
                  </motion.button>
                ))}
              </div>

              {/* Weekly Leaderboard */}
              <div className="glass rounded-3xl p-6">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2" style={{ color: secondaryColor }}>
                  <Flame size={24} />
                  This Week's Top Performers
                </h3>
                <p className="text-xs opacity-50 mb-6">Last 7 days</p>

                <div className="space-y-3">
                  {loading ? (
                    <div className="text-center py-12 opacity-50">Loading weekly leaderboard...</div>
                  ) : weeklyScores.length === 0 ? (
                    <div className="text-center py-12 opacity-50">No scores this week yet</div>
                  ) : (
                    weeklyScores.map((score, rank) => (
                      <motion.div
                        key={`${score.userId}-${score.playedAt}`}
                        className="flex items-center justify-between p-4 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.03)" }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: rank * 0.05 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                            style={{
                              background: rank === 0 ? "#FFD700" : rank === 1 ? "#C0C0C0" : rank === 2 ? "#CD7F32" : `${secondaryColor}15`,
                              color: rank < 3 ? "#030303" : secondaryColor,
                            }}
                          >
                            {rank + 1}
                          </div>
                          <p className="font-medium">{score.email.split("@")[0]}</p>
                        </div>
                        <p className="text-lg font-bold" style={{ color: secondaryColor }}>
                          {score.score}
                        </p>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
