import { CreateNoticeDTO, NoticeResponse, UpdateNoticeDTO } from '../interfaces/notice.interface';
import { NoticeModel } from '../models/Notice.model';

export class NoticeService {
  // Convert to response object
  private toResponseObject(doc: any): any {
    return {
      _id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      date: doc.date,
      time: doc.time || '',
      location: doc.location,
      type: doc.type,
      priority: doc.priority,
      createdAt: doc.createdAt,
    };
  }

  // Create Notice
  async createNotice(data: CreateNoticeDTO): Promise<NoticeResponse> {
    try {
      const notice = await NoticeModel.create(data);

      return {
        success: true,
        message: 'নোটিশ তৈরি হয়েছে',
        notice: this.toResponseObject(notice),
      };
    } catch (error: any) {
      throw new Error(error.message || 'নোটিশ তৈরি করতে সমস্যা');
    }
  }

  // Get All Notices
  async getAllNotices(type?: string): Promise<NoticeResponse> {
    try {
      const query: any = {};
      if (type) query.type = type;

      const notices = await NoticeModel.find(query).sort({ date: -1, priority: -1 });

      return {
        success: true,
        message: 'সব নোটিশ',
        notices: notices.map((notice) => this.toResponseObject(notice)),
      };
    } catch (error: any) {
      throw new Error(error.message || 'নোটিশ পাওয়া যায়নি');
    }
  }

  // Get Today's Notices
  async getTodayNotices(): Promise<NoticeResponse> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const notices = await NoticeModel.find({
        date: { $gte: today, $lt: tomorrow },
      }).sort({ priority: -1, createdAt: -1 });

      return {
        success: true,
        message: 'আজকের নোটিশ',
        notices: notices.map((notice) => this.toResponseObject(notice)),
      };
    } catch (error: any) {
      throw new Error(error.message || 'আজকের নোটিশ পাওয়া যায়নি');
    }
  }

  // Get Upcoming Notices
  async getUpcomingNotices(limit = 10): Promise<NoticeResponse> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const notices = await NoticeModel.find({
        date: { $gte: today },
      })
        .sort({ date: 1, priority: -1 })
        .limit(limit);

      return {
        success: true,
        message: 'আসন্ন নোটিশ',
        notices: notices.map((notice) => this.toResponseObject(notice)),
      };
    } catch (error: any) {
      throw new Error(error.message || 'আসন্ন নোটিশ পাওয়া যায়নি');
    }
  }

  // Get Important Notices
  async getImportantNotices(): Promise<NoticeResponse> {
    try {
      const notices = await NoticeModel.find({ type: 'important' })
        .sort({ date: -1, priority: -1 })
        .limit(20);

      return {
        success: true,
        message: 'গুরুত্বপূর্ণ নোটিশ',
        notices: notices.map((notice) => this.toResponseObject(notice)),
      };
    } catch (error: any) {
      throw new Error(error.message || 'গুরুত্বপূর্ণ নোটিশ পাওয়া যায়নি');
    }
  }

  // Get Single Notice
  async getNoticeById(id: string): Promise<NoticeResponse> {
    try {
      const notice = await NoticeModel.findById(id);

      if (!notice) {
        throw new Error('নোটিশ পাওয়া যায়নি');
      }

      return {
        success: true,
        message: 'নোটিশ পাওয়া গেছে',
        notice: this.toResponseObject(notice),
      };
    } catch (error: any) {
      throw new Error(error.message || 'নোটিশ পাওয়া যায়নি');
    }
  }

  // Update Notice
  async updateNotice(id: string, data: UpdateNoticeDTO): Promise<NoticeResponse> {
    try {
      const notice = await NoticeModel.findByIdAndUpdate(id, data, { new: true });

      if (!notice) {
        throw new Error('নোটিশ পাওয়া যায়নি');
      }

      return {
        success: true,
        message: 'নোটিশ আপডেট হয়েছে',
        notice: this.toResponseObject(notice),
      };
    } catch (error: any) {
      throw new Error(error.message || 'নোটিশ আপডেট করতে সমস্যা');
    }
  }

  // Delete Notice
  async deleteNotice(id: string): Promise<NoticeResponse> {
    try {
      const notice = await NoticeModel.findByIdAndDelete(id);

      if (!notice) {
        throw new Error('নোটিশ পাওয়া যায়নি');
      }

      return {
        success: true,
        message: 'নোটিশ ডিলিট হয়েছে',
      };
    } catch (error: any) {
      throw new Error(error.message || 'নোটিশ ডিলিট করতে সমস্যা');
    }
  }
}
