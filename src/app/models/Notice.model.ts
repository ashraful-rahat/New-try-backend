import mongoose, { Document, Schema } from 'mongoose';

export interface INotice extends Document {
  title: string;
  description: string;
  date: Date;
  time?: string;
  location: string;
  type: 'election' | 'daily' | 'important';
  priority: number;
  createdAt: Date;
}

const NoticeSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'শিরোনাম আবশ্যক'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'বিবরণ আবশ্যক'],
    },
    date: {
      type: Date,
      required: [true, 'তারিখ আবশ্যক'],
    },
    time: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: [true, 'লোকেশন আবশ্যক'],
    },
    type: {
      type: String,
      enum: ['election', 'daily', 'important'],
      default: 'daily',
    },
    priority: {
      type: Number,
      default: 0,
      min: 0,
      max: 10,
    },
  },
  {
    timestamps: true,
  },
);

// Simple indexes
NoticeSchema.index({ date: -1 });
NoticeSchema.index({ type: 1, date: -1 });
NoticeSchema.index({ priority: -1, date: -1 });

export const NoticeModel = mongoose.model<INotice>('Notice', NoticeSchema);
