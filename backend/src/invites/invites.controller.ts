import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { InvitesService } from './invites.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { JwtAuthGuard, AuthUserContext } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { MembershipRole } from '../common/enums/membership-role.enum';
import { SwaggerCreateInviteBody, SwaggerInviteResponse } from './invites.doc';

@ApiTags('Convites')
@Controller('invites')
@UseInterceptors(TransformInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  @ApiOperation({
    summary: 'Criar convite',
    description: 'Cria um convite para a empresa ativa. Apenas OWNER/ADMIN.',
  })
  @ApiBody({ type: SwaggerCreateInviteBody })
  @ApiResponse({
    status: 201,
    type: SwaggerInviteResponse,
    description: 'Convite criado com sucesso.',
  })
  create(@Body() createInviteDto: CreateInviteDto, @Req() req: any) {
    const user: AuthUserContext = req.user;
    return this.invitesService.create(createInviteDto, user.activeCompanyId);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar convites',
    description: 'Lista convites da empresa ativa.',
  })
  @ApiResponse({
    status: 200,
    type: SwaggerInviteResponse,
    isArray: true,
    description: 'Convites retornados com sucesso.',
  })
  findAll(@Req() req: any) {
    const user: AuthUserContext = req.user;
    return this.invitesService.findAll(user.activeCompanyId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar convite por ID',
    description: 'Retorna um convite se pertencer à empresa ativa.',
  })
  @ApiResponse({
    status: 200,
    type: SwaggerInviteResponse,
    description: 'Convite encontrado.',
  })
  findOne(@Param('id') id: string, @Req() req: any) {
    const user: AuthUserContext = req.user;
    return this.invitesService.findOne(id, user.activeCompanyId);
  }

  @Get('token/:token')
  @ApiOperation({
    summary: 'Buscar convite por token',
    description: 'Busca um convite a partir do token.',
  })
  @ApiResponse({
    status: 200,
    type: SwaggerInviteResponse,
    description: 'Convite encontrado.',
  })
  findByToken(@Param('token') token: string) {
    return this.invitesService.findByToken(token);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  @ApiOperation({
    summary: 'Remover convite',
    description: 'Remove um convite da empresa ativa. Apenas OWNER/ADMIN.',
  })
  @ApiResponse({ status: 204, description: 'Convite removido com sucesso.' })
  remove(@Param('id') id: string, @Req() req: any) {
    const user: AuthUserContext = req.user;
    return this.invitesService.remove(id, user.activeCompanyId);
  }
}
