import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type TaskDocument = Task & Document;

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Schema({ timestamps: true })
export class Task {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ enum: TaskStatus, default: TaskStatus.TODO })
  status: TaskStatus;

  @Prop({ enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop()
  dueDate?: Date;

  @Prop({ default: Date.now })
  completedAt?: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.index({ userId: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ createdAt: -1 });
TaskSchema.index({ dueDate: 1 });
