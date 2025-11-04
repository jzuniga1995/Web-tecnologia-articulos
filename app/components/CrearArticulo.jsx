'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'

// Cargar MDEditor dinámicamente (solo en cliente)
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

export default function AdminPage() {
  const [form, setForm] = useState({
    titulo: '',
    slug: '',
    contenido: '',
    idioma: 'es',
    imagen: ''
  })

  const [cargando, setCargando] = useState(false)
  const [subiendoImagen, setSubiendoImagen] = useState(false)
  const [token, setToken] = useState('')
  const [previewImagen, setPreviewImagen] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      const t = url.searchParams.get('token')
      if (t) setToken(t)
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // 🆕 Función para subir imagen a Cloudinary
const handleImageUpload = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return

  // Validar tipo de archivo
  if (!file.type.startsWith('image/')) {
    alert('❌ Por favor selecciona un archivo de imagen válido')
    return
  }

  // Validar tamaño (máximo 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('❌ La imagen no debe superar los 5MB')
    return
  }

  try {
    setSubiendoImagen(true)

    // Debug: verificar variables de entorno
    console.log('Cloud Name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME)
    console.log('Upload Preset:', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET)

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

    // Debug: ver respuesta completa
    const data = await res.json()
    console.log('Respuesta de Cloudinary:', data)

    if (!res.ok) {
      throw new Error(data.error?.message || 'Error al subir imagen a Cloudinary')
    }

    // Guardar URL de Cloudinary en el form
    setForm(prev => ({ ...prev, imagen: data.secure_url }))
    setPreviewImagen(data.secure_url)
    
    alert('✅ Imagen subida correctamente')
  } catch (err) {
    console.error('Error detallado:', err)
    alert('❌ Error al subir imagen: ' + err.message)
  } finally {
    setSubiendoImagen(false)
  }
}

  const handleSubmit = async () => {
    // 🆕 Validar que la imagen esté subida
    if (!form.imagen) {
      alert('❌ Debes subir una imagen antes de publicar')
      return
    }

    // Validar campos requeridos
    if (!form.titulo || !form.slug || !form.contenido) {
      alert('❌ Todos los campos son requeridos')
      return
    }

    try {
      setCargando(true)

      const res = await fetch('/api/articulos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al guardar el artículo')
      }

      alert('✅ Artículo guardado correctamente')
      setForm({ titulo: '', slug: '', contenido: '', idioma: 'es', imagen: '' })
      setPreviewImagen(null)
    } catch (err) {
      alert('❌ Error: ' + err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Crear nuevo artículo</h1>

      {/* Título y slug */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <input
          name="titulo"
          value={form.titulo}
          onChange={handleInputChange}
          placeholder="Título"
          className="border p-2 w-full rounded"
        />
        <input
          name="slug"
          value={form.slug}
          onChange={handleInputChange}
          placeholder="Slug (ej: el-futuro-de-la-ia)"
          className="border p-2 w-full rounded"
        />
      </div>

      {/* Selector de idioma */}
      <div className="mb-4">
        <select
          name="idioma"
          value={form.idioma}
          onChange={handleInputChange}
          className="border p-2 w-full rounded"
        >
          <option value="es">Español</option>
          <option value="en">Inglés</option>
        </select>
      </div>

      {/* 🆕 Upload de imagen a Cloudinary */}
      <div className="mb-6 border-2 border-dashed border-gray-300 rounded-lg p-6">
        <label className="block mb-2 text-sm font-semibold">
          📷 Imagen del artículo:
        </label>
        
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          disabled={subiendoImagen}
          className="mb-4 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />

        {subiendoImagen && (
          <p className="text-blue-600 text-sm">📤 Subiendo imagen a Cloudinary...</p>
        )}

        {previewImagen && (
          <div className="mt-4">
            <p className="text-sm text-green-600 mb-2">✅ Imagen subida correctamente</p>
            <div className="relative w-full h-48 bg-gray-100 rounded overflow-hidden">
              <Image
                src={previewImagen}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 break-all">{form.imagen}</p>
          </div>
        )}
      </div>

      {/* Editor Markdown + Previsualización */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="w-full" data-color-mode="dark">
          <label className="block mb-2 text-sm font-semibold">✍️ Contenido del artículo (Markdown):</label>
          <MDEditor
            height={400}
            value={form.contenido}
            onChange={(value) => setForm(prev => ({ ...prev, contenido: value || '' }))}
          />
        </div>

        <div className="w-full">
          <label className="block mb-2 text-sm font-semibold">👀 Vista previa:</label>
          <div className="border rounded-md p-4 bg-neutral-900 text-white prose prose-invert max-w-none overflow-auto" style={{ height: '400px' }}>
            <ReactMarkdown>{form.contenido}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Botón de publicación */}
      <button
        onClick={handleSubmit}
        disabled={cargando || subiendoImagen || !form.imagen}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {cargando ? 'Publicando...' : 'Publicar artículo'}
      </button>

      {!form.imagen && (
        <p className="text-sm text-gray-500 mt-2">⚠️ Debes subir una imagen antes de publicar</p>
      )}
    </div>
  )
}