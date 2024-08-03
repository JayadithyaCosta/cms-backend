import { Status } from '../ENUM/user.enum';

export type ReservationDetails = {
  bookedDate: Date;
  quantity?: number;
  status?: Status;
  specialRequests?: string;
  tablenumber: number;
};

export type ReservationModelAdminUserInfo = {
  username: string;
  userId: string;
};
