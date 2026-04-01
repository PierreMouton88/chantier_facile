import { NavLink, Outlet } from "react-router-dom"
import Button from "../components/Buttons"
import { Plus } from "lucide-react"
import { useMe } from "../hooks/useAuth"

export default function Documents() {
  const { data: user } = useMe()
  return (
    <div className="p-4 bg-white">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Mes Documents</h2>
      <div className="flex items-center justify-between mb-4">
        <div> Vous trouverez ici tous vos documents </div>
        {user?.role === 'entreprise' && (
          <Button to="/documents/devis/new" variant="secondary">
            <Plus size={18} /> Créer un Devis
          </Button>
        )}
      </div>

      <div className="flex gap-4 border-b border-gray-200 mb-6">

        <NavLink
          to="/documents/devis"
          className={({ isActive }) =>
            isActive
              ? "px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-medium"
              : "px-4 py-2 text-gray-600 hover:text-gray-800"
          }
        >
          Mes Devis
        </NavLink>

        <NavLink
          to="/documents/factures"
          className={({ isActive }) =>
            isActive
              ? "px-4 py-2 text-blue-600 border-b-2 border-blue-600 font-medium"
              : "px-4 py-2 text-gray-600 hover:text-gray-800"
          }
        >
          Mes Factures
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
}
