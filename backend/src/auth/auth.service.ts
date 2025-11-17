import { Injectable, Logger } from '@nestjs/common';
import { UnauthorizedException } from '../common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma?: PrismaService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      activeCompanyId: user.activeCompanyId ?? null,
    };

    const accessToken = this.jwtService.sign(payload);

    this.logger.log(`Usuário logado: ${user.id}`);

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        activeCompanyId: user.activeCompanyId,
      },
    };
  }

  async signup(signupDto: SignupDto) {
    const user = await this.usersService.create({
      email: signupDto.email,
      password: signupDto.password,
      name: signupDto.name,
    } as any);

    const payload = {
      sub: user.id,
      email: user.email,
      activeCompanyId: user.activeCompanyId ?? null,
    };

    const accessToken = this.jwtService.sign(payload);

    this.logger.log(`Usuário registrado: ${user.id}`);

    return {
      accessToken,
      user,
    };
  }
}
