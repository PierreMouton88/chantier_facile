import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ProfessionService } from './profession.service';
import { CreateProfessionDto } from './dto/create-profession.dto';
import { UpdateProfessionDto } from './dto/update-profession.dto';
import { ApiTags, ApiResponse, ApiForbiddenResponse } from '@nestjs/swagger';

@ApiTags('profession')
@Controller('profession')
export class ProfessionController {
  constructor(private readonly professionService: ProfessionService) {}

  @ApiResponse({
    status: 201,
    description: 'Corps de métier créé avec succès',
  })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Post()
  create(@Body() createProfessionDto: CreateProfessionDto) {
    return this.professionService.create(createProfessionDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Liste des corps de métier récupérée avec succès',
  })
  @ApiResponse({ status: 404, description: 'Profession introuvable' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @Get()
  findAll() {
    return this.professionService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Corps de métier trouvé',
  })
  @ApiResponse({ status: 404, description: 'Corps de métier introuvable' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.professionService.findOne(+id);
  }

  @ApiResponse({
    status: 200,
    description: 'Corps de métier mise à jour avec succès',
  })
  @ApiResponse({ status: 404, description: 'Corps de métier introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateProfessionDto: UpdateProfessionDto,
  ) {
    return this.professionService.update(+id, updateProfessionDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Corps de métier supprimé avec succès',
  })
  @ApiResponse({ status: 404, description: 'Corps de métier introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.professionService.remove(+id);
  }
}
