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
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiTags, ApiResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { Task } from './entities/task.entity';

@ApiTags('task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiResponse({
    status: 201,
    description: 'Task créée avec succès',
  })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Post()
  async create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    if (createTaskDto.entreprise_project_id) {
      // On pourrait vérifier l'existence de entreprise_project_id ici
    }
    return this.taskService.create(createTaskDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Liste des tasks récupérées avec succès',
  })
  @ApiResponse({ status: 404, description: 'Task introuvable' })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @ApiResponse({
    status: 200,
    description: 'Task trouvée',
  })
  @ApiResponse({ status: 404, description: 'Task introuvable' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @ApiResponse({
    status: 200,
    description: 'Task mise à jour avec succès',
  })
  @ApiResponse({ status: 404, description: 'Task introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.update(+id, updateTaskDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Task supprimée avec succès',
  })
  @ApiResponse({ status: 404, description: 'Task introuvable' })
  @ApiForbiddenResponse({ description: 'Accès refusé' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }

  @ApiResponse({
    status: 200,
    description: 'Liste des professions de la task récupérées avec succès',
  })
  @ApiResponse({ status: 404, description: 'Task introuvable' })
  @Get(':id/professions')
  async getProfessions(@Param('id') id: string) {
    const professions = await this.taskService.getProfessions(+id);
    if (!professions) {
      throw new NotFoundException(`Task avec l'ID ${id} introuvable`);
    }
    return professions;
  }

  @ApiResponse({
    status: 201,
    description: 'Professions ajoutées à la task avec succès',
  })
  @ApiResponse({ status: 404, description: 'Task ou profession introuvable' })
  @Post(':id/professions')
  async addProfessions(
    @Param('id') id: string,
    @Body() body: { profession_ids: number[] },
  ) {
    const task = await this.taskService.findOne(+id);
    if (!task) {
      throw new NotFoundException(`Task avec l'ID ${id} introuvable`);
    }
    return this.taskService.addProfessions(+id, body.profession_ids);
  }

  @ApiResponse({
    status: 200,
    description: 'Profession supprimée de la task avec succès',
  })
  @ApiResponse({ status: 404, description: 'Task ou profession introuvable' })
  @Delete(':id/professions/:professionId')
  async removeProfession(
    @Param('id') id: string,
    @Param('professionId') professionId: string,
  ) {
    return this.taskService.removeProfession(+id, +professionId);
  }
}
