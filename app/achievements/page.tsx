"use client"

import { motion } from "framer-motion"
import { Medal, Sparkles } from "lucide-react"
import Link from "next/link"
import { ParticleNetwork } from "@/components/particle-network"
import { useTheme } from "@/components/theme-provider"

export default function AchievementsPage() {
  const { accentColor, secondaryColor } = useTheme()

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-24">
      <div className="noise-overlay" />
      <ParticleNetwork />

      <motion.div
        className="relative z-10 w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Back */}
        <div className="mb-8">
          <Link href="/" className="text-sm opacity-50 hover:opacity-100 transition-opacity">
            ← Back to homepage
          </Link>
        </div>

        <div className="glass rounded-3xl p-12 text-center">
          <motion.div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: `${accentColor}15` }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Medal size={48} style={{ color: accentColor }} />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: accentColor }}>
            Achievements
          </h1>
          <p className="text-lg opacity-60 mb-2">Track your badges and milestones</p>

          <div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl mt-8 text-sm font-bold uppercase tracking-wider"
            style={{
              background: `linear-gradient(135deg, ${accentColor}20, ${secondaryColor}20)`,
              color: accentColor,
            }}
          >
            <Sparkles size={16} />
            Coming Soon
          </div>

          <p className="text-sm opacity-40 mt-8">
            We are preparing the achievements dashboard so you can view unlocked badges for games, events, and activities.
          </p>
        </div>

        <motion.div
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {[
            { title: "Game Badges", description: "Earn rewards for top scores and streaks" },
            { title: "Event Badges", description: "Collect badges for attending and organizing" },
            { title: "Milestones", description: "See your progress across all activities" },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="glass rounded-2xl p-6 text-center"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <h3 className="font-bold mb-2" style={{ color: accentColor }}>
                {feature.title}
              </h3>
              <p className="text-sm opacity-60">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  )
}
