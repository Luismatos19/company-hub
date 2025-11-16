import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, name } = createUserDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        activeCompanyId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    this.logger.log(`User created: ${user.id}`);
    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        activeCompanyId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        activeCompanyId: true,
        createdAt: true,
        updatedAt: true,
        memberships: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        activeCompany: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);

    const updateData: any = { ...updateUserDto };

    // Hash password if provided
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    // Validate activeCompanyId if provided
    if (updateData.activeCompanyId) {
      const company = await this.prisma.company.findUnique({
        where: { id: updateData.activeCompanyId },
      });

      if (!company) {
        throw new NotFoundException(
          `Company with ID ${updateData.activeCompanyId} not found`,
        );
      }

      // Check if user has membership in this company
      const membership = await this.prisma.membership.findUnique({
        where: {
          userId_companyId: {
            userId: id,
            companyId: updateData.activeCompanyId,
          },
        },
      });

      if (!membership) {
        throw new ConflictException(
          'User is not a member of the specified company',
        );
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        activeCompanyId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    this.logger.log(`User updated: ${id}`);
    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    await this.prisma.user.delete({
      where: { id },
    });

    this.logger.log(`User deleted: ${id}`);
    return { message: 'User deleted successfully' };
  }
}

