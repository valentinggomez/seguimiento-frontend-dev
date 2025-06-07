import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

export async function POST(req: Request) {
  try {
    const { accion, detalle, usuario } = await req.json()

    const { error } = await supabase.from('acciones_clinicas').insert([
      {
        accion,
        detalle,
        usuario
      }
    ])

    if (error) {
      console.error('❌ Error al registrar acción:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('❌ Error inesperado:', err)
    return NextResponse.json({ success: false, error: 'Error interno del servidor' }, { status: 500 })
  }
}
