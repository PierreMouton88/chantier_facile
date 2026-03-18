import type { Project } from "./../types/projects.type";
import { projectApi } from "../api/project.api";
import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import type { Task } from "../types/task.type";
import type { Profession } from "../types/profession.type";

const PROJECTS_QUERY_KEY = "projects";
const TASKS_QUERY_KEY = "tasks";
const PROFESSIONS_QUERY_KEY = "professions";
const PROJECT_WITH_TASKS_QUERY_KEY = "projectWithTasks";

export const useGetAllProjects = (): UseQueryResult<Project[], Error> => {
  return useQuery<Project[], Error>({
    queryKey: [PROJECTS_QUERY_KEY],
    queryFn: () => projectApi.findAll(),
  });
};

export const useGetAllProjectsByUserId = (
  userId: number
): UseQueryResult<Project[], Error> => {
  return useQuery<Project[], Error>({
    queryKey: [PROJECTS_QUERY_KEY, "user", userId],
    queryFn: () => projectApi.findAllByUserId(userId),
    enabled: !!userId,
    staleTime: 60000
  });
};

export const useFindProjectById = (
  id: number
): UseQueryResult<Project | null, Error> => {
  return useQuery<Project | null, Error>({
    queryKey: [PROJECTS_QUERY_KEY, id],
    queryFn: () => projectApi.findOne(id),
    enabled: !!id,
  });
};

export const useFindProjectWithTasks = (
  id: number
): UseQueryResult<Project | null, Error> => {
  return useQuery<Project | null, Error>({
    queryKey: [PROJECTS_QUERY_KEY, id, PROJECT_WITH_TASKS_QUERY_KEY], 
    queryFn: () => projectApi.findOneWithTasks(id),
    enabled: !!id,
    staleTime: 1000* 60 * 5, 
  });
};

export const useCreateProject = (): UseMutationResult<
  Project,
  Error,
  Omit<Project, "id" | "created_at" | "updated_at" >
> => {
  const queryClient = useQueryClient();
  return useMutation<
    Project,
    Error,
    Omit<Project, "id" | "created_at" | "updated_at">
  >({
    mutationFn: (body) => projectApi.create(body),
    onSuccess: (response) => {
      console.log("Projet créé :", response.title);
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("Erreur lors de la création :", error);
    },
  });
};
export const useUpdateProject = (): UseMutationResult<
  Project,
  Error,
  { id: number; body: Partial<Project> }
> => {
  const queryClient = useQueryClient();
  return useMutation<Project, Error, { id: number; body: Partial<Project> }>({
    mutationFn: ({ id, body }) => projectApi.update(id, body),
    onSuccess: (response) => {
      console.log("Project updated :", response.title);
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour :", error);
    },
  });
};

export const useDeleteProject = (): UseMutationResult<void, Error, number> => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: (id) => projectApi.remove(id),
    onSuccess: () => {
      console.log("Projet effacé");
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression :", error);
    },
  });
};
// Gestion des Tâches des Projets
export const useFindTaskByProjectId = (
  project_id: number,
  id: number
): UseQueryResult<Task | null, Error> => {
  return useQuery<Task | null, Error>({
    queryKey: [PROJECTS_QUERY_KEY, project_id, TASKS_QUERY_KEY, id],
    queryFn: () => projectApi.getOneTask(project_id, id),
  });
};
  
export const useCreateTask = (): UseMutationResult<
  Task,
  Error,
  { project_id: number; body: Omit<Task, "id" | "created_at" | "updated_at"> }
> => {
  const queryClient = useQueryClient();
  return useMutation<
    Task,
    Error,
    { project_id: number; body: Omit<Task, "id" | "created_at" | "updated_at"> }
  >({
    mutationFn: ({ project_id, body }) => projectApi.addTask(project_id, body),
    onSuccess: (response) => {
      console.log("Tâche créée :", response.title);
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("Erreur lors de la création :", error);
    },
  });
};

export const useFindTask = (
  id: number,
  idProject: number
): UseQueryResult<Task | null, Error> => {
  return useQuery<Task | null, Error>({
    queryKey: [TASKS_QUERY_KEY, id],
    queryFn: () => projectApi.getOneTask(id, idProject),
  });
};

export const useUpdateTask = (): UseMutationResult<
  Task,
  Error,
  { project_id: number; taskId: number; body: Partial<Task> }
> => {
  const queryClient = useQueryClient();
  return useMutation<
    Task,
    Error,
    { project_id: number; taskId: number; body: Partial<Task> }
  >({
    mutationFn: ({ project_id, taskId, body }) =>
      projectApi.updateTask(project_id, body, taskId),
    onSuccess: (response) => {
      console.log("Tâche updated :", response.title);
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("Erreur lors de la mise à jour :", error);
    },
  });
};

export const useDeleteTask = (): UseMutationResult<
  void,
  Error,
  { project_id: number; taskId: number }
> => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, { project_id: number; taskId: number }>({
    mutationFn: ({ project_id, taskId }) =>
      projectApi.removeTask(project_id, taskId),
    onSuccess: () => {
      console.log("Tâche effacée");
      queryClient.invalidateQueries({ queryKey: [PROJECTS_QUERY_KEY] });
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression :", error);
    },
  });
};

// Gestion des professions des tâches
export const useGetTaskProfessions = (
  taskId: number
): UseQueryResult<Profession[], Error> => {
  return useQuery({
    queryKey: [TASKS_QUERY_KEY, taskId, PROFESSIONS_QUERY_KEY],
    queryFn: () => projectApi.getTaskProfessions(taskId),
    enabled: !!taskId,
  });
};

export const useAddProfessionsToTask = (): UseMutationResult<
  void,
  Error,
  { taskId: number; profession_ids: number[] }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, profession_ids }) =>
      projectApi.addProfessionsToTask(taskId, profession_ids),
    onSuccess: (_, variables) => {
      console.log("Professions ajoutées à la tâche");
      // Invalider les professions de la tâche
      queryClient.invalidateQueries({
        queryKey: [TASKS_QUERY_KEY, variables.taskId, PROFESSIONS_QUERY_KEY],
      });
    },
    onError: (error) => {
      console.error("Erreur lors de l'ajout des professions :", error);
    },
  });
};

export const useRemoveProfessionFromTask = (): UseMutationResult<
  void,
  Error,
  { taskId: number; professionId: number }
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, professionId }) =>
      projectApi.removeProfessionFromTask(taskId, professionId),
    onSuccess: (_, variables) => {
      console.log("Profession retirée de la tâche");
      queryClient.invalidateQueries({
        queryKey: [TASKS_QUERY_KEY, variables.taskId, PROFESSIONS_QUERY_KEY],
      });
    },
    onError: (error) => {
      console.error("Erreur lors de la suppression de la profession :", error);
    },
  });
};
