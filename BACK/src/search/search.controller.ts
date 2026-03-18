import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { userRole } from '../user/enum/role.enum';
import { UserService } from '../user/user.service';
import { ProjectService } from '../project/project.service';
import { CompanySearchResultDto } from './dto/company-search-result.dto';
import { ProjectSearchResultDto } from './dto/project-search-result.dto';
import { PaginatedResponseDto } from './dto/paginated-response.dto';
import { plainToInstance } from 'class-transformer';

@Controller('search')
@UseGuards(AuthGuard, RolesGuard)
export class SearchController {
  constructor(
    private readonly userService: UserService,
    private readonly projectService: ProjectService,
  ) {}

  @Get('companies')
  @Roles(userRole.Customer)
  async searchCompanies(
    @Query('city') city?: string,
    @Query('zip_code') zip_code?: string,
    @Query('profession') profession?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('sort') sort?: string,
  ): Promise<PaginatedResponseDto<CompanySearchResultDto>> {
    const result = await this.userService.searchCompanies({
      city,
      zip_code,
      profession,
      page,
      limit,
      sort,
    });

    const transformedData = plainToInstance(
      CompanySearchResultDto,
      result.data,
      {
        excludeExtraneousValues: true,
      },
    );

    return {
      data: transformedData,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Get('companies/:id')
  @Roles(userRole.Customer)
  async getCompanyDetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<CompanySearchResultDto> {
    const user = await this.userService.getcompleteUser(id);
    return plainToInstance(CompanySearchResultDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Get('projects')
  @Roles(userRole.Entreprise)
  async searchProjects(
    @Query('city') city?: string,
    @Query('zip_code') zip_code?: string,
    @Query('is_finished') is_finished?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 10,
    @Query('sort') sort?: string,
  ): Promise<PaginatedResponseDto<ProjectSearchResultDto>> {
    const isFinishedBool =
      is_finished === 'true'
        ? true
        : is_finished === 'false'
          ? false
          : undefined;

    const result = await this.projectService.searchProjects({
      city,
      zip_code,
      is_finished: isFinishedBool,
      page,
      limit,
      sort,
    });

    const transformedData = plainToInstance(
      ProjectSearchResultDto,
      result.data,
      {
        excludeExtraneousValues: true,
      },
    );

    return {
      data: transformedData,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    };
  }

  @Get('projects/:id')
  @Roles(userRole.Entreprise)
  async getProjectDetails(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProjectSearchResultDto> {
    const projectWithCustomer = await this.projectService.findAll({
      where: { id },
      include: {
        address: true,
        customer: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!projectWithCustomer[0]) {
      throw new Error(`Project ${id} not found`);
    }

    return plainToInstance(ProjectSearchResultDto, projectWithCustomer[0], {
      excludeExtraneousValues: true,
    });
  }

  @Get('projects/:id/tasks')
  @Roles(userRole.Entreprise)
  async getProjectTasks(@Param('id', ParseIntPipe) id: number) {
    const project = await this.projectService.findOneWithTask(id);

    if (!project) {
      throw new Error(`Project ${id} not found`);
    }

    return project;
  }
}
