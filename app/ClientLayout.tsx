// ClientLayout.tsx
'use client'

import { Inter } from 'next/font/google'
import { useEffect } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const ping = () => {
      fetch('https://seguimiento-backend-dev.onrender.com')
        .then(() => console.log('✅ Ping al backend'))
        .catch(() => console.warn('⚠️ Error al hacer ping al backend'))
    }

    ping()
    const intervalo = setInterval(ping, 4 * 60 * 1000)
    return () => clearInterval(intervalo)
  }, [])

  return (
    <div className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen antialiased`}>
      {children}
    </div>
  )
}
