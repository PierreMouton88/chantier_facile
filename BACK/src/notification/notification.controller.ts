import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { ApiTags, ApiResponse, ApiForbiddenResponse } from '@nestjs/swagger';

@ApiTags('notification')
@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiResponse({
    status: 201,
    description: 'Notification créée avec succès',
  })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationService.create(createNotificationDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Liste des notifications récupérées avec succès',
  })
  @ApiResponse({ status: 404, description: 'Notification introuvable' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @Get()
  findAll() {
    return this.notificationService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Notification trouvée',
  })
  @ApiResponse({ status: 404, description: 'Notification introuvable' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.notificationService.findOne(+id);
  }

  @ApiResponse({
    status: 200,
    description: 'Notification mise à jour avec succès',
  })
  @ApiResponse({ status: 404, description: 'Notification introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
  ) {
    return this.notificationService.update(+id, updateNotificationDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Notification supprimée avec succès',
  })
  @ApiResponse({ status: 404, description: 'Notification introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.notificationService.remove(+id);
  }
}
