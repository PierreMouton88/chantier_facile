import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { EstimateService } from './estimate.service';
import { CreateEstimateDto } from './dto/create-estimate.dto';
import { UpdateEstimateDto } from './dto/update-estimate.dto';
import { ProjectService } from '../project/project.service';
import { ApiTags, ApiResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { LineService } from '../line/line.service';
import { CreateLineDto } from '../line/dto/create-line.dto';
import { UpdateLineDto } from '../line/dto/update-line.dto';
import { CreateEstimateWithLinesDto } from './dto/create-estimate-with-lines.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ResourceAccessGuard } from '../auth/guards/resource-access.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { userRole } from '../user/enum/role.enum';

@ApiTags('estimate')
@UseGuards(AuthGuard, RolesGuard, ResourceAccessGuard)
@Controller('estimate')
export class EstimateController {
  constructor(
    private readonly estimateService: EstimateService,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly lineService: LineService,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'Devis créé avec succès',
  })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Post()
  async create(@Body() createEstimateDto: CreateEstimateDto) {
    // Vérification de l'existence de project_id
    const project = await this.projectService.findOneWithTask(
      createEstimateDto.project_id,
    );
    if (!project) {
      throw new NotFoundException(
        `Project avec l'ID ${createEstimateDto.project_id} introuvable`,
      );
    }
    const entreprise = await this.userService.findOne(
      createEstimateDto.entreprise_id,
    );
    if (!entreprise) {
      throw new NotFoundException(
        `User avec l'ID ${createEstimateDto.entreprise_id} introuvable`,
      );
    }

    return this.estimateService.create(createEstimateDto);
  }

  @ApiResponse({
    status: 201,
    description: 'Devis et lignes créés avec succès',
  })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Post('with-lines')
  async createWithLines(@Body() dto: CreateEstimateWithLinesDto) {
    const project = await this.projectService.findOneWithTask(dto.project_id);
    if (!project) {
      throw new NotFoundException(
        `Project avec l'ID ${dto.project_id} introuvable`,
      );
    }
    const entreprise = await this.userService.findOne(dto.entreprise_id);
    if (!entreprise) {
      throw new NotFoundException(
        `User avec l'ID ${dto.entreprise_id} introuvable`,
      );
    }
    return this.estimateService.createWithLines(dto);
  }

  @ApiResponse({
    status: 200,
    description: 'Liste des estimates récupérés avec succès',
  })
  @ApiResponse({ status: 404, description: 'Devis introuvable' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @Get()
  findAll() {
    return this.estimateService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Devis trouvé',
  })
  @ApiResponse({ status: 404, description: 'Devis introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @Get(':id')
  findOne(@Param('id') id: string) {
    // TODO: Vérifier que l'utilisateur est propriétaire du projet lié à ce devis
    return this.estimateService.findOne(+id);
  }

  @ApiResponse({
    status: 200,
    description: 'Devis mis à jour avec succès',
  })
  @ApiResponse({ status: 404, description: 'Devis introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateEstimateDto: UpdateEstimateDto,
  ) {
    // Si project_id est modifié, vérifier son existence
    if (updateEstimateDto.project_id) {
      const project = await this.projectService.findOneWithTask(
        updateEstimateDto.project_id,
      );
      if (!project) {
        throw new NotFoundException(
          `Project avec l'ID ${updateEstimateDto.project_id} introuvable`,
        );
      }
    }
    if (updateEstimateDto.entreprise_id) {
      const entreprise = await this.userService.findOne(
        updateEstimateDto.entreprise_id,
      );
      if (!entreprise) {
        throw new NotFoundException(
          `User avec l'ID ${updateEstimateDto.entreprise_id} introuvable`,
        );
      }
    }

    return this.estimateService.update(+id, updateEstimateDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Devis supprimé avec succès',
  })
  @ApiResponse({ status: 404, description: 'Devis introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @Delete(':id')
  remove(@Param('id') id: string) {
    // TODO: Vérifier que l'utilisateur est propriétaire du projet lié à ce devis
    return this.estimateService.remove(+id);
  }

  // --- GESTION DES LINES DU DEVIS ---

  @ApiResponse({
    status: 200,
    description: 'Liste des lignes du devis récupérées avec succès',
  })
  @ApiResponse({ status: 404, description: 'Devis introuvable' })
  @Get(':id/lines')
  async getAllLines(@Param('id') estimateId: string) {
    const estimate = await this.estimateService.findOne(+estimateId);
    if (!estimate) {
      throw new NotFoundException(
        `Estimate avec l'ID ${estimateId} introuvable`,
      );
    }
    return this.lineService.findAll({ where: { estimate_id: +estimateId } });
  }

  @ApiResponse({
    status: 200,
    description: 'Ligne trouvée',
  })
  @ApiResponse({ status: 404, description: 'Ligne ou Devis introuvable' })
  @Get(':id/lines/:lineId')
  async getOneLine(
    @Param('id') estimateId: string,
    @Param('lineId') lineId: string,
  ) {
    const estimate = await this.estimateService.findOne(+estimateId);
    if (!estimate) {
      throw new NotFoundException(
        `Estimate avec l'ID ${estimateId} introuvable`,
      );
    }

    // Récupérer la ligne et vérifier qu'elle appartient au devis
    const line = await this.lineService.findOne(+lineId);
    if (!line) {
      throw new NotFoundException(`Line avec l'ID ${lineId} introuvable`);
    }
    if (line.estimate_id !== +estimateId) {
      throw new NotFoundException(
        `Line avec l'ID ${lineId} introuvable dans l'estimate ${estimateId}`,
      );
    }
    return line;
  }

  @ApiResponse({
    status: 201,
    description: 'Ligne créée avec succès',
  })
  @ApiResponse({ status: 404, description: 'Devis introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Post(':id/lines')
  async createLine(
    @Param('id') estimateId: string,
    @Body() createLineDto: CreateLineDto,
  ) {
    const estimate = await this.estimateService.findOne(+estimateId);
    if (!estimate) {
      throw new NotFoundException(
        `Estimate avec l'ID ${estimateId} introuvable`,
      );
    }
    createLineDto.estimate_id = +estimateId;

    return this.lineService.create(createLineDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Ligne mise à jour avec succès',
  })
  @ApiResponse({ status: 404, description: 'Ligne ou Devis introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Patch(':id/lines/:lineId')
  async updateLine(
    @Param('id') estimateId: string,
    @Param('lineId') lineId: string,
    @Body() updateLineDto: UpdateLineDto,
  ) {
    // Vérifier que le devis existe
    const estimate = await this.estimateService.findOne(+estimateId);
    if (!estimate) {
      throw new NotFoundException(
        `Estimate avec l'ID ${estimateId} introuvable`,
      );
    }

    // Vérifier que la ligne existe et appartient au devis
    const line = await this.lineService.findOne(+lineId);
    if (!line) {
      throw new NotFoundException(`Line avec l'ID ${lineId} introuvable`);
    }
    if (line.estimate_id !== +estimateId) {
      throw new NotFoundException(
        `Line avec l'ID ${lineId} introuvable dans l'estimate ${estimateId}`,
      );
    }

    return this.lineService.update(+lineId, updateLineDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Ligne supprimée avec succès',
  })
  @ApiResponse({ status: 404, description: 'Ligne ou Devis introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Delete(':id/lines/:lineId')
  async removeLine(
    @Param('id') estimateId: string,
    @Param('lineId') lineId: string,
  ) {
    // Vérifier que le devis existe
    const estimate = await this.estimateService.findOne(+estimateId);
    if (!estimate) {
      throw new NotFoundException(
        `Estimate avec l'ID ${estimateId} introuvable`,
      );
    }

    // Vérifier que la ligne existe et appartient au devis
    const line = await this.lineService.findOne(+lineId);
    if (!line) {
      throw new NotFoundException(`Line avec l'ID ${lineId} introuvable`);
    }
    if (line.estimate_id !== +estimateId) {
      throw new NotFoundException(
        `Line avec l'ID ${lineId} introuvable dans l'estimate ${estimateId}`,
      );
    }

    return this.lineService.remove(+lineId);
  }
}
