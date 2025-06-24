import { db } from '@/lib/db'
import { articulos } from '@/lib/schema'
import { desc } from 'drizzle-orm'
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

  const resultados = await db
    .select()
    .from(articulos)
    .orderBy(desc(articulos.fecha))
    .limit(porPagina)
    .offset(offset)

  const total = await db.select().from(articulos)

  return NextResponse.json({
    articulos: resultados,
    total: total.length,
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
