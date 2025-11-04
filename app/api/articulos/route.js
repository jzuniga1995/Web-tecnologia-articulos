import { db } from '@/lib/db'
import { articulos } from '@/lib/schema'
import { desc, count , eq} from 'drizzle-orm'
import { NextResponse } from 'next/server'

const validarToken = (req) => {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]
  return token === process.env.ADMIN_SECRET
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const pagina = parseInt(searchParams.get('pagina') || '1', 10)
    const porPagina = parseInt(searchParams.get('limite') || '20', 10)
    
    // Validar parámetros
    if (pagina < 1 || porPagina < 1 || porPagina > 100) {
      return NextResponse.json(
        { error: 'Parámetros de paginación inválidos' }, 
        { status: 400 }
      )
    }

    const offset = (pagina - 1) * porPagina

    // Obtener artículos paginados
    const resultados = await db
      .select()
      .from(articulos)
      .orderBy(desc(articulos.fecha))
      .limit(porPagina)
      .offset(offset)

    // 🚀 Optimización: Usar count() en lugar de select todo
    const [{ total }] = await db
      .select({ total: count() })
      .from(articulos)

    return NextResponse.json({
      articulos: resultados,
      total: total,
      pagina: pagina,
      porPagina: porPagina,
      totalPaginas: Math.ceil(total / porPagina)
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
      }
    })
  } catch (error) {
    console.error('Error al obtener artículos:', error)
    return NextResponse.json(
      { error: 'Error al obtener los artículos' }, 
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    if (!validarToken(req)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await req.json()

    // 🆕 Validación de campos requeridos
    const camposRequeridos = ['titulo', 'slug', 'contenido', 'imagen', 'idioma']
    const camposFaltantes = camposRequeridos.filter(campo => !body[campo])
    
    if (camposFaltantes.length > 0) {
      return NextResponse.json(
        { error: `Campos requeridos faltantes: ${camposFaltantes.join(', ')}` }, 
        { status: 400 }
      )
    }

    // 🆕 Validar que 'imagen' sea una URL de Cloudinary
    if (!body.imagen.startsWith('https://res.cloudinary.com/')) {
      return NextResponse.json(
        { error: 'La imagen debe ser una URL válida de Cloudinary' }, 
        { status: 400 }
      )
    }

    // 🆕 Validar idioma
    if (!['es', 'en'].includes(body.idioma)) {
      return NextResponse.json(
        { error: 'Idioma debe ser "es" o "en"' }, 
        { status: 400 }
      )
    }

    // 🆕 Verificar que el slug no exista
    const slugExiste = await db
      .select({ id: articulos.id })
      .from(articulos)
      .where(eq(articulos.slug, body.slug))
      .limit(1)

    if (slugExiste.length > 0) {
      return NextResponse.json(
        { error: 'Ya existe un artículo con ese slug' }, 
        { status: 409 }
      )
    }

    // Insertar artículo
    const [nuevoArticulo] = await db
      .insert(articulos)
      .values({
        titulo: body.titulo,
        slug: body.slug,
        contenido: body.contenido,
        imagen: body.imagen, // URL de Cloudinary
        idioma: body.idioma,
      })
      .returning()

    return NextResponse.json({ 
      ok: true, 
      mensaje: 'Artículo creado correctamente',
      articulo: nuevoArticulo
    }, { status: 201 })

  } catch (error) {
    console.error('Error al crear artículo:', error)
    return NextResponse.json(
      { error: 'Error al crear el artículo' }, 
      { status: 500 }
    )
  }
}