import {
  Injectable,
  Inject,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt'; // Import JwtService

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
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

  async createUser(createUserDto: CreateUserDto): Promise<{ token: string }> {
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
}
