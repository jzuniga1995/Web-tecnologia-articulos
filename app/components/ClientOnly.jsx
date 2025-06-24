'use client'

import { Suspense } from 'react'

export default function ClientOnly({ children }) {
  return (
    <Suspense fallback={<div className="p-6">Cargando...</div>}>
      {children}
    </Suspense>
  )
}
