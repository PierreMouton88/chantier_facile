import { IsInt, IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateUserReceivesNotificationsDto {
  @IsInt()
  @IsNotEmpty()
  notification_id: number;

  @IsInt()
  @IsNotEmpty()
  user_id: number;

  @IsBoolean()
  @IsOptional()
  is_read?: boolean;
}
