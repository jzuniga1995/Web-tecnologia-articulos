'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function ArticulosRecomendados() {
  const [articulos, setArticulos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchArticulos = async () => {
      setLoading(true)
      const res = await fetch('/api/articulos?pagina=1&limite=6')
      const data = await res.json()
      setArticulos(data.articulos)
      setLoading(false)
    }

    fetchArticulos()
  }, [])

  return (
    <section className="mt-20">
      <h2 className="text-2xl font-bold mb-6 text-cyan-400">Artículos recomendados</h2>

      {loading ? (
        <p className="text-zinc-400 text-sm">Cargando recomendaciones...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {articulos.map((art) => (
            <Link
              key={art.id}
              href={`/es/articulos/${art.slug}`}
              className="border rounded-xl overflow-hidden shadow hover:shadow-lg transition bg-zinc-800"
            >
              <div className="aspect-video relative">
                <Image
                  src={`/articulos/${art.imagen}`}
                  alt={art.titulo}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white">{art.titulo}</h3>
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
