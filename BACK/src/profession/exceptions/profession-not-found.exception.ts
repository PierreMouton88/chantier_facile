import { NotFoundException } from '@nestjs/common';

export class ProfessionNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Corps de métier avec l'ID ${id} introuvable`);
  }
}
