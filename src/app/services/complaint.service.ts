import { generateComplaintId } from '../../utils/idGenerator';
import {
  ComplaintResponse,
  CreateComplaintDTO,
  TrackComplaintDTO,
  UpdateComplaintDTO,
} from '../interfaces/complaint.interface';
import { ComplaintModel } from '../models/Complaint.model';

export class ComplaintService {
  // Create Complaint (Public - No Auth)
  async createComplaint(data: CreateComplaintDTO): Promise<ComplaintResponse> {
    // Generate unique complaint ID
    const complaintId = await generateComplaintId();

    // Create complaint
    const complaint = await ComplaintModel.create({
      complaintId,
      ...data,
      status: 'pending',
    });

    return {
      message: 'অভিযোগ সফলভাবে জমা হয়েছে',
      complaint: { ...complaint.toObject(), _id: complaint._id.toString() },
    };
  }

  // Track Complaints by Phone (Public - No Auth)
  async trackComplaints(data: TrackComplaintDTO): Promise<ComplaintResponse> {
    const { phone } = data;

    const complaints = await ComplaintModel.find({ phone }).sort({ createdAt: -1 });

    if (complaints.length === 0) {
      throw new Error('এই নম্বরে কোনো অভিযোগ পাওয়া যায়নি');
    }

    return {
      message: 'অভিযোগ খুঁজে পাওয়া গেছে',
      complaints: complaints.map((c) => ({ ...c.toObject(), _id: c._id.toString() })),
    };
  }

  // Get All Complaints (Admin Only)
  async getAllComplaints(): Promise<ComplaintResponse> {
    const complaints = await ComplaintModel.find().sort({ createdAt: -1 });

    return {
      message: 'সব অভিযোগ',
      complaints: complaints.map((c) => ({ ...c.toObject(), _id: c._id.toString() })),
    };
  }

  // Get Single Complaint (Admin Only)
  async getComplaintById(id: string): Promise<ComplaintResponse> {
    const complaint = await ComplaintModel.findById(id);

    if (!complaint) {
      throw new Error('অভিযোগ পাওয়া যায়নি');
    }

    return {
      message: 'অভিযোগ পাওয়া গেছে',
      complaint: { ...complaint.toObject(), _id: complaint._id.toString() } as any,
    };
  }

  // Update Complaint Status (Admin Only)
  async updateComplaintStatus(id: string, data: UpdateComplaintDTO): Promise<ComplaintResponse> {
    const complaint = await ComplaintModel.findById(id);

    if (!complaint) {
      throw new Error('অভিযোগ পাওয়া যায়নি');
    }

    // Update status
    complaint.status = data.status;
    complaint.adminNote = data.adminNote || complaint.adminNote;

    // If solved, set solvedAt
    if (data.status === 'solved') {
      complaint.solvedAt = new Date();
    }

    await complaint.save();

    return {
      message: 'অভিযোগ আপডেট হয়েছে',
      complaint: { ...complaint.toObject(), _id: complaint._id.toString() },
    };
  }

  // Delete Complaint (Admin Only)
  async deleteComplaint(id: string): Promise<ComplaintResponse> {
    const complaint = await ComplaintModel.findByIdAndDelete(id);

    if (!complaint) {
      throw new Error('অভিযোগ পাওয়া যায়নি');
    }

    return {
      message: 'অভিযোগ মুছে ফেলা হয়েছে',
      complaint: { ...complaint.toObject(), _id: complaint._id.toString() } as any,
    };
  }

  // Get Statistics (Public)
  async getStats() {
    const total = await ComplaintModel.countDocuments();
    const pending = await ComplaintModel.countDocuments({ status: 'pending' });
    const solved = await ComplaintModel.countDocuments({ status: 'solved' });

    return {
      message: 'পরিসংখ্যান',
      stats: {
        total,
        pending,
        solved,
      },
    };
  }
}
