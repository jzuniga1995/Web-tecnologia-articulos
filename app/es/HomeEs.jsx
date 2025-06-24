'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import SobreNosotros from './componentes/SobreNosotros'
import Contacto from './componentes/Contacto'

function limpiarMarkdown(texto) {
  return texto
    .replace(/#+\s?/g, '') // títulos ##
    .replace(/\*\*(.*?)\*\*/g, '$1') // negritas **
    .replace(/\*(.*?)\*/g, '$1') // cursiva *
    .replace(/`(.*?)`/g, '$1') // código en línea
    .replace(/!\[.*?\]\(.*?\)/g, '') // imágenes
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // links
    .replace(/[-*_]{3,}/g, '') // separadores
    .replace(/\n+/g, ' ') // saltos de línea
    .trim()
}




export default function HomeEs() {
  const [articulos, setArticulos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarArticulos = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/articulos?pagina=1&limite=6')
        const data = await res.json()
        setArticulos(data.articulos)
      } catch (err) {
        console.error('Error al cargar artículos:', err)
      } finally {
        setLoading(false)
      }
    }

    cargarArticulos()
  }, [])

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-black via-zinc-900 to-black text-white px-6 md:px-12 py-16">
      <div className="flex-grow">
        {/* Hero */}
        <section className="max-w-6xl mx-auto text-center mb-24">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight"
          >
            Conectá con el{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text">
              futuro
            </span>
            <br />
            de la tecnología y la inteligencia artificial
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto"
          >
            Noticias, tendencias y herramientas diseñadas para quienes piensan en código y creatividad.
          </motion.p>
        </section>

        {/* Artículos dinámicos */}
        <section className="max-w-7xl mx-auto grid gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <p className="text-zinc-400 text-center col-span-full">Cargando artículos...</p>
          ) : (
            articulos.map(({ titulo, slug, contenido, imagen, fecha }, i) => (
              <motion.article
                key={`card-${slug}`}
                aria-label={titulo}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.2 }}
                className="group relative block overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_10px_50px_rgba(0,255,255,0.2)] transition-transform hover:-translate-y-1 duration-300 backdrop-blur-md"
              >
                <Link href={`/es/articulos/${slug}`}>
                  <div className="overflow-hidden relative aspect-[16/9]">
                    <img
                      src={`/articulos/${imagen}`}
                      alt={titulo}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-2 text-white group-hover:text-cyan-400 transition-colors duration-300">
                      {titulo}
                    </h2>
                <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">
  {limpiarMarkdown(contenido).slice(0, 120)}...
</p>

                    <span className="inline-block mt-4 text-sm font-medium text-cyan-500 group-hover:underline transition-all duration-300">
                      Leer más →
                    </span>
                  </div>
                </Link>
              </motion.article>
            ))
          )}
        </section>
      </div>

      <SobreNosotros />
      <Contacto />
    </main>
  )
}
