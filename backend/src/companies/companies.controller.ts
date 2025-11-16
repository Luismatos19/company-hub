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
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { JwtAuthGuard, AuthUserContext } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { MembershipRole } from '../common/enums/membership-role.enum';
import {
  SwaggerCompanyResponse,
  SwaggerCreateCompanyBody,
  SwaggerUpdateCompanyBody,
} from './companies.doc';

@ApiTags('Empresas')
@Controller('companies')
@UseInterceptors(TransformInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar empresa',
    description:
      'Cria uma empresa e define o criador como OWNER. Se o usuário não tiver empresa ativa, esta passa a ser a ativa.',
  })
  @ApiBody({ type: SwaggerCreateCompanyBody })
  @ApiResponse({
    status: 201,
    type: SwaggerCompanyResponse,
    description: 'Empresa criada com sucesso.',
  })
  create(@Body() createCompanyDto: CreateCompanyDto, @Req() req: any) {
    const user: AuthUserContext = req.user;
    return this.companiesService.create(createCompanyDto, user.id);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar empresas',
    description: 'Lista somente as empresas nas quais o usuário é membro.',
  })
  @ApiResponse({
    status: 200,
    type: SwaggerCompanyResponse,
    isArray: true,
    description: 'Empresas retornadas com sucesso.',
  })
  findAll(@Req() req: any) {
    const user: AuthUserContext = req.user;
    return this.companiesService.findAllForUser(user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar empresa por ID',
    description: 'Retorna dados da empresa se for a empresa ativa do usuário.',
  })
  @ApiResponse({
    status: 200,
    type: SwaggerCompanyResponse,
    description: 'Empresa encontrada.',
  })
  findOne(@Param('id') id: string, @Req() req: any) {
    const user: AuthUserContext = req.user;

    if (user.activeCompanyId !== id) {
      throw new ForbiddenException(
        'Sessão está escopada para outra empresa ativa',
      );
    }

    return this.companiesService.findOneForUser(id, user.id);
  }

  @Patch(':id')
  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  @ApiOperation({
    summary: 'Atualizar empresa',
    description: 'OWNER e ADMIN podem atualizar os dados da empresa ativa.',
  })
  @ApiBody({ type: SwaggerUpdateCompanyBody })
  @ApiResponse({
    status: 200,
    type: SwaggerCompanyResponse,
    description: 'Empresa atualizada com sucesso.',
  })
  update(
    @Param('id') id: string,
    @Body() updateCompanyDto: UpdateCompanyDto,
    @Req() req: any,
  ) {
    const user: AuthUserContext = req.user;

    if (user.activeCompanyId !== id) {
      throw new ForbiddenException(
        'Você não tem permissão para atualizar esta empresa',
      );
    }

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
  @ApiOperation({
    summary: 'Remover empresa',
    description: 'Apenas OWNER pode remover a empresa ativa.',
  })
  @ApiResponse({ status: 204, description: 'Empresa deletada com sucesso.' })
  remove(@Param('id') id: string, @Req() req: any) {
    const user: AuthUserContext = req.user;

    if (user.activeCompanyId !== id) {
      throw new ForbiddenException(
        'Você não tem permissão para deletar esta empresa',
      );
    }

    return this.companiesService.remove(id, user.id, user.role);
  }
}
