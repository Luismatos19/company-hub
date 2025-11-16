import { ApiProperty } from '@nestjs/swagger';

export class SwaggerLoginBody {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'E-mail do usuário',
  })
  email: string;

  @ApiProperty({ example: 'secret123', description: 'Senha do usuário' })
  password: string;
}

export class SwaggerLoginResponseUser {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty({ nullable: true })
  name?: string | null;

  @ApiProperty({ format: 'uuid', nullable: true })
  activeCompanyId?: string | null;
}
