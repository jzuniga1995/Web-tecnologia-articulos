import ClientOnly from '@/app/components/ClientOnly'
import CrearArticulo from '@/app/components/CrearArticulo'

export default function Page() {
  return (
    <ClientOnly>
      <CrearArticulo />
    </ClientOnly>
  )
}
