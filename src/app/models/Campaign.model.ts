import mongoose, { Document, Schema } from 'mongoose';

// =======================
// Campaign Image Interface
// =======================
export interface ICampaignImage {
  url: string;
  publicId: string;
  order: number;
}

// =======================
// Campaign Types
// =======================
export type CampaignType = 'VOLUNTEER' | 'EVENT' | 'SOCIAL_ACTIVITY';

// =======================
// Campaign Status
// =======================
export type CampaignStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

// =======================
// Campaign Interface
// =======================
export interface ICampaign extends Document {
  title: string;
  description: string;
  images: ICampaignImage[];

  category: string;
  type: CampaignType;

  startDate: Date;
  endDate?: Date;

  location?: string;

  volunteerLimit?: number;
  registeredVolunteers?: number;

  status: CampaignStatus;
  priority: number;

  createdBy: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

// =======================
// Campaign Image Schema
// =======================
const CampaignImageSchema = new Schema<ICampaignImage>({
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

// =======================
// Campaign Schema (POLITICAL SAFE)
// =======================
const CampaignSchema = new Schema<ICampaign>(
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

    images: {
      type: [CampaignImageSchema],
      default: [],
    },

    category: {
      type: String,
      required: [true, 'ক্যাটাগরি আবশ্যক'],
      enum: ['শিক্ষা', 'স্বাস্থ্য', 'পরিবেশ', 'যুব উন্নয়ন', 'সামাজিক কার্যক্রম', 'অন্যান্য'],
    },

    type: {
      type: String,
      enum: ['VOLUNTEER', 'EVENT', 'SOCIAL_ACTIVITY'],
      required: true,
    },

    startDate: {
      type: Date,
      required: [true, 'শুরুর তারিখ আবশ্যক'],
    },

    endDate: {
      type: Date,
    },

    location: {
      type: String,
      trim: true,
    },

    volunteerLimit: {
      type: Number,
      min: [1, 'ভলান্টিয়ার লিমিট ১ বা তার বেশি হতে হবে'],
    },

    registeredVolunteers: {
      type: Number,
      default: 0,
      min: [0, 'ভলান্টিয়ার সংখ্যা ০ বা তার বেশি হতে হবে'],
    },

    status: {
      type: String,
      enum: ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'],
      default: 'UPCOMING',
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

// =======================
// Indexes
// =======================
CampaignSchema.index({ status: 1, priority: -1, createdAt: -1 });
CampaignSchema.index({ category: 1 });
CampaignSchema.index({ type: 1 });
CampaignSchema.index({ createdBy: 1 });
CampaignSchema.index({ startDate: 1 });
CampaignSchema.index({ endDate: 1 });

// =======================
// Model Export
// =======================
export const CampaignModel = mongoose.model<ICampaign>('Campaign', CampaignSchema);
