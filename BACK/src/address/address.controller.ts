import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AddressService } from './address.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { ApiResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { userRole } from '../user/enum/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('address')
@UseGuards(AuthGuard, RolesGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  //create
  @ApiResponse({
    status: 201,
    description: 'Addresse créée avec succès',
  })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Post()
  create(@Body() createAddressDto: CreateAddressDto) {
    return this.addressService.create(createAddressDto);
  }

  //findall
  @Roles(userRole.Admin)
  @ApiResponse({
    status: 200,
    description: 'Liste des addresses récupérées avec succès',
  })
  @ApiResponse({ status: 404, description: 'Addresse introuvable' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @Get()
  findAll() {
    return this.addressService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Addresse trouvée',
  })

  //findone
  @Roles(userRole.Customer, userRole.Entreprise, userRole.Admin)
  @ApiResponse({ status: 404, description: 'Addresse introuvable' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addressService.findOne(+id);
  }

  //update
  @Roles(userRole.Customer, userRole.Entreprise, userRole.Admin)
  @ApiResponse({
    status: 200,
    description: 'Addresse mise à jour avec succès',
  })
  @ApiResponse({ status: 404, description: 'Addresse introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressService.update(+id, updateAddressDto);
  }

  //delete
  @Roles(userRole.Admin)
  @ApiResponse({
    status: 200,
    description: 'Addresse supprimée avec succès',
  })
  @ApiResponse({ status: 404, description: 'Addresse introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.addressService.remove(+id);
  }
}
