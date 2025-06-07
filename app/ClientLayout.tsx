'use client'

import { Inter } from 'next/font/google'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    const ping = () => {
      fetch('https://seguimiento-backend-dev.onrender.com')
        .then(() => console.log('✅ Ping al backend'))
        .catch(() => console.warn('⚠️ Error al hacer ping al backend'))
    }

    ping()
    const intervalo = setInterval(ping, 4 * 60 * 1000) // cada 4 minutos
    return () => clearInterval(intervalo)
  }, [])

  return (
    <div className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen antialiased`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
