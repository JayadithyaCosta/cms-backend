import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth-module/jwt-auth.guard';
import { GetUser } from '../auth-module/get-user.decorator';
import { User } from './schemas/user.schema'; // Import your User schema
import { CreateUserDto, LoginUserDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @GetUser() user: User): Promise<User> {
    console.log('Authenticated user:', user);
    return this.userService.findOne(id);
  }

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ token: string }> {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<{ token: string }> {
    const user = await this.userService.findByEmail(loginUserDto.email);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    console.log('User:', user);

    const isPasswordValid = await this.userService.verifyPassword(
      loginUserDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return { token: await this.userService.generateJwt(user) }; // Use generateJwt from UserService
  }
}
