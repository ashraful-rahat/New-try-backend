import mongoose, { Document, Schema } from 'mongoose';
import { AdminRole } from '../interfaces/auth.interface';

export interface IAdmin extends Document {
  email: string;
  password: string;
  role: AdminRole;
  createdAt: Date;
  lastLogin?: Date;
}

const AdminSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'member'],
    default: 'member',
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
});

export const AdminModel = mongoose.model<IAdmin>('Admin', AdminSchema);
