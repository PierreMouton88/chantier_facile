import { NotFoundException } from '@nestjs/common';

export class UserReceivesNotificationsNotFoundException extends NotFoundException {
  constructor(id: number) {
    super(`UserReceivesNotifications avec l'ID ${id} introuvable`);
  }
}
