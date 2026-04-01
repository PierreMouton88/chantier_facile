import { Plus } from 'lucide-react'
import { projects } from '../data/Project'
import ProjectCardCustomer from './ProjectCardCustomer'

import { useMe } from '../hooks/useAuth'

const DashboardCardCustomer = () => {
 const { data: user } = useMe();

 // Extraction type-safe du nom du user
 const userName = user && user.role === 'customer' && 'profile' in user
   ? user.profile.name
   : 'Utilisateur';

  return (
    <div className="p-4 bg-white min-h-screen">

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Bonjour, {userName} 👋</h2>
        <button className="bg-black text-white p-2 rounded-full shadow-md hover:bg-gray-800 transition-colors">
          <Plus size={24} /> {/* Icône Plus de Lucide */}
        </button>
      </div>

      {/* Section "Chantier en cours" */}
      <h3 className="text-xl font-semibold text-gray-500 mb-4">Chantier en cours</h3>

      {/* Liste des chantiers */}
      <div className="space-y-3">
        {projects.map(project => (
          <ProjectCardCustomer 
            key={project.id}
            projectName={project.name}
            projectDelay={project.delay}
            tradeBody={project.trade}
          />
        ))}
      </div>

     
    </div>
  );
};

export default DashboardCardCustomer;
