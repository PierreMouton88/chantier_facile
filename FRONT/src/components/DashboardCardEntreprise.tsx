import { Clock } from 'lucide-react'
import { projectsEntreprise } from '../data/ProjectEntreprise'
import ProjectCardEntreprise from './ProjectCardEntreprise'
import { useAuthCtx } from '../authContext/AuthContext'

const DashboardCardEntreprise = () => {
   const { user } = useAuthCtx();

   // Extraction type-safe du nom de l'entreprise
   const entrepriseName = user && user.role === 'entreprise' && 'profile' in user
     ? (user.profile.raisonSociale || 'Entreprise')
     : 'Entreprise';

  return (
        <div className="dashboard-card entreprise p-6">
            <div>
            <h2>Bienvenue {entrepriseName} ! 🏢</h2>
 <div className="flex justify-center gap-12 p-4  rounded-lg shadow-md">
    
    <div className="flex flex-col items-center text-center p-7 bg-gray-50 rounded-lg shadow-md">
      
      <div className="flex items-center space-x-2 mb-1">
        <Clock size={24} className="text-gray-600" /> 
        <p className="text-2xl font-semibold text-gray-800">
          {projectsEntreprise.length}
        </p>
      </div>
      
      <p className="text-sm text-gray-500 mt-[-5px]">
        Chantiers actifs
      </p>
    </div>

    <div className="border-l border-gray-300 h-16"></div> 

    <div className="flex flex-col items-center text-center p-7 bg-gray-50 rounded-lg shadow-md">
      
      <div className="flex items-center space-x-2 mb-1">
        <Clock size={24} className="text-gray-600" /> 
        <p className="text-2xl font-semibold text-gray-800">
          {projectsEntreprise.length}
        </p>
      </div>
      
      <p className="text-sm text-gray-500 mt-[-5px]">
        Tâches en cours
      </p>
    </div>

  </div>
            
            <p>Statistiques des ventes et gestion des employés.</p>
            </div>
            <div>
             {projectsEntreprise.map(project => (
          <ProjectCardEntreprise
            key={project.id}
            projectName={project.name}
            projectDelay={project.delay}
            tradeBody={project.trade}
            customerName={project.customerName}
          />
        ))}</div>
        <div className="flex justify-center mt-6">
        <div className="w-1/4 h-1 bg-gray-300 rounded-full"></div>
      </div>
        </div>
      
    );
};

export default DashboardCardEntreprise;
