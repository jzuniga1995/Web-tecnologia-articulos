import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { articulos } from '@/lib/schema'
import { desc, eq } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

  // Entradas estáticas
  const staticUrls = [
    {
      loc: `${baseUrl}/es`,
      lastmod: new Date().toISOString().split('T')[0],
    },
    {
      loc: `${baseUrl}/es/articulos`,
      lastmod: new Date().toISOString().split('T')[0],
    },
  ]

  // Entradas dinámicas desde DB
  const data = await db
    .select({ slug: articulos.slug, fecha: articulos.fecha })
    .from(articulos)
    .where(eq(articulos.idioma, 'es'))
    .orderBy(desc(articulos.fecha))

  // Armar XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticUrls
    .map(
      ({ loc, lastmod }) => `
    <url>
      <loc>${loc}</loc>
      <lastmod>${lastmod}</lastmod>
    </url>`
    )
    .join('')}
  ${data
    .map(
      ({ slug, fecha }) => `
    <url>
      <loc>${baseUrl}/es/articulos/${slug}</loc>
      <lastmod>${new Date(fecha).toISOString().split('T')[0]}</lastmod>
    </url>`
    )
    .join('')}
</urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
}
