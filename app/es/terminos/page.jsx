export const metadata = {
  title: 'Términos y Condiciones | Neurobity',
  description: 'Consulta los términos legales para el uso del sitio Neurobity.',
  alternates: {
    canonical: 'https://neurobity.com/terminos',
  },
}

export default function TerminosCondiciones() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-white">
      <h1 className="text-3xl font-bold mb-6">Términos y Condiciones</h1>
      <p className="mb-4">
        Al acceder y usar el sitio <strong>Neurobity</strong>, aceptás cumplir con estos términos. Si no estás de acuerdo, no deberías usar el sitio.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">1. Uso del contenido</h2>
      <p className="mb-4">
        Todo el contenido de este sitio es para fines informativos. No garantizamos que sea 100% preciso o actualizado. Usás el contenido bajo tu propia responsabilidad.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">2. Propiedad intelectual</h2>
      <p className="mb-4">
        Los textos, imágenes y diseños en este sitio pertenecen a Neurobity. No está permitido copiarlos, modificarlos o redistribuirlos sin autorización.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">3. Cambios a los términos</h2>
      <p className="mb-4">
        Podemos modificar estos términos en cualquier momento. Te recomendamos revisarlos periódicamente.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">4. Contacto</h2>
      <p>
        Para consultas legales o relacionadas con estos términos, escribí a <strong>webmasterpro25@gmail.com</strong>.
      </p>
    </div>
  )
}
