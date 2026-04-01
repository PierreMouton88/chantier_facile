// Barre de navigation principale: liens centraux, contrôle droit (cloche, contact, menu profil), menu mobile
import { useEffect, useRef, useState } from "react";
import { Menu, X, Bell, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useMe, useLogout } from "../hooks/useAuth";
import type { User as AppUser } from "../types/user.type";
import logoCF from "../assets/logo_chantierFacile.png";

// Liens de navigation centraux pour le rôle entreprise
const navigationLinksEntreprise = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Chantiers", href: "/chantiers" },
  { name: "Planning", href: "/planning" },
  { name: "Mes Projets", href: "/projets" },
  { name: "Mes Documents", href: "/documents" },
];
// Liens de navigation centraux pour le rôle client
const navigationLinksCustomer = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Annuaire", href: "/annuaire" },
  { name: "Planning", href: "/planning" },
  { name: "Mes Projets", href: "/projets" },
  { name: "Mes Documents", href: "/documents" },
];
/**
 * Retourne les liens centraux selon le rôle de l'utilisateur.
 * Si non authentifié, retourne un tableau vide (rien n'est affiché).
 */
const getNavigationLinks = (role: string | null, isAuthenticated: boolean) => {
  if (!isAuthenticated) return [];
  if (role === "entreprise") return navigationLinksEntreprise;
  if (role === "customer") return navigationLinksCustomer;
  return [];
};

/**
 * Calcule l'initiale du profil à afficher dans le menu compte.
 * Priorité: première lettre du prénom, sinon du nom, sinon de l'email.
 */
const getProfileInitial = (user: AppUser | null): string => {
  const first = (user as any)?.profile?.firstName?.[0];
  const last = (user as any)?.profile?.name?.[0];
  const email = user?.email?.[0];
  return ((first ?? last ?? email ?? "U") as string).toUpperCase();
};

// Affiche le logo de l'application
const Logo = () => (
  <div className="flex items-center">
    <div className="m-2">
      <NavLink to="/home" aria-label="Accueil">
        <img
          src={logoCF}
          alt="ChantierFacile"
          className="block h-8 sm:h-10 md:h-12 w-auto object-contain"
        />
      </NavLink>
    </div>
  </div>
);

// Rend les liens centraux uniquement si l'utilisateur est authentifié
const CenterNavigation = ({
  isAuthenticated,
  navigationLinks,
}: {
  isAuthenticated: boolean;
  navigationLinks: { name: string; href: string }[];
}) =>
  isAuthenticated ? (
    <div className="hidden lg:flex lg:space-x-4">
      {navigationLinks.map((link) => (
        <NavLink
          key={link.name}
          to={link.href}
          className="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
        >
          {link.name}
        </NavLink>
      ))}
    </div>
  ) : null;

/**
 * Menu profil (icône compte):
 * - Ouverture/fermeture contrôlée
 * - Fermeture au clic extérieur et avec Échap
 * - Animation de déploiement du haut vers le bas
 * - Contient initiale du profil, lien vers Profil et bouton Déconnexion
 */
