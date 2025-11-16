import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { JwtAuthGuard, AuthUserContext } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { MembershipRole } from '../common/enums/membership-role.enum';
import { DocCompanies } from './companies.doc';
import { Query } from '@nestjs/common';
import { PaginationQueryDto } from './dto/PaginationQueryDto';
import { UsersService } from '../users/users.service';
@ApiTags('Empresas')
@Controller('companies')
@UseInterceptors(TransformInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompaniesController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @DocCompanies.Create()
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @CurrentUser() user: AuthUserContext,
  ) {
    return this.companiesService.create(createCompanyDto, user.id);
  }

  @Get()
  @DocCompanies.List()
  findAll(
    @CurrentUser() user: AuthUserContext,
    @Query() pagination: PaginationQueryDto,
  ) {
    return this.companiesService.findAllForUser(user.id, pagination);
  }

  @Get(':id')
  @DocCompanies.GetOne()
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUserContext) {
    return this.companiesService.findOneForUser(id, user.id);
  }

  @Patch(':id')
  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  @DocCompanies.Update()
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @CurrentUser() user: AuthUserContext,
  ) {
    return this.companiesService.update(
      id,
      updateCompanyDto,
      user.id,
      user.role,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(MembershipRole.OWNER)
  @DocCompanies.Remove()
  remove(@Param('id') id: string, @CurrentUser() user: AuthUserContext) {
    return this.companiesService.remove(id, user.id, user.role);
  }

  @Post(':id/select')
  @HttpCode(HttpStatus.OK)
  async selectCompany(
    @Param('id') id: string,
    @CurrentUser() user: AuthUserContext,
  ) {
    return this.usersService.update(user.id, { activeCompanyId: id } as any);
  }
}
