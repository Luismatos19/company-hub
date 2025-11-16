import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'Senha deve ser uma string' })
  @IsOptional()
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password?: string;

  @IsString({ message: 'Nome deve ser uma string' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'ID da empresa ativa deve ser uma string' })
  @IsOptional()
  activeCompanyId?: string;
}
