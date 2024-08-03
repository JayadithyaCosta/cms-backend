import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user-module/schemas/user.schema';
import { redisStore } from 'cache-manager-ioredis'; // Ensure correct import
import {
  Reservation,
  ReservationSchema,
} from 'src/user-module/schemas/reservations.schema';
import AdminController from './admin.controller';
import { AdminService } from './admin.service';
import { UserModule } from 'src/user-module/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: redisStore, // Correct use of redisStore
        host: 'localhost',
        port: 6379,
        ttl: 60, // seconds
      }),
    }),
    UserModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
