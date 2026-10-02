import { Schema, model, type InferSchemaType } from 'mongoose';

const todoSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title must be at most 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description must be at most 1000 characters'],
      default: '',
    },
    done: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export type Todo = InferSchemaType<typeof todoSchema>;

export const TodoModel = model('Todo', todoSchema);
