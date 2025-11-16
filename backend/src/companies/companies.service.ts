import {
  Injectable,
  NotFoundException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { MembershipRole } from '../common/enums/membership-role.enum';

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma empresa e define o usuário criador como OWNER dessa empresa.
   * Também define a empresa como ativa para o usuário caso ele ainda não tenha uma.
   */
  async create(createCompanyDto: CreateCompanyDto, userId: string) {
    const company = await this.prisma.company.create({
      data: createCompanyDto,
    });

    await this.prisma.membership.create({
      data: {
        userId,
        companyId: company.id,
        role: MembershipRole.OWNER,
      },
    });

    // Se o usuário ainda não tem empresa ativa, define esta
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user && !user.activeCompanyId) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { activeCompanyId: company.id },
      });
    }

    this.logger.log(`Empresa criada: ${company.id} por usuário: ${userId}`);
    return company;
  }

  /**
   * Retorna apenas empresas nas quais o usuário é membro.
   */
  async findAllForUser(userId: string) {
    return this.prisma.company.findMany({
      where: {
        memberships: {
          some: { userId },
        },
      },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        _count: {
          select: {
            memberships: true,
            invites: true,
            activeUsers: true,
          },
        },
      },
    });
  }

  async findOneForUser(id: string, userId: string) {
    const company = await this.prisma.company.findFirst({
      where: {
        id,
        memberships: {
          some: { userId },
        },
      },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
        invites: true,
        activeUsers: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
      },
    });

    if (!company) {
      throw new NotFoundException(
        `Empresa com ID ${id} não encontrada ou usuário não é membro`,
      );
    }

    return company;
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    userId: string,
    role: MembershipRole,
  ) {
    if (role === MembershipRole.MEMBER) {
      throw new ForbiddenException(
        'Apenas OWNER ou ADMIN podem editar dados da empresa',
      );
    }

    await this.findOneForUser(id, userId);

    const updatedCompany = await this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
    });

    this.logger.log(`Empresa atualizada: ${id} por usuário: ${userId}`);
    return updatedCompany;
  }

  async remove(id: string, userId: string, role: MembershipRole) {
    if (role !== MembershipRole.OWNER) {
      throw new ForbiddenException('Apenas OWNER pode remover a empresa');
    }

    await this.findOneForUser(id, userId);

    await this.prisma.company.delete({
      where: { id },
    });

    this.logger.log(`Empresa deletada: ${id} por usuário: ${userId}`);
    return { message: 'Empresa deletada com sucesso' };
  }
}
