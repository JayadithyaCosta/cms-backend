import { Status } from 'src/common/models/ENUM/user.enum';

export class UpdateReservationDto {
  reservationId: string;
  status: Status;
}

export class CreateAdminUserDto {
  name: string;
  email: string;
  password: string;
}

export class UpdateUserDto {
  userId: string;
  name: string;
  email: string;
}
