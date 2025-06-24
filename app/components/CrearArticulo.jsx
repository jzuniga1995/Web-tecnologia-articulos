'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'

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
  const [token, setToken] = useState('')

  const searchParams = useSearchParams()

  useEffect(() => {
    const t = searchParams.get('token')
    if (t) setToken(t)
  }, [searchParams])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async () => {
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

      if (!res.ok) throw new Error('Error al guardar el artículo')

      alert('✅ Artículo guardado correctamente')
      setForm({ titulo: '', slug: '', contenido: '', idioma: 'es', imagen: '' })
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
          className="border p-2 w-full"
        />
        <input
          name="slug"
          value={form.slug}
          onChange={handleInputChange}
          placeholder="Slug (ej: el-futuro-de-la-ia)"
          className="border p-2 w-full"
        />
      </div>

      {/* Selector de idioma e imagen */}
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <select
          name="idioma"
          value={form.idioma}
          onChange={handleInputChange}
          className="border p-2 w-full"
        >
          <option value="es">Español</option>
          <option value="en">Inglés</option>
        </select>
        <input
          name="imagen"
          value={form.imagen}
          onChange={handleInputChange}
          placeholder="Nombre de imagen (ej: portada1.jpg)"
          className="border p-2 w-full"
        />
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
          <div className="border rounded-md p-4 bg-neutral-900 text-white prose prose-invert max-w-none">
            <ReactMarkdown>{form.contenido}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Botón de publicación */}
      <button
        onClick={handleSubmit}
        disabled={cargando}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        {cargando ? 'Publicando...' : 'Publicar artículo'}
      </button>
    </div>
  )
}
