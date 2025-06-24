import { NextResponse } from 'next/server'

export function middleware(request) {
  const { pathname, searchParams } = request.nextUrl
  const method = request.method

  const isStatic =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname.startsWith('/robots') ||
    pathname.startsWith('/logo') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.webp') ||
    pathname.endsWith('.xml')

  // ✅ Permitir rutas públicas sin protección
  if (
    isStatic ||
    pathname === '/sitemap.xml' ||
    pathname === '/robots.txt' ||
    pathname.startsWith('/es') ||
    pathname.startsWith('/en')
  ) {
    return NextResponse.next()
  }

  // ✅ Permitir /api/articulos solo si es GET
  if (pathname === '/api/articulos') {
    if (method === 'GET') return NextResponse.next()

    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const secret = process.env.ADMIN_SECRET

    if (token === secret) return NextResponse.next()

    return new NextResponse('No autorizado para escribir artículos', { status: 401 })
  }

  // ✅ Permitir /api/articulos/:id si es GET
  if (pathname.startsWith('/api/articulos/')) {
    if (method === 'GET') return NextResponse.next()

    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const secret = process.env.ADMIN_SECRET

    if (token === secret) return NextResponse.next()

    return new NextResponse('No autorizado para modificar artículos', { status: 401 })
  }

  // ✅ Proteger ruta /admin con token por query param
  if (pathname.startsWith('/admin')) {
    const token = searchParams.get('token')
    const secret = process.env.ADMIN_SECRET

    if (token === secret) return NextResponse.next()

    return new NextResponse('No autorizado para entrar a admin', { status: 401 })
  }

  // 🌐 Redirección de idioma por defecto
  const langHeader = request.headers.get('accept-language') || ''
  const lang = langHeader.slice(0, 2)
  const targetLang = lang === 'en' ? 'en' : 'es'

  return NextResponse.redirect(new URL(`/${targetLang}`, request.url))
}
