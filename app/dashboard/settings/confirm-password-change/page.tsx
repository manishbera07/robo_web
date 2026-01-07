"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ParticleNetwork } from "@/components/particle-network"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ConfirmPasswordChangePage() {
  const { accentColor } = useTheme()
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const confirmPasswordChange = async () => {
      try {
        const pendingPassword = sessionStorage.getItem("pendingPassword")
        
        if (!pendingPassword) {
          throw new Error("No pending password found. Please try changing your password again.")
        }

        // Update password with the stored new password
        const { error } = await supabase.auth.updateUser({
          password: pendingPassword,
        })

        if (error) {
          throw error
        }

        // Clear the stored password
        sessionStorage.removeItem("pendingPassword")

        setMessage({
          type: "success",
          text: "Password changed successfully! You can now log in with your new password.",
        })

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push("/dashboard")
        }, 3000)
      } catch (error) {
        setMessage({
          type: "error",
          text: error instanceof Error ? error.message : "Failed to change password",
        })
      } finally {
        setIsLoading(false)
      }
    }

    confirmPasswordChange()
  }, [supabase, router])

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="noise-overlay" />
      <ParticleNetwork />
      <Navbar />

      <main className="relative z-10 pt-28 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4 mb-6">
              <Link href="/dashboard">
                <motion.button
                  className="flex items-center gap-2 px-4 py-2 rounded-xl glass"
                  style={{ color: accentColor }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowLeft size={18} />
                  <span className="text-sm">Back</span>
                </motion.button>
              </Link>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wider opacity-50 mb-1">Password Change</p>
              <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}>
                Confirming Password
              </h1>
            </div>
          </motion.div>

          {/* Confirmation Card */}
          <motion.div
            className="glass rounded-3xl p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {isLoading ? (
              <>
                <motion.div
                  className="w-16 h-16 rounded-full mx-auto mb-6"
                  style={{ border: `3px solid ${accentColor}` }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <p className="text-lg opacity-70">Processing your password change...</p>
              </>
            ) : message ? (
              <>
                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{
                    background:
                      message.type === "success"
                        ? "rgba(68,255,68,0.1)"
                        : "rgba(255,68,68,0.1)",
                  }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  {message.type === "success" ? (
                    <CheckCircle size={32} style={{ color: "#44ff44" }} />
                  ) : (
                    <AlertCircle size={32} style={{ color: "#ff4444" }} />
                  )}
                </motion.div>
                <p
                  className="text-lg font-semibold mb-2"
                  style={{
                    color: message.type === "success" ? "#44ff44" : "#ff4444",
                  }}
                >
                  {message.type === "success" ? "Success!" : "Error"}
                </p>
                <p className="opacity-70 mb-8">{message.text}</p>

                {message.type === "success" ? (
                  <p className="text-sm opacity-50">Redirecting to dashboard...</p>
                ) : (
                  <Link href="/dashboard/settings">
                    <motion.button
                      className="px-6 py-3 rounded-xl font-bold"
                      style={{
                        background: `${accentColor}`,
                        color: "#030303",
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Try Again
                    </motion.button>
                  </Link>
                )}
              </>
            ) : null}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
