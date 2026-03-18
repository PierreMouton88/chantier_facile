import { Injectable, ConflictException } from '@nestjs/common';
import { CreateEstimateDto } from './dto/create-estimate.dto';
import { UpdateEstimateDto } from './dto/update-estimate.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Estimate } from './entities/estimate.entity';
import { CreateEstimateWithLinesDto } from './dto/create-estimate-with-lines.dto';

@Injectable()
export class EstimateService {
  constructor(private prisma: PrismaService) {}

  async create(createEstimateDto: CreateEstimateDto): Promise<Estimate> {
    // Vérifier si estimate_number existe déjà
    const existingEstimateNumber = await this.prisma.estimate.findUnique({
      where: { estimate_number: createEstimateDto.estimate_number },
    });
    if (existingEstimateNumber) {
      throw new ConflictException(
        `Un estimate avec le numéro ${createEstimateDto.estimate_number} existe déjà`,
      );
    }

    return this.prisma.estimate.create({
      data: {
        title: createEstimateDto.title,
        estimate_number: createEstimateDto.estimate_number,
        payment_type: createEstimateDto.payment_type ?? 'cash',
        is_validated_by_customer:
          createEstimateDto.is_validated_by_customer ?? false,
        limit_date: new Date(createEstimateDto.limit_date),
        project_id: createEstimateDto.project_id,
        entreprise_id: createEstimateDto.entreprise_id,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async findAll(options?: Prisma.EstimateFindManyArgs): Promise<Estimate[]> {
    return this.prisma.estimate.findMany({
      ...(options ?? {}),
      include: { lines: true },
    });
  }

  async findOne(id: number): Promise<Estimate | null> {
    return this.prisma.estimate.findUnique({
      where: { id },
      include: { lines: true },
    });
  }

  async update(id: number, data: UpdateEstimateDto): Promise<Estimate> {
    // Vérifier si estimate_number existe déjà (si modifié)
    if (data.estimate_number) {
      const existingEstimateNumber = await this.prisma.estimate.findUnique({
        where: { estimate_number: data.estimate_number },
      });
      if (existingEstimateNumber && existingEstimateNumber.id !== id) {
        throw new ConflictException(
          `Un estimate avec le numéro ${data.estimate_number} existe déjà`,
        );
      }
    }
    const updateData: any = {
      ...data,
      updated_at: new Date(),
    };
    // Convertir limit_date en Date si présent
    if (data.limit_date) {
      updateData.limit_date = new Date(data.limit_date);
    }
    return await this.prisma.estimate.update({
      where: { id: id },
      data: updateData,
    });
  }

  async remove(id: number): Promise<Estimate> {
    return await this.prisma.estimate.delete({ where: { id } });
  }

  async createWithLines(dto: CreateEstimateWithLinesDto): Promise<Estimate> {
    const existingEstimateNumber = await this.prisma.estimate.findUnique({
      where: { estimate_number: dto.estimate_number },
    });
    if (existingEstimateNumber) {
      throw new ConflictException(
        `Un estimate avec le numéro ${dto.estimate_number} existe déjà`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const created = await tx.estimate.create({
        data: {
          title: dto.title,
          estimate_number: dto.estimate_number,
          payment_type: dto.payment_type ?? 'cash',
          is_validated_by_customer: dto.is_validated_by_customer ?? false,
          limit_date: new Date(dto.limit_date),
          project_id: dto.project_id,
          entreprise_id: dto.entreprise_id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      });

      if (Array.isArray(dto.lines) && dto.lines.length > 0) {
        for (const line of dto.lines) {
          await tx.line.create({
            data: {
              description: line.description,
              quantity: line.quantity,
              price_per_qty: line.price_per_qty as any,
              estimate_id: created.id,
              created_at: new Date(),
              updated_at: new Date(),
            },
          });
        }
      }

      return tx.estimate.findUnique({
        where: { id: created.id },
        include: { lines: true },
      }) as unknown as Estimate;
    });
  }
}
