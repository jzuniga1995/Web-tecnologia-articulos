import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js'; // ⬅️ Agregar .js

// Configuración optimizada del pool de conexiones
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // Suficiente para Vercel
  idleTimeoutMillis: 20000,
  connectionTimeoutMillis: 5000,
  allowExitOnIdle: true, // Importante para serverless
});

// Manejo de errores del pool
pool.on('error', (err) => {
  console.error('Error inesperado en el pool de PostgreSQL:', err);
  process.exit(-1);
});

export const db = drizzle(pool, { schema });