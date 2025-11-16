import { ApiProperty } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

export class SwaggerCompanyResponse {
  @ApiProperty({ format: 'uuid', description: 'Identificador da empresa' })
  id: string;

  @ApiProperty({ example: 'Minha Empresa LTDA', description: 'Nome da empresa' })
  name: string;

  @ApiProperty({ type: String, format: 'date-time', description: 'Data de criação' })
  createdAt: string;

  @ApiProperty({ type: String, format: 'date-time', description: 'Data de atualização' })
  updatedAt: string;
}

export class SwaggerCreateCompanyBody {
  @ApiProperty({ example: 'Minha Empresa LTDA', description: 'Nome da empresa' })
  name: string;
}

export class SwaggerUpdateCompanyBody {
  @ApiProperty({ example: 'Minha Empresa Atualizada LTDA', required: false, description: 'Novo nome da empresa' })
  name?: string;
}

export const DocCompanies = {
  Create: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Criar empresa',
        description:
          'Cria uma empresa e define o criador como OWNER. Se o usuário não tiver empresa ativa, esta passa a ser a ativa.',
      }),
      ApiBody({ type: SwaggerCreateCompanyBody }),
      ApiResponse({
        status: 201,
        type: SwaggerCompanyResponse,
        description: 'Empresa criada com sucesso.',
      }),
    ),
  List: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Listar empresas',
        description: 'Lista somente as empresas nas quais o usuário é membro.',
      }),
      ApiResponse({
        status: 200,
        type: SwaggerCompanyResponse,
        isArray: true,
        description: 'Empresas retornadas com sucesso.',
      }),
    ),
  GetOne: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Buscar empresa por ID',
        description: 'Retorna dados da empresa se for a empresa ativa do usuário.',
      }),
      ApiResponse({
        status: 200,
        type: SwaggerCompanyResponse,
        description: 'Empresa encontrada.',
      }),
    ),
  Update: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Atualizar empresa',
        description: 'OWNER e ADMIN podem atualizar os dados da empresa ativa.',
      }),
      ApiBody({ type: SwaggerUpdateCompanyBody }),
      ApiResponse({
        status: 200,
        type: SwaggerCompanyResponse,
        description: 'Empresa atualizada com sucesso.',
      }),
    ),
  Remove: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Remover empresa',
        description: 'Apenas OWNER pode remover a empresa ativa.',
      }),
      ApiResponse({ status: 204, description: 'Empresa deletada com sucesso.' }),
    ),
};


