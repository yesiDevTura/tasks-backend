import mongoose, { Document, Schema } from 'mongoose';
import { TaskPriorityValue } from '../../../domain/value-objects/TaskPriority';

export interface TaskDocument extends Document {
  title: string;
  description: string;
  completed: boolean;
  priority: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<TaskDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },    description: {
      type: String,
      required: false,
      trim: true,
    },
    completed: {
      type: Boolean,
      required: true,
      default: false,
    },    priority: {
      type: String,
      required: true,
      enum: Object.values(TaskPriorityValue),
      default: TaskPriorityValue.MEDIUM,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  { 
    timestamps: true // Automatically adds createdAt and updatedAt fields
  }
);

export const TaskModel = mongoose.model<TaskDocument>('Task', taskSchema);
