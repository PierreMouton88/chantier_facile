import { NotFoundException } from '@nestjs/common';

export class LineNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Line avec l'ID ${id} introuvable`);
  }
}
