import { NotFoundException } from '@nestjs/common';

export class ProfileNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Profil avec l'ID ${id} introuvable`);
  }
}
