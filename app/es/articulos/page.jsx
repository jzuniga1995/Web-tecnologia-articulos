import { db } from '@/lib/db'
import { articulos } from '@/lib/schema'
import { desc, eq } from 'drizzle-orm'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Artículos en Español | Neurobity',
  description: 'Lee artículos recientes sobre tecnología, IA y productividad en español.',
  alternates: {
    canonical: 'https://neurobity.com/es/articulos',
  },
}

// 🔧 Función para limpiar sintaxis Markdown
function limpiarMarkdown(md) {
  return md
    .replace(/[#>*_`~\-]+/g, '') // eliminar símbolos comunes
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // links [texto](url) -> texto
    .replace(/!\[.*?\]\(.*?\)/g, '') // imágenes ![alt](url) -> vacío
    .replace(/\n+/g, ' ') // saltos de línea -> espacio
    .trim()
}

export default async function ArticulosPage() {
  const data = await db
    .select()
    .from(articulos)
    .where(eq(articulos.idioma, 'es'))
    .orderBy(desc(articulos.fecha))

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 text-white">
      <h1 className="text-4xl font-extrabold mb-14 text-center">📰 Artículos en Español</h1>

      {data.length === 0 ? (
        <p className="text-center text-zinc-400">No hay artículos disponibles por ahora.</p>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((articulo) => (
            <Link
              key={articulo.id}
              href={`/es/articulos/${articulo.slug}`}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-md hover:shadow-xl transition duration-300"
            >
              <div className="relative w-full h-48">
                <Image
                  src={`/articulos/${articulo.imagen}`}
                  alt={articulo.titulo}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-5">
                <h2 className="text-xl font-bold mb-2 text-white line-clamp-2 group-hover:text-cyan-400 transition-colors">
                  {articulo.titulo}
                </h2>
                <p className="text-sm text-zinc-400 mb-2">
                  Publicado el{' '}
                  {new Date(articulo.fecha).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <p className="text-sm text-zinc-300 line-clamp-3">
                  {limpiarMarkdown(articulo.contenido).slice(0, 100)}...
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
