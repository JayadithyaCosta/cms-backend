import {
  Injectable,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from './schemas/reservations.schema';
import { v4 as uuidv4 } from 'uuid';
import { Status } from 'src/common/models/ENUM/user.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Reservation.name) private reservationModel: Model<Reservation>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService, // Inject JwtService
  ) {}

  async findOne(id: string): Promise<User> {
    const cacheKey = `user:${id}`;

    // Try to get the user from cache
    const cachedUser = await this.cacheManager.get<User>(cacheKey);
    if (cachedUser) {
      return cachedUser;
    }

    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Cache the user data with a TTL of 60 seconds
      await this.cacheManager.set(cacheKey, user, 60); // Pass TTL as a number

      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user');
    }
  }

  async findByEmail(email: string): Promise<User> {
    const cacheKey = `user:${email}`;

    // Try to get the user from cache
    const cachedUser = await this.cacheManager.get<User>(cacheKey);

    if (cachedUser) {
      return cachedUser;
    }

    try {
      const user = await this.userModel.findOne({ email: email }).exec();

      if (!user || user === null) {
        return null;
      }

      // Cache the user data with a TTL of 60 seconds
      await this.cacheManager.set(cacheKey, user, 60); // Pass TTL as a number

      return user;
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user');
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<{ token: string }> {
    const emailExists = await this.findByEmail(createUserDto.email);

    if (emailExists) {
      throw new ForbiddenException('Email already exists');
    }
    const hashedPassword = await argon2.hash(createUserDto.password);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    try {
      await createdUser.save();
      return { token: await this.generateJwt(createdUser) };
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async verifyPassword(
    suppliedPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    try {
      return await argon2.verify(storedPassword, suppliedPassword);
    } catch (error) {
      throw new InternalServerErrorException('Error verifying password');
    }
  }

  async generateJwt(user: User): Promise<string> {
    const payload = { username: user.name, sub: user._id };

    try {
      const token = this.jwtService.sign(payload);
      return token;
    } catch (error) {
      console.error('Error generating JWT:', error);
      throw new InternalServerErrorException('Error generating JWT');
    }
  }

  async createReservation(
    reservation: CreateReservationDto,
    user: User,
  ): Promise<{ message: string; reservationId: string }> {
    try {
      const reservationId = uuidv4();

      const newReservation = new this.reservationModel({
        reservationId,
        userId: user._id.toString(),
        email: user.email,
        details: {
          ...reservation.reservationDetails,
          status: Status.PENDING,
          quantity:
            reservation.reservationDetails.quantity === undefined
              ? 1
              : reservation.reservationDetails.quantity,
        },
        agentId: null,
        bookedDate: reservation.reservationDetails.bookedDate
          ? new Date(reservation.reservationDetails.bookedDate)
          : new Date(),
      });
      try {
        await newReservation.save();
        return { message: 'Reservation created successfully', reservationId };
      } catch (saveError) {
        console.error('Error saving reservation:', saveError);
        throw new InternalServerErrorException('Error saving reservation');
      }
    } catch (error) {
      throw new InternalServerErrorException('Error creating reservation');
    }
  }
}
