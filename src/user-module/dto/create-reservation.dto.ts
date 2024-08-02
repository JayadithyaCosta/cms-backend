import { IsNotEmpty } from 'class-validator';
import { ReservationDetails } from 'src/common/models/types/reservations.type';

export class CreateReservationDto {
  @IsNotEmpty()
  reservationDetails: ReservationDetails;
}
