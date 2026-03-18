import { NotFoundException } from '@nestjs/common';

export class TaskNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Task avec l'ID ${id} introuvable`);
  }
}
