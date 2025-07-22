import { NextResponse } from 'next/server'

export function middleware(request) {
  const url = request.nextUrl
  const { pathname, searchParams } = url
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
    pathname.startsWith('/yandex_') // 🛡️ Permitimos el archivo de verificación de Yandex
  ) {
    return NextResponse.next()
  }

  // ✅ Permitir /api/articulos solo si es GET o con token válido
  if (pathname === '/api/articulos') {
    if (method === 'GET') return NextResponse.next()

    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const secret = process.env.ADMIN_SECRET

    if (token === secret) return NextResponse.next()

    return new NextResponse('No autorizado para escribir artículos', { status: 401 })
  }

  // ✅ Permitir /api/articulos/:id si es GET o con token válido
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

  // 🌐 Redirección por defecto: si no empieza con /es, redirige a la misma ruta bajo /es
  if (!pathname.startsWith('/es')) {
    url.pathname = `/es${pathname}`
    return NextResponse.redirect(url, 301)
  }

  return NextResponse.next()
}
