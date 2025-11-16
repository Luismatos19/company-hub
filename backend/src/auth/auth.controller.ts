import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { Response } from 'express';
import { SwaggerLoginBody, SwaggerLoginResponseUser } from './auth.doc';

@ApiTags('Autenticação')
@Controller('auth')
@UseInterceptors(TransformInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login',
    description:
      'Autentica o usuário e define o JWT em um cookie httpOnly (access_token).',
  })
  @ApiBody({ type: SwaggerLoginBody })
  @ApiResponse({
    status: 200,
    type: SwaggerLoginResponseUser,
    description: 'Usuário autenticado; cookie httpOnly definido.',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(loginDto);

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
    });

    return result.user;
  }
}
