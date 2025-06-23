'use client';
import { motion } from 'framer-motion';

export default function Contacto() {
  return (
    <section
      id="contacto"
      className="max-w-4xl mx-auto text-center px-4 md:px-10 py-24"
    >
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text"
      >
        Contacto
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        viewport={{ once: true }}
        className="text-zinc-300 text-lg mb-6"
      >
        ¿Tenés preguntas, sugerencias o querés colaborar?
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        viewport={{ once: true }}
        className="text-cyan-400 text-xl font-semibold"
      >
        <a
          href="mailto:contacto@neurobity.com"
          className="hover:underline"
        >
          contacto@neurobity.com
        </a>
      </motion.p>
    </section>
  );
}
