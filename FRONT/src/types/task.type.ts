
export interface Task {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  status: TaskStatus;
  entreprise_project_id: number | null;
}

export type TaskStatus = "pending" | "stopped" | "finished" | "started";
