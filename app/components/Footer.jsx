'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Facebook,
  Twitter,
  Github,
  Instagram,
  Linkedin,
} from 'lucide-react';
import {
  SiTiktok,
  SiReddit,
  SiQuora,
  SiX,
} from 'react-icons/si';

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      role="contentinfo"
      className="mt-24 px-6 py-16 text-center 
                 bg-white/5 backdrop-blur-xl 
                 border-t border-white/10 
                 shadow-[0_4px_60px_rgba(0,255,255,0.06)] 
                 hover:shadow-[0_6px_80px_rgba(0,255,255,0.12)] 
                 hover:ring-1 hover:ring-cyan-500/30 
                 transition-all duration-500"
    >
      {/* Marca + descripción */}
      <div className="max-w-4xl mx-auto mb-10">
        <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
          Neurobity
        </h2>
        <p className="text-sm text-zinc-400">
          Tecnología, inteligencia artificial y conocimiento para todos.
        </p>
      </div>

      {/* Redes sociales */}
      <div className="flex justify-center gap-6 flex-wrap mb-10 text-white text-opacity-90">
        <Link href="https://facebook.com/neurobity" aria-label="Facebook" target="_blank" className="hover:text-cyan-400 transition">
          <Facebook size={20} />
        </Link>
        <Link href="https://tiktok.com/@neurobity" aria-label="TikTok" target="_blank" className="hover:text-cyan-400 transition">
          <SiTiktok size={20} />
        </Link>
        <Link href="https://x.com/neurobity" aria-label="X" target="_blank" className="hover:text-cyan-400 transition">
          <SiX size={20} />
        </Link>
        <Link href="https://reddit.com/r/neurobity" aria-label="Reddit" target="_blank" className="hover:text-cyan-400 transition">
          <SiReddit size={20} />
        </Link>
        <Link href="https://quora.com/profile/Neurobity" aria-label="Quora" target="_blank" className="hover:text-cyan-400 transition">
          <SiQuora size={20} />
        </Link>
        <Link href="https://github.com/neurobity" aria-label="GitHub" target="_blank" className="hover:text-cyan-400 transition">
          <Github size={20} />
        </Link>
        <Link href="https://instagram.com/neurobity" aria-label="Instagram" target="_blank" className="hover:text-cyan-400 transition">
          <Instagram size={20} />
        </Link>
        <Link href="https://linkedin.com/company/neurobity" aria-label="LinkedIn" target="_blank" className="hover:text-cyan-400 transition">
          <Linkedin size={20} />
        </Link>
      </div>

      {/* Navegación */}
      <div className="flex justify-center gap-6 text-sm mb-6 flex-wrap text-zinc-400">
        <Link href="/es" className="hover:text-cyan-400">
          Inicio
        </Link>
        <Link href="/es/articulos" className="hover:text-cyan-400">
          Artículos
        </Link>
        <Link href="/es/privacidad" className="hover:text-cyan-400">
          Privacidad
        </Link>
        <Link href="/es/terminos" className="hover:text-cyan-400">
          Términos
        </Link>
      </div>

      {/* Copyright */}
      <p className="text-xs text-zinc-500">
        © {new Date().getFullYear()} <span className="text-white font-semibold">Neurobity</span> — Todos los derechos reservados.
      </p>
    </motion.footer>
  );
}
