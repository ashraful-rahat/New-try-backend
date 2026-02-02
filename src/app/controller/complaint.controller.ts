import { Request, Response } from 'express';
import { ComplaintService } from '../services/complaint.service';

const complaintService = new ComplaintService();

export class ComplaintController {
  // Create Complaint (Public)
  async create(req: Request, res: Response) {
    try {
      const { name, phone, area, complaintType, details } = req.body;

      // Validation
      if (!name || !phone || !area || !complaintType || !details) {
        return res.status(400).json({
          success: false,
          message: 'সব ফিল্ড পূরণ করুন',
        });
      }

      const result = await complaintService.createComplaint({
        name,
        phone,
        area,
        complaintType,
        details,
      });

      res.status(201).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Track Complaints (Public)
  async track(req: Request, res: Response) {
    try {
      const { phone } = req.body;

      if (!phone) {
        return res.status(400).json({
          success: false,
          message: 'ফোন নম্বর দিন',
        });
      }

      const result = await complaintService.trackComplaints({ phone });

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get All Complaints (Admin)
  async getAll(req: Request, res: Response) {
    try {
      const result = await complaintService.getAllComplaints();

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get Single Complaint (Admin)
  async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (Array.isArray(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid complaint id',
        });
      }

      const result = await complaintService.getComplaintById(id);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Update Status (Admin)
  async updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, adminNote } = req.body;

      if (Array.isArray(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid complaint id',
        });
      }

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status দিন',
        });
      }

      const result = await complaintService.updateComplaintStatus(id, {
        status,
        adminNote,
      });

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Delete Complaint (Admin)
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (Array.isArray(id)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid complaint id',
        });
      }

      const result = await complaintService.deleteComplaint(id);

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  // Get Stats (Public)
  async getStats(req: Request, res: Response) {
    try {
      const result = await complaintService.getStats();

      res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

// Export instance
export const complaintController = new ComplaintController();
