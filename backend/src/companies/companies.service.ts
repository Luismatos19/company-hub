import { Injectable, Logger } from '@nestjs/common';
import {
  NotFoundException,
  ForbiddenException,
} from '../common/exceptions';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { MembershipRole } from '../common/enums/membership-role.enum';

@Injectable()
export class CompaniesService {
  private readonly logger = new Logger(CompaniesService.name);

  constructor(private readonly prisma: PrismaService) {}

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

  async findAllForUser(
    userId: string,
    pagination?: { page: number; pageSize: number },
  ) {
    const skip = pagination
      ? (pagination.page - 1) * pagination.pageSize
      : undefined;
    const take = pagination ? pagination.pageSize : undefined;

    return this.prisma.company.findMany({
      where: {
        memberships: {
          some: { userId },
        },
      },
      skip,
      take,
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
      throw new NotFoundException('Empresa', id);
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
