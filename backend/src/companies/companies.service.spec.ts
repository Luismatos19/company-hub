import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesService } from './companies.service';
import { PrismaService } from '../common/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('CompaniesService', () => {
  let service: CompaniesService;
  let prisma: PrismaService;

  const mockPrismaService = {
    company: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompaniesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CompaniesService>(CompaniesService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createCompanyDto = {
      name: 'Test Company',
    };

    it('should create a new company', async () => {
      mockPrismaService.company.create.mockResolvedValue({
        id: '1',
        ...createCompanyDto,
      });

      const result = await service.create(createCompanyDto);

      expect(result).toBeDefined();
      expect(result.name).toBe(createCompanyDto.name);
      expect(mockPrismaService.company.create).toHaveBeenCalledWith({
        data: createCompanyDto,
      });
    });
  });

  describe('findOne', () => {
    it('should return a company', async () => {
      const company = {
        id: '1',
        name: 'Test Company',
      };

      mockPrismaService.company.findUnique.mockResolvedValue(company);

      const result = await service.findOne('1');

      expect(result).toEqual(company);
    });

    it('should throw NotFoundException if company not found', async () => {
      mockPrismaService.company.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a company', async () => {
      const company = {
        id: '1',
        name: 'Test Company',
      };

      const updateDto = { name: 'Updated Company' };

      mockPrismaService.company.findUnique.mockResolvedValue(company);
      mockPrismaService.company.update.mockResolvedValue({
        ...company,
        ...updateDto,
      });

      const result = await service.update('1', updateDto);

      expect(result.name).toBe(updateDto.name);
      expect(mockPrismaService.company.update).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a company', async () => {
      const company = {
        id: '1',
        name: 'Test Company',
      };

      mockPrismaService.company.findUnique.mockResolvedValue(company);
      mockPrismaService.company.delete.mockResolvedValue(company);

      const result = await service.remove('1');

      expect(result.message).toBe('Empresa deletada com sucesso');
      expect(mockPrismaService.company.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });
  });
});
