import { ApiProperty } from '@nestjs/swagger';

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


