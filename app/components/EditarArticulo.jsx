'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

export default function EditarArticuloPage() {
  const [id, setId] = useState('')
  const [articulo, setArticulo] = useState(null)
  const [mensaje, setMensaje] = useState(null)
  const [token, setToken] = useState('')
  const [subiendoImagen, setSubiendoImagen] = useState(false)
  const [imagenOriginal, setImagenOriginal] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      const t = url.searchParams.get('token')
      if (t) setToken(t)
    }
  }, [])

  // 🆕 Función helper para mostrar URLs de imagen (Cloudinary o legacy)
  const getImageUrl = (imagen) => {
    if (imagen.startsWith('https://res.cloudinary.com/')) {
      return imagen
    }
    return `/articulos/${imagen}`
  }

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
      setImagenOriginal(encontrado.imagen) // Guardar imagen original
      setMensaje('✅ Artículo cargado correctamente')
    } catch (err) {
      setArticulo(null)
      setMensaje('❌ Error al buscar el artículo')
    }
  }

  // 🆕 Función para subir nueva imagen a Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      setMensaje('❌ Por favor selecciona un archivo de imagen válido')
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMensaje('❌ La imagen no debe superar los 5MB')
      return
    }

    try {
      setSubiendoImagen(true)
      setMensaje('📤 Subiendo nueva imagen a Cloudinary...')

      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      )

      if (!res.ok) throw new Error('Error al subir imagen a Cloudinary')

      const data = await res.json()
      
      // Actualizar la imagen del artículo
      setArticulo(prev => ({ ...prev, imagen: data.secure_url }))
      setMensaje('✅ Nueva imagen subida correctamente')
    } catch (err) {
      console.error('Error subiendo imagen:', err)
      setMensaje('❌ Error al subir imagen: ' + err.message)
    } finally {
      setSubiendoImagen(false)
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
      const { fecha, fecha_actualizacion, id: _, ...resto } = articulo

      const res = await fetch(`/api/articulos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...resto }),
      })

      const data = await res.json()

      if (res.ok) {
        setMensaje('✅ Artículo actualizado correctamente')
        setImagenOriginal(articulo.imagen) // Actualizar imagen original
      } else {
        setMensaje('❌ Error al actualizar: ' + (data?.error || 'desconocido'))
      }
    } catch (err) {
      setMensaje('❌ Error del servidor al actualizar')
    }
  }

  // 🆕 Restaurar imagen original
  const restaurarImagenOriginal = () => {
    setArticulo(prev => ({ ...prev, imagen: imagenOriginal }))
    setMensaje('ℹ️ Imagen restaurada a la original')
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
            placeholder="Ingresa el ID del artículo"
          />
          <button 
            onClick={buscarArticulo} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 whitespace-nowrap"
          >
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
              className="border px-3 py-2 w-full rounded"
            />
            <input
              type="text"
              value={articulo.slug}
              onChange={(e) => setArticulo({ ...articulo, slug: e.target.value })}
              placeholder="Slug (ej: el-futuro-de-la-ia)"
              className="border px-3 py-2 w-full rounded"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <select
              value={articulo.idioma}
              onChange={(e) => setArticulo({ ...articulo, idioma: e.target.value })}
              className="border px-3 py-2 w-full rounded"
            >
              <option value="es">Español</option>
              <option value="en">Inglés</option>
            </select>
          </div>

          {/* 🆕 Gestión de imagen con Cloudinary */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            <label className="block mb-2 text-sm font-semibold">
              📷 Imagen del artículo:
            </label>

            {/* Imagen actual */}
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Imagen actual:</p>
              <div className="relative w-full h-48 bg-gray-100 rounded overflow-hidden mb-2">
                <Image
                  src={getImageUrl(articulo.imagen)}
                  alt={articulo.titulo}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-xs text-gray-500 break-all">{articulo.imagen}</p>
            </div>

            {/* Upload nueva imagen */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Cambiar imagen:
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={subiendoImagen}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
              />

              {articulo.imagen !== imagenOriginal && (
                <button
                  type="button"
                  onClick={restaurarImagenOriginal}
                  className="text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  ↩️ Restaurar imagen original
                </button>
              )}
            </div>
          </div>

          {/* Editor Markdown + Vista previa */}
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
              <div className="border rounded-md p-4 bg-neutral-900 text-white prose prose-invert max-w-none overflow-auto" style={{ height: '400px' }}>
                <ReactMarkdown>{articulo.contenido}</ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Botón guardar */}
          <button
            type="submit"
            disabled={subiendoImagen}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {subiendoImagen ? 'Subiendo imagen...' : 'Guardar cambios'}
          </button>
        </form>
      )}

      {mensaje && (
        <div className={`mt-6 p-4 rounded text-center ${
          mensaje.includes('✅') ? 'bg-green-100 text-green-800' : 
          mensaje.includes('❌') ? 'bg-red-100 text-red-800' : 
          'bg-blue-100 text-blue-800'
        }`}>
          {mensaje}
        </div>
      )}
    </div>
  )
}