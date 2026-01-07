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

export default function EditEventPage() {
  const { accentColor, secondaryColor } = useTheme()
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()
  const eventId = params.id as string

  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
    image_url: "",
    event_type: "Workshop",
    registration_url: "",
  })

  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchEvent()
  }, [eventId])

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single()

      if (error) throw error
      setForm(data)
    } catch (err: any) {
      console.error("Error fetching event:", err)
      setMessage("Failed to load event")
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
      console.log("Updating event:", form)
      const { error } = await supabase
        .from("events")
        .update(form)
        .eq("id", eventId)

      if (error) {
        console.error("Supabase update error:", error)
        throw error
      }

      console.log("Event updated successfully")
      setMessage("✓ Event updated successfully!")
      setTimeout(() => router.push("/organizer/admin/events"), 2000)
    } catch (err: any) {
      console.error("Error updating event:", err)
      setMessage(err.message || "Failed to update event")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) return

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId)

      if (error) throw error
      setMessage("✓ Event deleted successfully!")
      setTimeout(() => router.push("/organizer/admin/events"), 1500)
    } catch (err: any) {
      console.error("Error deleting event:", err)
      setMessage(err.message || "Failed to delete event")
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="noise-overlay" />
        <ParticleNetwork />
        <Navbar />
        <p className="text-center opacity-50">Loading event...</p>
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
            <Link href="/organizer/admin/events">
              <motion.button
                className="p-2 rounded-xl glass"
                style={{ color: accentColor }}
                whileHover={{ scale: 1.05 }}
              >
                <ArrowLeft size={20} />
              </motion.button>
            </Link>
            <h1 className="text-3xl font-bold" style={{ color: accentColor, fontFamily: "var(--font-orbitron)" }}>
              EDIT EVENT
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
                <label className="block text-sm font-semibold mb-2">Event Title *</label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g., Robotics Workshop"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Event details and description..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Event Date</label>
                  <input
                    type="datetime-local"
                    name="event_date"
                    value={form.event_date ? form.event_date.slice(0, 16) : ""}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Event Type</label>
                  <select
                    name="event_type"
                    value={form.event_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2"
                  >
                    <option>Workshop</option>
                    <option>Competition</option>
                    <option>Hackathon</option>
                    <option>Seminar</option>
                    <option>Meeting</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Location</label>
                <input
                  type="text"
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g., Heritage Institute, Kolkata"
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

              <div>
                <label className="block text-sm font-semibold mb-2">Registration URL (Google Form, Eventbrite, etc.)</label>
                <input
                  type="url"
                  name="registration_url"
                  value={form.registration_url}
                  onChange={handleChange}
                  placeholder="https://forms.google.com/..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2"
                />
              </div>

              {form.image_url && (
                <div className="glass rounded-xl p-4">
                  <p className="text-xs opacity-60 mb-2">Preview:</p>
                  <img src={form.image_url} alt="Preview" className="w-full rounded-lg max-h-60 object-cover" />
                </div>
              )}

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

                <Link href="/organizer/admin/events">
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
