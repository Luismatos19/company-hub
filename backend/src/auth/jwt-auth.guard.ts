import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../common/prisma/prisma.service';
import { MembershipRole } from '../common/enums/membership-role.enum';

export interface AuthUserContext {
  id: string;
  email: string;
  activeCompanyId: string;
  role: MembershipRole;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<any>();

    const token = this.extractTokenFromRequest(request);
    if (!token) {
      throw new UnauthorizedException('Token de autenticação não encontrado');
    }

    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new UnauthorizedException('Token de autenticação inválido');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        memberships: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const path: string = request?.originalUrl || request?.url || '';
    const method: string = (request?.method || '').toUpperCase();
    const isInviteAccept = path.includes('/invites/accept');
    const isCompanyCreate =
      method === 'POST' &&
      (path.includes('/companies') || path.includes('/company'));
    const bypassActiveCompanyChecks = isInviteAccept || isCompanyCreate;

    if (!user.activeCompanyId && !bypassActiveCompanyChecks) {
      throw new ForbiddenException('Nenhuma empresa ativa selecionada');
    }

    const membership = user.memberships.find(
      (m) => m.companyId === user.activeCompanyId,
    );

    if (!membership && !bypassActiveCompanyChecks) {
      throw new ForbiddenException(
        'Usuário não é membro da empresa ativa selecionada',
      );
    }

    const authUser: AuthUserContext = {
      id: user.id,
      email: user.email,
      activeCompanyId: user.activeCompanyId ?? '',
      role: membership?.role as MembershipRole,
    };

    request.user = authUser;

    return true;
  }

  private extractTokenFromRequest(request: any): string | null {
    const cookieHeader: string | undefined = request.headers?.cookie;
    if (cookieHeader) {
      const cookies = Object.fromEntries(
        cookieHeader.split(';').map((c) => {
          const [name, ...rest] = c.trim().split('=');
          return [name, decodeURIComponent(rest.join('='))];
        }),
      );
      if (cookies['access_token']) {
        return cookies['access_token'];
      }
    }

    // Fallback para Authorization: Bearer
    const authHeader: string | undefined = request.headers?.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring('Bearer '.length);
    }

    return null;
  }
}
