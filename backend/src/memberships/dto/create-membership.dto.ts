import { IsString, IsNotEmpty, IsIn } from 'class-validator';
import { MembershipRole } from '../../common/enums/membership-role.enum';

export class CreateMembershipDto {
  @IsString({ message: 'ID do usuário deve ser uma string' })
  @IsNotEmpty({ message: 'ID do usuário é obrigatório' })
  userId: string;

  @IsString({ message: 'ID da empresa deve ser uma string' })
  @IsNotEmpty({ message: 'ID da empresa é obrigatório' })
  companyId: string;

  @IsNotEmpty({ message: 'Role é obrigatório' })
  @IsIn(['OWNER', 'ADMIN', 'MEMBER'], {
    message: 'Role deve ser um dos seguintes valores: OWNER, ADMIN, MEMBER',
  })
  role: MembershipRole;
}
