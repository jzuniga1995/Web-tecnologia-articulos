'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function ArticulosRecomendados({ slugActual }) {
  const [articulos, setArticulos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticulos = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/articulos?pagina=1&limite=6')
        
        if (!res.ok) {
          throw new Error('Error al cargar artículos')
        }

        const data = await res.json()
        const filtrados = data.articulos.filter((a) => a.slug !== slugActual)
        setArticulos(filtrados)
      } catch (error) {
        console.error('Error cargando artículos recomendados:', error)
        setArticulos([])
      } finally {
        setLoading(false)
      }
    }

    fetchArticulos()
  }, [slugActual])

  // 🆕 Función helper para manejar URLs de imagen (Cloudinary o legacy)
  const getImageUrl = (imagen) => {
    // Si ya es una URL completa de Cloudinary, usarla directamente
    if (imagen.startsWith('https://res.cloudinary.com/')) {
      return imagen
    }
    // Si es formato legacy (solo nombre de archivo), construir ruta local
    return `/articulos/${imagen}`
  }

  return (
    <section className="mt-20">
      <h2 className="text-2xl font-bold mb-6 text-cyan-400">Artículos recomendados</h2>

      {loading ? (
        <p className="text-zinc-400 text-sm">Cargando recomendaciones...</p>
      ) : articulos.length === 0 ? (
        <p className="text-zinc-400 text-sm">No hay artículos recomendados disponibles.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {articulos.map((art) => (
            <Link
              key={art.id}
              href={`/es/articulos/${art.slug}`}
              className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-zinc-800 hover:scale-105 duration-300"
            >
              <div className="aspect-video relative bg-zinc-900">
                <Image
                  src={getImageUrl(art.imagen)}
                  alt={art.titulo}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 33vw"
                  priority={false}
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white line-clamp-2">
                  {art.titulo}
                </h3>
                <p className="text-sm text-zinc-400 mt-2">
                  {new Date(art.fecha).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}