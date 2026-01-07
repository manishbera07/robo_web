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

export default function MerchForm() {
  const { accentColor, secondaryColor } = useTheme()
  const router = useRouter()
  const supabase = createClient()

  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "Clothing",
    price: "",
    image_url: "",
    available: true,
    display_order: 0,
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    setForm((prev) => ({ ...prev, [name]: val }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const submitData = {
        ...form,
        price: form.price ? parseFloat(form.price as string) : null,
      }

      const { error } = await supabase.from("merchandise").insert([submitData])

      if (error) throw error

      setMessage("✓ Product added successfully!")
      setTimeout(() => router.push("/organizer/admin/merchandise"), 2000)
    } catch (err: any) {
      console.error(err)
      setMessage(err.message || "Failed to add product")
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
            <Link href="/organizer/admin/merchandise">
              <motion.button
                className="p-2 rounded-xl glass"
                style={{ color: accentColor }}
                whileHover={{ scale: 1.05 }}
              >
                <ArrowLeft size={20} />
              </motion.button>
            </Link>
            <h1 className="text-3xl font-bold" style={{ color: accentColor, fontFamily: "var(--font-orbitron)" }}>
              NEW PRODUCT
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
                <label className="block text-sm font-semibold mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g., Club Hoodie"
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
                  placeholder="Product details..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2"
                  >
                    <option>Clothing</option>
                    <option>Accessories</option>
                    <option>Electronics</option>
                    <option>Stickers</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="0"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2"
                  />
                </div>
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
                  <label className="block text-sm font-semibold mb-2">Display Order</label>
                  <input
                    type="number"
                    name="display_order"
                    value={form.display_order}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Available</label>
                  <div className="flex items-center h-full">
                    <input
                      type="checkbox"
                      name="available"
                      checked={form.available}
                      onChange={handleChange}
                      className="w-5 h-5 rounded"
                    />
                    <span className="ml-2 text-sm">In Stock</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <motion.button
                  type="submit"
                  disabled={loading || !form.name}
                  className="flex-1 py-3 rounded-xl text-sm uppercase font-bold disabled:opacity-50"
                  style={{
                    background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
                    color: "#030303",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {loading ? "Adding..." : "Add Product"}
                </motion.button>

                <Link href="/organizer/admin/merchandise" className="flex-1">
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
