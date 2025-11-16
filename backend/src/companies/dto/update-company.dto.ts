import { IsString, MinLength, IsOptional } from 'class-validator';

export class UpdateCompanyDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @IsOptional()
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  name?: string;
}
