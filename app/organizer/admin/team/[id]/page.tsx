"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ParticleNetwork } from "@/components/particle-network"
import { ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function EditTeamPage() {
  const { accentColor, secondaryColor } = useTheme()
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()
  const memberId = params.id as string

  const [form, setForm] = useState({
    name: "",
    role: "",
    department: "Engineering",
    bio: "",
    image_url: "",
    github_url: "",
    linkedin_url: "",
    email: "",
    display_order: 0,
  })

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchMember()
  }, [memberId])

  const fetchMember = async () => {
    try {
      const { data, error } = await supabase
        .from("team_members")
        .select("*")
        .eq("id", memberId)
        .single()

      if (error) throw error
      setForm(data)
    } catch (err: any) {
      console.error("Error fetching member:", err)
      setMessage("Failed to load member")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMessage("")

    try {
      const { error } = await supabase
        .from("team_members")
        .update(form)
        .eq("id", memberId)

      if (error) throw error
      setMessage("✓ Member updated successfully!")
      setTimeout(() => router.push("/organizer/admin/team"), 2000)
    } catch (err: any) {
      console.error("Error updating member:", err)
      setMessage(err.message || "Failed to update member")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this team member?")) return

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", memberId)

      if (error) throw error
      setMessage("✓ Member deleted successfully!")
      setTimeout(() => router.push("/organizer/admin/team"), 1500)
    } catch (err: any) {
      console.error("Error deleting member:", err)
      setMessage(err.message || "Failed to delete member")
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="noise-overlay" />
        <ParticleNetwork />
        <Navbar />
        <p className="text-center opacity-50">Loading member...</p>
      </div>
    )
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
              EDIT MEMBER
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
                <label className="block text-sm font-semibold mb-2">Member Name *</label>
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

              <div>
                <label className="block text-sm font-semibold mb-2">Role *</label>
                <input
                  type="text"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  placeholder="e.g., Lead Developer"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Department</label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2"
                  >
                    <option>Engineering</option>
                    <option>Design</option>
                    <option>Management</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="member@heritage.edu"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Short bio about the member..."
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
                  <img src={form.image_url} alt="Preview" className="w-32 h-32 rounded-lg object-cover" />
                </div>
              )}

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
                  disabled={submitting}
                  className="flex-1 py-3 rounded-xl text-sm uppercase font-bold disabled:opacity-50"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
                    color: "#030303",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </motion.button>

                <motion.button
                  type="button"
                  onClick={handleDelete}
                  disabled={submitting}
                  className="px-6 py-3 rounded-xl text-sm uppercase font-bold"
                  style={{ background: "rgba(255,68,68,0.1)", color: "#ff4444" }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </motion.button>

                <Link href="/organizer/admin/team">
                  <motion.button
                    type="button"
                    className="px-6 py-3 rounded-xl text-sm uppercase font-bold glass"
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
