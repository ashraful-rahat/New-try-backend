export interface Complaint {
  _id: string;
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

export interface CreateComplaintDTO {
  name: string;
  phone: string;
  area: string;
  complaintType: string;
  details: string;
}

export interface TrackComplaintDTO {
  phone: string;
}

export interface UpdateComplaintDTO {
  status: string;
  adminNote?: string;
}

export interface ComplaintResponse {
  message: string;
  complaint?: Complaint;
  complaints?: Complaint[];
}
