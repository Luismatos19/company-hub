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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InvitesService } from './invites.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { JwtAuthGuard, AuthUserContext } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { MembershipRole } from '../common/enums/membership-role.enum';
import { DocInvites } from './invites.doc';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('Convites')
@Controller('invites')
@UseInterceptors(TransformInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvitesController {
  constructor(private readonly invitesService: InvitesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  @DocInvites.Create()
  create(
    @Body() createInviteDto: CreateInviteDto,
    @CurrentUser() user: AuthUserContext,
  ) {
    return this.invitesService.create(createInviteDto, user.activeCompanyId);
  }

  @Get()
  @DocInvites.List()
  findAll(@CurrentUser() user: AuthUserContext) {
    return this.invitesService.findAll(user.activeCompanyId);
  }

  @Get(':id')
  @DocInvites.GetOne()
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUserContext) {
    return this.invitesService.findOne(id, user.activeCompanyId);
  }

  @Get('token/:token')
  @DocInvites.GetByToken()
  findByToken(@Param('token') token: string) {
    return this.invitesService.findByToken(token);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  @DocInvites.Remove()
  remove(@Param('id') id: string, @CurrentUser() user: AuthUserContext) {
    return this.invitesService.remove(id, user.activeCompanyId);
  }

  @Post('accept')
  @HttpCode(HttpStatus.OK)
  @DocInvites.Accept()
  async accept(
    @Body() body: { token: string },
    @CurrentUser() user: AuthUserContext,
  ) {
    return this.invitesService.acceptInvite(user.id, body.token);
  }
}
