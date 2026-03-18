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
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UserService } from '../user/user.service';
import { ApiTags, ApiResponse, ApiForbiddenResponse } from '@nestjs/swagger';

@ApiTags('profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly userService: UserService,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'Profil créé avec succès',
  })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Post()
  async create(@Body() createProfileDto: CreateProfileDto) {
    const user = await this.userService.findOne(createProfileDto.user_id);
    if (!user) {
      throw new NotFoundException(
        `User avec l'ID ${createProfileDto.user_id} introuvable`,
      );
    }
    return this.profileService.create(createProfileDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Liste des profils récupérés avec succès',
  })
  @ApiResponse({ status: 404, description: 'Profil introuvable' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @Get()
  findAll() {
    return this.profileService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Profil trouvé',
  })
  @ApiResponse({ status: 404, description: 'Profil introuvable' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profileService.findOne(+id);
  }

  @ApiResponse({
    status: 200,
    description: 'Profil mis à jour avec succès',
  })
  @ApiResponse({ status: 404, description: 'Profil introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(+id, updateProfileDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Profil supprimé avec succès',
  })
  @ApiResponse({ status: 404, description: 'Profil introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profileService.remove(+id);
  }

  @ApiResponse({
    status: 201,
    description: 'Professions ajoutées au profil avec succès',
  })
  @ApiResponse({ status: 404, description: 'Profil ou profession introuvable' })
  @Post(':id/professions')
  async addProfessions(
    @Param('id') id: string,
    @Body() body: { profession_ids: number[] },
  ) {
    const profile = await this.profileService.findOne(+id);
    if (!profile) {
      throw new NotFoundException(`Profil avec l'ID ${id} introuvable`);
    }
    return this.profileService.addProfessions(+id, body.profession_ids);
  }

  @ApiResponse({
    status: 200,
    description: 'Profession supprimée du profil avec succès',
  })
  @ApiResponse({ status: 404, description: 'Profil ou profession introuvable' })
  @Delete(':id/professions/:professionId')
  async removeProfession(
    @Param('id') id: string,
    @Param('professionId') professionId: string,
  ) {
    return this.profileService.removeProfession(+id, +professionId);
  }
}
