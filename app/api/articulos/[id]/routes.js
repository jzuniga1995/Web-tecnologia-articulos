import { db } from '@/lib/db'
import { articulos } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

const validarToken = (req) => {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]
  return token === process.env.ADMIN_SECRET
}

export async function GET(req, { params }) {
  const id = Number(params.id)
  if (!id || isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  const resultado = await db.select().from(articulos).where(eq(articulos.id, id))
  if (!resultado.length) {
    return NextResponse.json({ error: 'Artículo no encontrado' }, { status: 404 })
  }

  return NextResponse.json(resultado[0])
}

export async function PATCH(req, { params }) {
  if (!validarToken(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const id = Number(params.id)
  if (!id || isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  const body = await req.json()
  await db
    .update(articulos)
    .set({
      ...body,
      fecha_actualizacion: new Date(),
    })
    .where(eq(articulos.id, id))

  return NextResponse.json({ ok: true })
}
