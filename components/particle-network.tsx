"use client"

import { useEffect, useRef, useCallback } from "react"
import { useTheme } from "./theme-provider"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}

export function ParticleNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const { accentColor, secondaryColor } = useTheme()

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return null

    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    let particles: Particle[] = []
    let animationId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 20000)
      particles = []
      for (let i = 0; i < Math.min(particleCount, 80); i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
        })
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, i) => {
        // Mouse interaction
        const dx = mouseRef.current.x - p.x
        const dy = mouseRef.current.y - p.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 150) {
          const force = (150 - dist) / 150
          p.vx -= (dx / dist) * force * 0.02
          p.vy -= (dy / dist) * force * 0.02
        }

        // Update position
        p.x += p.vx
        p.y += p.vy

        // Boundary check with smooth wrap
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Apply friction
        p.vx *= 0.99
        p.vy *= 0.99

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 3)
        gradient.addColorStop(0, `${accentColor}`)
        gradient.addColorStop(0.5, `${accentColor}40`)
        gradient.addColorStop(1, "transparent")

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 3, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = accentColor
        ctx.fill()

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            const opacity = ((150 - distance) / 150) * 0.15
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `${secondaryColor}${Math.floor(opacity * 255)
              .toString(16)
              .padStart(2, "0")}`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      })

      animationId = requestAnimationFrame(draw)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    resize()
    draw()

    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", handleMouseMove)

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [accentColor, secondaryColor])

  useEffect(() => {
    const cleanup = animate()
    return () => cleanup?.()
  }, [animate])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />
}
