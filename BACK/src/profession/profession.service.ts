import { Injectable } from '@nestjs/common';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { UpdateProfessionDto } from './dto/update-profession.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Profession } from './entities/profession.entity';

@Injectable()
export class ProfessionService {
  constructor(private prisma: PrismaService) {}

  async create(createProfessionDto: CreateProfessionDto): Promise<Profession> {
    return this.prisma.profession.create({
      data: {
        profession_name: createProfessionDto.profession_name || '',
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async findAll(
    options?: Prisma.ProfessionFindManyArgs,
  ): Promise<Profession[]> {
    return this.prisma.profession.findMany(options);
  }

  async findOne(id: number): Promise<Profession | null> {
    return this.prisma.profession.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateProfessionDto): Promise<Profession> {
    const updateData = {
      ...data,
      updated_at: new Date(),
    };
    return await this.prisma.profession.update({
      where: { id: id },
      data: updateData,
    });
  }

  async remove(id: number): Promise<Profession> {
    return await this.prisma.profession.delete({ where: { id } });
  }
}
