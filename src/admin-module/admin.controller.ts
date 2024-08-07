import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import {
  CreateAdminUserDto,
  UpdateReservationDto,
  UpdateUserDto,
} from './dto/response/create-actions-admin-user.dto';
import { JwtAuthGuard } from 'src/auth-module/jwt-auth.guard';
import { RolesInterceptor } from 'src/common/interceptors/role.interceptor';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserEnum } from 'src/common/models/ENUM/user.enum';
import { User } from 'src/user-module/schemas/user.schema';
import { Reservation } from 'src/user-module/schemas/reservations.schema';
import { BaseResponseDto } from './dto/response/base.response.dto';
import { GetUser } from 'src/auth-module/get-user.decorator';

@Controller('admin')
export default class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('get-all-users')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RolesInterceptor)
  @Roles(UserEnum.ADMIN_USER)
  async getAllUsers(): Promise<User[]> {
    return this.adminService.getAllUsers();
  }

  @Post('update-user')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RolesInterceptor)
  @Roles(UserEnum.ADMIN_USER)
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<BaseResponseDto> {
    return this.adminService.updateUser(updateUserDto);
  }

  @Delete('delete-user')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RolesInterceptor)
  @Roles(UserEnum.ADMIN_USER)
  async deleteUser(@Query('userId') userId: string): Promise<BaseResponseDto> {
    return this.adminService.deleteUser(userId);
  }

  @Get('get-all-reservations')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RolesInterceptor)
  @Roles(UserEnum.ADMIN_USER)
  async getAllReservations(): Promise<Reservation[]> {
    return this.adminService.getAllReservations();
  }

  @Post('update-reservation')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RolesInterceptor)
  @Roles(UserEnum.ADMIN_USER)
  async updateReservation(
    @Body() updateReservationDto: UpdateReservationDto,
    @GetUser() user: User,
  ): Promise<BaseResponseDto> {
    return this.adminService.updateReservation(updateReservationDto, user);
  }

  @Delete('delete-reservation')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(RolesInterceptor)
  @Roles(UserEnum.ADMIN_USER)
  async deleteReservation(
    @Query('reservationId') reservationId: string,
  ): Promise<BaseResponseDto> {
    return this.adminService.deleteReservation(reservationId);
  }

  @Post('register')
  async register(
    @Body() createAdminUserDto: CreateAdminUserDto,
  ): Promise<{ token: string }> {
    return this.adminService.createAdminUser(createAdminUserDto);
  }
}
