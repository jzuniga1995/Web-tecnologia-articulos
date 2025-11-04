import { v2 as cloudinary } from 'cloudinary'
import { config } from 'dotenv'
import { db } from './db-migrate.js' // ⬅️ Usar db especial para migración
import { articulos } from '../lib/schema.js'
import { eq } from 'drizzle-orm'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Cargar variables de entorno desde .env.local
config({ path: path.resolve(__dirname, '..', '.env.local') })

// Verificar variables de entorno ANTES de configurar
console.log('🔍 Verificando variables de entorno...')
console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configurada' : '❌ No encontrada')
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? '✅ Configurada' : '❌ No encontrada')
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? '✅ Configurada' : '❌ No encontrada')
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? '✅ Configurada' : '❌ No encontrada')
console.log('')

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
}

async function migrateImagesToCloudinary() {
  console.log(`${colors.cyan}🚀 Iniciando migración de imágenes a Cloudinary...${colors.reset}\n`)

  // Verificar credenciales
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error(`${colors.red}❌ Error: Faltan credenciales de Cloudinary en .env.local${colors.reset}`)
    process.exit(1)
  }

  if (!process.env.DATABASE_URL) {
    console.error(`${colors.red}❌ Error: Falta DATABASE_URL en .env.local${colors.reset}`)
    process.exit(1)
  }

  try {
    // 1. Obtener todos los artículos de la base de datos
    console.log(`${colors.yellow}📊 Obteniendo artículos de la base de datos...${colors.reset}`)
    const todosLosArticulos = await db.select().from(articulos)
    console.log(`${colors.green}✅ Se encontraron ${todosLosArticulos.length} artículos${colors.reset}\n`)

    // 2. Filtrar artículos que aún no tienen URL de Cloudinary
    const articulosPorMigrar = todosLosArticulos.filter(
      (art) => !art.imagen.startsWith('https://res.cloudinary.com/')
    )

    if (articulosPorMigrar.length === 0) {
      console.log(`${colors.green}✅ ¡Todos los artículos ya están migrados a Cloudinary!${colors.reset}`)
      return
    }

    console.log(
      `${colors.yellow}📦 Artículos pendientes de migración: ${articulosPorMigrar.length}${colors.reset}\n`
    )

    // 3. Migrar cada artículo
    let exitosos = 0
    let fallidos = 0
    const errores = []

    for (const articulo of articulosPorMigrar) {
      console.log(`${colors.cyan}⏳ Procesando: "${articulo.titulo}"${colors.reset}`)
      console.log(`   Imagen actual: ${articulo.imagen}`)

      try {
        // Construir ruta completa de la imagen en public
        const rutaImagen = path.join(__dirname, '..', 'public', 'articulos', articulo.imagen)

        // Verificar que el archivo existe
        if (!fs.existsSync(rutaImagen)) {
          throw new Error(`Archivo no encontrado: ${rutaImagen}`)
        }

        // Subir imagen a Cloudinary
        console.log(`   📤 Subiendo a Cloudinary...`)
        const resultado = await cloudinary.uploader.upload(rutaImagen, {
          folder: 'neurobity-blog',
          public_id: path.parse(articulo.imagen).name,
          overwrite: false,
          resource_type: 'image',
        })

        const nuevaUrl = resultado.secure_url
        console.log(`   ✅ Subida exitosa: ${nuevaUrl}`)

        // Actualizar la base de datos con la nueva URL
        await db
          .update(articulos)
          .set({
            imagen: nuevaUrl,
            fecha_actualizacion: new Date(),
          })
          .where(eq(articulos.id, articulo.id))

        console.log(`   ✅ Base de datos actualizada`)
        console.log(`${colors.green}   ✔️  Artículo migrado exitosamente${colors.reset}\n`)

        exitosos++
      } catch (error) {
        console.error(`${colors.red}   ❌ Error al migrar: ${error.message}${colors.reset}\n`)
        fallidos++
        errores.push({
          articulo: articulo.titulo,
          imagen: articulo.imagen,
          error: error.message,
        })
      }

      // Pequeña pausa para no saturar la API de Cloudinary
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    // 4. Resumen final
    console.log(`\n${'='.repeat(60)}`)
    console.log(`${colors.cyan}📊 RESUMEN DE MIGRACIÓN${colors.reset}`)
    console.log(`${'='.repeat(60)}`)
    console.log(`${colors.green}✅ Exitosos: ${exitosos}${colors.reset}`)
    console.log(`${colors.red}❌ Fallidos: ${fallidos}${colors.reset}`)
    console.log(`📦 Total procesados: ${exitosos + fallidos}`)

    if (errores.length > 0) {
      console.log(`\n${colors.red}❌ Errores encontrados:${colors.reset}`)
      errores.forEach((err, index) => {
        console.log(`\n${index + 1}. ${err.articulo}`)
        console.log(`   Imagen: ${err.imagen}`)
        console.log(`   Error: ${err.error}`)
      })
    }

    console.log(`\n${colors.green}🎉 ¡Migración completada!${colors.reset}`)
  } catch (error) {
    console.error(`${colors.red}💥 Error fatal en la migración:${colors.reset}`, error)
    process.exit(1)
  }
}

// Ejecutar migración
migrateImagesToCloudinary()
  .then(() => {
    console.log(`\n${colors.green}✅ Script finalizado correctamente${colors.reset}`)
    process.exit(0)
  })
  .catch((error) => {
    console.error(`\n${colors.red}❌ Script finalizado con errores:${colors.reset}`, error)
    process.exit(1)
  })