import { Injectable, Logger } from '@nestjs/common';
import {
  NotFoundException,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '../common/exceptions';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class InvitesService {
  private readonly logger = new Logger(InvitesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createInviteDto: CreateInviteDto, activeCompanyId: string) {
    const { email, companyId, expiresAt } = createInviteDto;

    if (companyId !== activeCompanyId) {
      throw new ForbiddenException(
        'Convites só podem ser criados para a empresa que você está ativo',
      );
    }

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Empresa', companyId);
    }

    const expiresAtDate = new Date(expiresAt);
    if (expiresAtDate < new Date()) {
      throw new BadRequestException('Data de expiração deve ser no futuro');
    }

    const token = randomBytes(32).toString('hex');

    const invite = await this.prisma.invite.create({
      data: {
        email,
        companyId,
        token,
        expiresAt: expiresAtDate,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    this.logger.log(`Convite criado: ${invite.id} para ${email}`);

    await this.simulateEmailSend(invite);

    return invite;
  }

  async findAll(activeCompanyId: string) {
    return this.prisma.invite.findMany({
      where: { companyId: activeCompanyId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string, activeCompanyId: string) {
    const invite = await this.prisma.invite.findFirst({
      where: { id, companyId: activeCompanyId },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!invite) {
      throw new NotFoundException('Convite', id);
    }

    return invite;
  }

  async findByToken(token: string) {
    const invite = await this.prisma.invite.findUnique({
      where: { token },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!invite) {
      throw new NotFoundException('Convite');
    }

    if (new Date() > invite.expiresAt) {
      throw new BadRequestException('Convite expirado');
    }

    return invite;
  }

  async remove(id: string, activeCompanyId: string) {
    await this.findOne(id, activeCompanyId);

    await this.prisma.invite.delete({
      where: { id },
    });

    this.logger.log(`Convite deletado: ${id}`);
    return { message: 'Convite deletado com sucesso' };
  }

  async acceptInvite(userId: string, token: string) {
    const invite = await this.prisma.invite.findUnique({
      where: { token },
      include: {
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!invite) {
      throw new UnauthorizedException('Convite inválido');
    }

    if (new Date() > invite.expiresAt) {
      throw new UnauthorizedException('Convite expirado');
    }

    const existing = await this.prisma.membership.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId: invite.companyId,
        },
      },
    });
    if (!existing) {
      await this.prisma.membership.create({
        data: {
          userId,
          companyId: invite.companyId,
          role: 'MEMBER',
        },
      });
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user && !user.activeCompanyId) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { activeCompanyId: invite.companyId },
      });
    }

    this.logger.log(
      `Convite aceito: usuário ${userId} aceitou convite para empresa ${invite.companyId}`,
    );

    return {
      message: 'Convite aceito com sucesso',
      company: invite.company,
    };
  }

  private async simulateEmailSend(invite: {
    id: string;
    email: string;
    token: string;
    expiresAt: Date;
    company: { id: string; name: string };
  }): Promise<void> {
    const delay = Math.floor(Math.random() * 150) + 50;
    await new Promise((resolve) => setTimeout(resolve, delay));

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const acceptUrl = `${frontendUrl}/accept-invite?token=${invite.token}`;
    const expiresAtFormatted = new Date(invite.expiresAt).toLocaleString(
      'pt-BR',
    );

    this.logger.log('═══════════════════════════════════════════════════════');
    this.logger.log('📧 EMAIL SIMULADO ENVIADO');
    this.logger.log('═══════════════════════════════════════════════════════');
    this.logger.log(`Para: ${invite.email}`);
    this.logger.log(
      `Assunto: Convite para se juntar à empresa ${invite.company.name}`,
    );
    this.logger.log('');
    this.logger.log('Corpo do email:');
    this.logger.log('');
    this.logger.log(`Olá!`);
    this.logger.log('');
    this.logger.log(
      `Você foi convidado(a) para se juntar à empresa ${invite.company.name} no Company Hub.`,
    );
    this.logger.log('');
    this.logger.log(`Para aceitar o convite, clique no link abaixo:`);
    this.logger.log(`${acceptUrl}`);
    this.logger.log('');
    this.logger.log(`Este convite expira em: ${expiresAtFormatted}`);
    this.logger.log('');
    this.logger.log(`Token do convite: ${invite.token}`);
    this.logger.log('');
    this.logger.log(
      'Se você não esperava este convite, pode ignorar este email.',
    );
    this.logger.log('');
    this.logger.log('Atenciosamente,');
    this.logger.log('Equipe Company Hub');
    this.logger.log('═══════════════════════════════════════════════════════');
  }
}
