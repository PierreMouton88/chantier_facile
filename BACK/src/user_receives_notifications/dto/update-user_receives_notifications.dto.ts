import { PartialType } from '@nestjs/mapped-types';
import { CreateUserReceivesNotificationsDto } from './create-user_receives_notifications.dto';

export class UpdateUserReceivesNotificationsDto extends PartialType(
  CreateUserReceivesNotificationsDto,
) {}
