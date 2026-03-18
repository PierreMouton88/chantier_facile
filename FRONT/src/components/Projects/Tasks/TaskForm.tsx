import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../Buttons';
import { ArrowLeft } from 'lucide-react';
import type { Task } from '../../../types/task.type';




const initialTaskState: Task = {
    id: 0,
    title: '',
    description: '',
    user_id: null,
    status: 'pending',
    start_date: '',
    end_date: '',
    project_id: 0,
};

export const CreateTask = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const projectId = parseInt(id || '0', 10);

    const [taskData, setTaskData] = useState<Task>({
        ...initialTaskState,
        id: projectId,
    });

    const [isSaving, setIsSaving] = useState(false);
    const [feedback, setFeedback] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTaskData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setFeedback('');

        const newTask = {
            ...taskData,
            taskId: Date.now(),
            ProjectId: projectId,
        };


        // Simuler un appel API (POST) pour créer la tâche
        setTimeout(() => {
            // En cas de succès :
            // 1. Ajouter la tâche à votre tableau 'tasks' ou base de données.
            // 2. Rediriger l'utilisateur (`/projets/${id}/tasks`)

            setIsSaving(false);
            setFeedback('✅ Tâche créée avec succès ! Redirection...');

            setTimeout(() => {
                navigate(`/projets/${id}/tasks`);
            }, 1000);

        }, 1500);
    };

    return (
        <div className='flex justify-between'>
            <div className=''></div>

            <div className="p-4 bg-white min-h-screen">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Créer une Nouvelle Tâche pour le Projet n°{projectId}
                </h2>

                {feedback && (
                    <div className="mb-4 p-3 text-sm rounded-lg text-green-700 bg-green-100">{feedback}</div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Champ Nom de la Tâche */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Nom de la Tâche</label>
                        <input
                            type="text"
                            name="title"
                            id="title"
                            value={taskData.title}
                            onChange={handleChange}
                            placeholder="Ex: Mise en place du design"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>

                    {/* Champ Métier */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Métier</label>
                        <input
                            type="text"
                            name="description"
                            id="description"
                            value={taskData.description}
                            onChange={handleChange}
                            placeholder="Ex: Développement Front-end"
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>


                    {/* Champ Statut */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Statut</label>
                        <select
                            name="status"
                            id="status"
                            value={taskData.status}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        >
                            <option value="À faire">À faire</option>
                            <option value="En cours">En cours</option>
                            <option value="Terminée">Terminée</option>
                            <option value="Bloquée">Bloquée</option>
                        </select>
                    </div>

                    {/* Champ Délai */}
                    <div>
                        <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">Délai (Date Limite)</label>
                        <input
                            type="date"
                            name="end_date"
                            id="end_date"
                            value={taskData.end_date}
                            onChange={handleChange}
                            required
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                        />
                    </div>

                    {/* Boutons d'Action */}
                    <div className="flex justify-between pt-4">
                        <Button to={`/projets/${id}/tasks`} variant="secondary">
                            <ArrowLeft size={20} /> Annuler
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? 'Création...' : 'Créer la Tâche'}
                        </Button>
                    </div>
                </form>
            </div>

            <div className=''></div>
        </div>

    );
};