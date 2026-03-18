import { Injectable } from '@nestjs/common';
import { CreateTaskHasProfessionDto } from './dto/create-task_has_profession.dto';
import { UpdateTaskHasProfessionDto } from './dto/update-task_has_profession.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { TaskHasProfession } from './entities/task_has_profession.entity';

@Injectable()
export class TaskHasProfessionService {
  constructor(private prisma: PrismaService) {}

  async create(createTaskHasProfessionDto: CreateTaskHasProfessionDto) {
    return this.prisma.taskHasProfession.create({
      data: {
        task_id: createTaskHasProfessionDto.task_id,
        profession_id: createTaskHasProfessionDto.profession_id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async findAll(
    options?: Prisma.TaskHasProfessionFindManyArgs,
  ): Promise<TaskHasProfession[]> {
    return this.prisma.taskHasProfession.findMany(options);
  }

  async findOne(id: number): Promise<TaskHasProfession | null> {
    return this.prisma.taskHasProfession.findUnique({ where: { id } });
  }

  async update(
    id: number,
    data: UpdateTaskHasProfessionDto,
  ): Promise<TaskHasProfession> {
    const updateData = {
      ...data,
      updated_at: new Date(),
    };
    return await this.prisma.taskHasProfession.update({
      where: { id: id },
      data: updateData,
    });
  }

  async remove(id: number): Promise<boolean> {
    await this.prisma.taskHasProfession.delete({ where: { id } });
    return true;
  }
}
