import { IsEmail, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateInviteDto {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  email: string;

  @IsString({ message: 'ID da empresa deve ser uma string' })
  @IsNotEmpty({ message: 'ID da empresa é obrigatório' })
  companyId: string;

  @IsDateString({}, { message: 'Data de expiração deve ser uma data válida' })
  @IsNotEmpty({ message: 'Data de expiração é obrigatória' })
  expiresAt: string;
}
