import { useParams, useNavigate } from 'react-router-dom';
import { useFindTask, useUpdateTask } from '../../hooks/useProject';

import type { Task } from '../../types/task.type';
import { TaskForm } from './TaskForm.page';

export const EditTaskPage = () => {
  const { projectId, taskId } = useParams<{ projectId: string; taskId: string }>();
  const navigate = useNavigate();
  
  // 1. On récupère la mutation
  const updateTask = useUpdateTask();

  // 2. On charge les données actuelles de la tâche
  const { data: task, isLoading } = useFindTask(
    Number(taskId), 
    Number(projectId)
  );

  // 3. La fonction de soumission que l'on passe au TaskForm
  const handleUpdate = (formData: Partial<Task>) => {
    // On appelle mutate avec l'objet exactement comme défini dans votre hook
    updateTask.mutate(
      { 
        project_id: Number(projectId), 
        taskId: Number(taskId), 
        body: formData 
      },
      {
        onSuccess: () => {
          // Retour au projet après succès
          navigate(`/projets`);
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <TaskForm 
      title="Modifier la Tâche"
      initialData={task}
      onSubmit={handleUpdate}
      isLoading={updateTask.isPending}
      onCancel={() => navigate(-1)}
    />
  );
};