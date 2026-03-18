import { useParams } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { tasks } from '../data/ProjectforTask';
import Button from '../components/Buttons';
import { TaskComponent } from '../components/Projects/Tasks/Task';

export const ProjectTasks = () => {

    const { id } = useParams<{ id: string }>();
    const projectId = parseInt(id || '0', 10);
    const filteredTasks = tasks.filter((task: { ProjectId: number; }) => task.ProjectId === projectId);

    return (
        <div className="p-4 bg-white ">

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Bonjour, USER 👋</h2>
                <div className="flex gap-3">
                    <Button to={`/projets/${id}/devis/new`} variant="secondary"><Plus size={20} />Créer un Devis</Button>
                    <Button to={`/projets/${id}/new`}><Plus size={20} />Nouvelle Tâche</Button>
                </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-500 mb-4">
                Tâches pour le Projet n°{projectId}
            </h3>

            <div className="space-y-3">
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                        <TaskComponent ProjectId={task} />
                    ))
                ) : (
                    <p className="text-gray-500 italic">
                        Aucune tâche trouvée pour ce projet ({projectId}).
                    </p>
                )}
            </div>

        </div>
    );
};