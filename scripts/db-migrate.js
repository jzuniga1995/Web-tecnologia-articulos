import { config } from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Cargar variables ANTES de cualquier otra importación
config({ path: path.resolve(__dirname, '..', '.env.local') })

// Ahora sí importar drizzle
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from '../lib/schema.js'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 20000,
  connectionTimeoutMillis: 5000,
  allowExitOnIdle: true,
})

pool.on('error', (err) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err)
  process.exit(-1)
})

export const db = drizzle(pool, { schema })