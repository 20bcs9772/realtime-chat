"use client"

import { useState } from "react"
import { motion } from "framer-motion"

export default function MorphingShape() {
  const [m, setM] = useState<0 | 1>(0)

  function toggle() {
    setM((x) => (x === 0 ? 1 : 0))
  }

  return (
    <motion.div
      onClick={toggle}
      initial={false}
      animate={{
        borderRadius: m ? "50%" : "12px",
        backgroundColor: m ? "var(--color-primary-600)" : "var(--color-primary-500)",
      }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
      className="size-24 md:size-28 bg-primary"
    />
  )
}
