'use client'
import { useRouter } from 'next/navigation'
import { FaUserPlus, FaHeartbeat } from 'react-icons/fa'

export default function Inicio() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-white flex items-center justify-center px-4">
      <div className="max-w-lg w-full bg-white border border-gray-200 rounded-3xl shadow-xl p-10 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#004080] tracking-tight">Sistema de Seguimiento UDAP</h1>
          <p className="mt-2 text-sm text-gray-500">Unidad de Dolor Agudo Postoperatorio</p>
        </div>

        <div className="space-y-5">
          <button
            onClick={() => router.push('/panel/registro')}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-[#004080] text-white font-semibold hover:bg-[#003466] shadow-lg transition"
          >
            <FaUserPlus className="text-lg" />
            Registrar nuevo paciente
          </button>

          <button
            onClick={() => router.push('/panel/respuestas')}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-red-100 text-red-800 font-semibold hover:bg-red-200 shadow-md transition"
          >
            <FaHeartbeat className="text-lg" />
            Ver respuestas y alertas clínicas
          </button>
        </div>
      </div>
    </main>
  )
}
