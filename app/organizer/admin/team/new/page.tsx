"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ParticleNetwork } from "@/components/particle-network"
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function TeamForm() {
  const { accentColor, secondaryColor } = useTheme()
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({
    name: "",
    role: "",
    department: "Core Team",
    bio: "",
    image_url: "",
    github_url: "",
    linkedin_url: "",
    email: "",
    display_order: 0,
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const { error } = await supabase.from("team_members").insert([form])

      if (error) throw error

      setMessage("✓ Team member added successfully!")
      setTimeout(() => router.push("/organizer/admin/team"), 2000)
    } catch (err: any) {
      console.error(err)
      setMessage(err.message || "Failed to add team member")
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
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div
            className="flex items-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link href="/organizer/admin/team">
              <motion.button
                className="p-2 rounded-xl glass"
                style={{ color: accentColor }}
                whileHover={{ scale: 1.05 }}
              >
                <ArrowLeft size={20} />
              </motion.button>
            </Link>
            <h1 className="text-3xl font-bold" style={{ color: accentColor, fontFamily: "var(--font-orbitron)" }}>
              ADD TEAM MEMBER
            </h1>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {message && (
              <motion.div
                className="flex items-center gap-2 p-4 rounded-xl mb-6"
                style={{
                  background: message.includes("✓") ? "#00ff8820" : "#ff446620",
                }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {message.includes("✓") ? (
                  <CheckCircle size={20} style={{ color: "#00ff88" }} />
                ) : (
                  <AlertCircle size={20} style={{ color: "#ff4466" }} />
                )}
                <span>{message}</span>
              </motion.div>
            )}

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Role *</label>
                  <input
                    type="text"
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    placeholder="e.g., Team Lead"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Department</label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2"
                  >
                    <option>Core Team</option>
                    <option>Mechanical</option>
                    <option>Electronics</option>
                    <option>Software</option>
                    <option>Design</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Short bio..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Image URL</label>
                <input
                  type="url"
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2"
                />
              </div>

              {form.image_url && (
                <div className="glass rounded-xl p-4">
                  <p className="text-xs opacity-60 mb-2">Preview:</p>
                  <img src={form.image_url} alt="Preview" className="w-full rounded-lg max-h-60 object-cover" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Display Order</label>
                  <input
                    type="number"
                    name="display_order"
                    value={form.display_order}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">GitHub URL</label>
                  <input
                    type="url"
                    name="github_url"
                    value={form.github_url}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">LinkedIn URL</label>
                  <input
                    type="url"
                    name="linkedin_url"
                    value={form.linkedin_url}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <motion.button
                  type="submit"
                  disabled={loading || !form.name || !form.role}
                  className="flex-1 py-3 rounded-xl text-sm uppercase font-bold disabled:opacity-50"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
                    color: "#030303",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? "Adding..." : "Add Member"}
                </motion.button>

                <Link href="/organizer/admin/team" className="flex-1">
                  <motion.button
                    type="button"
                    className="w-full py-3 rounded-xl text-sm uppercase font-bold glass"
                    style={{ color: accentColor }}
                    whileHover={{ scale: 1.05 }}
                  >
                    Cancel
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
