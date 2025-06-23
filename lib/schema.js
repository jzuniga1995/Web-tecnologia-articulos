import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const articulos = pgTable('articulos', {
  id: serial('id').primaryKey(),
  titulo: text('titulo').notNull(),
  slug: text('slug').notNull().unique(),
  contenido: text('contenido').notNull(),
  imagen: text('imagen').notNull(), // URL de imagen
  idioma: text('idioma').notNull(), // 'es' o 'en'
  fecha: timestamp('fecha').defaultNow(), // creación
  fecha_actualizacion: timestamp('fecha_actualizacion').defaultNow(), // 👈 nuevo campo
});
