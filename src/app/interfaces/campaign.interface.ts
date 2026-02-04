// =======================
// Campaign Image
// =======================
export interface CampaignImage {
  url: string;
  publicId: string;
  order: number;
  _id?: string;
}

// =======================
// Campaign Type
// =======================
export type CampaignType = 'VOLUNTEER' | 'EVENT' | 'SOCIAL_ACTIVITY';

// =======================
// Campaign Status
// =======================
export type CampaignStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';

// =======================
// Created By
// =======================
export interface CampaignCreator {
  _id: string;
  name: string;
  role: 'CANDIDATE' | 'ADMIN';
}

// =======================
// Campaign (NO MONEY, POLITICAL SAFE)
// =======================
export interface Campaign {
  _id: string;
  title: string;
  description: string;
  images: CampaignImage[];

  category: string;
  type: CampaignType;

  startDate: Date;
  endDate?: Date;

  location?: string;

  volunteerLimit?: number;
  registeredVolunteers?: number;

  status: CampaignStatus;
  priority: number;

  createdBy: CampaignCreator;

  createdAt: Date;
  updatedAt: Date;
}

// =======================
// Create Campaign DTO
// =======================
export interface CreateCampaignDTO {
  title: string;
  description: string;
  images?: CampaignImage[];

  category: string;
  type: CampaignType;

  startDate: Date;
  endDate?: Date;

  location?: string;
  volunteerLimit?: number;

  priority?: number;
}

// =======================
// Update Campaign DTO
// =======================
export interface UpdateCampaignDTO {
  title?: string;
  description?: string;
  images?: CampaignImage[];

  category?: string;
  type?: CampaignType;

  startDate?: Date;
  endDate?: Date;

  location?: string;
  volunteerLimit?: number;
  registeredVolunteers?: number;

  status?: CampaignStatus;
  priority?: number;
}

// =======================
// API Response
// =======================
export interface CampaignResponse {
  success: boolean;
  message: string;
  campaign?: Campaign;
  campaigns?: Campaign[];
}

// =======================
// Campaign Stats (NO FINANCIAL DATA)
// =======================
export interface CampaignStats {
  total: number;
  upcoming: number;
  ongoing: number;
  completed: number;
  cancelled: number;
}

// =======================
// Campaign Stats Response
// =======================
export interface CampaignStatsResponse {
  success: boolean;
  message: string;
  stats: CampaignStats;
}
