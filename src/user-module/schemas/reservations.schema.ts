import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  ReservationDetails,
  ReservationModelAdminUserInfo,
} from 'src/common/models/types/reservations.type';

@Schema()
export class Reservation extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, type: Object })
  details: ReservationDetails;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false, default: null, type: Object })
  adminInfo?: ReservationModelAdminUserInfo;

  @Prop({ required: true, default: false })
  bookedDate: Date;

  @Prop({ required: false, default: new Date() })
  createdAt: Date;

  @Prop({ required: false, default: new Date() })
  updatedAt: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
