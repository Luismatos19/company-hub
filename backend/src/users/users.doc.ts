import { ApiProperty } from '@nestjs/swagger';

export class SwaggerUserResponse {
  @ApiProperty({ format: 'uuid', description: 'Identificador do usuário' })
  id: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'E-mail do usuário',
  })
  email: string;

  @ApiProperty({
    example: 'John Doe',
    nullable: true,
    description: 'Nome do usuário',
  })
  name?: string | null;

  @ApiProperty({
    format: 'uuid',
    nullable: true,
    description: 'Empresa ativa do usuário',
  })
  activeCompanyId?: string | null;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Data de criação',
  })
  createdAt: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    description: 'Data de atualização',
  })
  updatedAt: string;
}

export class SwaggerCreateUserBody {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'E-mail do usuário',
  })
  email: string;

  @ApiProperty({
    minLength: 6,
    example: 'secret123',
    description: 'Senha do usuário (mínimo 6 caracteres)',
  })
  password: string;

  @ApiProperty({
    example: 'John Doe',
    required: false,
    description: 'Nome do usuário',
  })
  name?: string;
}

export class SwaggerUpdateUserBody {
  @ApiProperty({
    example: 'johnny@example.com',
    required: false,
    description: 'Novo e-mail',
  })
  email?: string;

  @ApiProperty({
    minLength: 6,
    required: false,
    description: 'Nova senha (mínimo 6 caracteres)',
  })
  password?: string;

  @ApiProperty({ example: 'Johnny', required: false, description: 'Novo nome' })
  name?: string;

  @ApiProperty({
    format: 'uuid',
    required: false,
    description: 'Define a empresa ativa do usuário',
  })
  activeCompanyId?: string;
}
