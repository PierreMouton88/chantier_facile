import { NavLink } from 'react-router-dom'

export default function Contact() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Contact</h1>
        <p className="text-gray-600 mb-6">Pour toute question, contactez-nous.</p>
        <div className="flex items-center gap-4">
          <a href="mailto:support@chantierfacile.com" className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800">Email</a>
          <NavLink to="/home" className="rounded-md bg-white px-4 py-2 text-black ring-1 ring-gray-300 hover:bg-gray-50">Retour à l’accueil</NavLink>
        </div>
      </section>
    </main>
  )
}
