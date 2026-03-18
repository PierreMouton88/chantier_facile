import { IsInt, IsNotEmpty } from 'class-validator';

export class CreateTaskHasProfessionDto {
  @IsInt()
  @IsNotEmpty()
  task_id: number;

  @IsInt()
  @IsNotEmpty()
  profession_id: number;
}
