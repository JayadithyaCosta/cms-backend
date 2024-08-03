import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation } from 'src/user-module/schemas/reservations.schema';
import { User } from 'src/user-module/schemas/user.schema';
import {
  CreateAdminUserDto,
  UpdateReservationDto,
} from './dto/response/create-actions-admin-user.dto';
import { UserService } from 'src/user-module/user.service';
import { UserEnum } from 'src/common/models/ENUM/user.enum';
import * as argon2 from 'argon2';
import { ObjectId } from 'mongodb';
import { BaseResponseDto } from './dto/response/base.response.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Reservation.name) private reservationmodel: Model<Reservation>,
    private readonly userService: UserService,
  ) {}

  async getAllUsers(): Promise<User[]> {
    const users = await this.userModel
      .find({ role: UserEnum.DEFAULT_USER })
      .exec();
    const sanitizedUsers = users.map((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      delete userObj.createdAt;
      delete userObj.updatedAt;
      return userObj;
    });
    return sanitizedUsers;
  }

  async getAllReservations(): Promise<Reservation[]> {
    return this.reservationmodel.find().exec();
  }

  async updateReservation(
    updateReservationDto: UpdateReservationDto,
    user: User,
  ): Promise<BaseResponseDto> {
    const { reservationId, status } = updateReservationDto;
    const reservationObjectId = new ObjectId(reservationId);

    await this.reservationmodel
      .findOneAndUpdate(
        { _id: reservationObjectId },
        {
          'details.status': status,
          adminInfo: {
            username: user.name,
            userId: user._id,
          },
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    return {
      success: true,
      message: 'Reservation updated successfully',
    };
  }

  async deleteReservation(reservationId: string) {
    return this.reservationmodel.findByIdAndDelete(reservationId).exec();
  }

  async createAdminUser(
    createAdminUserDto: CreateAdminUserDto,
  ): Promise<{ token: string }> {
    const emailExists = await this.userService.findByEmail(
      createAdminUserDto.email,
    );
    if (emailExists) {
      throw new ForbiddenException('Email already exists');
    }
    const hashedPassword = await argon2.hash(createAdminUserDto.password);
    const user = new this.userModel({
      ...createAdminUserDto,
      password: hashedPassword,
      role: UserEnum.ADMIN_USER,
    });
    try {
      await user.save();
      const token = await this.userService.generateJwt(user);
      return {
        token,
      };
    } catch (error) {
      throw new Error('Error creating admin user');
    }
  }
}
