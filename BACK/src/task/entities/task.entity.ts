import { TaskStatus } from '@prisma/client';

export class Task {
  id: number;
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  status: TaskStatus;
  entreprise_project_id: number | null;
  updated_at: Date;
  created_at: Date;
}
