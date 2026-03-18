import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Project } from '@prisma/client';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async create(createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        title: createProjectDto.title,
        description: createProjectDto.description,
        start_date: new Date(createProjectDto.start_date),
        address_id: createProjectDto.address_id,
        customer_id: createProjectDto.customer_id,
        is_finished: createProjectDto.is_finished ?? false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  /**
   * Récupère un projet avec son adresse associée (Join)
   */
  async getProjectWithAddress(id: number): Promise<Project> {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        address: true, // Jointure simple vers la table Address
      },
    });

    if (!project) {
      throw new NotFoundException(`Le projet avec l'id ${id} est introuvable`);
    }

    return project;
  }

  async findAll(options?: Prisma.ProjectFindManyArgs): Promise<Project[]> {
    return this.prisma.project.findMany(options);
  }

  async findOne(id: number): Promise<Project | null> {
    return this.prisma.project.findUnique({ where: { id } });
  }

  async findOneWithTask(id: number): Promise<Project | null> {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        entreprises: {
          include: {
            tasks: {
              include: {
                professions: {
                  include: { profession: true },
                },
              },
            },
          },
        },
      },
    });
  }

  async findAllByUserId(userId: number): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: {
        OR: [
          { customer_id: userId },
          { entreprises: { some: { entreprise_id: userId } } },
        ],
      },
      include: {
        entreprises: {
          include: {
            tasks: {
              include: {
                professions: {
                  include: { profession: true },
                },
              },
            },
          },
        },
      },
    });
  }

  async update(id: number, data: UpdateProjectDto): Promise<Project> {
    const updateData: any = {
      ...data,
      updated_at: new Date(),
    };

    if (data.start_date) {
      updateData.start_date = new Date(data.start_date);
    }

    return await this.prisma.project.update({
      where: { id: id },
      data: updateData,
    });
  }

  async remove(id: number): Promise<boolean> {
    await this.prisma.project.delete({ where: { id } });
    return true;
  }

  async searchProjects(filters: {
    city?: string;
    zip_code?: string;
    is_finished?: boolean;
    page: number;
    limit: number;
    sort?: string;
  }) {
    const { city, zip_code, is_finished, page, limit, sort } = filters;
    const skip = (page - 1) * limit;

    const where: Prisma.ProjectWhereInput = {
      AND: [],
    };

    if (city) {
      (where.AND as Prisma.ProjectWhereInput[]).push({
        address: {
          city: {
            contains: city,
          },
        },
      });
    }

    if (zip_code) {
      (where.AND as Prisma.ProjectWhereInput[]).push({
        address: {
          zip_code: {
            contains: zip_code,
          },
        },
      });
    }

    if (is_finished !== undefined) {
      (where.AND as Prisma.ProjectWhereInput[]).push({
        is_finished,
      });
    }

    const orderBy: Prisma.ProjectOrderByWithRelationInput = {};
    if (sort === 'name_asc') {
      orderBy.title = 'asc';
    } else if (sort === 'name_desc') {
      orderBy.title = 'desc';
    } else if (sort === 'date_asc') {
      orderBy.start_date = 'asc';
    } else if (sort === 'date_desc') {
      orderBy.start_date = 'desc';
    } else {
      orderBy.title = 'asc';
    }

    const [data, total] = await Promise.all([
      this.prisma.project.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          address: true,
          customer: {
            include: {
              profile: true,
            },
          },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
