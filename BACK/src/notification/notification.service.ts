import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async create(
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification> {
    return this.prisma.notification.create({
      data: {
        title: createNotificationDto.title || '',
        body: createNotificationDto.body || '',
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async findAll(
    options?: Prisma.NotificationFindManyArgs,
  ): Promise<Notification[]> {
    return this.prisma.notification.findMany(options);
  }

  async findOne(id: number): Promise<Notification | null> {
    return this.prisma.notification.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateNotificationDto): Promise<Notification> {
    const updateData = {
      ...data,
      updated_at: new Date(),
    };
    return await this.prisma.notification.update({
      where: { id: id },
      data: updateData,
    });
  }

  async remove(id: number): Promise<Notification> {
    return await this.prisma.notification.delete({ where: { id } });
  }
}
