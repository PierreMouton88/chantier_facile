import { TaskService } from './../task/task.service';
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  NotFoundException,
  BadRequestException,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { AddressService } from '../address/address.service';
import { UserService } from '../user/user.service';

import { ApiTags, ApiResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreateTaskDto } from '../task/dto/create-task.dto';
import { UpdateTaskDto } from '../task/dto/update-task.dto';
import {
  OwnerOrAdmin,
  ProjectOwnerOrAdmin,
} from '../auth/decorators/resource-access.decorator';
import { ResourceAccessGuard } from '../auth/guards/resource-access.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { userRole } from '../user/enum/role.enum';

@ApiTags('project')
@UseGuards(AuthGuard, RolesGuard, ResourceAccessGuard)
@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectService,
    private readonly addressService: AddressService,
    private readonly userService: UserService,
    private readonly taskService: TaskService,
  ) {}

  @ApiResponse({
    status: 201,
    description: 'Project créé avec succès',
  })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Post()
  async create(@Body() createProjectDto: CreateProjectDto) {
    const address = await this.addressService.findOne(
      createProjectDto.address_id,
    );
    if (!address) {
      throw new NotFoundException(
        `Address avec l'ID ${createProjectDto.address_id} introuvable`,
      );
    }

    const customer = await this.userService.findOne(
      createProjectDto.customer_id,
    );
    if (!customer) {
      throw new NotFoundException(
        `User avec l'ID ${createProjectDto.customer_id} introuvable`,
      );
    }
    if (customer.role !== 'customer') {
      throw new BadRequestException(
        `User avec l'ID ${createProjectDto.customer_id} n'a pas le rôle customer`,
      );
    }

    return this.projectService.create(createProjectDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Liste des projects récupérés avec succès',
  })
  @ApiResponse({ status: 404, description: 'Project introuvable' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin)
  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Liste des projects pour un utilisateur récupérés avec succès',
  })
  @ApiResponse({ status: 404, description: 'Utilisateur introuvable' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @OwnerOrAdmin('userId')
  @Get('user/:userId')
  async findAllByUserId(@Param('userId') userId: string) {
    const user = await this.userService.findOne(+userId);
    if (!user) {
      throw new NotFoundException(`User avec l'ID ${userId} introuvable`);
    }
    return this.projectService.findAllByUserId(+userId);
  }

  @ApiResponse({ status: 200, description: 'Project trouvé' })
  @ApiResponse({ status: 404, description: 'Project introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @ProjectOwnerOrAdmin('id')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const project = await this.projectService.findOne(+id);
    if (!project) {
      throw new NotFoundException(`Project avec l'ID ${id} introuvable`);
    }
    return project;
  }

  @ApiResponse({ status: 404, description: 'Project introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @ProjectOwnerOrAdmin('id')
  @Get(':id/tasks')
  findOneWithTask(@Param('id') id: string) {
    return this.projectService.findOneWithTask(+id);
  }

  @ApiResponse({
    status: 200,
    description: 'Project mis à jour avec succès',
  })
  @ApiResponse({ status: 404, description: 'Project introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @ProjectOwnerOrAdmin('id')
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Project supprimé avec succès',
  })
  @ApiResponse({ status: 404, description: 'Project introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @ProjectOwnerOrAdmin('id')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(+id);
  }

  // --- GESTION DES TASKS DU PROJECT ---

  @ApiResponse({
    status: 200,
    description: 'Liste des tasks du projet récupérées avec succès',
  })
  @ApiResponse({ status: 404, description: 'Project introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @ProjectOwnerOrAdmin('id')
  @Get(':id/task')
  async getAllTasks(@Param('id') projectId: string) {
    const project = await this.projectService.findOneWithTask(+projectId);
    if (!project) {
      throw new NotFoundException(`Project avec l'ID ${projectId} introuvable`);
    }
    return this.taskService.findAll({
      where: { entrepriseProject: { project_id: +projectId } },
    });
  }

  @ApiResponse({
    status: 200,
    description: 'Task trouvée',
  })
  @ApiResponse({ status: 404, description: 'Task ou Project introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @ProjectOwnerOrAdmin('id')
  @Get(':id/task/:taskId')
  async getOneTask(
    @Param('id') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    const project = await this.projectService.findOneWithTask(+projectId);
    if (!project) {
      throw new NotFoundException(`Project avec l'ID ${projectId} introuvable`);
    }

    const task = await this.taskService.findOne(+taskId);
    if (!task.entreprise_project_id) {
      throw new NotFoundException(
        `Task avec l'ID ${taskId} introuvable dans le project ${projectId}`,
      );
    }
    return task;
  }

  @ApiResponse({
    status: 201,
    description: 'Task créée avec succès',
  })
  @ApiResponse({ status: 404, description: 'Project introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Entreprise)
  @ProjectOwnerOrAdmin('id')
  @Post(':id/task')
  async createTask(
    @Param('id') projectId: string,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    const project = await this.projectService.findOneWithTask(+projectId);
    if (!project) {
      throw new NotFoundException(`Project avec l'ID ${projectId} introuvable`);
    }
    return this.taskService.create(createTaskDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Task mise à jour avec succès',
  })
  @ApiResponse({ status: 404, description: 'Task ou Project introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @ProjectOwnerOrAdmin('id')
  @Patch(':id/task/:taskId')
  async updateTask(
    @Param('id') projectId: string,
    @Param('taskId') taskId: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    const project = await this.projectService.findOneWithTask(+projectId);
    if (!project) {
      throw new NotFoundException(`Project avec l'ID ${projectId} introuvable`);
    }
    return this.taskService.update(+taskId, updateTaskDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Task supprimée avec succès',
  })
  @ApiResponse({ status: 404, description: 'Task ou Project introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Roles(userRole.Admin, userRole.Customer, userRole.Entreprise)
  @ProjectOwnerOrAdmin('id')
  @Delete(':id/task/:taskId')
  async removeTask(
    @Param('id') projectId: string,
    @Param('taskId') taskId: string,
  ) {
    const project = await this.projectService.findOneWithTask(+projectId);
    if (!project) {
      throw new NotFoundException(`Project avec l'ID ${projectId} introuvable`);
    }
    return this.taskService.remove(+taskId);
  }
}
