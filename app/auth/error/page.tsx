"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { ParticleNetwork } from "@/components/particle-network"
import { AlertCircle, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function ErrorContent() {
  const { accentColor, secondaryColor } = useTheme()
  const searchParams = useSearchParams()
  const errorMessage = searchParams.get("error") || "An unexpected error occurred"

  return (
    <motion.div
      className="relative z-10 w-full max-w-md text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Error Card */}
      <div className="glass rounded-3xl p-8">
        <motion.div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: "rgba(255,68,68,0.2)" }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
        >
          <AlertCircle size={48} color="#ff4444" />
        </motion.div>

        <h1 className="text-2xl font-bold mb-4" style={{ color: accentColor }}>
          Something Went Wrong
        </h1>

        <p className="text-sm opacity-60 mb-6">{errorMessage}</p>

        <div className="flex flex-col gap-3">
          <Link href="/auth/login">
            <motion.button
              className="w-full py-4 rounded-xl text-sm uppercase tracking-wider font-bold flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
                color: "#030303",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              TRY AGAIN
              <ArrowRight size={18} />
            </motion.button>
          </Link>

          <Link href="/">
            <motion.button
              className="w-full py-4 rounded-xl text-sm uppercase tracking-wider glass"
              style={{ color: accentColor }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              BACK TO HOME
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function AuthErrorPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div className="noise-overlay" />
      <ParticleNetwork />
      <Suspense fallback={null}>
        <ErrorContent />
      </Suspense>
    </div>
  )
}
