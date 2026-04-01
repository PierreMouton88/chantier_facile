import React, { useState } from 'react';
import { useGetAllProjectsByUserId } from '../../hooks/useProject';
import { useMe } from '../../hooks/useAuth';
import Button from '../../components/Buttons';
import ProjectShow from '../../components/Projects/ProjectShow';
import { TaskShow } from '../../components/Projects/Tasks/TaskShow';



// Composant principal du tableau de bord des projets
export const PageProjets: React.FC = () => {
  const { data: user } = useMe()
  const { data: projects, isLoading: isLoadingProjects } = useGetAllProjectsByUserId(user!.id);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  console.log("project select :", selectedProjectId);
  console.log("Projets chargés :", projects);

  return (
    <div className="flex justify-center p-4 bg-white gap-20">

      {/* Colonne 1 : Liste des Projets */}
      <div >
        <div>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-gray-800 p-6">Mes Projets</h2>
            <Button to="/projets/new/project">Créer un nouveau projet</Button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <input
              id="toggleFinished"
              type="checkbox"
              className="h-4 w-4"
            />
            <label className="text-sm text-gray-700">
              Afficher les projets terminés
            </label>
          </div>
        </div>
        <h1> Tous les Projets</h1>
        {isLoadingProjects && <p>Chargement des projets...</p>}

        <ul>
          {projects?.map((project) => (
            <li
              key={project.id}
              onClick={() => setSelectedProjectId(project.id)}
              style={{
                cursor: 'pointer',
                fontWeight: selectedProjectId === project.id ? 'bold' : 'normal',
                padding: '5px'
              }}
            >
              <ProjectShow project={project} />
            </li>
          ))}
        </ul>

      </div>

      {/* Colonne 2 : Détails du Projet Sélectionné les Taches*/}
      <div className=''>
        <div>
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold text-gray-800 p-6">Mes Tâches</h2>
          

{user?.role === 'entreprise' && (
<Button
  to={selectedProjectId ? `/projets/${selectedProjectId}/tasks/new` : "#"}
  disabled={!selectedProjectId}
  className={!selectedProjectId ? "opacity-50 cursor-not-allowed" : ""}
>
  Créer une nouvelle Tâche
</Button>
)}
          </div>
        </div>
        {selectedProjectId ? (
          <TaskShow project={projects?.find(p => p.id === selectedProjectId)} />) : (
          <p>Sélectionnez un projet à gauche pour voir les détails et les tâches.</p>
        )}
      </div>
    </div>
  );
};