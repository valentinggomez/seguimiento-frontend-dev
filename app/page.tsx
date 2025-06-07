'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@supabase/supabase-js'
import { motion } from "framer-motion";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Home() {
  const [form, setForm] = useState({
    nombre: '',
    dni: '',
    telefono: '',
    cirugia: '',
    fecha_cirugia: ''
  })
  const [errores, setErrores] = useState<{ [key: string]: boolean }>({})
  const [enviado, setEnviado] = useState(false)
  const [link, setLink] = useState('')
  const [copiado, setCopiado] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validación visual premium de campos vacíos
    const campos = ['nombre', 'dni', 'telefono', 'cirugia', 'fecha_cirugia']
    const nuevosErrores: { [key: string]: boolean } = {}

    campos.forEach((campo) => {
      if ((form as any)[campo]?.trim() === '') {
        nuevosErrores[campo] = true
      }
    })

    // Validar que la fecha de cirugía no sea futura
    const [dia, mes, anio] = form.fecha_cirugia.split('/')
    const fechaIngresada = new Date(`${anio}-${mes}-${dia}`)
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)

    if (fechaIngresada > hoy) {
      nuevosErrores['fecha_cirugia'] = true
      nuevosErrores['fecha_cirugia'] = true
      setErrores(nuevosErrores)
      setTimeout(() => setErrores({}), 1500)
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      setTimeout(() => setErrores({}), 1200)
      return
    }

    const fechaFormateada = `${anio}-${mes}-${dia}`

    const nuevoPaciente = {
      ...form,
      fecha_cirugia: fechaFormateada
    }

    const { data, error } = await supabase.from('pacientes').insert([nuevoPaciente]).select()

    if (data && data[0]) {
      const nuevoId = data[0].id
      const url = `${window.location.origin}/seguimiento/${nuevoId}`
      setLink(url)
      setEnviado(true)
      setCopiado(false)
    } else {
      alert('❌ Error al registrar paciente')
      console.error(error)
    }
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
      fecha_cirugia: ''
    })
    setEnviado(false)
    setLink('')
    setCopiado(false)
  }

  return (
    <main className="min-h-screen bg-[#f9fbfc] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-10 border border-gray-100">
        {/* ENCABEZADO */}
        <div className="flex flex-col items-center mb-10 text-center">
          <h1 className="text-3xl font-bold text-[#1a2c45]">UDAP</h1>
          <p className="text-sm text-gray-500">Unidad de Dolor Agudo Postoperatorio</p>
        </div>

        {!enviado ? (
          <form onSubmit={handleSubmit} className="space-y-7">
            {[
              { name: 'nombre', label: 'Nombre completo', type: 'text' },
              { name: 'dni', label: 'DNI', type: 'text' },
              { name: 'telefono', label: 'Teléfono de contacto', type: 'tel' },
              { name: 'cirugia', label: 'Tipo de cirugía', type: 'text' }
            ].map(({ name, label, type }) => (
              <div key={name} className="relative">
                <input
                  type={type}
                  name={name}
                  value={(form as any)[name]}
                  onChange={handleChange}
                  required
                  placeholder=" "
                  autoComplete="off"
                  className={`peer w-full px-3 pt-6 pb-2 border ${
                    errores[name]
                      ? 'border-red-500 shadow-sm shadow-red-100 animate-shake'
                      : (form as any)[name].trim() === ''
                      ? 'border-gray-300'
                      : 'border-[#004080]'
                  } rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#004080] transition-all`}
                />
                <label
                  htmlFor={name}
                  className="absolute left-3 top-2.5 text-sm text-gray-500 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#004080] peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
                >
                  {label}
                </label>
              </div>
            ))}

                {/* CAMPO DE FECHA CON FORMATEO AUTOMÁTICO Y VALIDACIÓN VISUAL PREMIUM */}
                  <div className="relative">
                    <input
                      type="text"
                      name="fecha_cirugia"
                      value={form.fecha_cirugia}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '')
                        if (val.length >= 3 && val.length <= 4)
                          val = val.replace(/(\d{2})(\d+)/, '$1/$2')
                        else if (val.length >= 5)
                          val = val.replace(/(\d{2})(\d{2})(\d+)/, '$1/$2/$3')
                        setForm({ ...form, fecha_cirugia: val.slice(0, 10) })
                      }}
                      placeholder=" "
                      maxLength={10}
                      required
                      autoComplete="off"
                      className={`peer w-full px-3 pt-6 pb-2 border-b-2 text-gray-800 bg-transparent focus:outline-none transition-all
                        ${
                          errores.fecha_cirugia
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:border-[#004080]'
                        }`}
                    />
                    <label
                      htmlFor="fecha_cirugia"
                      className="absolute left-3 top-2.5 text-sm text-gray-500 peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#004080] peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 transition-all"
                    >
                      Fecha de cirugía (dd/mm/aaaa)
                    </label>
                    {errores.fecha_cirugia && (
                      <p className="text-red-600 text-sm mt-1">
                        La fecha no puede estar vacía ni ser futura.
                      </p>
                    )}
                  </div>

            <button
              type="submit"
              className="w-full bg-[#004080] text-white py-3 rounded-lg hover:bg-[#002e5c] transition font-semibold shadow"
            >
              Guardar paciente y generar link
            </button>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-8 text-center"
          >
            <div className="border border-green-300 bg-green-50 rounded-2xl shadow-md px-6 py-8">
              <div className="flex items-center justify-center gap-3 mb-3 text-green-700">
                <span className="text-4xl">✅</span>
                <h2 className="text-2xl font-bold tracking-tight">
                  Paciente registrado correctamente
                </h2>
              </div>

              <p className="text-gray-700 mb-4 text-sm max-w-md mx-auto">
                Compartí este enlace con el paciente para que complete su formulario postoperatorio:
              </p>

              <div className="bg-white border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 font-mono break-words">
                {link}
              </div>

              <motion.button
                onClick={copiarLink}
                animate={copiado ? { scale: [1, 1.05, 1], backgroundColor: "#16a34a" } : {}}
                transition={{ duration: 0.3 }}
                className={`mt-5 px-6 py-2.5 rounded-lg text-white font-semibold transition-all shadow-md inline-flex items-center gap-2 ${
                  copiado
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-[#004080] hover:bg-[#003466]'
                }`}
              >
                {copiado ? '✅ Link copiado' : '📋 Copiar link'}
              </motion.button>
            </div>

            <button
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 mt-4 px-5 py-2 rounded-lg bg-white border border-gray-300 text-[#004080] hover:bg-gray-50 hover:shadow transition font-medium"
            >
              + Cargar otro paciente
            </button>
          </motion.div>
        )}
      </div>
    </main>
  )
}
