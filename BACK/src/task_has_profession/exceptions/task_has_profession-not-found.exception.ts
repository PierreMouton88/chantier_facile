import { NotFoundException } from '@nestjs/common';

export class TaskHasProfessionNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`TaskHasProfession avec l'ID ${id} introuvable`);
  }
}
