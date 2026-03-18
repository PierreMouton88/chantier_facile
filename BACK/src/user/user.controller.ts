import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { Prisma } from '@prisma/client';
import { userRole } from '../user/enum/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { OwnerOrAdmin } from '../auth/decorators/resource-access.decorator';
import { ResourceAccessGuard } from '../auth/guards/resource-access.guard';
import { UserWithProfileDto } from '../auth/dto/user-with-profile.dto';

@Controller('user')
@UseGuards(AuthGuard, RolesGuard, ResourceAccessGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(userRole.Admin)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  @Roles(userRole.Admin)
  async findAll(
    @Query() options?: Prisma.UserFindManyArgs,
  ): Promise<UserResponseDto[]> {
    return this.userService.findAll(options);
  }

  @Get('entreprise')
  @Roles(userRole.Admin)
  async findAllEntreprise(
    @Query() options?: Prisma.UserFindManyArgs,
  ): Promise<UserResponseDto[]> {
    return this.userService.findAllEntreprise(options);
  }

  @Get(':id')
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @OwnerOrAdmin('id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.findOne(+id);
  }

  @Get(':id/profile')
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @OwnerOrAdmin('id')
  async getUserwithProfile(
    @Param('id') id: string,
  ): Promise<UserWithProfileDto> {
    return this.userService.getcompleteUser(+id);
  }

  @Put(':id')
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @OwnerOrAdmin('id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @OwnerOrAdmin('id')
  async remove(@Param('id') id: string): Promise<UserResponseDto> {
    return this.userService.remove(+id);
  }
}
