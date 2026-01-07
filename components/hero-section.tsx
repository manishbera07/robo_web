"use client"

import { useState, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { useTheme } from "./theme-provider"
import { Zap, ChevronDown } from "lucide-react"
import Link from "next/link"

const targetText = "BUILDING THE FUTURE"
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%"

export function HeroSection() {
  const { theme, accentColor, secondaryColor } = useTheme()
  const [displayText, setDisplayText] = useState("")
  const [isDecoding, setIsDecoding] = useState(true)

  const decodeText = useCallback(() => {
    let iteration = 0
    const interval = setInterval(() => {
      setDisplayText(
        targetText
          .split("")
          .map((char, index) => {
            if (char === " ") return " "
            if (index < iteration) return targetText[index]
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join(""),
      )

      if (iteration >= targetText.length) {
        setIsDecoding(false)
        clearInterval(interval)
      }

      iteration += 0.5
    }, 50)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const cleanup = decodeText()
    return cleanup
  }, [decodeText])

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
      {/* Gradient orbs */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: accentColor }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: secondaryColor }}
      />

      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 mt-12"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: secondaryColor }} />
            <span className="text-xs uppercase tracking-widest opacity-70">Heritage Institute of Technology</span>
          </motion.div>

          {/* Main headline */}
          <h1
            className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tighter mb-4"
            style={{ fontFamily: "var(--font-orbitron)", color: accentColor }}
          >
            {displayText}
            {isDecoding && (
              <motion.span
                className="inline-block w-1 md:w-2 h-10 md:h-16 lg:h-20 ml-2 align-middle"
                style={{ backgroundColor: secondaryColor }}
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
              />
            )}
          </h1>

          {/* Subtitle */}
          <motion.h2
            className="text-xl md:text-3xl font-light tracking-wide mb-6 opacity-80 lg:text-3xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.5 }}
          >
            at Heritage Institute of Technology, Kolkata
          </motion.h2>

          {/* Description */}
          <motion.p
            className="text-sm md:text-base opacity-50 mb-12 max-w-2xl mx-auto tracking-wide leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.7 }}
          >
            The Official Robotics & Automation Hub of Heritage Institute of Technology, Kolkata. Where innovation meets
            engineering excellence.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Link href="/events">
              <motion.button
                className="group relative px-8 py-4 rounded-2xl text-sm uppercase tracking-widest overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${accentColor}, ${secondaryColor})`,
                  color: "#030303",
                }}
                whileHover={{ scale: 1.05, boxShadow: `0 0 40px ${accentColor}50` }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center gap-3 justify-center font-bold">
                  <Zap size={18} />
                  EXPLORE EVENTS
                </span>
                <motion.div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100"
                  style={{ background: `linear-gradient(135deg, ${secondaryColor}, ${accentColor})` }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </Link>

            <Link href="/auth/sign-up">
              <motion.button
                className="px-8 py-4 rounded-2xl text-sm uppercase tracking-widest glass glass-hover"
                style={{ color: accentColor, border: `1px solid ${accentColor}30` }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                JOIN THE CLUB
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-20 grid grid-cols-3 gap-8 max-w-xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
          >
            {[
              { value: "500+", label: "Members" },
              { value: "50+", label: "Events" },
              { value: "25+", label: "Projects" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
              >
                <p className="text-2xl md:text-4xl font-bold" style={{ color: accentColor }}>
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-wider opacity-50 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 1.5 }}
          >
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}>
              <ChevronDown size={24} style={{ color: accentColor }} />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
