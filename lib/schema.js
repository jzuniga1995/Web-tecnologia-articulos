import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const articulos = pgTable('articulos', {
  id: serial('id').primaryKey(),
  titulo: text('titulo').notNull(),
  slug: text('slug').notNull().unique(),
  contenido: text('contenido').notNull(),
  imagen: text('imagen').notNull(), 
  idioma: text('idioma').notNull(), 
  fecha: timestamp('fecha').defaultNow(),
  fecha_actualizacion: timestamp('fecha_actualizacion').defaultNow(),
});