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

type Paciente = {
  id: number
  nombre: string
}

export default function PanelRespuestas() {
  const [respuestas, setRespuestas] = useState<Respuesta[]>([])
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [abierto, setAbierto] = useState<number | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const fetchTodo = async () => {
      const { data: respuestasData } = await supabase
        .from('respuestas_postop')
        .select('*')
        .order('fecha_respuesta', { ascending: false })

      const { data: pacientesData } = await supabase
        .from('pacientes')
        .select('id, nombre')

      if (respuestasData && pacientesData) {
        setRespuestas(respuestasData)
        setPacientes(pacientesData)
      }

      setCargando(false)
    }

    fetchTodo()
  }, [])

  const obtenerNombre = (paciente_id: number) =>
    pacientes.find((p) => p.id === paciente_id)?.nombre || `ID ${paciente_id}`

  const formatearFecha = (fecha: string) =>
    new Date(fecha).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })

  const mostrarSiNo = (valor: string) =>
    valor === 'true' ? 'Sí' : valor === 'false' ? 'No' : valor

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-[#004080] mb-6">📄 Respuestas postoperatorias</h1>

        <div className="mb-6">
          <a
            href="/"
            className="inline-block bg-white border border-gray-300 text-[#004080] px-4 py-2 rounded-lg shadow hover:bg-gray-50 transition"
          >
            ← Volver al inicio
          </a>
        </div>

        {cargando ? (
          <p className="text-gray-600">Cargando respuestas...</p>
        ) : respuestas.length === 0 ? (
          <p className="text-gray-600">No hay respuestas aún.</p>
        ) : (
          <div className="grid gap-4">
            {respuestas.map((r) => {
              const estaAbierto = abierto === r.id
              return (
                <div key={r.id} className="bg-white rounded-xl shadow">
                  <button
                    onClick={() => setAbierto(estaAbierto ? null : r.id)}
                    className={`w-full flex justify-between items-center p-4 text-left font-semibold text-[#004080] hover:bg-gray-50 rounded-t-xl`}
                  >
                    <span>🧾 Seguimiento de {obtenerNombre(r.paciente_id)}</span>
                    <span className="text-sm text-gray-500">{formatearFecha(r.fecha_respuesta)}</span>
                  </button>

                  {estaAbierto && (
                    <div className="px-5 pb-4 text-sm text-gray-700 grid grid-cols-2 gap-x-6 gap-y-1">
                      <p><strong>Dolor 6h:</strong> {r.dolor_6h}</p>
                      <p><strong>Dolor 24h:</strong> {r.dolor_24h}</p>
                      <p><strong>¿Dolor mayor a 7?</strong> {mostrarSiNo(r.dolor_mayor_7)}</p>
                      <p><strong>Náuseas:</strong> {mostrarSiNo(r.nauseas)}</p>
                      <p><strong>Vómitos:</strong> {mostrarSiNo(r.vomitos)}</p>
                      <p><strong>Somnolencia:</strong> {mostrarSiNo(r.somnolencia)}</p>
                      <p><strong>Satisfacción:</strong> {r.satisfaccion}</p>
                      <p><strong>Observaciones:</strong> {r.observaciones || '–'}</p>
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
