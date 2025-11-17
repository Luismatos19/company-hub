import { Injectable, Logger } from '@nestjs/common';
import {
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '../common/exceptions';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { MembershipRole } from '../common/enums/membership-role.enum';

@Injectable()
export class MembershipsService {
  private readonly logger = new Logger(MembershipsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(
    createMembershipDto: CreateMembershipDto,
    activeCompanyId: string,
    currentUserRole: MembershipRole,
  ) {
    const { userId, companyId, role } = createMembershipDto;

    if (currentUserRole === MembershipRole.MEMBER) {
      throw new ForbiddenException(
        'Apenas OWNER ou ADMIN podem adicionar membros',
      );
    }

    if (companyId !== activeCompanyId) {
      throw new ForbiddenException(
        'Associação deve ser criado na empresa ativa da sessão',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário', userId);
    }

    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new NotFoundException('Empresa', companyId);
    }

    const existingMembership = await this.prisma.membership.findUnique({
      where: {
        userId_companyId: {
          userId,
          companyId,
        },
      },
    });

    if (existingMembership) {
      throw new ConflictException('Usuário já é membro desta empresa');
    }

    const membership = await this.prisma.membership.create({
      data: {
        userId,
        companyId,
        role,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    this.logger.log(`Membro criado: ${membership.id}`);
    return membership;
  }

  async findAll(activeCompanyId: string) {
    return this.prisma.membership.findMany({
      where: { companyId: activeCompanyId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findOne(id: string, activeCompanyId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: { id, companyId: activeCompanyId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!membership) {
      throw new NotFoundException('Membro', id);
    }

    return membership;
  }

  async update(
    id: string,
    updateMembershipDto: UpdateMembershipDto,
    activeCompanyId: string,
    currentUserRole: MembershipRole,
  ) {
    if (currentUserRole === MembershipRole.MEMBER) {
      throw new ForbiddenException(
        'Apenas OWNER ou ADMIN podem atualizar membros',
      );
    }

    await this.findOne(id, activeCompanyId);

    const updatedMembership = await this.prisma.membership.update({
      where: { id },
      data: updateMembershipDto,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        company: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    this.logger.log(`Membro atualizado: ${id}`);
    return updatedMembership;
  }

  async remove(
    id: string,
    activeCompanyId: string,
    currentUserRole: MembershipRole,
  ) {
    if (currentUserRole === MembershipRole.MEMBER) {
      throw new ForbiddenException(
        'Apenas OWNER ou ADMIN podem remover membros',
      );
    }

    await this.findOne(id, activeCompanyId);

    await this.prisma.membership.delete({
      where: { id },
    });

    this.logger.log(`Membro deletado: ${id}`);
    return { message: 'Membro deletado com sucesso' };
  }
}
