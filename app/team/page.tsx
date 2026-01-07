"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ParticleNetwork } from "@/components/particle-network"
import { RobotWatcher } from "@/components/robot-watcher"
import { Users, Github, Linkedin, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface TeamMember {
  id: string
  name: string
  role: string
  department: string
  bio: string
  image_url: string
  github_url: string
  linkedin_url: string
  email: string
}

export default function TeamPage() {
  const { accentColor, secondaryColor } = useTheme()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchMembers()
  }, [])

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .order("display_order", { ascending: true })

      if (error) {
        console.error("Supabase error fetching team members:", error.message, error.details)
        throw error
      }
      setMembers(data || [])
    } catch (err: any) {
      console.error("Error fetching team members:", err?.message || err)
      setMembers([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="noise-overlay" />
      <ParticleNetwork />
      <Navbar />

      <main className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs uppercase tracking-widest mb-4"
              style={{ color: secondaryColor }}
            >
              <Users size={16} />
              The Crew
            </motion.div>

            <h1
              className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
              style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}
            >
              OUR TEAM
            </h1>

            <p className="text-sm md:text-base opacity-50 max-w-xl mx-auto">
              Meet the passionate engineers and innovators behind the Robotics Club of Heritage Institute of Technology,
              Kolkata.
            </p>
          </motion.div>

          {/* Team Grid */}
          {loading ? (
            <div className="text-center py-20">
              <p className="text-lg opacity-60">Loading team members...</p>
            </div>
          ) : members.length === 0 ? (
            <motion.div
              className="glass rounded-3xl p-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${accentColor}30, ${secondaryColor}30)` }}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              >
                <Users size={40} style={{ color: accentColor }} />
              </motion.div>

              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}
              >
                TEAM PROFILES COMING SOON
              </h2>

              <p className="text-sm opacity-60 max-w-md mx-auto mb-6">
                We're gathering information about our amazing team members. Check back soon to learn about the talented
                individuals who make the Robotics Club of Heritage Institute of Technology, Kolkata thrive.
              </p>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {members.map((member, index) => (
                <motion.div
                  key={member.id}
                  className="glass rounded-3xl overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  {member.image_url ? (
                    <img src={member.image_url} alt={member.name} className="w-full h-48 object-cover" />
                  ) : (
                    <motion.div
                      className="w-full h-48 flex items-center justify-center"
                      style={{ background: `${accentColor}20` }}
                    >
                      <Users size={40} style={{ color: accentColor }} className="opacity-50" />
                    </motion.div>
                  )}

                  <div className="p-6 text-center">
                    <h3 className="font-bold mb-1" style={{ color: accentColor }}>
                      {member.name}
                    </h3>
                    <p className="text-sm opacity-60 mb-1">{member.role}</p>
                    <p className="text-xs uppercase tracking-wider mb-3" style={{ color: secondaryColor }}>
                      {member.department}
                    </p>

                    {member.bio && <p className="text-xs opacity-50 mb-4">{member.bio}</p>}

                    {/* Social Links */}
                    <div className="flex items-center justify-center gap-3">
                      {member.github_url && (
                        <a
                          href={member.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="opacity-60 hover:opacity-100 transition"
                        >
                          <Github size={18} />
                        </a>
                      )}
                      {member.linkedin_url && (
                        <a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="opacity-60 hover:opacity-100 transition"
                        >
                          <Linkedin size={18} />
                        </a>
                      )}
                      {member.email && (
                        <a href={`mailto:${member.email}`} className="opacity-60 hover:opacity-100 transition">
                          <Mail size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <RobotWatcher />
    </div>
  )
}
