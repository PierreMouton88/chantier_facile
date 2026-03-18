import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateProjectDto } from './create-project.dto';

// On exclut address_id car il n'est pas modifiable
export class UpdateProjectDto extends PartialType(
  OmitType(CreateProjectDto, ['address_id'] as const),
) {}
