import { ApiProperty } from '@nestjs/swagger';
import { MembershipRole } from '../common/enums/membership-role.enum';

export class SwaggerMembershipResponse {
  @ApiProperty({ format: 'uuid', description: 'Identificador da associação' })
  id: string;

  @ApiProperty({ enum: MembershipRole, description: 'Papel do usuário na empresa' })
  role: MembershipRole;

  @ApiProperty({ type: String, format: 'date-time', description: 'Data de criação' })
  createdAt: string;

  @ApiProperty({ format: 'uuid', description: 'ID da empresa' })
  companyId: string;

  @ApiProperty({ format: 'uuid', description: 'ID do usuário' })
  userId: string;
}

export class SwaggerCreateMembershipBody {
  @ApiProperty({ format: 'uuid', description: 'ID do usuário a ser associado' })
  userId: string;

  @ApiProperty({ format: 'uuid', description: 'ID da empresa (deve ser a empresa ativa da sessão)' })
  companyId: string;

  @ApiProperty({ enum: MembershipRole, description: 'Papel do usuário na empresa' })
  role: MembershipRole;
}

export class SwaggerUpdateMembershipBody {
  @ApiProperty({ enum: MembershipRole, required: false, description: 'Novo papel do usuário' })
  role?: MembershipRole;
}


