import { Request, Response } from 'express';
import { NoticeService } from '../services/notice.service';

const noticeService = new NoticeService();

// Create Notice
export const createNotice = async (req: Request, res: Response) => {
  try {
    const { title, description, date, time, location, type, priority } = req.body;

    // Simple validation
    if (!title || !description || !date || !location) {
      return res.status(400).json({
        success: false,
        message: 'শিরোনাম, বিবরণ, তারিখ এবং লোকেশন দিন',
      });
    }

    const noticeData = {
      title,
      description,
      date: new Date(date),
      time: time || '',
      location,
      type: type || 'daily',
      priority: priority ? parseInt(String(priority)) : 0,
    };

    const result = await noticeService.createNotice(noticeData);

    res.status(201).json(result);
  } catch (error: any) {
    console.error('Error creating notice:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'নোটিশ তৈরি করতে সমস্যা হয়েছে',
    });
  }
};

// Get All Notices
export const getAllNotices = async (req: Request, res: Response) => {
  try {
    const type = req.query.type as string;
    const result = await noticeService.getAllNotices(type);

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error getting all notices:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'নোটিশ গুলো পাওয়া যায়নি',
    });
  }
};

// Get Today's Notices
export const getTodayNotices = async (req: Request, res: Response) => {
  try {
    const result = await noticeService.getTodayNotices();

    res.status(200).json(result);
  } catch (error: any) {
    console.error("Error getting today's notices:", error);
    res.status(400).json({
      success: false,
      message: error.message || 'আজকের নোটিশ পাওয়া যায়নি',
    });
  }
};

// Get Upcoming Notices
export const getUpcomingNotices = async (req: Request, res: Response) => {
  try {
    const limitParam = req.query.limit;
    const limit = limitParam ? parseInt(String(limitParam)) : 10; // ✅ Fixed
    const result = await noticeService.getUpcomingNotices(limit);

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error getting upcoming notices:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'আসন্ন নোটিশ পাওয়া যায়নি',
    });
  }
};

// Get Important Notices
export const getImportantNotices = async (req: Request, res: Response) => {
  try {
    const result = await noticeService.getImportantNotices();

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error getting important notices:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'গুরুত্বপূর্ণ নোটিশ পাওয়া যায়নি',
    });
  }
};

// Get Single Notice - ✅ FIXED: Using String() constructor
export const getNoticeById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id); // ✅ Fixed: Convert to string

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'নোটিশ আইডি দিন',
      });
    }

    const result = await noticeService.getNoticeById(id);

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error getting notice by ID:', error);
    const status = error.message === 'নোটিশ পাওয়া যায়নি' ? 404 : 400;
    res.status(status).json({
      success: false,
      message: error.message || 'নোটিশ পাওয়া যায়নি',
    });
  }
};

// Update Notice - ✅ FIXED: Using String() constructor
export const updateNotice = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id); // ✅ Fixed: Convert to string

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'নোটিশ আইডি দিন',
      });
    }

    const updateData = { ...req.body };

    // Convert date if present
    if (updateData.date) {
      updateData.date = new Date(updateData.date);
    }

    // Convert priority to number if present
    if (updateData.priority !== undefined) {
      updateData.priority = parseInt(String(updateData.priority));
    }

    const result = await noticeService.updateNotice(id, updateData);

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error updating notice:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'নোটিশ আপডেট করতে সমস্যা হয়েছে',
    });
  }
};

// Delete Notice - ✅ FIXED: Using String() constructor
export const deleteNotice = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id); // ✅ Fixed: Convert to string

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'নোটিশ আইডি দিন',
      });
    }

    const result = await noticeService.deleteNotice(id);

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error deleting notice:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'নোটিশ ডিলিট করতে সমস্যা হয়েছে',
    });
  }
};

// Export controller object
export const noticeController = {
  create: createNotice,
  getAll: getAllNotices,
  getToday: getTodayNotices,
  getUpcoming: getUpcomingNotices,
  getImportant: getImportantNotices,
  getById: getNoticeById,
  update: updateNotice,
  delete: deleteNotice,
};
