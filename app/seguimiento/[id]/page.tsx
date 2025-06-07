'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const preguntas = [
  '¿Cuánto dolor tuvo a las 6 horas? (0-10)',
  '¿Cuánto dolor tuvo a las 24 horas? (0-10)',
  '¿Tuvo dolor mayor a 7 puntos?',
  '¿Tuvo náuseas?',
  '¿Tuvo vómitos?',
  '¿Tuvo somnolencia?',
  '¿Requirió medicación adicional?',
  '¿Despertó por dolor?',
  '¿Desea continuar el seguimiento?',
  '¿Cómo calificaría la atención recibida?',
  '¿Desea dejar alguna observación?'
]

export default function SeguimientoPaciente() {
  const { id } = useParams()
  const [paciente, setPaciente] = useState<any>(null)
  const [respuestas, setRespuestas] = useState<string[]>(Array(preguntas.length).fill(''))
  const [enviado, setEnviado] = useState(false)

  useEffect(() => {
    const fetchPaciente = async () => {
      const { data } = await supabase.from('pacientes').select('*').eq('id', id).single()
      setPaciente(data)
    }
    fetchPaciente()
  }, [id])

  const handleChange = (i: number, valor: string) => {
    const nuevas = [...respuestas]
    nuevas[i] = valor
    setRespuestas(nuevas)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const body = {
      paciente_id: id,
      respuestas
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/respuestas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (res.ok) setEnviado(true)
    else alert('Error al enviar la respuesta.')
  }

  if (!paciente) return <p className="text-center py-20">Cargando datos del paciente...</p>

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-blue-200">
        <div className="flex flex-col items-center text-center mb-8 mt-6">

          <h1 className="text-3xl font-bold text-blue-800 tracking-tight">
            Seguimiento postoperatorio - UDAP
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            UDAP · Unidad Docente de Anestesiología de Córdoba
          </p>
        </div>

        <div className="w-full bg-blue-50 border border-blue-200 rounded-xl shadow-sm p-4 mb-8 text-sm sm:text-base">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
            <p><strong>👤 Nombre:</strong> {paciente?.nombre}</p>
            <p><strong>🆔 DNI:</strong> {paciente?.dni}</p>
            <p><strong>🏥 Cirugía:</strong> {paciente?.cirugia}</p>
            <p><strong>📅 Fecha:</strong> {paciente?.fecha}</p>
          </div>
        </div>

        {!enviado ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Inputs numéricos */}
            {[0, 1].map(i => (
              <div key={i}>
                <label className="block text-gray-700 font-medium mb-1">{preguntas[i]}</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={respuestas[i]}
                  onChange={e => handleChange(i, e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}

            {/* Selects */}
            {[2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i}>
                <label className="block text-gray-700 font-medium mb-1">{preguntas[i]}</label>
                <select
                  value={respuestas[i]}
                  onChange={e => handleChange(i, e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar</option>
                  <option value="Sí">Sí</option>
                  <option value="No">No</option>
                </select>
              </div>
            ))}

            {/* Satisfacción (1 a 5) */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">{preguntas[9]}</label>
              <select
                value={respuestas[9]}
                onChange={e => handleChange(9, e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccionar</option>
                {[1, 2, 3, 4, 5].map(n => <option key={n} value={String(n)}>{n}</option>)}
              </select>
            </div>

            {/* Observaciones (textarea) */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">{preguntas[10]}</label>
              <textarea
                value={respuestas[10]}
                onChange={e => handleChange(10, e.target.value)}
                required
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 font-semibold rounded-xl shadow-md hover:bg-blue-700 transition-all"
            >
              Enviar seguimiento
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center text-center bg-white border border-green-300 rounded-2xl shadow-lg p-8 mt-10">
            <span className="text-green-600 text-5xl mb-3">✅</span>
            <h2 className="text-2xl font-bold text-green-700 mb-1">¡Seguimiento enviado!</h2>
            <p className="text-gray-800 text-base">Tus respuestas han sido recibidas por nuestro equipo médico.</p>
            <p className="text-center text-sm text-gray-600 mt-2">
              Si tenés dudas o síntomas, comunicate con el equipo de UDAP.
            </p>
            <p className="text-center text-xs text-gray-400 mt-10">
              Sistema desarrollado exclusivamente para UDAP – Unidad Docente de Anestesiología · Córdoba
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
