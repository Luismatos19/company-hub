import { SetMetadata } from '@nestjs/common';
import { MembershipRole } from '../common/enums/membership-role.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: MembershipRole[]) =>
  SetMetadata(ROLES_KEY, roles);
