'use client'

import { Inter } from 'next/font/google'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isFirstLoad, setIsFirstLoad] = useState(true)

  useEffect(() => {
    setIsFirstLoad(false)
  }, [])

  return (
    <div className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen antialiased`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={isFirstLoad ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
