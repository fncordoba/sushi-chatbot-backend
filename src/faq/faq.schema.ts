import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class FAQ extends Document {
  @Prop({ required: true })
  question: string;

  @Prop({ required: true })
  answer: string;
}

export const FAQSchema = SchemaFactory.createForClass(FAQ);
