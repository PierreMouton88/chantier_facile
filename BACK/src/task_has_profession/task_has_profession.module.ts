import { Module } from '@nestjs/common';
import { TaskHasProfessionService } from './task_has_profession.service';
import { PrismaService } from '../prisma/prisma.service';
import { TaskModule } from '../task/task.module';
import { ProfessionModule } from '../profession/profession.module';

@Module({
  imports: [TaskModule, ProfessionModule],
  controllers: [],
  providers: [TaskHasProfessionService, PrismaService],
  exports: [TaskHasProfessionService],
})
export class TaskHasProfessionModule {}
