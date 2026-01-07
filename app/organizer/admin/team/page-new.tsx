"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ParticleNetwork } from "@/components/particle-network"
import { Users, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TeamAdmin() {
  const { accentColor } = useTheme()

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="noise-overlay" />
      <ParticleNetwork />
      <Navbar />

      <main className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link href="/organizer/admin">
              <motion.button
                className="p-2 rounded-xl glass"
                style={{ color: accentColor }}
                whileHover={{ scale: 1.05 }}
              >
                <ArrowLeft size={20} />
              </motion.button>
            </Link>
            <h1 className="text-3xl font-bold" style={{ color: accentColor, fontFamily: "var(--font-orbitron)" }}>
              MANAGE TEAM
            </h1>
          </motion.div>

          <motion.div
            className="glass rounded-2xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Users size={48} style={{ color: accentColor }} className="mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-4">Manage via Supabase</h2>
            <p className="opacity-60 mb-6 max-w-md mx-auto">
              Use Supabase Table Editor to manage team members directly. Go to your Supabase dashboard and edit the "team_members" table.
            </p>
            <p className="text-sm opacity-50">All changes will appear immediately on the public Team page.</p>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
