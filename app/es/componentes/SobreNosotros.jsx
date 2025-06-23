'use client';
import { motion } from 'framer-motion';

export default function SobreNosotros() {
  return (
    <section
      id="sobrenosotros"
      className="max-w-6xl mx-auto text-center px-4 md:px-10 py-24"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text"
      >
        ¿Quiénes somos?
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        viewport={{ once: true }}
        className="text-lg md:text-xl text-zinc-300 max-w-3xl mx-auto"
      >
        En <span className="text-white font-semibold">Neurobity</span> creemos en un futuro impulsado por la tecnología, la inteligencia artificial y el pensamiento creativo. Creamos contenido y herramientas diseñadas para potenciar a desarrolladores, creadores y mentes curiosas en todo el mundo.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        viewport={{ once: true }}
        className="mt-10 text-zinc-400 text-sm"
      >
        <p><strong className="text-white">Misión:</strong> democratizar el acceso a herramientas y conocimiento sobre IA.</p>
        <p><strong className="text-white">Visión:</strong> construir una comunidad global donde la tecnología inspire el cambio.</p>
      </motion.div>
    </section>
  );
}
