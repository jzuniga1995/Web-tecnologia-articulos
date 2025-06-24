'use client'

import dynamic from 'next/dynamic'

const EditarArticuloPage = dynamic(() => import('@/app/components/EditarArticulo'), {
  ssr: false, // 👈 esto lo forza al cliente
})

export default function Page() {
  return <EditarArticuloPage />
}
