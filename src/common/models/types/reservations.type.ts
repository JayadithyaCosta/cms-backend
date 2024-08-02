import { Status } from '../ENUM/user.enum';

export type ReservationDetails = {
  // startDate: Date;
  // endDate: Date;
  bookedDate: Date;
  quantity?: number;
  status?: Status;
  specialRequests?: string;
  tablenumber: number;
};
