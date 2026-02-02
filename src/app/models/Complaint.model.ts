import mongoose, { Document, Schema } from 'mongoose';

export interface IComplaint extends Document {
  complaintId: string;
  name: string;
  phone: string;
  area: string;
  complaintType: string;
  details: string;
  status: string;
  adminNote?: string;
  createdAt: Date;
  solvedAt?: Date;
}

const ComplaintSchema: Schema = new Schema({
  complaintId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  area: {
    type: String,
    required: true,
    trim: true,
  },
  complaintType: {
    type: String,
    required: true,
    enum: ['রাস্তা', 'বিদ্যুৎ', 'পানি', 'স্বাস্থ্য', 'শিক্ষা', 'অন্যান্য'],
  },
  details: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'solved'],
    default: 'pending',
  },
  adminNote: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  solvedAt: {
    type: Date,
    default: null,
  },
});

export const ComplaintModel = mongoose.model<IComplaint>('Complaint', ComplaintSchema);
