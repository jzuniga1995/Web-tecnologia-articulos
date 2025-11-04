export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { articulos } from '@/lib/schema'
import { eq, and } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ArticulosRecomendados from '@/app/components/ArticulosRecomendados'

// 🆕 Función helper para manejar URLs de imagen (Cloudinary o legacy)
function getImageUrl(imagen) {
  // Si ya es una URL completa de Cloudinary, usarla directamente
  if (imagen.startsWith('https://res.cloudinary.com/')) {
    return imagen
  }
  // Si es formato legacy (solo nombre de archivo), construir ruta completa
  return `https://neurobity.com/articulos/${imagen}`
}

export async function generateMetadata({ params }) {
  const { slug } = params

  const data = await db
    .select()
    .from(articulos)
    .where(and(eq(articulos.slug, slug), eq(articulos.idioma, 'es')))

  const articulo = data[0]
  if (!articulo) return {}

  const descripcion = articulo.contenido
    .replace(/<[^>]+>/g, '')
    .replace(/[#*_~`]/g, '')
    .slice(0, 160)

  // 🆕 Usar función helper para la imagen en metadata
  const imagenUrl = getImageUrl(articulo.imagen)

  return {
    title: articulo.titulo,
    description: descripcion,
    alternates: {
      canonical: `https://neurobity.com/es/articulos/${slug}`,
      languages: {
        es: `https://neurobity.com/es/articulos/${slug}`,
      },
    },
    openGraph: {
      title: articulo.titulo,
      description: descripcion,
      type: 'article',
      url: `https://neurobity.com/es/articulos/${slug}`,
      images: [
        {
          url: imagenUrl,
          width: 1200,
          height: 630,
          alt: articulo.titulo,
        },
      ],
      publishedTime: articulo.fecha,
      modifiedTime: articulo.fecha_actualizacion || articulo.fecha,
    },
    twitter: {
      card: 'summary_large_image',
      title: articulo.titulo,
      description: descripcion,
      images: [imagenUrl],
    },
  }
}

const ArticuloPage = async ({ params }) => {
  const { slug } = params

  const data = await db
    .select()
    .from(articulos)
    .where(and(eq(articulos.slug, slug), eq(articulos.idioma, 'es')))

  const articulo = data[0]
  if (!articulo) return notFound()

  // 🆕 Usar función helper para la imagen
  const imagenUrl = getImageUrl(articulo.imagen)

  return (
    <article className="max-w-4xl mx-auto px-6 py-14 text-white">
      {/* Imagen destacada */}
      <div className="w-full aspect-video relative rounded-xl overflow-hidden shadow-lg mb-10 bg-zinc-900">
        <Image
          src={imagenUrl}
          alt={articulo.titulo}
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        />
      </div>

      {/* Título y fecha */}
      <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
        {articulo.titulo}
      </h1>

      <div className="flex items-center gap-4 text-sm text-zinc-400 mb-10">
        <time dateTime={articulo.fecha}>
          Publicado el{' '}
          {new Date(articulo.fecha).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        {articulo.fecha_actualizacion && articulo.fecha_actualizacion !== articulo.fecha && (
          <span>
            • Actualizado el{' '}
            {new Date(articulo.fecha_actualizacion).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
        )}
      </div>

      {/* Contenido renderizado como Markdown con estilos */}
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h2: ({ node, ...props }) => (
              <h2 className="mt-8 mb-3 text-cyan-400 text-2xl font-bold" {...props} />
            ),
            h3: ({ node, ...props }) => (
              <h3 className="mt-6 mb-3 text-cyan-300 text-xl font-semibold" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="leading-relaxed mb-4 text-zinc-200" {...props} />
            ),
            ul: ({ node, ...props }) => (
              <ul className="list-disc list-inside mb-4 space-y-2" {...props} />
            ),
            ol: ({ node, ...props }) => (
              <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="text-zinc-200" {...props} />
            ),
            a: ({ node, ...props }) => {
              const isExternal = props.href?.startsWith('http')
              return (
                <a
                  {...props}
                  className="text-blue-400 underline hover:text-blue-300 transition-colors"
                  rel={isExternal ? 'nofollow noopener noreferrer' : undefined}
                  target={isExternal ? '_blank' : undefined}
                />
              )
            },
            code: ({ node, inline, ...props }) =>
              inline ? (
                <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-cyan-300 text-sm" {...props} />
              ) : (
                <code className="block bg-zinc-900 p-4 rounded-lg overflow-x-auto text-sm" {...props} />
              ),
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-cyan-500 pl-4 italic text-zinc-300 my-4" {...props} />
            ),
          }}
        >
          {articulo.contenido}
        </ReactMarkdown>
      </div>

      <ArticulosRecomendados slugActual={slug} />
    </article>
  )
}

export default ArticuloPage