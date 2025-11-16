import { Test, TestingModule } from '@nestjs/testing';
import { MembershipsService } from './memberships.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { MembershipRole } from '../common/enums/membership-role.enum';

describe('MembershipsService', () => {
  let service: MembershipsService;
  let prisma: PrismaService;

  const mockPrismaService = {
    membership: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
    company: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembershipsService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<MembershipsService>(MembershipsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createMembershipDto = {
      userId: '1',
      companyId: '1',
      role: MembershipRole.ADMIN,
    };

    it('should create a new membership', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1' });
      mockPrismaService.company.findUnique.mockResolvedValue({ id: '1' });
      mockPrismaService.membership.findUnique.mockResolvedValue(null);
      mockPrismaService.membership.create.mockResolvedValue({
        id: '1',
        ...createMembershipDto,
      });

      const result = await service.create(createMembershipDto);

      expect(result).toBeDefined();
      expect(mockPrismaService.membership.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.create(createMembershipDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ConflictException if membership already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: '1' });
      mockPrismaService.company.findUnique.mockResolvedValue({ id: '1' });
      mockPrismaService.membership.findUnique.mockResolvedValue({
        id: '1',
      });

      await expect(service.create(createMembershipDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });
});
