import './globals.css'
import ClientLayout from './ClientLayout'

export const metadata = {
  title: 'Seguimiento Postoperatorio',
  description: 'Sistema digital para seguimiento de pacientes post cirugía',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
