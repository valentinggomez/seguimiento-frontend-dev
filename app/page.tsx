'use client'
import { useRouter } from 'next/navigation'

export default function PanelPrincipal() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full bg-white shadow-xl rounded-2xl p-10 space-y-8 text-center">
        <h1 className="text-2xl font-bold text-[#004080]">Sistema de Seguimiento UDAP</h1>
        <p className="text-gray-600">Seleccioná una acción</p>

        <div className="grid gap-6">
          <button
            onClick={() => router.push('/panel/registro')}
            className="px-6 py-4 rounded-xl bg-[#004080] text-white font-semibold hover:bg-[#002e5c] shadow transition"
          >
            🧾 Registrar nuevo paciente
          </button>

          <button
            onClick={() => router.push('/panel/respuestas')}
            className="px-6 py-4 rounded-xl bg-red-100 text-red-800 font-semibold hover:bg-red-200 shadow transition"
          >
            🚨 Ver respuestas y alertas clínicas
          </button>
        </div>
      </div>
    </main>
  )
}
    