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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { JwtAuthGuard, AuthUserContext } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { MembershipRole } from '../common/enums/membership-role.enum';
import { DocMemberships } from './memberships.doc';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('Associações')
@Controller('memberships')
@UseInterceptors(TransformInterceptor)
@UseGuards(JwtAuthGuard, RolesGuard)
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  @DocMemberships.Create()
  create(
    @Body() createMembershipDto: CreateMembershipDto,
    @CurrentUser() user: AuthUserContext,
  ) {
    return this.membershipsService.create(
      createMembershipDto,
      user.activeCompanyId,
      user.role,
    );
  }

  @Get()
  @DocMemberships.List()
  findAll(@CurrentUser() user: AuthUserContext) {
    return this.membershipsService.findAll(user.activeCompanyId);
  }

  @Patch(':id')
  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  @DocMemberships.Update()
  update(
    @Param('id') id: string,
    @Body() updateMembershipDto: UpdateMembershipDto,
    @CurrentUser() user: AuthUserContext,
  ) {
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
  @DocMemberships.Remove()
  remove(@Param('id') id: string, @CurrentUser() user: AuthUserContext) {
    return this.membershipsService.remove(id, user.activeCompanyId, user.role);
  }
}
