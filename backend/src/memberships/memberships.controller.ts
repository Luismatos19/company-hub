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
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { JwtAuthGuard, AuthUserContext } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { MembershipRole } from '../common/enums/membership-role.enum';
import {
  SwaggerCreateMembershipBody,
  SwaggerMembershipResponse,
  SwaggerUpdateMembershipBody,
} from './memberships.doc';

@ApiTags('Associações')
@Controller('memberships')
@UseInterceptors(TransformInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  @ApiOperation({
    summary: 'Criar associação (membro)',
    description:
      'Cria uma associação para a empresa ativa. Apenas OWNER/ADMIN.',
  })
  @ApiBody({ type: SwaggerCreateMembershipBody })
  @ApiResponse({
    status: 201,
    type: SwaggerMembershipResponse,
    description: 'Associação criada com sucesso.',
  })
  create(@Body() createMembershipDto: CreateMembershipDto, @Req() req: any) {
    const user: AuthUserContext = req.user;
    return this.membershipsService.create(
      createMembershipDto,
      user.activeCompanyId,
      user.role,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Listar associações',
    description: 'Lista membros da empresa ativa.',
  })
  @ApiResponse({
    status: 200,
    type: SwaggerMembershipResponse,
    isArray: true,
    description: 'Lista retornada com sucesso.',
  })
  findAll(@Req() req: any) {
    const user: AuthUserContext = req.user;
    return this.membershipsService.findAll(user.activeCompanyId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar associação por ID',
    description: 'Retorna dados da associação na empresa ativa.',
  })
  @ApiResponse({
    status: 200,
    type: SwaggerMembershipResponse,
    description: 'Associação encontrada.',
  })
  findOne(@Param('id') id: string, @Req() req: any) {
    const user: AuthUserContext = req.user;
    return this.membershipsService.findOne(id, user.activeCompanyId);
  }

  @Patch(':id')
  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  @ApiOperation({
    summary: 'Atualizar associação',
    description:
      'Atualiza papel de um membro na empresa ativa. Apenas OWNER/ADMIN.',
  })
  @ApiBody({ type: SwaggerUpdateMembershipBody })
  @ApiResponse({
    status: 200,
    type: SwaggerMembershipResponse,
    description: 'Associação atualizada com sucesso.',
  })
  update(
    @Param('id') id: string,
    @Body() updateMembershipDto: UpdateMembershipDto,
    @Req() req: any,
  ) {
    const user: AuthUserContext = req.user;
    return this.membershipsService.update(
      id,
      updateMembershipDto,
      user.activeCompanyId,
      user.role,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  @ApiOperation({
    summary: 'Remover associação',
    description: 'Remove membro da empresa ativa. Apenas OWNER/ADMIN.',
  })
  @ApiResponse({ status: 204, description: 'Associação removida com sucesso.' })
  remove(@Param('id') id: string, @Req() req: any) {
    const user: AuthUserContext = req.user;
    return this.membershipsService.remove(id, user.activeCompanyId, user.role);
  }
}
