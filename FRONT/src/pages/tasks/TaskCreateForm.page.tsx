import { useParams, useNavigate } from 'react-router-dom';
import { useCreateTask, useFindProjectWithTasks } from '../../hooks/useProject';
import { useAuthCtx } from '../../authContext/AuthContext';
import { TaskForm } from './TaskForm.page';

export const CreateTaskPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuthCtx();

  const createTask = useCreateTask();
  const { data: project } = useFindProjectWithTasks(Number(projectId));

  const entrepriseProjectId = project?.entreprises?.find(
    (ep) => ep.entreprise_id === user?.id
  )?.id;

  const handleCreate = (formData: any) => {
    const taskBody = {
      ...formData,
      entreprise_project_id: entrepriseProjectId,
    };

    createTask.mutate(
      {
        project_id: Number(projectId),
        body: taskBody,
      },
      {
        onSuccess: () => {
          navigate(`/projets`);
        },
      }
    );
  };

  return (
    <TaskForm
      title="Ajouter une nouvelle tâche"
      onSubmit={handleCreate}
      isLoading={createTask.isPending}
      onCancel={() => navigate(-1)}
      initialData={{
        status: 'pending'
      }}
    />
  );
};