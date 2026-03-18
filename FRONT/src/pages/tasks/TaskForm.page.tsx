// TaskForm.tsx
import React, { useState } from 'react';
import Button from '../../components/Buttons';
import type { Task, TaskStatus } from '../../types/task.type';

interface TaskFormProps {
  // En mode création, on n'a pas encore de Task complète (pas d'ID)
  initialData?: Partial<Task>; 
  onSubmit: (data: Omit<Task, 'id'>) => void;
  isLoading: boolean;
  title: string;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ 
  initialData, 
  onSubmit, 
  isLoading, 
  title, 
  onCancel 
}) => {
  // Initialisation de l'état local avec vos types
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    start_date: initialData?.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : '',
    end_date: initialData?.end_date ? new Date(initialData.end_date).toISOString().split('T')[0] : '',
    status: (initialData?.status as TaskStatus) || 'pending',
    entreprise_project_id: initialData?.entreprise_project_id ?? null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      entreprise_project_id: formData.entreprise_project_id,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-2xl mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">{title}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">Titre</label>
          <input
            type="text"
            required
            className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded-md outline-none"
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Début</label>
            <input
              type="date"
              required
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fin</label>
            <input
              type="date"
              required
              className="w-full p-2 border border-gray-300 rounded-md"
              value={formData.end_date}
              onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Statut</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md bg-white"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
          >
            <option value="pending">En attente</option>
            <option value="started">Démarrée</option>
            <option value="stopped">Arrêtée</option>
            <option value="finished">Terminée</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button type="button" onClick={onCancel} variant="secondary">
            Annuler
          </Button>
          <Button
            type="submit"
            loading={isLoading}
            className="px-6 py-2"
          >
            {initialData?.id ? "Mettre à jour" : "Créer la tâche"}
          </Button>
        </div>
      </form>
    </div>
  );
};