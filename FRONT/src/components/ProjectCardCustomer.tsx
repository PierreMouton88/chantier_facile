import { Info } from 'lucide-react';

// Interface pour typer les props du composant
interface ProjectCardProps {
  projectName: string;
  projectDelay: string;
  tradeBody: string;
}

const ProjectCardCustomer = ({ projectName, projectDelay, tradeBody }: ProjectCardProps) => {
  return (
    <div className="bg-gray-200 p-4 mb-2 rounded-lg flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        {/*Ajouter Link qui englobe Info*/}
        <Info className="text-gray-600 mr-3" size={20} />
        <div>
          <p className="font-semibold text-gray-800">{projectName}</p>
          <p className="text-sm text-gray-600">{tradeBody}</p>
        </div>
      </div>
      <p className="text-sm font-medium text-gray-700">{projectDelay}</p>
    </div>
  );
};

export default ProjectCardCustomer;