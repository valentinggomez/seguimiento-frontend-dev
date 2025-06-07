// app/layout.tsx
import './globals.css'
import { Inter } from 'next/font/google'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Seguimiento Postoperatorio',
  description: 'Sistema digital para seguimiento de pacientes post cirugía',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen antialiased`}>
        <AnimatedLayout>{children}</AnimatedLayout>
      </body>
    </html>
  )
}

function AnimatedLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="max-w-4xl mx-auto px-4 py-8"
      >
        {children}
      </motion.main>
    </AnimatePresence>
  )
}
