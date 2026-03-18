import { NotFoundException } from '@nestjs/common';

export class NotificationNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`Notification avec l'ID ${id} introuvable`);
  }
}
