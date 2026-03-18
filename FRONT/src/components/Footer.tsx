import { NavLink } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-gray-200 via-gray-300 to-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-2xl font-semibold text-gray-900">ChantierFacile</p>
            <p className="mt-2 text-sm text-gray-600">La plateforme qui simplifie la collaboration entre clients et entreprises de chantier.</p>
            <div className="mt-4 space-y-2 text-sm text-gray-700">
              <div className="flex items-center gap-2"><Mail size={16} /><span>contact@chantierfacile.app</span></div>
              <div className="flex items-center gap-2"><Phone size={16} /><span>+33 1 23 45 67 89</span></div>
              <div className="flex items-center gap-2"><MapPin size={16} /><span>Paris, France</span></div>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Pour les clients</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><NavLink to="/signupUser" className="hover:text-gray-900">Créer mon compte</NavLink></li>
              <li><NavLink to="/login" className="hover:text-gray-900">Me connecter</NavLink></li>
              <li><a href="#" className="hover:text-gray-900">Découvrir les fonctionnalités</a></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Pour les entreprises</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><NavLink to="/signupEntreprise" className="hover:text-gray-900">Créer un compte entreprise</NavLink></li>
              <li><NavLink to="/login" className="hover:text-gray-900">Accéder à mon espace</NavLink></li>
              <li><a href="#" className="hover:text-gray-900">Gérer devis & factures</a></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">Ressources</p>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Aide</a></li>
              <li><a href="#" className="hover:text-gray-900">Mentions légales</a></li>
              <li><a href="#" className="hover:text-gray-900">Confidentialité</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex items-center justify-between text-sm text-gray-500">
          <p>© 2025 ChantierFacile. Tous droits réservés.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-700">Conditions</a>
            <a href="#" className="hover:text-gray-700">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
