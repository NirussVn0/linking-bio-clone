import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  discordId: string;

  @Prop({ required: true })
  username: string;

  @Prop()
  avatar?: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop()
  email?: string;

  @Prop({ default: Date.now })
  lastLogin: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Note: discordId already has unique index from @Prop({ unique: true })
UserSchema.index({ username: 1 });
UserSchema.index({ email: 1 });
