import { forwardRef, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './schemas/user.schema';
import { redisStore } from 'cache-manager-ioredis'; // Ensure correct import
import { AuthModule } from '../auth-module/auth.module'; // Correct path
import { Reservation, ReservationSchema } from './schemas/reservations.schema';

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
    forwardRef(() => AuthModule), // Use forwardRef to break circular dependency
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
