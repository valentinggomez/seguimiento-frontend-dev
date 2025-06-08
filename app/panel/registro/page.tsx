'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { motion } from 'framer-motion'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function RegistroPaciente() {
  const [form, setForm] = useState({
    nombre: '',
    dni: '',
    telefono: '',
    cirugia: '',
    fecha_cirugia: '',
    dni_medico: '',
    matricula_medico: ''
  })

  const [enviado, setEnviado] = useState(false)
  const [link, setLink] = useState('')
  const [copiado, setCopiado] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const campos = Object.entries(form)
    const vacios = campos.filter(([_, val]) => val.trim() === '')
    if (vacios.length > 0) {
      alert('⚠️ Por favor, completá todos los campos obligatorios.')
      return
    }

    const [d, m, y] = form.fecha_cirugia.split('/')
    const fechaValida = new Date(`${y}-${m}-${d}`)
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    if (fechaValida > hoy) {
      alert('⚠️ La fecha de cirugía no puede ser futura.')
      return
    }

    const paciente = {
      ...form,
      fecha_cirugia: `${y}-${m}-${d}`
    }

    const { data, error } = await supabase.from('pacientes').insert([paciente]).select()
    if (error || !data || !data[0]) {
      alert('❌ Error al guardar el paciente')
      console.error(error)
      return
    }

    const nuevoId = data[0].id
    setLink(`${window.location.origin}/seguimiento/${nuevoId}`)
    setEnviado(true)
  }

  const copiarLink = () => {
    navigator.clipboard.writeText(link)
    setCopiado(true)
    setTimeout(() => setCopiado(false), 2000)
  }

  const resetForm = () => {
    setForm({
      nombre: '',
      dni: '',
      telefono: '',
      cirugia: '',
      fecha_cirugia: '',
      dni_medico: '',
      matricula_medico: ''
    })
    setEnviado(false)
    setLink('')
    setCopiado(false)
  }

  return (
    <main className="max-h-screen bg-white px-4 py-14 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl bg-white/90 border border-gray-200 backdrop-blur-md shadow-xl rounded-3xl p-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#003466] tracking-tight">Registro de Paciente</h1>
          <p className="text-sm text-gray-500 mt-1">Unidad de Dolor Agudo Postoperatorio (UDAP)</p>
        </div>
        <div className="mb-6">
          <a
            href="/"
            className="inline-block bg-white border border-gray-300 text-[#004080] px-4 py-2 rounded-lg shadow hover:bg-gray-50 transition"
          >
            ← Volver al inicio
          </a>
        </div>


        {!enviado ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {[
              { name: 'nombre', label: 'Nombre completo' },
              { name: 'dni', label: 'DNI' },
              { name: 'telefono', label: 'Teléfono de contacto' },
              { name: 'cirugia', label: 'Tipo de cirugía' },
              { name: 'fecha_cirugia', label: 'Fecha de cirugía (dd/mm/aaaa)' },
              { name: 'dni_medico', label: 'DNI del médico' },
              { name: 'matricula_medico', label: 'Matrícula profesional' }
            ].map(({ name, label }) => (
              <div key={name} className="relative">
                <input
                  type="text"
                  name={name}
                  value={(form as any)[name]}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  className="peer w-full px-3 pt-6 pb-2 border border-gray-300 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#004080] transition-all"
                />
                <label
                  htmlFor={name}
                  className="absolute left-3 top-2.5 text-sm text-gray-500 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#004080] peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
                >
                  {label}
                </label>
              </div>
            ))}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#004080] hover:bg-[#002e5c] text-white font-semibold transition shadow"
            >
              Guardar paciente y generar link
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <div className="bg-green-50 border border-green-300 rounded-xl p-6 shadow">
              <h2 className="text-xl font-semibold text-green-700 mb-2">✅ Paciente registrado</h2>
              <p className="text-gray-700 text-sm mb-3">
                Compartí este enlace con el paciente para completar el formulario postoperatorio:
              </p>
              <div className="font-mono bg-white border rounded-lg px-4 py-2 text-sm text-gray-800 break-words">
                {link}
              </div>
              <button
                onClick={copiarLink}
                className={`mt-4 px-5 py-2 rounded-lg text-white font-medium transition shadow ${
                  copiado ? 'bg-green-600' : 'bg-[#004080] hover:bg-[#003466]'
                }`}
              >
                {copiado ? '✅ Link copiado' : '📋 Copiar link'}
              </button>
            </div>

            <button
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 mt-4 px-5 py-2 rounded-lg bg-white border border-gray-300 text-[#004080] hover:bg-gray-50 hover:shadow transition font-medium"
            >
              + Cargar otro paciente
            </button>
          </motion.div>
        )}
      </motion.div>
    </main>
  )
}
