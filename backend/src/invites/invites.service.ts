import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
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
      throw new NotFoundException(`Empresa com ID ${companyId} não encontrada`);
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
      throw new NotFoundException(
        `Convite com ID ${id} não encontrado na empresa ativa`,
      );
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
      throw new NotFoundException('Token de convite inválido');
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
}
