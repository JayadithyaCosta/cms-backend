import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ReservationDetails } from 'src/common/models/types/reservations.type';

@Schema()
export class Reservation extends Document {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  details: ReservationDetails;

  @Prop({ required: true, default: false })
  agentId?: string;

  @Prop({ required: true, default: new Date() })
  createdAt: Date;

  @Prop({ required: true, default: new Date() })
  updatedAt: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
