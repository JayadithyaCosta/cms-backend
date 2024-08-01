import { Status } from '../ENUM/user.enum';

export type ReservationDetails = {
  reservationId: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  status: Status;
  quantity: number;
  specialRequests?: string;
  tablenumber?: number;
};
