import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { UserReceivesNotificationsService } from './user_receives_notifications.service';
import { CreateUserReceivesNotificationsDto } from './dto/create-user_receives_notifications.dto';
import { UpdateUserReceivesNotificationsDto } from './dto/update-user_receives_notifications.dto';
import { ApiTags, ApiResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { NotificationService } from '../notification/notification.service';

@ApiTags('user_receives_notifications')
@Controller('user_receives_notifications')
export class UserReceivesNotificationsController {
  constructor(
    private readonly userReceivesNotificationsService: UserReceivesNotificationsService,
    private readonly notificationService: NotificationService,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'UserReceivesNotifications créé avec succès',
  })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Post()
  async create(
    @Body()
    createUserReceivesNotificationsDto: CreateUserReceivesNotificationsDto,
  ) {
    // Vérification de l'existence de notification_id
    const notification = await this.notificationService.findOne(
      createUserReceivesNotificationsDto.notification_id,
    );
    if (!notification) {
      throw new NotFoundException(
        `Notification avec l'ID ${createUserReceivesNotificationsDto.notification_id} introuvable`,
      );
    }

    // Note: user_id sera vérifié quand le service User sera complété
    // const user = await this.userService.findOne(createUserReceivesNotificationsDto.user_id);
    // if (!user) {
    //   throw new NotFoundException(`User avec l'ID ${createUserReceivesNotificationsDto.user_id} introuvable`);
    // }

    return this.userReceivesNotificationsService.create(
      createUserReceivesNotificationsDto,
    );
  }

  @ApiResponse({
    status: 200,
    description: 'Liste des user_receives_notifications récupérées avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'UserReceivesNotifications introuvable',
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @Get()
  findAll() {
    return this.userReceivesNotificationsService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'UserReceivesNotifications trouvé',
  })
  @ApiResponse({
    status: 404,
    description: 'UserReceivesNotifications introuvable',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userReceivesNotificationsService.findOne(+id);
  }

  @ApiResponse({
    status: 200,
    description: 'UserReceivesNotifications mis à jour avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'UserReceivesNotifications introuvable',
  })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateUserReceivesNotificationsDto: UpdateUserReceivesNotificationsDto,
  ) {
    return this.userReceivesNotificationsService.update(
      +id,
      updateUserReceivesNotificationsDto,
    );
  }

  @ApiResponse({
    status: 200,
    description: 'UserReceivesNotifications supprimé avec succès',
  })
  @ApiResponse({
    status: 404,
    description: 'UserReceivesNotifications introuvable',
  })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userReceivesNotificationsService.remove(+id);
  }
}
