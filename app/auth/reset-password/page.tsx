"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ParticleNetwork } from "@/components/particle-network"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"

export default function ResetPasswordPage() {
  const { accentColor } = useTheme()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Check if user has valid session from reset link
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) {
        setError("Invalid or expired reset link. Please request a new password reset.")
      }
      setIsLoaded(true)
    }
    checkSession()
  }, [supabase.auth])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    // Validation
    if (!password || !confirmPassword) {
      setMessage({ type: "error", text: "All fields are required" })
      return
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" })
      return
    }

    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" })
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      })

      if (error) {
        throw error
      }

      setMessage({
        type: "success",
        text: "Password reset successfully! Redirecting to login...",
      })

      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Failed to reset password",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isLoaded) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="noise-overlay" />
        <ParticleNetwork />
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <div className="w-12 h-12 rounded-full border-2" style={{ borderColor: accentColor, borderTopColor: "transparent" }} />
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative min-h-screen overflow-x-hidden">
        <div className="noise-overlay" />
        <ParticleNetwork />
        <Navbar />

        <main className="relative z-10 pt-28 pb-20 px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div className="glass rounded-3xl p-8 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <motion.div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: "rgba(255,68,68,0.1)" }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <AlertCircle size={32} style={{ color: "#ff4444" }} />
              </motion.div>
              <h1 className="text-2xl font-bold mb-2" style={{ color: "#ff4444" }}>
                Invalid Reset Link
              </h1>
              <p className="opacity-70 mb-6">{error}</p>

              <Link href="/auth/forgot-password">
                <motion.button
                  className="px-6 py-3 rounded-xl font-bold"
                  style={{
                    background: accentColor,
                    color: "#030303",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Request New Reset Link
                </motion.button>
              </Link>
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
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <motion.div className="mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-4 mb-6">
              <Link href="/auth/login">
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
              <p className="text-sm uppercase tracking-wider opacity-50 mb-1">Password Recovery</p>
              <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}>
                Set New Password
              </h1>
            </div>
          </motion.div>

          {/* Reset Card */}
          <motion.div
            className="glass rounded-3xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <form onSubmit={handleResetPassword} className="space-y-6">
              {/* New Password */}
              <div>
                <label className="text-xs uppercase tracking-wider opacity-50 mb-2 block">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="w-full px-4 py-4 rounded-xl glass text-sm focus:outline-none pr-12"
                    style={{ border: `1px solid ${accentColor}20` }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs opacity-50 mt-2">Minimum 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-xs uppercase tracking-wider opacity-50 mb-2 block">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    className="w-full px-4 py-4 rounded-xl glass text-sm focus:outline-none pr-12"
                    style={{ border: `1px solid ${accentColor}20` }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Message */}
              {message && (
                <motion.div
                  className="p-4 rounded-xl flex items-center gap-3"
                  style={{
                    background: message.type === "success" ? "rgba(68,255,68,0.1)" : "rgba(255,68,68,0.1)",
                    color: message.type === "success" ? "#44ff44" : "#ff4444",
                    border: `1px solid ${message.type === "success" ? "rgba(68,255,68,0.3)" : "rgba(255,68,68,0.3)"}`,
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {message.type === "success" ? (
                    <CheckCircle size={20} />
                  ) : (
                    <AlertCircle size={20} />
                  )}
                  <span className="text-sm">{message.text}</span>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 rounded-xl text-sm uppercase tracking-wider font-bold flex items-center justify-center gap-2"
                style={{
                  background: `${accentColor}`,
                  color: "#030303",
                  opacity: isLoading ? 0.7 : 1,
                }}
                whileHover={isLoading ? {} : { scale: 1.02 }}
                whileTap={isLoading ? {} : { scale: 0.98 }}
              >
                <Lock size={18} />
                {isLoading ? "RESETTING PASSWORD..." : "RESET PASSWORD"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
