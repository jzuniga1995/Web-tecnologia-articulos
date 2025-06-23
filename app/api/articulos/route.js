import { db } from '@/lib/db'
import { articulos } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

const validarToken = (req) => {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]
  return token === process.env.ADMIN_SECRET
}

export async function GET() {
  const data = await db.select().from(articulos)
  return NextResponse.json(data)
}

export async function POST(req) {
  if (!validarToken(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json()
  await db.insert(articulos).values(body)
  return NextResponse.json({ ok: true })
}

export async function PATCH(req) {
  if (!validarToken(req)) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const { id, ...data } = body

  if (!id) {
    return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
  }

  await db
    .update(articulos)
    .set({
      ...data,
      fecha_actualizacion: new Date(),
    })
    .where(eq(articulos.id, id))

  return NextResponse.json({ ok: true })
}
