'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

export default function EditarArticuloPage() {
  const [id, setId] = useState('')
  const [articulo, setArticulo] = useState(null)
  const [mensaje, setMensaje] = useState(null)
  const [token, setToken] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      const t = url.searchParams.get('token')
      if (t) setToken(t)
    }
  }, [])

  const buscarArticulo = async () => {
    setMensaje(null)

    if (!id) {
      setMensaje('❌ Debes ingresar un ID válido')
      return
    }

    try {
      const res = await fetch(`/api/articulos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        throw new Error('No encontrado')
      }

      const encontrado = await res.json()
      setArticulo(encontrado)
    } catch (err) {
      setArticulo(null)
      setMensaje('❌ Error al buscar el artículo')
    }
  }

  const actualizarArticulo = async (e) => {
    e.preventDefault()
    setMensaje(null)

    if (!articulo.titulo || !articulo.slug || !articulo.contenido || !articulo.imagen) {
      setMensaje('❌ Todos los campos son obligatorios')
      return
    }

    try {
      const { fecha, fecha_actualizacion, ...resto } = articulo

      const res = await fetch('/api/articulos', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...resto, id: Number(id) }),
      })

      if (res.ok) {
        setMensaje('✅ Artículo actualizado correctamente')
      } else {
        const errorData = await res.json()
        setMensaje('❌ Error al actualizar: ' + (errorData?.error || 'desconocido'))
      }
    } catch (err) {
      setMensaje('❌ Error del servidor al actualizar')
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Editar artículo existente</h1>

      <div className="mb-6">
        <label className="block mb-1 font-medium">🔍 Buscar por ID:</label>
        <div className="flex gap-4 items-center">
          <input
            type="number"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
          <button onClick={buscarArticulo} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Buscar
          </button>
        </div>
      </div>

      {articulo && (
        <form onSubmit={actualizarArticulo} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              value={articulo.titulo}
              onChange={(e) => setArticulo({ ...articulo, titulo: e.target.value })}
              placeholder="Título"
              className="border px-3 py-2 w-full"
            />
            <input
              type="text"
              value={articulo.slug}
              onChange={(e) => setArticulo({ ...articulo, slug: e.target.value })}
              placeholder="Slug (ej: el-futuro-de-la-ia)"
              className="border px-3 py-2 w-full"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <select
              value={articulo.idioma}
              onChange={(e) => setArticulo({ ...articulo, idioma: e.target.value })}
              className="border px-3 py-2 w-full"
            >
              <option value="es">Español</option>
              <option value="en">Inglés</option>
            </select>
            <input
              type="text"
              value={articulo.imagen}
              onChange={(e) => setArticulo({ ...articulo, imagen: e.target.value })}
              placeholder="Imagen (ej: portada1.jpg)"
              className="border px-3 py-2 w-full"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="w-full" data-color-mode="dark">
              <label className="block mb-2 text-sm font-semibold">✍️ Editar contenido (Markdown):</label>
              <MDEditor
                height={400}
                value={articulo.contenido}
                onChange={(value) => setArticulo({ ...articulo, contenido: value || '' })}
              />
            </div>

            <div className="w-full">
              <label className="block mb-2 text-sm font-semibold">👀 Vista previa:</label>
              <div className="border rounded-md p-4 bg-neutral-900 text-white prose prose-invert max-w-none">
                <ReactMarkdown>{articulo.contenido}</ReactMarkdown>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Guardar cambios
          </button>
        </form>
      )}

      {mensaje && <p className="mt-6 text-center">{mensaje}</p>}
    </div>
  )
}
