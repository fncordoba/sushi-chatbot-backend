import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class MenuItem extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop()
  description?: string;

  @Prop({ default: 0 })
  quantity?: number;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);
