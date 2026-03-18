import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Profession, TaskHasProfession } from '@prisma/client';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return await this.prisma.task.create({
      data: {
        ...createTaskDto,
        start_date: new Date(createTaskDto.start_date),
        end_date: new Date(createTaskDto.end_date),
        status: createTaskDto.status ?? 'pending',
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async findAll(options?: Prisma.TaskFindManyArgs): Promise<Task[]> {
    return this.prisma.task.findMany(options);
  }

  async findOne(id: number): Promise<Task> {
    return this.prisma.task.findUniqueOrThrow({ where: { id } });
  }

  async findOneTaskByProject(id: number): Promise<Task> {
    return this.prisma.task.findUniqueOrThrow({ where: { id } });
  }

  async update(id: number, data: UpdateTaskDto): Promise<Task> {
    const updateData: Prisma.TaskUpdateInput = {
      ...data,
      updated_at: new Date(),
    };

    if (data.start_date) {
      updateData.start_date = new Date(data.start_date);
    }
    if (data.end_date) {
      updateData.end_date = new Date(data.end_date);
    }

    return await this.prisma.task.update({
      where: { id: id },
      data: updateData,
    });
  }

  async remove(id: number): Promise<Task> {
    return await this.prisma.task.delete({ where: { id } });
  }

  async getProfessions(taskId: number): Promise<Profession[]> {
    const taskWithProfessions = await this.prisma.task.findUniqueOrThrow({
      where: { id: taskId },
      include: {
        professions: {
          include: {
            profession: true,
          },
        },
      },
    });
    // Retourne uniquement le tableau des professions
    return taskWithProfessions.professions.map((p) => p.profession);
  }

  async addProfessions(
    taskId: number,
    professionIds: number[],
  ): Promise<TaskHasProfession[]> {
    // Créer les liens dans la table associative pour chaque profession
    const createPromises = professionIds.map((professionId) =>
      this.prisma.taskHasProfession.create({
        data: {
          task_id: taskId,
          profession_id: professionId,
          created_at: new Date(),
          updated_at: new Date(),
        },
      }),
    );
    return await Promise.all(createPromises);
  }

  async removeProfession(
    taskId: number,
    professionId: number,
  ): Promise<{ count: number }> {
    // Supprimer le lien dans la table associative
    return await this.prisma.taskHasProfession.deleteMany({
      where: {
        task_id: taskId,
        profession_id: professionId,
      },
    });
  }
}
