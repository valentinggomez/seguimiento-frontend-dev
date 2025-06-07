'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Respuesta = {
  id: number
  paciente_id: number
  fecha_respuesta: string
  dolor_6h: string
  dolor_24h: string
  dolor_mayor_7: string
  nauseas: string
  vomitos: string
  somnolencia: string
  observaciones: string
  satisfaccion: string
}

export default function PanelRespuestas() {
  const [respuestas, setRespuestas] = useState<Respuesta[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const fetchRespuestas = async () => {
      const { data, error } = await supabase.from('respuestas_postop').select('*').order('fecha_respuesta', { ascending: false })

      if (!error && data) {
        setRespuestas(data)
      }

      setCargando(false)
    }

    fetchRespuestas()
  }, [])

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <a
            href="/"
            className="inline-block bg-white border border-gray-300 text-[#004080] px-4 py-2 rounded-lg shadow hover:bg-gray-50 transition"
          >
            ← Volver al inicio
          </a>
        </div>

        <h1 className="text-2xl font-bold text-[#004080] mb-6">📄 Respuestas postoperatorias</h1>

        {cargando ? (
          <p className="text-gray-600">Cargando respuestas...</p>
        ) : respuestas.length === 0 ? (
          <p className="text-gray-600">No hay respuestas aún.</p>
        ) : (
          <div className="grid gap-4">
            {respuestas.map((r) => (
              <div key={r.id} className="bg-white rounded-xl shadow p-5">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold text-[#004080]">🧾 Seguimiento ID #{r.id}</h2>
                  <span className="text-sm text-gray-500">{new Date(r.fecha_respuesta).toLocaleString('es-AR')}</span>
                </div>
                <div className="text-sm text-gray-700 grid grid-cols-2 gap-x-6 gap-y-1">
                  <p><strong>Dolor 6h:</strong> {r.dolor_6h}</p>
                  <p><strong>Dolor 24h:</strong> {r.dolor_24h}</p>
                  <p><strong>¿Dolor mayor a 7?</strong> {r.dolor_mayor_7}</p>
                  <p><strong>Náuseas:</strong> {r.nauseas}</p>
                  <p><strong>Vómitos:</strong> {r.vomitos}</p>
                  <p><strong>Somnolencia:</strong> {r.somnolencia}</p>
                  <p><strong>Satisfacción:</strong> {r.satisfaccion}</p>
                  <p><strong>Observaciones:</strong> {r.observaciones || '–'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
