"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ParticleNetwork } from "@/components/particle-network"
import { ShoppingBag, ArrowLeft, Info } from "lucide-react"
import Link from "next/link"

export default function MerchAdmin() {
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
              MANAGE MERCHANDISE
            </h1>
          </motion.div>

          <motion.div
            className="glass rounded-2xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ShoppingBag size={48} style={{ color: accentColor }} className="mx-auto mb-4 opacity-50" />
            <h2 className="text-2xl font-bold mb-4">Manage via Supabase</h2>
            <p className="opacity-60 mb-6 max-w-md mx-auto">
              Use Supabase Table Editor to manage merchandise directly. Go to your Supabase dashboard and edit the "merchandise" table.
            </p>
            <p className="text-sm opacity-50">All changes will appear immediately on the public Merch page.</p>
          </motion.div>
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
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4">
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
                MANAGE MERCHANDISE
              </h1>
            </div>
            <Link href="/organizer/admin/merchandise/new">
              <motion.button
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm uppercase font-bold"
                style={{ background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`, color: "#030303" }}
                whileHover={{ scale: 1.05 }}
              >
                <Plus size={18} />
                New Product
              </motion.button>
            </Link>
          </motion.div>

          {message && (
            <motion.div
              className="flex items-center gap-2 p-4 rounded-xl mb-6 text-sm"
              style={{ background: message.includes("deleted") ? "#00ff8820" : "#ff446620" }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span>{message}</span>
            </motion.div>
          )}

          {/* Products */}
          {loading ? (
            <div className="text-center py-20">Loading...</div>
          ) : products.length === 0 ? (
            <motion.div
              className="glass rounded-2xl p-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <ShoppingBag size={48} style={{ color: accentColor }} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg opacity-60 mb-4">No products yet</p>
              <Link href="/organizer/admin/merchandise/new">
                <motion.button
                  className="px-6 py-2 rounded-xl text-sm uppercase font-bold"
                  style={{ background: `${accentColor}20`, color: accentColor }}
                  whileHover={{ scale: 1.05 }}
                >
                  Add First Product
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {products.map((product, i) => (
                <motion.div
                  key={product.id}
                  className="glass rounded-xl overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {product.image_url && (
                    <img src={product.image_url} alt={product.name} className="w-full h-40 object-cover" />
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold">{product.name}</h3>
                        <p className="text-xs opacity-60">{product.category}</p>
                      </div>
                      {product.available && (
                        <span className="px-2 py-1 rounded-lg text-xs" style={{ background: "#00ff8820", color: "#00ff88" }}>
                          Available
                        </span>
                      )}
                    </div>
                    <p className="text-sm opacity-60 mb-3">{product.description}</p>
                    {product.price && <p className="font-semibold text-lg mb-3">₹{product.price}</p>}
                    <div className="flex gap-2">
                      <Link href={`/organizer/admin/merchandise/${product.id}`} className="flex-1">
                        <motion.button
                          className="w-full p-2 rounded-lg glass text-xs"
                          style={{ color: secondaryColor }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <Edit2 size={14} className="mx-auto" />
                        </motion.button>
                      </Link>
                      <motion.button
                        onClick={() => deleteProduct(product.id)}
                        className="flex-1 p-2 rounded-lg glass text-xs"
                        style={{ color: "#ff4466" }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <Trash2 size={14} className="mx-auto" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
