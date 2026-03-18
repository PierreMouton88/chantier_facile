import { NavLink } from 'react-router-dom'
import { Building2, Handshake, Hammer, Calendar, FileText, Users, ShieldCheck, Star } from 'lucide-react'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-100">
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-16 sm:pt-24 sm:pb-20 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="mx-auto max-w-3xl text-center lg:text-left">
              <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-7xl">ChantierFacile</h1>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">Vos travaux, simplement</h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">Collaborez avec des entreprises de chantier, suivez vos projets, gérez devis et factures en un seul endroit.</p>
              <div className="mt-8 flex items-center justify-center lg:justify-start gap-4">
                <NavLink to="/signupUser" className="rounded-full bg-black px-6 py-3 text-white hover:bg-gray-800">Je suis un client</NavLink>
                <NavLink to="/signupEntreprise" className="rounded-full bg-white px-6 py-3 text-black ring-1 ring-gray-300 hover:bg-gray-50">Je suis une entreprise</NavLink>
              </div>
              <div className="mt-4">
                <NavLink to="/login" className="text-sm text-gray-600 underline">Déjà un compte ? Se connecter</NavLink>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-yellow-800 ring-1 ring-yellow-300">
                  <Star size={14} className="text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold">98% Satisfaits</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://cdn.pixabay.com/photo/2018/07/13/23/03/planning-3536758_1280.jpg"
                alt="Chantier et collaboration"
                className="w-full h-[320px] sm:h-[380px] lg:h-[420px] object-cover rounded-3xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100"><Handshake className="text-gray-700" size={24} /></div>
            <h3 className="text-lg font-semibold text-gray-900">Collaboration transparente</h3>
            <p className="mt-2 text-sm text-gray-600">Clients et entreprises travaillent ensemble, avec une visibilité partagée sur l’avancement.</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100"><Building2 className="text-gray-700" size={24} /></div>
            <h3 className="text-lg font-semibold text-gray-900">Réseau d’entreprises</h3>
            <p className="mt-2 text-sm text-gray-600">Trouvez les bons professionnels par métier et spécialité pour votre chantier.</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100"><Hammer className="text-gray-700" size={24} /></div>
            <h3 className="text-lg font-semibold text-gray-900">Suivi des tâches</h3>
            <p className="mt-2 text-sm text-gray-600">Planifiez, assignez et suivez les tâches pour piloter vos travaux sereinement.</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100"><Calendar className="text-gray-700" size={24} /></div>
            <h3 className="text-lg font-semibold text-gray-900">Planning partagé</h3>
            <p className="mt-2 text-sm text-gray-600">Anticipez les délais et les interventions avec un calendrier simple et clair.</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100"><FileText className="text-gray-700" size={24} /></div>
            <h3 className="text-lg font-semibold text-gray-900">Devis & factures</h3>
            <p className="mt-2 text-sm text-gray-600">Centralisez vos documents et suivez les validations en un clin d’œil.</p>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100"><Users className="text-gray-700" size={24} /></div>
            <h3 className="text-lg font-semibold text-gray-900">Professions & métiers</h3>
            <p className="mt-2 text-sm text-gray-600">Associez des professions aux profils et aux tâches pour une meilleure organisation.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="rounded-3xl bg-black px-8 py-12 text-white">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <h4 className="text-xl font-semibold">1. Publiez votre projet</h4>
              <p className="mt-2 text-sm text-gray-300">Décrivez vos travaux, vos délais et vos préférences.</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold">2. Recevez des devis</h4>
              <p className="mt-2 text-sm text-gray-300">Comparez les propositions et sélectionnez les bons partenaires.</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold">3. Suivez l’avancement</h4>
              <p className="mt-2 text-sm text-gray-300">Gardez le cap avec un planning partagé et des tâches claires.</p>
            </div>
          </div>
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-gray-300"><ShieldCheck size={20} /><span>Cookies sécurisés, rafraîchissement des sessions sans friction</span></div>
            <div className="flex gap-3">
              <NavLink to="/signupUser" className="rounded-full bg-white px-5 py-3 text-black hover:bg-gray-100">Commencer en tant que client</NavLink>
              <NavLink to="/signupEntreprise" className="rounded-full bg-white px-5 py-3 text-black hover:bg-gray-100">Créer un compte entreprise</NavLink>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
