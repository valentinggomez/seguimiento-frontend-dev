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
  const [abierto, setAbierto] = useState<number | null>(null)
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
            {respuestas.map((r) => {
              const estaAbierto = abierto === r.id
              const dolorAlto =
                parseInt(r.dolor_6h) > 7 || parseInt(r.dolor_24h) > 7

              // 🧠 Reemplazá esto por lo que uses para obtener el nombre
              const nombre = `Paciente ${r.paciente_id}`

              return (
                <div
                  key={r.id}
                  className={`bg-white rounded-xl shadow border transition overflow-hidden ${
                    dolorAlto ? 'border-red-400' : 'border-gray-200'
                  }`}
                >
                  <button
                    onClick={() =>
                      setAbierto((prev) => (prev === r.id ? null : r.id))
                    }
                    className={`w-full flex justify-between items-center p-4 text-left font-semibold ${
                      dolorAlto
                        ? 'bg-red-50 hover:bg-red-100 text-red-800'
                        : 'text-[#004080] hover:bg-gray-50'
                    } rounded-t-xl`}
                  >
                    <span>🧾 Seguimiento de {nombre}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(r.fecha_respuesta).toLocaleString('es-AR', {
                        day: 'numeric',
                        month: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })}
                    </span>
                  </button>

                  {estaAbierto && (
                    <div className="px-5 pb-4 pt-2 text-sm text-gray-700 grid grid-cols-2 gap-x-6 gap-y-1">
                      <p>
                        <strong>Dolor 6h:</strong> {r.dolor_6h}
                      </p>
                      <p>
                        <strong>Dolor 24h:</strong> {r.dolor_24h}
                      </p>
                      <p>
                        <strong>¿Dolor mayor a 7?</strong>{' '}
                        <span
                          className={
                            dolorAlto ? 'text-red-600 font-semibold' : ''
                          }
                        >
                          {dolorAlto ? 'Sí 🔔' : 'No'}
                        </span>
                      </p>
                      <p>
                        <strong>Náuseas:</strong>{' '}
                        {r.nauseas === 'true' ? 'Sí' : 'No'}
                      </p>
                      <p>
                        <strong>Vómitos:</strong>{' '}
                        {r.vomitos === 'true' ? 'Sí' : 'No'}
                      </p>
                      <p>
                        <strong>Somnolencia:</strong>{' '}
                        {r.somnolencia === 'true' ? 'Sí' : 'No'}
                      </p>
                      <p>
                        <strong>Satisfacción:</strong> {r.satisfaccion}
                      </p>
                      <p>
                        <strong>Observaciones:</strong>{' '}
                        {r.observaciones || '–'}
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
