import { ApiProperty } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

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

export const DocUsers = {
  Create: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Criar usuário',
        description: 'Cria um novo usuário na plataforma.',
      }),
      ApiBody({ type: SwaggerCreateUserBody }),
      ApiResponse({
        status: 201,
        type: SwaggerUserResponse,
        description: 'Usuário criado com sucesso.',
      }),
    ),
  List: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Listar usuários',
        description: 'Retorna a lista de usuários.',
      }),
      ApiResponse({
        status: 200,
        type: SwaggerUserResponse,
        isArray: true,
        description: 'Lista de usuários retornada com sucesso.',
      }),
    ),
  GetOne: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Buscar usuário por ID',
        description: 'Retorna os dados de um usuário específico.',
      }),
      ApiResponse({
        status: 200,
        type: SwaggerUserResponse,
        description: 'Usuário encontrado.',
      }),
    ),
  Update: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Atualizar usuário',
        description: 'Atualiza os dados de um usuário.',
      }),
      ApiBody({ type: SwaggerUpdateUserBody }),
      ApiResponse({
        status: 200,
        type: SwaggerUserResponse,
        description: 'Usuário atualizado com sucesso.',
      }),
    ),
  Remove: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Remover usuário',
        description: 'Remove um usuário por ID.',
      }),
      ApiResponse({
        status: 204,
        description: 'Usuário removido com sucesso.',
      }),
    ),
};
