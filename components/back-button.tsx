"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

export function BackButton() {
  const router = useRouter()

  const handleBack = () => {
    router.push("/dashboard")
  }

  return (
    <motion.button
      onClick={handleBack}
      className="fixed left-4 top-4 z-50 px-3 py-2 rounded-xl glass text-sm font-semibold flex items-center gap-2"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <ArrowLeft size={16} />
      <span>Back</span>
    </motion.button>
  )
}
