"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useTheme } from "@/components/theme-provider"
import { ParticleNetwork } from "@/components/particle-network"
import { motion } from "framer-motion"
import { Images } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

type GalleryImage = {
  id: string
  title: string
  description: string | null
  image_url: string
  category: string | null
  created_at: string | null
}

export default function GalleryPage() {
  const { accentColor, secondaryColor } = useTheme()
  const supabase = createClient()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from("gallery_images")
          .select("id,title,description,image_url,category,created_at")
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(24)

        if (error) throw error
        setImages(data || [])
      } catch (err) {
        console.error("Error fetching gallery images", err)
        setImages([])
      } finally {
        setLoading(false)
      }
    }

    fetchImages()
  }, [supabase])

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="noise-overlay" />
      <ParticleNetwork />
      <Navbar />

      <main className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-xs uppercase tracking-widest mb-4"
              style={{ color: secondaryColor }}
            >
              <Images size={16} />
              Visual Archive
            </motion.div>

            <h1
              className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
              style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}
            >
              GALLERY
            </h1>

            <p className="text-sm md:text-base opacity-50 max-w-xl mx-auto">
              Browse event highlights, project builds, and lab moments. Full gallery opens soon.
            </p>
          </motion.div>

          {/* Content */}
          {loading ? (
            <div className="text-center py-16 opacity-70">Loading gallery...</div>
          ) : images.length === 0 ? (
            <motion.div
              className="glass rounded-3xl p-12 text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <motion.div
                className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${accentColor}30, ${secondaryColor}30)` }}
                animate={{ rotate: [0, 6, -6, 0] }}
                transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY }}
              >
                <Images size={40} style={{ color: accentColor }} />
              </motion.div>

              <h2
                className="text-2xl font-bold mb-3"
                style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}
              >
                Coming Soon
              </h2>

              <p className="text-sm opacity-60 max-w-md mx-auto">
                We're preparing a curated visual story of our robotics journey—events, builds, and behind-the-scenes lab shots.
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {images.map((img, idx) => (
                <motion.div
                  key={img.id}
                  className="glass rounded-2xl overflow-hidden border border-white/5"
                  whileHover={{ scale: 1.02, y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="aspect-[4/3] bg-black/40">
                    <img src={img.image_url} alt={img.title} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="text-sm font-semibold" style={{ color: accentColor }}>
                      {img.title}
                    </div>
                    {img.description && <p className="text-sm opacity-70 line-clamp-2">{img.description}</p>}
                    <div className="text-xs uppercase tracking-wider opacity-60">
                      {img.category || "Uncategorized"}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
