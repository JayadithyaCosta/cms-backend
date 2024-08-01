import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth-module/jwt-auth.guard';
import { GetUser } from '../auth-module/get-user.decorator';
import { User } from './schemas/user.schema'; // Import your User schema

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @GetUser() user: User): Promise<User> {
    console.log('Authenticated user:', user);
    return this.userService.findOne(id);
  }

  @Post()
  async register(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<User> {
    console.log('Authenticated user:', user);
    return this.userService.findOne(id);
  }
}
