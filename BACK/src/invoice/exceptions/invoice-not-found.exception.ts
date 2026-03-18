import { NotFoundException } from '@nestjs/common';

export class InvoiceNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Invoice avec l'ID ${id} introuvable`);
  }
}
