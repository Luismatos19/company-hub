import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { TransformInterceptor } from '../common/interceptors/transform.interceptor';
import { Response } from 'express';
import { DocAuth } from './auth.doc';
import { SignupDto } from './dto/signup.dto';
import { JwtAuthGuard, AuthUserContext } from './jwt-auth.guard';
import { Req } from '@nestjs/common';

@ApiTags('Autenticação')
@Controller('auth')
@UseInterceptors(TransformInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @DocAuth.Login()
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

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @DocAuth.Signup()
  async signup(
    @Body() dto: SignupDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.signup(dto);

    res.cookie('access_token', result.accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/',
    });

    return result.user;
  }
}
