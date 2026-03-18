import { Module } from '@nestjs/common';
import { ProfessionService } from './profession.service';
import { ProfessionController } from './profession.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ProfessionController],
  providers: [ProfessionService, PrismaService],
  exports: [ProfessionService],
})
export class ProfessionModule {}
