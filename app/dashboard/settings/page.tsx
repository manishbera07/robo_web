"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useTheme } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ParticleNetwork } from "@/components/particle-network"
import { RobotWatcher } from "@/components/robot-watcher"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Lock, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"

export default function SettingsPage() {
  const { accentColor } = useTheme()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "All fields are required" })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" })
      return
    }

    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" })
      return
    }

    if (currentPassword === newPassword) {
      setMessage({ type: "error", text: "New password must be different from current password" })
      return
    }

    setIsLoading(true)

    try {
      // First, verify current password by attempting to sign in
      const user = await supabase.auth.getUser()
      if (!user.data.user?.email) {
        throw new Error("Unable to verify user")
      }

      // Verify current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.data.user.email,
        password: currentPassword,
      })

      if (signInError) {
        throw new Error("Current password is incorrect")
      }

      // Store the new password temporarily (we'll use it after email verification)
      sessionStorage.setItem("pendingPassword", newPassword)

      // Send password reset email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        user.data.user.email,
        {
          redirectTo: `${window.location.origin}/dashboard/settings/confirm-password-change`,
        }
      )

      if (resetError) {
        throw resetError
      }

      // Show success message
      setMessage({
        type: "success",
        text: "Confirmation email sent! Click the link in the email to verify and change your password.",
      })

      // Reset form
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An error occurred while changing password",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="noise-overlay" />
      <ParticleNetwork />
      <Navbar />
      <RobotWatcher />

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
              <p className="text-sm uppercase tracking-wider opacity-50 mb-1">Account Settings</p>
              <h1 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}>
                Change Password
              </h1>
            </div>
          </motion.div>

          {/* Settings Card */}
          <motion.div
            className="glass rounded-3xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${accentColor}15` }}>
                  <Lock size={24} style={{ color: accentColor }} />
                </div>
                <div>
                  <h2 className="font-bold">Change Your Password</h2>
                  <p className="text-sm opacity-50">Secure your account with a new password</p>
                </div>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-6">
              {/* Current Password */}
              <div>
                <label className="text-xs uppercase tracking-wider opacity-50 mb-2 block">Current Password</label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter your current password"
                    className="w-full px-4 py-4 rounded-xl glass text-sm focus:outline-none pr-12"
                    style={{ border: `1px solid ${accentColor}20` }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
                  >
                    {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="text-xs uppercase tracking-wider opacity-50 mb-2 block">New Password</label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your new password"
                    className="w-full px-4 py-4 rounded-xl glass text-sm focus:outline-none pr-12"
                    style={{ border: `1px solid ${accentColor}20` }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-xs opacity-50 mt-2">Minimum 6 characters</p>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="text-xs uppercase tracking-wider opacity-50 mb-2 block">Confirm New Password</label>
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
                {isLoading ? "UPDATING PASSWORD..." : "CHANGE PASSWORD"}
              </motion.button>
            </form>

            {/* Security Info */}
            <div className="mt-8 flex gap-3">
              <Link href="/dashboard" className="flex-1">
                <motion.button
                  className="w-full py-3 rounded-xl text-sm uppercase tracking-wider font-bold"
                  style={{
                    background: `${accentColor}10`,
                    color: accentColor,
                    border: `1px solid ${accentColor}30`,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Back to Dashboard
                </motion.button>
              </Link>
              <motion.button
                type="button"
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.push("/auth/login")
                }}
                className="flex-1 py-3 rounded-xl text-sm uppercase tracking-wider font-bold"
                style={{
                  background: "rgba(255,68,68,0.1)",
                  color: "#ff6666",
                  border: "1px solid rgba(255,68,68,0.3)",
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Logout
              </motion.button>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
