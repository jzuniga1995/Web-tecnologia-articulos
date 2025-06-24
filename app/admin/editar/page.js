import ClientOnly from '@/app/components/ClientOnly'
import EditarArticulo from '@/app/components/EditarArticulo'

export default function Page() {
  return (
    <ClientOnly>
      <EditarArticulo />
    </ClientOnly>
  )
}
