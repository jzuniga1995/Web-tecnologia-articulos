import sharp from 'sharp'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const carpeta = path.join(__dirname, 'public', 'articulos')

fs.readdir(carpeta, async (err, archivos) => {
  if (err) {
    console.error('❌ Error al leer la carpeta:', err)
    return
  }

  const webps = archivos.filter((archivo) => path.extname(archivo).toLowerCase() === '.webp')

  for (const archivo of webps) {
    const ruta = path.join(carpeta, archivo)

    try {
      const buffer = await sharp(ruta).webp({ quality: 50 }).toBuffer()
      fs.writeFileSync(ruta, buffer)
      console.log(`✅ Reoptimizada: ${archivo}`)
    } catch (error) {
      console.error(`❌ Falló: ${archivo}`, error)
    }
  }

  console.log('🎉 Reoptimización completa.')
})
