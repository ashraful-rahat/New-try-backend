import { ComplaintModel } from '../app/models/Complaint.model';

export const generateComplaintId = async (): Promise<string> => {
  // Get last complaint
  const lastComplaint = await ComplaintModel.findOne()
    .sort({ createdAt: -1 })
    .select('complaintId');

  if (!lastComplaint) {
    return 'CMP-001'; // First complaint
  }

  // Extract number from last ID (CMP-001 -> 1)
  const lastNumber = parseInt(lastComplaint.complaintId.split('-')[1]);
  const newNumber = lastNumber + 1;

  // Generate new ID with padding (CMP-002, CMP-010, CMP-100)
  return `CMP-${String(newNumber).padStart(3, '0')}`;
};
