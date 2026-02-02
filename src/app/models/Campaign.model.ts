import mongoose, { Document, Schema } from 'mongoose';

export interface ICampaignImage {
  url: string;
  publicId: string;
  order: number;
}

export interface ICampaign extends Document {
  title: string;
  description: string;
  images: ICampaignImage[];
  category: string;
  targetAmount?: number;
  collectedAmount: number;
  startDate: Date;
  endDate?: Date;
  status: 'active' | 'completed' | 'cancelled' | 'pending';
  priority: number;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CampaignImageSchema: Schema = new Schema({
  url: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    default: 0,
  },
});

const CampaignSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'টাইটেল আবশ্যক'],
      trim: true,
      minlength: [5, 'টাইটেল ৫ অক্ষরের বেশি হতে হবে'],
      maxlength: [200, 'টাইটেল ২০০ অক্ষরের কম হতে হবে'],
    },
    description: {
      type: String,
      required: [true, 'বিবরণ আবশ্যক'],
      minlength: [20, 'বিবরণ ২০ অক্ষরের বেশি হতে হবে'],
    },
    images: [CampaignImageSchema],
    category: {
      type: String,
      required: [true, 'ক্যাটাগরি আবশ্যক'],
      enum: [
        'শিক্ষা',
        'স্বাস্থ্য',
        'রাস্তাঘাট',
        'পরিবেশ',
        'যুব উন্নয়ন',
        'দরিদ্র সহায়তা',
        'অন্যান্য',
      ],
    },
    targetAmount: {
      type: Number,
      min: [0, 'টার্গেট অ্যামাউন্ট ০ বা তার বেশি হতে হবে'],
      default: 0,
    },
    collectedAmount: {
      type: Number,
      min: [0, 'সংগ্রহিত অ্যামাউন্ট ০ বা তার বেশি হতে হবে'],
      default: 0,
    },
    startDate: {
      type: Date,
      required: [true, 'শুরুর তারিখ আবশ্যক'],
    },
    endDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'cancelled', 'pending'],
      default: 'active',
    },
    priority: {
      type: Number,
      min: [0, 'প্রায়োরিটি ০ বা তার বেশি হতে হবে'],
      max: [10, 'প্রায়োরিটি ১০ বা তার কম হতে হবে'],
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for better performance
CampaignSchema.index({ status: 1, priority: -1, createdAt: -1 });
CampaignSchema.index({ category: 1 });
CampaignSchema.index({ createdBy: 1 });
CampaignSchema.index({ startDate: 1 });
CampaignSchema.index({ endDate: 1 });

export const CampaignModel = mongoose.model<ICampaign>('Campaign', CampaignSchema);
