export interface CampaignImage {
  url: string;
  publicId: string;
  order: number;
  _id?: string;
}

export interface Campaign {
  _id: string;
  title: string;
  description: string;
  images: CampaignImage[];
  category: string;
  targetAmount?: number;
  collectedAmount: number;
  startDate: Date;
  endDate?: Date;
  status: string;
  priority: number;
  createdBy: string | { _id: string; name: string; email?: string };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCampaignDTO {
  title: string;
  description: string;
  images?: CampaignImage[];
  category: string;
  targetAmount?: number;
  startDate: Date;
  endDate?: Date;
  priority?: number;
}

export interface UpdateCampaignDTO {
  title?: string;
  description?: string;
  images?: CampaignImage[];
  category?: string;
  targetAmount?: number;
  collectedAmount?: number;
  startDate?: Date;
  endDate?: Date;
  status?: string;
  priority?: number;
}

export interface CampaignResponse {
  success: boolean;
  message: string;
  campaign?: Campaign;
  campaigns?: Campaign[];
}

export interface CampaignStats {
  total: number;
  active: number;
  completed: number;
  cancelled: number;
  totalTarget: number;
  totalCollected: number;
  completionRate: string;
}

export interface CampaignStatsResponse {
  success: boolean;
  message: string;
  stats: CampaignStats;
}
