"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ParticleNetwork } from "@/components/particle-network"
import { Calendar, Users, ShoppingBag, LogOut, Plus } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function AdminDashboard() {
  const { accentColor, secondaryColor } = useTheme()
  const router = useRouter()
  const [stats, setStats] = useState({ events: 0, team: 0, merch: 0 })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [events, team, merch] = await Promise.all([
          supabase.from("events").select("id"),
          supabase.from("team_members").select("id"),
          supabase.from("merchandise").select("id"),
        ])

        setStats({
          events: events.data?.length || 0,
          team: team.data?.length || 0,
          merch: merch.data?.length || 0,
        })
      } catch (err: any) {
        console.error("Error fetching stats:", err?.message || err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const adminSections = [
    {
      title: "Events",
      description: "Manage events, workshops, and competitions",
      icon: Calendar,
      href: "/organizer/admin/events",
      count: stats.events,
      color: accentColor,
    },
    {
      title: "Team Members",
      description: "Manage team profiles and information",
      icon: Users,
      href: "/organizer/admin/team",
      count: stats.team,
      color: secondaryColor,
    },
    {
      title: "Merchandise",
      description: "Manage products and merchandise",
      icon: ShoppingBag,
      href: "/organizer/admin/merchandise",
      count: stats.merch,
      color: "#ff4488",
    },
  ]

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="noise-overlay" />
      <ParticleNetwork />
      <Navbar />

      <main className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div className="flex items-center justify-between mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div>
              <h1
                className="text-4xl md:text-5xl font-bold tracking-tight mb-2"
                style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}
              >
                ADMIN PORTAL
              </h1>
              <p className="text-sm opacity-60">Manage all club content from here</p>
            </div>
            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm"
              style={{ color: accentColor }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut size={18} />
              Logout
            </motion.button>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-12">
            {adminSections.map((section, i) => (
              <motion.div
                key={i}
                className="glass rounded-xl p-4 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="text-2xl font-bold" style={{ color: section.color }}>
                  {loading ? "..." : section.count}
                </p>
                <p className="text-xs opacity-60 mt-1">{section.title}</p>
              </motion.div>
            ))}
          </div>

          {/* Admin Sections */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminSections.map((section, i) => {
              const Icon = section.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link href={section.href}>
                    <motion.div
                      className="glass rounded-2xl p-6 h-full cursor-pointer"
                      whileHover={{ scale: 1.05, y: -5 }}
                      style={{ borderLeft: `4px solid ${section.color}` }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <Icon size={28} style={{ color: section.color }} />
                        <Plus size={20} style={{ color: section.color }} />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{section.title}</h3>
                      <p className="text-sm opacity-60 mb-4">{section.description}</p>
                      <motion.button
                        className="px-4 py-2 rounded-lg text-xs uppercase font-bold"
                        style={{ background: `${section.color}20`, color: section.color }}
                        whileHover={{ scale: 1.05 }}
                      >
                        Manage →
                      </motion.button>
                    </motion.div>
                  </Link>
                </motion.div>
              )
            })}
          </div>

          {/* Quick Actions */}
          <motion.div
            className="mt-12 glass rounded-2xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <div className="flex flex-wrap gap-3">
              <Link href="/organizer/admin/events/new">
                <motion.button
                  className="px-4 py-2 rounded-lg text-xs uppercase font-bold glass"
                  style={{ color: accentColor }}
                  whileHover={{ scale: 1.05 }}
                >
                  + Add Event
                </motion.button>
              </Link>
              <Link href="/organizer/admin/team/new">
                <motion.button
                  className="px-4 py-2 rounded-lg text-xs uppercase font-bold glass"
                  style={{ color: secondaryColor }}
                  whileHover={{ scale: 1.05 }}
                >
                  + Add Team Member
                </motion.button>
              </Link>
              <Link href="/organizer/admin/merchandise/new">
                <motion.button
                  className="px-4 py-2 rounded-lg text-xs uppercase font-bold glass"
                  style={{ color: "#ff4488" }}
                  whileHover={{ scale: 1.05 }}
                >
                  + Add Merchandise
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
