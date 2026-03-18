import { NotFoundException } from '@nestjs/common';

export class EstimateNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Estimate avec l'ID ${id} introuvable`);
  }
}
