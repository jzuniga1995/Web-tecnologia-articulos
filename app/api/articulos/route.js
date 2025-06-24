import { db } from '@/lib/db'
import { articulos } from '@/lib/schema'
import { desc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

const validarToken = (req) => {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]
  return token === process.env.ADMIN_SECRET
}

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const pagina = parseInt(searchParams.get('pagina') || '1', 10)
  const porPagina = parseInt(searchParams.get('limite') || '20', 10)

  const offset = (pagina - 1) * porPagina

  // Consulta paginada
  const resultados = await db
    .select()
    .from(articulos)
    .orderBy(desc(articulos.fecha))
    .limit(porPagina)
    .offset(offset)

  // Total de artículos para calcular cuántas páginas hay (solo para frontend)
  const total = await db.select().from(articulos)

  return NextResponse.json({
    articulos: resultados,
    total: total.length, // o usar COUNT si querés performance real
  })
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
