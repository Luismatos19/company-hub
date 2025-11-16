import { IsOptional, IsIn } from 'class-validator';
import { MembershipRole } from '../../common/enums/membership-role.enum';

export class UpdateMembershipDto {
  @IsOptional()
  @IsIn(['OWNER', 'ADMIN', 'MEMBER'], {
    message: 'Role deve ser um dos seguintes valores: OWNER, ADMIN, MEMBER',
  })
  role?: MembershipRole;
}
