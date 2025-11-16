import { ApiProperty } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

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

export const DocInvites = {
  Create: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Criar convite',
        description: 'Cria um convite para a empresa ativa. Apenas OWNER/ADMIN.',
      }),
      ApiBody({ type: SwaggerCreateInviteBody }),
      ApiResponse({
        status: 201,
        type: SwaggerInviteResponse,
        description: 'Convite criado com sucesso.',
      }),
    ),
  List: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Listar convites',
        description: 'Lista convites da empresa ativa.',
      }),
      ApiResponse({
        status: 200,
        type: SwaggerInviteResponse,
        isArray: true,
        description: 'Convites retornados com sucesso.',
      }),
    ),
  GetOne: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Buscar convite por ID',
        description: 'Retorna um convite se pertencer à empresa ativa.',
      }),
      ApiResponse({
        status: 200,
        type: SwaggerInviteResponse,
        description: 'Convite encontrado.',
      }),
    ),
  GetByToken: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Buscar convite por token',
        description: 'Busca um convite a partir do token.',
      }),
      ApiResponse({
        status: 200,
        type: SwaggerInviteResponse,
        description: 'Convite encontrado.',
      }),
    ),
  Remove: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Remover convite',
        description: 'Remove um convite da empresa ativa. Apenas OWNER/ADMIN.',
      }),
      ApiResponse({ status: 204, description: 'Convite removido com sucesso.' }),
    ),
  Accept: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Aceitar convite',
        description:
          'Aceita convite via token (requer usuário autenticado, não exige empresa ativa).',
      }),
      ApiBody({ schema: { properties: { token: { type: 'string' } }, required: ['token'] } }),
      ApiResponse({ status: 200, description: 'Convite aceito com sucesso.' }),
    ),
};


