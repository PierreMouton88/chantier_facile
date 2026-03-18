import { Module } from '@nestjs/common';
import { UserReceivesNotificationsService } from './user_receives_notifications.service';
import { UserReceivesNotificationsController } from './user_receives_notifications.controller';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [NotificationModule],
  controllers: [UserReceivesNotificationsController],
  providers: [UserReceivesNotificationsService, PrismaService],
  exports: [UserReceivesNotificationsService],
})
export class UserReceivesNotificationsModule {}
