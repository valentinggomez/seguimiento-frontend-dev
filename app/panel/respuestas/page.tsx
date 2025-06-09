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
  const [pacientes, setPacientes] = useState<{
    id: number
    nombre: string
    cirugia: string
    edad?: number
    sexo?: string
    peso?: number
    altura?: number
    imc?: string
  }[]>([])


  useEffect(() => {
    const fetchDatos = async () => {
      // Traer respuestas
      const { data: respuestasData, error: errorRespuestas } = await supabase
        .from('respuestas_postop')
        .select('*')
        .order('fecha_respuesta', { ascending: false })

      // Traer pacientes
      const { data: pacientesData, error: errorPacientes } = await supabase
        .from('pacientes')
        .select('id, nombre, cirugia, edad, sexo, peso, altura, imc')

      if (!errorRespuestas && respuestasData) {
        setRespuestas(respuestasData)
      }

      if (!errorPacientes && pacientesData) {
        setPacientes(pacientesData)
      }

      setCargando(false)
    }

    fetchDatos()
  }, [])


  const obtenerNombre = (id: number) => {
    const paciente = pacientes.find(p => p.id === id)
    return paciente?.nombre || `Paciente ${id}`
  }
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
              const dolor6 = parseInt(r.dolor_6h)
              const dolor24 = parseInt(r.dolor_24h)

              const tieneSintomasLeves =
                r.nauseas === 'true' || r.vomitos === 'true' || r.somnolencia === 'true'
              const dolorAlto = dolor6 > 7 || dolor24 > 7

              const nivel = dolorAlto
                ? 'critico'
                : tieneSintomasLeves
                ? 'leve'
                : 'ok'

              const paciente = pacientes.find(p => p.id === r.paciente_id)
              const nombre = paciente?.nombre || `Paciente ${r.paciente_id}`
              const cirugia = paciente?.cirugia || 'Cirugía no registrada'

              const estilos = {
                ok: 'bg-green-50 hover:bg-green-100 text-green-800 border-green-300',
                leve: 'bg-yellow-50 hover:bg-yellow-100 text-yellow-800 border-yellow-300',
                critico: 'bg-red-50 hover:bg-red-100 text-red-800 border-red-400',
              }

              function getIMCColor(imc: string) {
                const valor = parseFloat(imc || '')
                if (isNaN(valor)) return ''
                if (valor < 18.5) return 'text-blue-600'
                if (valor < 25) return 'text-green-600'
                if (valor < 30) return 'text-yellow-600'
                return 'text-red-600'
              }
              return (
                <div
                  key={r.id}
                  className={`bg-white rounded-xl shadow border transition overflow-hidden ${estilos[nivel]}`}
                >
                  <button
                    onClick={() => setAbierto(estaAbierto ? null : r.id)}
                    className={`w-full flex justify-between items-center p-4 text-left font-semibold ${estilos[nivel]} rounded-t-xl`}
                  >
                    <div>
                      <span>🧾 Seguimiento de {nombre}</span>
                      <p className="text-sm text-gray-500">
                        {cirugia} • {paciente?.edad ? `${paciente.edad} años` : 'Edad no registrada'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {paciente?.sexo && `Sexo: ${paciente.sexo}`} •{' '}
                        {paciente?.peso && `Peso: ${paciente.peso}kg`} •{' '}
                        {paciente?.altura && `Altura: ${paciente.altura}m`} •{' '}
                        {paciente?.imc && (
                          <span className={`font-semibold ${getIMCColor(paciente.imc)}`}>
                            IMC: {paciente.imc}
                          </span>
                        )}
                      </p>
                    </div>
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
                      <p><strong>Dolor 6h:</strong> {r.dolor_6h}</p>
                      <p><strong>Dolor 24h:</strong> {r.dolor_24h}</p>
                      <p>
                        <strong>¿Dolor mayor a 7?</strong>{' '}
                        <span className={dolorAlto ? 'text-red-600 font-semibold' : ''}>
                          {dolorAlto ? 'Sí 🔔' : 'No'}
                        </span>
                      </p>
                      <p><strong>Náuseas:</strong> {r.nauseas === 'true' ? 'Sí' : 'No'}</p>
                      <p><strong>Vómitos:</strong> {r.vomitos === 'true' ? 'Sí' : 'No'}</p>
                      <p><strong>Somnolencia:</strong> {r.somnolencia === 'true' ? 'Sí' : 'No'}</p>
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
