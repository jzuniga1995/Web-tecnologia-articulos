'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const ARTICULOS_POR_PAGINA = 20

function limpiarMarkdown(md) {
  return md
    .replace(/[#>*_`~\-]+/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\n+/g, ' ')
    .trim()
}

export default function ListaArticulos() {
  const [articulos, setArticulos] = useState([])
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [loading, setLoading] = useState(true)

  // 🆕 Función helper para manejar URLs de imagen (Cloudinary o legacy)
  const getImageUrl = (imagen) => {
    // Si ya es una URL completa de Cloudinary, usarla directamente
    if (imagen.startsWith('https://res.cloudinary.com/')) {
      return imagen
    }
    // Si es formato legacy (solo nombre de archivo), construir ruta local
    return `/articulos/${imagen}`
  }

  useEffect(() => {
    const fetchArticulos = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/articulos?pagina=${pagina}&limite=${ARTICULOS_POR_PAGINA}`)
        
        if (!res.ok) {
          throw new Error('Error al cargar artículos')
        }

        const data = await res.json()

        const filtrados = data.articulos.filter((a) => a.idioma === 'es')
        setArticulos(filtrados)
        setTotalPaginas(data.totalPaginas || Math.ceil(data.total / ARTICULOS_POR_PAGINA))
      } catch (error) {
        console.error('Error cargando artículos:', error)
        setArticulos([])
      } finally {
        setLoading(false)
      }
    }

    fetchArticulos()
  }, [pagina])

  return (
    <section className="max-w-7xl mx-auto px-6 py-20 text-white">
      <h1 className="text-4xl font-extrabold mb-14 text-center">
        Lo más reciente en tecnología e innovación
      </h1>

      {loading ? (
        <p className="text-center text-zinc-400">Cargando artículos...</p>
      ) : articulos.length === 0 ? (
        <p className="text-center text-zinc-400">No hay artículos disponibles por ahora.</p>
      ) : (
        <>
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {articulos.map((articulo) => (
              <Link
                key={articulo.id}
                href={`/es/articulos/${articulo.slug}`}
                className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-md hover:shadow-xl transition duration-300"
              >
                <div className="relative w-full h-48 bg-zinc-900">
                  <Image
                    src={getImageUrl(articulo.imagen)}
                    alt={articulo.titulo}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    priority={false}
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

          {/* Paginación */}
          {totalPaginas > 1 && (
            <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
              <button
                onClick={() => setPagina(prev => Math.max(1, prev - 1))}
                disabled={pagina === 1}
                className="px-4 py-2 rounded border bg-zinc-800 text-gray-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Anterior
              </button>

              {Array.from({ length: totalPaginas }).map((_, i) => {
                const n = i + 1
                // Mostrar solo páginas cercanas a la actual para no saturar
                if (
                  n === 1 || 
                  n === totalPaginas || 
                  (n >= pagina - 2 && n <= pagina + 2)
                ) {
                  return (
                    <button
                      key={n}
                      onClick={() => setPagina(n)}
                      className={`px-4 py-2 rounded border ${
                        pagina === n
                          ? 'bg-cyan-600 text-white font-bold'
                          : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                      }`}
                    >
                      {n}
                    </button>
                  )
                } else if (n === pagina - 3 || n === pagina + 3) {
                  return <span key={n} className="text-zinc-500">...</span>
                }
                return null
              })}

              <button
                onClick={() => setPagina(prev => Math.min(totalPaginas, prev + 1))}
                disabled={pagina === totalPaginas}
                className="px-4 py-2 rounded border bg-zinc-800 text-gray-300 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}