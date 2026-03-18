import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { EstimateService } from '../estimate/estimate.service';
import { ApiTags, ApiResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { ResourceAccessGuard } from '../auth/guards/resource-access.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { userRole } from '../user/enum/role.enum';

@ApiTags('invoice')
@UseGuards(AuthGuard, RolesGuard, ResourceAccessGuard)
@Controller('invoice')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly estimateService: EstimateService,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'Facture créée avec succès',
  })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Post()
  async create(@Body() createInvoiceDto: CreateInvoiceDto) {
    // Vérification de l'existence de estimate_id
    const estimate = await this.estimateService.findOne(
      createInvoiceDto.estimate_id,
    );
    if (!estimate) {
      throw new NotFoundException(
        `Estimate avec l'ID ${createInvoiceDto.estimate_id} introuvable`,
      );
    }

    return this.invoiceService.create(createInvoiceDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Liste des factures récupérées avec succès',
  })
  @ApiResponse({ status: 404, description: 'Facture introuvable' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @Get()
  findAll() {
    return this.invoiceService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Facture trouvée',
  })
  @ApiResponse({ status: 404, description: 'Facture introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @Get(':id')
  findOne(@Param('id') id: string) {
    // TODO: Vérifier que l'utilisateur est propriétaire du projet lié à cette facture
    return this.invoiceService.findOne(+id);
  }

  @ApiResponse({
    status: 200,
    description: 'Facture mise à jour avec succès',
  })
  @ApiResponse({ status: 404, description: 'Facture introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ) {
    // Si estimate_id est modifié, vérifier son existence
    if (updateInvoiceDto.estimate_id) {
      const estimate = await this.estimateService.findOne(
        updateInvoiceDto.estimate_id,
      );
      if (!estimate) {
        throw new NotFoundException(
          `Estimate avec l'ID ${updateInvoiceDto.estimate_id} introuvable`,
        );
      }
    }
    return this.invoiceService.update(+id, updateInvoiceDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Facture supprimée avec succès',
  })
  @ApiResponse({ status: 404, description: 'Facture introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @Delete(':id')
  remove(@Param('id') id: string) {
    // TODO: Vérifier que l'utilisateur est propriétaire du projet lié à cette facture
    return this.invoiceService.remove(+id);
  }
}
