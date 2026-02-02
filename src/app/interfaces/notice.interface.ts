export interface SimpleNotice {
  _id: string;
  title: string;
  description: string;
  date: Date;
  time?: string;
  location: string;
  type: 'election' | 'daily' | 'important';
  priority: number;
  createdAt: Date;
}

export interface CreateNoticeDTO {
  title: string;
  description: string;
  date: Date;
  time?: string;
  location: string;
  type?: string;
  priority?: number;
}

export interface UpdateNoticeDTO {
  title?: string;
  description?: string;
  date?: Date;
  time?: string;
  location?: string;
  type?: string;
  priority?: number;
}

export interface NoticeResponse {
  success: boolean;
  message: string;
  notice?: SimpleNotice;
  notices?: SimpleNotice[];
}
