import type { Project } from "../types/projects.type";
import type { Task } from "../types/task.type";
import { axiosClient } from "../utils/axios-client";

const api = axiosClient();
const ENDPOINT = "/project";

export const projectApi = {
  // GET /project
  findAll: () => api.get<Project[]>(ENDPOINT).then((r) => r.data),

  // GET /project/user/:userId
  findAllByUserId: (userId: number) =>
    api.get<Project[]>(`${ENDPOINT}/user/${userId}`).then((r) => r.data),

  // GET /project/:id
  findOne: (id: number) =>
    api.get<Project>(`${ENDPOINT}/${id}`).then((r) => r.data),

  // GET /project/:id/tasks
  findOneWithTasks: (id: number) =>
    api.get<Project>(`${ENDPOINT}/${id}/tasks`).then((r) => r.data),

  // POST /project
  create: (data: Omit<Project, "id" | "created_at" | "updated_at">) =>
    api.post<Project>(ENDPOINT, data).then((r) => r.data),

  // PUT /project/:id
  update: (id: number, data: Partial<Project>) =>
    api.put<Project>(`${ENDPOINT}/${id}`, data).then((r) => r.data),

  // DELETE /project/:id
  remove: (id: number) =>
    api.delete<void>(`${ENDPOINT}/${id}`).then((r) => r.data),

  // Gestion des tasks

  // GET /project/:id/task (liste plate de toutes les tasks du projet)
  getAllTasksByProjectId: (projectId: number) =>
    api.get<Task[]>(`${ENDPOINT}/${projectId}/task`).then((r) => r.data),

  // GET /project/:id/task/:taskid
  getOneTask: (taskId: number, id: number) =>
    api.get<Task>(`${ENDPOINT}/${id}/task/${taskId}`).then((r) => r.data),

  // POST /project/:id/task
  addTask: (
    id: number,
    data: Omit<Task, "id" | "created_at" | "updated_at">
  ) => api.post<Task>(`${ENDPOINT}/${id}/task`, data).then((r) => r.data),

  // PUT /project/:id/task/:taskid
  updateTask: (id: number, data: Partial<Task>, taskId: number) =>
    api
      .patch<Task>(`${ENDPOINT}/${id}/task/${taskId}`, data)
      .then((r) => r.data),

  // DELETE /project/:id/task/:taskid
  removeTask: (id: number, taskId: number) =>
    api.delete<void>(`${ENDPOINT}/${id}/task/${taskId}`).then((r) => r.data),

  // Gestion des professions des tâches

  // Ici j'ai laissé la route /task car on peut en avoir besoin pour lister genre toutes les taches en retard, ou linker une tache à une notif.
  // Et donc on appelle professions par ces routes là, mais elles sont dispo par l'ORM quoiqu'il.
  // GET /task/:taskId/professions
  getTaskProfessions: (taskId: number) =>
    api.get(`/task/${taskId}/professions`).then((r) => r.data),

  // POST /task/:taskId/professions
  addProfessionsToTask: (taskId: number, profession_ids: number[]) =>
    api.post(`/task/${taskId}/professions`, { profession_ids }).then((r) => r.data),

  // DELETE /task/:taskId/professions/:professionId
  removeProfessionFromTask: (taskId: number, professionId: number) =>
    api.delete(`/task/${taskId}/professions/${professionId}`).then((r) => r.data),
};
