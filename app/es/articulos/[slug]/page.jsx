export const dynamic = 'force-dynamic'

import { db } from '@/lib/db'
import { articulos } from '@/lib/schema'
import { eq, and } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import ArticulosRecomendados from '@/app/components/ArticulosRecomendados'

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
    .slice(0, 160)

  return {
    title: articulo.titulo,
    description: descripcion,
    alternates: {
      canonical: `https://neurobity.com/es/articulos/${slug}`,
    },
    openGraph: {
      title: articulo.titulo,
      description: descripcion,
      type: 'article',
      url: `https://neurobity.com/es/articulos/${slug}`,
      images: [
        {
          url: `https://neurobity.com/articulos/${articulo.imagen}`,
          alt: articulo.titulo,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: articulo.titulo,
      description: descripcion,
      images: [`https://neurobity.com/articulos/${articulo.imagen}`],
    },
  }
}

const ArticuloPage = async ({ params: { slug } }) => {
  const data = await db
    .select()
    .from(articulos)
    .where(and(eq(articulos.slug, slug), eq(articulos.idioma, 'es')))

  const articulo = data[0]
  if (!articulo) return notFound()

  return (
    <article className="max-w-4xl mx-auto px-6 py-14 text-white">
      {/* Imagen destacada */}
      <div className="w-full aspect-video relative rounded-xl overflow-hidden shadow-lg mb-10">
        <Image
          src={`/articulos/${articulo.imagen}`}
          alt={articulo.titulo}
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Título y fecha */}
      <h1 className="text-3xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
        {articulo.titulo}
      </h1>

      <p className="text-sm text-zinc-400 mb-10">
        Publicado el{' '}
        {new Date(articulo.fecha).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>

      {/* Contenido renderizado como Markdown con estilos */}
      <div className="prose prose-invert max-w-none">
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    h2: ({ node, ...props }) => (
      <h2 className="mt-8 mb-3 text-cyan-400 text-2xl font-bold" {...props} />
    ),
    p: ({ node, ...props }) => (
      <p className="leading-relaxed mb-4" {...props} />
    ),
    ul: ({ node, ...props }) => (
      <ul className="list-disc list-inside mb-4" {...props} />
    ),
    ol: ({ node, ...props }) => (
      <ol className="list-decimal list-inside mb-4" {...props} />
    ),
    a: ({ node, ...props }) => {
      const isExternal = props.href?.startsWith('http')
      return (
        <a
          {...props}
          className="text-blue-400 underline hover:text-blue-300"
          rel={isExternal ? 'nofollow noopener noreferrer' : undefined}
          target={isExternal ? '_blank' : undefined}
        />
      )
    },
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
