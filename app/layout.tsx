'use client'
import './globals.css'
import { Inter } from 'next/font/google'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Seguimiento Postoperatorio',
  description: 'Sistema digital para seguimiento de pacientes post cirugía',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // PING AUTOMÁTICO CADA 4 MINUTOS
  useEffect(() => {
    const ping = () => {
      fetch('https://seguimiento-backend-dev.onrender.com') // Podés cambiar esta ruta a un endpoint más liviano como /ping si existe
        .then(() => console.log('✅ Ping al backend'))
        .catch(() => console.warn('⚠️ Error al hacer ping'))
    }

    ping() // primer ping al cargar
    const interval = setInterval(ping, 240000) // cada 4 minutos

    return () => clearInterval(interval)
  }, [])

  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen antialiased`}>
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
      </body>
    </html>
  )
}
