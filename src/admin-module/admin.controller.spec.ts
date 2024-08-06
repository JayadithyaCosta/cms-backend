import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import AdminController from './admin.controller';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth-module/jwt-auth.guard';
import { RolesInterceptor } from '../common/interceptors/role.interceptor';

describe('AdminController', () => {
  let app: INestApplication;
  const adminService = {
    updateReservation: jest.fn(),
    deleteReservation: jest.fn(),
    createAdminUser: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        {
          provide: AdminService,
          useValue: adminService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideInterceptor(RolesInterceptor)
      .useValue({ intercept: (context, next) => next.handle() })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/POST admin/update-reservation', () => {
    const updateReservationDto = { reservationId: '123', status: 'confirmed' };
    adminService.updateReservation.mockResolvedValue({ success: true });

    return request(app.getHttpServer())
      .post('/admin/update-reservation')
      .send(updateReservationDto)
      .expect(201)
      .expect({ success: true });
  });

  it('/DELETE admin/delete-reservation', () => {
    const deleteReservationDto = { reservationId: '123' };
    adminService.deleteReservation.mockResolvedValue({ success: true });

    return request(app.getHttpServer())
      .delete('/admin/delete-reservation')
      .send(deleteReservationDto)
      .expect(200)
      .expect({ success: true });
  });

  it('/POST admin/register', () => {
    const createAdminUserDto = { username: 'admin', password: 'password' };
    adminService.createAdminUser.mockResolvedValue({ token: 'some-token' });

    return request(app.getHttpServer())
      .post('/admin/register')
      .send(createAdminUserDto)
      .expect(201)
      .expect({ token: 'some-token' });
  });
});
