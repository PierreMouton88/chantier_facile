import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateProject, useUpdateProject, useFindProjectById } from '../../hooks/useProject';
import { useAuthCtx } from '../../authContext/AuthContext';
import Button from '../../components/Buttons';
import { AddressPicker } from '../../components/pickers/AddressPicker';

export const ProjectForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthCtx();
  const isEditMode = Boolean(id);

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const { data: existingProject, isLoading } = useFindProjectById(Number(id));

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    address_id: 0,
    customer_id: user?.id,
    is_finished: false
  });

  useEffect(() => {
    if (isEditMode && existingProject) {
      setFormData({
        title: existingProject.title,
        description: existingProject.description,
        start_date: existingProject.start_date
          ? new Date(existingProject.start_date).toISOString().split('T')[0]
          : '',
        address_id: existingProject.address_id,
        is_finished: existingProject.is_finished,
        customer_id: existingProject.customer_id || user?.id,
      });
    }
  }, [existingProject, isEditMode, user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // On s'assure que l'ID d'adresse est présent
    if (!formData.address_id) {
      alert("Veuillez sélectionner ou créer une adresse pour le chantier.");
      return;
    }
    

    const projectDto = {
      ...formData,
      start_date: new Date(formData.start_date),
      customer_id: Number(formData.customer_id),
    };

    if (isEditMode && id) {
      updateProject.mutate(
        { id: Number(id), body: projectDto },
        { onSuccess: () => navigate('/projets') }
      );
    } else {
      createProject.mutate(projectDto, {
        onSuccess: () => navigate('/projets')
      });
    }
  };

  if (isEditMode && isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-2xl mt-10">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        {isEditMode ? "Modifier le Projet" : "Nouveau Projet"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">Titre</label>
          <input
            type="text"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 outline-none"
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
            <label className="block text-sm font-medium text-gray-700">Date Début</label>
            <input
              type="date"
              required
              className="w-full p-2 border border-gray-300 rounded-md outline-none"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
            />
          </div>
        </div>

        {/* Picker d'adresse intégré directement à l'état du formulaire */}
        <AddressPicker
          currentAddressId={formData.address_id}
          projectAddressId={existingProject?.address_id}
          onAddressSelected={(id) => setFormData({ ...formData, address_id: id })}
        />

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            type="button" 
            onClick={() => navigate('/projets')} 
            variant="secondary"
          >
            Annuler
          </Button>
          <Button
            type="submit"
            loading={createProject.isPending || updateProject.isPending}
            className="px-6 py-2"
          >
            {isEditMode ? "Mettre à jour" : "Créer le projet"}
          </Button>
        </div>
      </form>
    </div>
  );
};