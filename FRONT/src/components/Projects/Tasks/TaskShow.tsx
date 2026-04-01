import React from 'react';

import type { Task } from "../../../types/task.type";
import Button from "../../Buttons";
import type { Project } from '../../../types/projects.type';
import { useMe } from '../../../hooks/useAuth';



// Fonction utilitaire pour extraire les professions
const extractProfessions = (task: Task) => {
  // Assure la compatibilité avec la structure renvoyée par NestJS/Prisma `include: { profession: true }`
  return (task as any).professions?.map((association: any) =>
    association.profession
  ) || [];
}

export const TaskShow: React.FC<{ project: Project | undefined }> = ({ project }) => {

  const { data: user } = useMe();

  if (!project) return <p className="p-4 text-gray-500">Projet introuvable.</p>;

  const allTasks: Task[] = project.entreprises?.flatMap(ep => ep.tasks || []) || [];

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-100">

      <div className="border-b pb-4 mb-4">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
          {project.title}
        </h2>
        <p className="text-gray-600 italic border-l-4 border-indigo-200 pl-3">
          {project.description}
        </p>
      </div>
      <h3 className="text-2xl font-semibold text-gray-700 mb-4 mt-6">
        Tâches du Projet ({allTasks.length})
      </h3>
      {allTasks.length > 0 ? (
        <ul className="space-y-4">
          {allTasks.map((task: Task) => (
            <li
              key={task.id}
              className="p-4 border border-gray-200 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition duration-200"
            >
              <div className="flex justify-between items-start">
                <div className="flex-grow pr-4">
                  <h4 className="font-bold text-xl">
                    {task.title}
                  </h4>
                  <p className="text-sm text-gray-500 mb-3 capitalize">
                    Statut:
                    <span className={`font-medium ml-1 ${task.status === 'finished' ? 'text-green-600' :
                        task.status === 'started' ? 'text-blue-600' :
                          'text-yellow-600'
                      }`}>
                      {task.status}
                    </span>
                  </p>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <h5 className="font-semibold text-gray-700 mb-2">
                      Métiers Requis :
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {extractProfessions(task).map((prof: any) => (
                        <span
                          key={prof.id}
                          className="text-xs bg-indigo-100  font-medium px-3 py-1 rounded-full shadow-sm"
                        >
                          {prof.profession_name}
                        </span>
                      ))}
                      {extractProfessions(task).length === 0 && (
                        <span className="text-sm text-gray-400">Aucun métier assigné.</span>
                      )}
                    </div>
                  </div>
                </div>
                {user?.role === 'entreprise' && (
                <div className="flex">
                  <Button to={`/projets/${project.id}/tasks/edit/${task.id}`} variant="secondary">
                    Modifier la Tâche
                  </Button>
                </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-md">
          <p className="text-yellow-700">Aucune tâche n'est encore associée à ce projet.</p>
        </div>
      )}
    </div>
  );
};