import { db } from '@/lib/db'
import { articulos } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
  const id = Number(params.id)

  if (!id || isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  const resultado = await db.select().from(articulos).where(eq(articulos.id, id))

  if (resultado.length === 0) {
    return NextResponse.json({ error: 'Artículo no encontrado' }, { status: 404 })
  }

  return NextResponse.json(resultado[0])
}
