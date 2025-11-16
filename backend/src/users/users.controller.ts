import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBody, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import {
  SwaggerCreateUserBody,
  SwaggerUpdateUserBody,
  SwaggerUserResponse,
} from './users.doc';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(TransformInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar usuário',
    description: 'Cria um novo usuário na plataforma.',
  })
  @ApiBody({ type: SwaggerCreateUserBody })
  @ApiResponse({
    status: 201,
    type: SwaggerUserResponse,
    description: 'Usuário criado com sucesso.',
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Listar usuários',
    description: 'Retorna a lista de usuários.',
  })
  @ApiResponse({
    status: 200,
    type: SwaggerUserResponse,
    isArray: true,
    description: 'Lista de usuários retornada com sucesso.',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description: 'Retorna os dados de um usuário específico.',
  })
  @ApiResponse({
    status: 200,
    type: SwaggerUserResponse,
    description: 'Usuário encontrado.',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Atualizar usuário',
    description: 'Atualiza os dados de um usuário.',
  })
  @ApiBody({ type: SwaggerUpdateUserBody })
  @ApiResponse({
    status: 200,
    type: SwaggerUserResponse,
    description: 'Usuário atualizado com sucesso.',
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Remover usuário',
    description: 'Remove um usuário por ID.',
  })
  @ApiResponse({ status: 204, description: 'Usuário removido com sucesso.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
