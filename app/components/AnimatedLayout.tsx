'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function AnimatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  useEffect(() => {
    setIsFirstLoad(false)
  }, [])

  return (
    <motion.div
      key={pathname}
      initial={isFirstLoad ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full"
    >
      {children}
    </motion.div>
  )
}
