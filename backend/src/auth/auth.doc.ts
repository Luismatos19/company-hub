import { ApiProperty } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

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

export const DocAuth = {
  Login: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Login',
        description:
          'Autentica o usuário e define o JWT em um cookie httpOnly (access_token).',
      }),
      ApiBody({
        schema: {
          properties: {
            email: { type: 'string' },
            password: { type: 'string' },
          },
          required: ['email', 'password'],
        },
      }),
      ApiResponse({
        status: 200,
        type: SwaggerLoginResponseUser,
        description: 'Usuário autenticado; cookie httpOnly definido.',
      }),
    ),
  Signup: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Cadastro',
        description: 'Cria um novo usuário e autentica (cookie httpOnly).',
      }),
      ApiResponse({ status: 201, type: SwaggerLoginResponseUser }),
    ),
  Logout: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Logout',
        description: 'Remove o cookie de autenticação (access_token).',
      }),
      ApiResponse({
        status: 200,
        description: 'Logout realizado com sucesso',
      }),
    ),
};