const ProfileMenu = ({
  user,
  onLogout,
}: {
  user: AppUser | null;
  onLogout: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const profileMenuContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocumentMouseDown = (e: MouseEvent) => {
      if (
        isOpen &&
        profileMenuContainerRef.current &&
        !profileMenuContainerRef.current.contains(e.target as Node)
      )
        setIsOpen(false);
    };
    const onDocumentKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", onDocumentMouseDown);
    document.addEventListener("keydown", onDocumentKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocumentMouseDown);
      document.removeEventListener("keydown", onDocumentKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={profileMenuContainerRef}>
      <button
        type="button"
        className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 ${isOpen ? "text-gray-900 bg-gray-100 ring-2 ring-indigo-500" : "text-gray-400 hover:text-gray-500"}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="sr-only">Accéder au compte</span>
        <User className="h-6 w-6" aria-hidden="true" />
      </button>
      <div
        className={`absolute right-0 top-10 w-64 bg-white rounded-lg shadow-lg border border-gray-200 origin-top transform transition-all duration-200 ease-out ${isOpen ? "opacity-100 scale-y-100 translate-y-0" : "opacity-0 scale-y-0 -translate-y-2 pointer-events-none"}`}
      >
        <div className="flex flex-col items-center p-4">
          <div className="h-12 w-12 rounded-full bg-rose-300 text-white flex items-center justify-center text-lg font-semibold">
            {getProfileInitial(user)}
          </div>
        </div>
        <div className="px-4 pb-4">
          <NavLink
            to="/profile"
            className="block w-full text-center border rounded-md py-2 text-gray-900 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Modifier profil
          </NavLink>
          <button
            className="mt-3 w-full rounded-md bg-rose-400 text-white py-2 hover:bg-rose-500"
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
          >
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
};

// Contrôles à droite: cloche (auth), contact (public), menu profil/login, hamburger mobile
const RightControls = ({
  isAuthenticated,
  user,
  onLogout,
  isMobileMenuOpen,
  toggleMobileMenu,
}: {
  isAuthenticated: boolean;
  user: AppUser | null;
  onLogout: () => void;
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
}) => (
  <div className="flex items-center gap-4">
    {isAuthenticated && (
      <NavLink
        to="/notification"
        type="button"
        className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span className="sr-only">Voir les notifications</span>
        <Bell className="h-6 w-6" aria-hidden="true" />
      </NavLink>
    )}

    {!isAuthenticated && (
      <NavLink
        to="/contact"
        className="text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium"
      >
        Contact
      </NavLink>
    )}

    {isAuthenticated ? (
      <ProfileMenu user={user} onLogout={onLogout} />
    ) : (
      <NavLink
        to="/login"
        type="button"
        className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <span className="sr-only">Accéder au compte</span>
        <User className="h-6 w-6" aria-hidden="true" />
      </NavLink>
    )}

    {isAuthenticated && (
      <div className="lg:hidden ml-4">
        <button
          onClick={toggleMobileMenu}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          aria-controls="mobile-menu"
          aria-expanded="false"
        >
          <span className="sr-only">Ouvrir le menu principal</span>
          {isMobileMenuOpen ? (
            <X className="block h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="block h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>
    )}
  </div>
);

// Menu mobile déroulant: affiche les liens centraux en mode mobile quand authentifié
const MobileMenu = ({
  isAuthenticated,
  isMobileMenuOpen,
  navigationLinks,
  close,
}: {
  isAuthenticated: boolean;
  isMobileMenuOpen: boolean;
  navigationLinks: { name: string; href: string }[];
  close: () => void;
}) => (
  <div className="lg:hidden" id="mobile-menu">
    {isMobileMenuOpen && isAuthenticated && (
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
        {navigationLinks.map((link) => (
          <NavLink
            key={link.name}
            to={link.href}
            className="text-gray-900 hover:bg-indigo-50 block px-3 py-2 rounded-md text-base font-medium"
            onClick={close}
          >
            {link.name}
          </NavLink>
        ))}
      </div>
    )}
  </div>
);

/**
 * Composant principal de la Navbar.
 * Assemble Logo, liens centraux, contrôles à droite et menu mobile.
 */
export const NavigationBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { data: userData } = useMe();
  const user = userData ?? null;

  const logoutMutation = useLogout();
  const isAuthenticated = !!user;
  const role = user?.role ?? null;

  const navigationLinks = getNavigationLinks(role, isAuthenticated);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const onLogout = () => {
    logoutMutation.mutate();
    navigate("/home");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Logo />
          <CenterNavigation
            isAuthenticated={isAuthenticated}
            navigationLinks={navigationLinks}
          />
          <RightControls
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={onLogout}
            isMobileMenuOpen={isMobileMenuOpen}
            toggleMobileMenu={toggleMobileMenu}
          />
        </div>
      </div>
      <MobileMenu
        isAuthenticated={isAuthenticated}
        isMobileMenuOpen={isMobileMenuOpen}
        navigationLinks={navigationLinks}
        close={toggleMobileMenu}
      />
    </nav>
  );
};
