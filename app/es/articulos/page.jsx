import ListaArticulos from "@/app/components/ListaArticulos"

export const metadata = {
  title: 'Artículos en Español | Neurobity',
  description: 'Lee artículos recientes sobre tecnología, IA y productividad en español.',
  alternates: {
    canonical: 'https://neurobity.com/es/articulos',
  },
}

export default function Page() {
  return <ListaArticulos />
}
