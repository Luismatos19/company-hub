import { ApiProperty } from '@nestjs/swagger';

export class SwaggerInviteResponse {
  @ApiProperty({ format: 'uuid', description: 'Identificador do convite' })
  id: string;

  @ApiProperty({ example: 'guest@example.com', description: 'E-mail do convidado' })
  email: string;

  @ApiProperty({ example: 'token-aleatorio', description: 'Token único do convite' })
  token: string;

  @ApiProperty({ type: String, format: 'date-time', description: 'Data de criação' })
  createdAt: string;

  @ApiProperty({ type: String, format: 'date-time', description: 'Data de expiração do convite' })
  expiresAt: string;

  @ApiProperty({ format: 'uuid', description: 'ID da empresa' })
  companyId: string;
}

export class SwaggerCreateInviteBody {
  @ApiProperty({ example: 'guest@example.com', description: 'E-mail do convidado' })
  email: string;

  @ApiProperty({ format: 'uuid', description: 'ID da empresa (deve ser a empresa ativa da sessão)' })
  companyId: string;

  @ApiProperty({ type: String, format: 'date-time', description: 'Data/hora de expiração (ISO 8601)' })
  expiresAt: string;
}


