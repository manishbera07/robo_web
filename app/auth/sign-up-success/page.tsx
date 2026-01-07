"use client"

import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { ParticleNetwork } from "@/components/particle-network"
import { CheckCircle, Mail, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  const { accentColor, secondaryColor } = useTheme()

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div className="noise-overlay" />
      <ParticleNetwork />

      <motion.div
        className="relative z-10 w-full max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Success Card */}
        <div className="glass rounded-3xl p-8">
          <motion.div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: `${secondaryColor}20` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <CheckCircle size={48} style={{ color: secondaryColor }} />
          </motion.div>

          <h1 className="text-2xl font-bold mb-4" style={{ color: accentColor }}>
            Account Created!
          </h1>

          <p className="text-sm opacity-60 mb-6">
            Welcome to the Robotics Club of Heritage Institute of Technology, Kolkata. Please check your email to verify
            your account.
          </p>

          <div className="glass rounded-xl p-4 mb-8">
            <div className="flex items-center gap-3">
              <Mail size={24} style={{ color: accentColor }} />
              <div className="text-left">
                <p className="text-sm font-medium" style={{ color: accentColor }}>
                  Check your inbox
                </p>
                <p className="text-xs opacity-50">Click the verification link to activate your account</p>
              </div>
            </div>
          </div>

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
              GO TO LOGIN
              <ArrowRight size={18} />
            </motion.button>
          </Link>
        </div>

        {/* Back to home */}
        <div className="mt-6">
          <Link href="/" className="text-sm opacity-50 hover:opacity-100 transition-opacity">
            Back to homepage
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
