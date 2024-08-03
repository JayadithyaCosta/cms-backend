import { Status } from 'src/common/models/ENUM/user.enum';

export class UpdateReservationDto {
  reservationId: string;
  status: Status;
  specialNotes: string;
}

export class CreateAdminUserDto {
  name: string;
  email: string;
  password: string;
}
