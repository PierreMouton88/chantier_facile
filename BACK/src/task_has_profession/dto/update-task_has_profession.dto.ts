import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskHasProfessionDto } from './create-task_has_profession.dto';

export class UpdateTaskHasProfessionDto extends PartialType(
  CreateTaskHasProfessionDto,
) {}
