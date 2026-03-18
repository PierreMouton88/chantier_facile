import { Injectable } from '@nestjs/common';
import { CreateUserReceivesNotificationsDto } from './dto/create-user_receives_notifications.dto';
import { UpdateUserReceivesNotificationsDto } from './dto/update-user_receives_notifications.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { UserReceivesNotifications } from './entities/user_receives_notifications.entity';

@Injectable()
export class UserReceivesNotificationsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createUserReceivesNotificationsDto: CreateUserReceivesNotificationsDto,
  ) {
    return this.prisma.userReceivesNotifications.create({
      data: {
        notification_id: createUserReceivesNotificationsDto.notification_id,
        user_id: createUserReceivesNotificationsDto.user_id,
        is_read: createUserReceivesNotificationsDto.is_read ?? false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async findAll(
    options?: Prisma.UserReceivesNotificationsFindManyArgs,
  ): Promise<UserReceivesNotifications[]> {
    return this.prisma.userReceivesNotifications.findMany(options);
  }

  async findOne(id: number): Promise<UserReceivesNotifications | null> {
    return this.prisma.userReceivesNotifications.findUnique({ where: { id } });
  }

  async update(
    id: number,
    data: UpdateUserReceivesNotificationsDto,
  ): Promise<UserReceivesNotifications> {
    const updateData = {
      ...data,
      updated_at: new Date(),
    };
    return await this.prisma.userReceivesNotifications.update({
      where: { id: id },
      data: updateData,
    });
  }

  async remove(id: number): Promise<boolean> {
    await this.prisma.userReceivesNotifications.delete({ where: { id } });
    return true;
  }
}
