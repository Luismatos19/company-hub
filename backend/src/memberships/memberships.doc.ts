import { ApiProperty } from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
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

export const DocMemberships = {
  Create: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Criar associação (membro)',
        description:
          'Cria uma associação para a empresa ativa. Apenas OWNER/ADMIN.',
      }),
      ApiBody({ type: SwaggerCreateMembershipBody }),
      ApiResponse({
        status: 201,
        type: SwaggerMembershipResponse,
        description: 'Associação criada com sucesso.',
      }),
    ),
  List: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Listar associações',
        description: 'Lista membros da empresa ativa.',
      }),
      ApiResponse({
        status: 200,
        type: SwaggerMembershipResponse,
        isArray: true,
        description: 'Lista retornada com sucesso.',
      }),
    ),
  GetOne: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Buscar associação por ID',
        description: 'Retorna dados da associação na empresa ativa.',
      }),
      ApiResponse({
        status: 200,
        type: SwaggerMembershipResponse,
        description: 'Associação encontrada.',
      }),
    ),
  Update: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Atualizar associação',
        description:
          'Atualiza papel de um membro na empresa ativa. Apenas OWNER/ADMIN.',
      }),
      ApiBody({ type: SwaggerUpdateMembershipBody }),
      ApiResponse({
        status: 200,
        type: SwaggerMembershipResponse,
        description: 'Associação atualizada com sucesso.',
      }),
    ),
  Remove: () =>
    applyDecorators(
      ApiOperation({
        summary: 'Remover associação',
        description: 'Remove membro da empresa ativa. Apenas OWNER/ADMIN.',
      }),
      ApiResponse({ status: 204, description: 'Associação removida com sucesso.' }),
    ),
};


