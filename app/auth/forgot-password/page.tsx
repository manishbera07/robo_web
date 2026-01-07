"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { ParticleNetwork } from "@/components/particle-network"
import { createClient } from "@/lib/supabase/client"
import { Mail, ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const { accentColor } = useTheme()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const supabase = createClient()

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!email) {
        throw new Error("Please enter your email address")
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        throw error
      }

      setIsSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div className="noise-overlay" />
      <ParticleNetwork />

      <motion.div
        className="relative z-10 w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <Link href="/">
          <motion.div className="flex items-center justify-center gap-3 mb-8" whileHover={{ scale: 1.02 }}>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold"
              style={{
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}aa)`,
                color: "#030303",
              }}
            >
              RC
            </div>
            <div className="text-left">
              <p className="text-xs uppercase tracking-wider opacity-60">Robotics Club</p>
              <p className="text-sm font-bold" style={{ color: accentColor }}>
                Heritage Institute, Kolkata
              </p>
            </div>
          </motion.div>
        </Link>

        {/* Forgot Password Card */}
        <div className="glass rounded-3xl p-8">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-8">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: `${accentColor}15` }}
                >
                  <Mail size={32} style={{ color: accentColor }} />
                </div>
                <h1 className="text-2xl font-bold mb-2" style={{ color: accentColor }}>
                  Forgot Password?
                </h1>
                <p className="text-sm opacity-50">
                  Enter your email and we'll send you a link to reset your password
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="text-xs uppercase tracking-wider opacity-50 mb-2 block">Email</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="engineer@heritage.edu"
                      className="w-full pl-12 pr-4 py-4 rounded-xl glass text-sm focus:outline-none"
                      style={{ border: `1px solid ${accentColor}20` }}
                      required
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <motion.p
                    className="text-sm text-center py-3 rounded-xl"
                    style={{ background: "rgba(255,68,68,0.1)", color: "#ff4444" }}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.p>
                )}

                {/* Submit */}
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
                  {isLoading ? "SENDING..." : "SEND RESET LINK"}
                  {!isLoading && <ArrowRight size={18} />}
                </motion.button>
              </form>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link href="/auth/login" className="text-sm opacity-50 hover:opacity-100 transition-opacity">
                  Back to login
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="text-center">
                <motion.div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: "rgba(68,255,68,0.1)" }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <CheckCircle size={32} style={{ color: "#44ff44" }} />
                </motion.div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: "#44ff44" }}>
                  Check Your Email
                </h2>
                <p className="text-sm opacity-70 mb-6">
                  We've sent a password reset link to <span className="font-semibold">{email}</span>
                </p>
                <p className="text-sm opacity-50 mb-8">
                  Click the link in the email to reset your password. The link will expire in 24 hours.
                </p>

                <div className="flex flex-col gap-3">
                  <Link href="/auth/login" className="w-full">
                    <motion.button
                      className="w-full py-4 rounded-xl text-sm uppercase tracking-wider font-bold"
                      style={{
                        background: `${accentColor}`,
                        color: "#030303",
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Back to Login
                    </motion.button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
