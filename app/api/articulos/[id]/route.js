import { db } from '@/lib/db'
import { articulos } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

const validarToken = (req) => {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]
  return token === process.env.ADMIN_SECRET
}

export async function GET(req, context) {
  try {
    const id = Number(context.params.id)
    
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const resultado = await db
      .select()
      .from(articulos)
      .where(eq(articulos.id, id))
      .limit(1)

    if (!resultado.length) {
      return NextResponse.json({ error: 'Artículo no encontrado' }, { status: 404 })
    }

    return NextResponse.json(resultado[0], {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
      }
    })
  } catch (error) {
    console.error('Error al obtener artículo:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' }, 
      { status: 500 }
    )
  }
}

export async function PATCH(req, context) {
  try {
    if (!validarToken(req)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const id = Number(context.params.id)
    
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
    }

    const body = await req.json()

    // Validar que el artículo existe
    const existe = await db
      .select({ id: articulos.id })
      .from(articulos)
      .where(eq(articulos.id, id))
      .limit(1)

    if (!existe.length) {
      return NextResponse.json({ error: 'Artículo no encontrado' }, { status: 404 })
    }

    // 🆕 Campos permitidos ahora incluyen URL de Cloudinary
    const camposPermitidos = ['titulo', 'slug', 'contenido', 'imagen', 'idioma']
    const datosActualizar = Object.keys(body)
      .filter(key => camposPermitidos.includes(key))
      .reduce((obj, key) => {
        obj[key] = body[key]
        return obj
      }, {})

    // 🆕 Validar que 'imagen' sea una URL válida de Cloudinary
    if (datosActualizar.imagen) {
      const esUrlCloudinary = datosActualizar.imagen.startsWith('https://res.cloudinary.com/')
      const esUrlAntigua = datosActualizar.imagen.endsWith('.webp') && !datosActualizar.imagen.includes('://')
      
      if (!esUrlCloudinary && !esUrlAntigua) {
        return NextResponse.json(
          { error: 'URL de imagen inválida. Debe ser de Cloudinary o formato legacy (.webp)' }, 
          { status: 400 }
        )
      }
    }

    await db
      .update(articulos)
      .set({
        ...datosActualizar,
        fecha_actualizacion: new Date(),
      })
      .where(eq(articulos.id, id))

    return NextResponse.json({ 
      ok: true, 
      mensaje: 'Artículo actualizado correctamente' 
    })
  } catch (error) {
    console.error('Error al actualizar artículo:', error)
    return NextResponse.json(
      { error: 'Error al actualizar el artículo' }, 
      { status: 500 }
    )
  }
}