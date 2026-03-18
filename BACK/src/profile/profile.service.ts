import { Injectable, ConflictException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Profile } from './entities/profile.entity';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async create(createProfileDto: CreateProfileDto): Promise<Profile> {
    // Vérifier si le siret existe déjà (s'il est fourni)
    if (createProfileDto.siret) {
      const existingSiret = await this.prisma.profile.findUnique({
        where: { siret: createProfileDto.siret },
      });
      if (existingSiret) {
        throw new ConflictException(
          `Un profile avec le SIRET ${createProfileDto.siret} existe déjà`,
        );
      }
    }

    return this.prisma.profile.create({
      data: {
        ...createProfileDto,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async findAll(options?: Prisma.ProfileFindManyArgs): Promise<Profile[]> {
    return this.prisma.profile.findMany(options);
  }

  async findOne(user_id: number): Promise<Profile | null> {
    return this.prisma.profile.findUnique({ where: { user_id } });
  }

  async update(user_id: number, data: UpdateProfileDto): Promise<Profile> {
    // Vérifier si le siret existe déjà (s'il est fourni et différent de l'actuel)
    if (data.siret) {
      const existingSiret = await this.prisma.profile.findUnique({
        where: { siret: data.siret },
      });
      if (existingSiret && existingSiret.user_id !== user_id) {
        throw new ConflictException(
          `Un profile avec le SIRET ${data.siret} existe déjà`,
        );
      }
    }

    const updateData = {
      ...data,
      updated_at: new Date(),
    };
    return await this.prisma.profile.update({
      where: { user_id },
      data: updateData,
    });
  }

  async remove(user_id: number): Promise<boolean> {
    await this.prisma.profile.delete({ where: { user_id } });
    return true;
  }

  async getProfessions(userId: number) {
    const professions = await this.prisma.userHasProfession.findMany({
      where: { user_id: userId },
      include: { profession: true },
    });
    return professions.map((p) => p.profession);
  }

  async addProfessions(userId: number, professionIds: number[]) {
    const createPromises = professionIds.map((professionId) =>
      this.prisma.userHasProfession.create({
        data: {
          user_id: userId,
          profession_id: professionId,
          created_at: new Date(),
          updated_at: new Date(),
        },
      }),
    );

    return await Promise.all(createPromises);
  }

  async removeProfession(userId: number, professionId: number) {
    return await this.prisma.userHasProfession.delete({
      where: {
        user_id_profession_id: {
          user_id: userId,
          profession_id: professionId,
        },
      },
    });
  }
}
