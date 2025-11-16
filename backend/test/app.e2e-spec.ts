import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/common/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  it('/api (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('message');
      });
  });

  describe('/api/users (POST)', () => {
    it('should create a user', () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      };

      return request(app.getHttpServer())
        .post('/api/users')
        .send(createUserDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data.email).toBe(createUserDto.email);
          expect(res.body.data).not.toHaveProperty('password');
        });
    });

    it('should return 400 if email is invalid', () => {
      const createUserDto = {
        email: 'invalid-email',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/api/users')
        .send(createUserDto)
        .expect(400);
    });
  });

  describe('/api/companies (POST)', () => {
    it('should create a company', () => {
      const createCompanyDto = {
        name: 'Test Company',
      };

      return request(app.getHttpServer())
        .post('/api/companies')
        .send(createCompanyDto)
        .expect(201)
        .expect((res) => {
          expect(res.body.data).toHaveProperty('id');
          expect(res.body.data.name).toBe(createCompanyDto.name);
        });
    });

    it('should return 400 if name is empty', () => {
      const createCompanyDto = {
        name: '',
      };

      return request(app.getHttpServer())
        .post('/api/companies')
        .send(createCompanyDto)
        .expect(400);
    });
  });
});
