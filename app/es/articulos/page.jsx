import ListaArticulos from "@/app/components/ListaArticulos"

export const metadata = {
  title: 'Artículos | Neurobity',
  description: 'Explorá los últimos artículos sobre inteligencia artificial, tecnología y productividad.',
  alternates: {
    canonical: 'https://neurobity.com/es/articulos',
  },
}


export default function Page() {
  return <ListaArticulos />
}
