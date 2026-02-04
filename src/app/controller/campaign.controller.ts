import { Request, Response } from 'express';
import { getCloudinaryImageData } from '../middleware/multer';
import { CampaignService } from '../services/campaign.service';

const campaignService = new CampaignService();

// =======================
// Helpers
// =======================
const validateCampaignData = (data: any): string | null => {
  if (!data.title || !data.description || !data.category || !data.type || !data.startDate) {
    return 'টাইটেল, বিবরণ, ক্যাটাগরি, টাইপ এবং শুরুর তারিখ দিন';
  }

  if (data.title.length < 5) {
    return 'টাইটেল ৫ অক্ষরের বেশি হতে হবে';
  }

  if (data.description.length < 20) {
    return 'বিবরণ ২০ অক্ষরের বেশি হতে হবে';
  }

  return null;
};

const getStringParam = (param: string | string[] | undefined): string => {
  if (Array.isArray(param)) return param[0];
  return param as string;
};

// =======================
// Create Campaign
// =======================
export const createCampaign = async (req: Request, res: Response) => {
  try {
    const uploadedFiles = req.files as Express.Multer.File[];
    const images: any[] = [];

    if (uploadedFiles?.length) {
      uploadedFiles.forEach((file, index) => {
        const imageData = getCloudinaryImageData(file);
        images.push({
          url: imageData.url,
          publicId: imageData.publicId,
          order: index,
        });
      });
    }

    const campaignData = {
      title: req.body.title,
      description: req.body.description,
      images,
      category: req.body.category,
      type: req.body.type, // VOLUNTEER | EVENT | SOCIAL_ACTIVITY
      startDate: new Date(req.body.startDate),
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
      location: req.body.location,
      volunteerLimit: req.body.volunteerLimit ? parseInt(req.body.volunteerLimit) : undefined,
      priority: req.body.priority ? parseInt(req.body.priority) : 0,
    };

    const validationError = validateCampaignData(campaignData);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    // TODO: Replace with real admin from auth middleware
    const createdBy = '65a1b2c3d4e5f67890abcdef';

    const result = await campaignService.createCampaign(campaignData, createdBy);

    res.status(201).json(result);
  } catch (error: any) {
    console.error('❌ Create Campaign Error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'ক্যাম্পেইন তৈরি করতে সমস্যা হয়েছে',
    });
  }
};

// =======================
// Get All Campaigns
// =======================
export const getAllCampaigns = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    const type = req.query.type as string | undefined;

    const result = await campaignService.getAllCampaigns(status, type);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'ক্যাম্পেইন গুলো পাওয়া যায়নি',
    });
  }
};

// =======================
// Get Active / Ongoing Campaigns
// =======================
export const getActiveCampaigns = async (_req: Request, res: Response) => {
  try {
    const result = await campaignService.getActiveCampaigns();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'সক্রিয় ক্যাম্পেইন পাওয়া যায়নি',
    });
  }
};

// =======================
// Get Single Campaign
// =======================
export const getCampaignById = async (req: Request, res: Response) => {
  try {
    const id = getStringParam(req.params.id);
    const result = await campaignService.getCampaignById(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || 'ক্যাম্পেইন পাওয়া যায়নি',
    });
  }
};

// =======================
// Update Campaign
// =======================
export const updateCampaign = async (req: Request, res: Response) => {
  try {
    const id = getStringParam(req.params.id);
    const uploadedFiles = req.files as Express.Multer.File[];

    let images;
    if (uploadedFiles?.length) {
      images = uploadedFiles.map((file, index) => {
        const imageData = getCloudinaryImageData(file);
        return {
          url: imageData.url,
          publicId: imageData.publicId,
          order: index,
        };
      });
    }

    const updateData: any = { ...req.body };

    if (images) updateData.images = images;
    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
    if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);
    if (updateData.volunteerLimit) updateData.volunteerLimit = parseInt(updateData.volunteerLimit);
    if (updateData.priority) updateData.priority = parseInt(updateData.priority);

    const result = await campaignService.updateCampaign(id, updateData);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'ক্যাম্পেইন আপডেট করা যায়নি',
    });
  }
};

// =======================
// Update Campaign Status
// =======================
export const updateCampaignStatus = async (req: Request, res: Response) => {
  try {
    const id = getStringParam(req.params.id);
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'স্ট্যাটাস দিন',
      });
    }

    const result = await campaignService.updateCampaignStatus(id, status);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'স্ট্যাটাস আপডেট করা যায়নি',
    });
  }
};

// =======================
// Delete Campaign
// =======================
export const deleteCampaign = async (req: Request, res: Response) => {
  try {
    const id = getStringParam(req.params.id);
    const result = await campaignService.deleteCampaign(id);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(404).json({
      success: false,
      message: error.message || 'ক্যাম্পেইন ডিলিট করা যায়নি',
    });
  }
};

// =======================
// Campaign Statistics (NO MONEY)
// =======================
export const getCampaignStats = async (_req: Request, res: Response) => {
  try {
    const result = await campaignService.getCampaignStats();
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'স্ট্যাটস পাওয়া যায়নি',
    });
  }
};

// =======================
// Add Images
// =======================
export const addImagesToCampaign = async (req: Request, res: Response) => {
  try {
    const id = getStringParam(req.params.id);
    const uploadedFiles = req.files as Express.Multer.File[];

    if (!uploadedFiles?.length) {
      return res.status(400).json({
        success: false,
        message: 'কমপক্ষে একটি ইমেজ দিন',
      });
    }

    const images = uploadedFiles.map((file, index) => {
      const imageData = getCloudinaryImageData(file);
      return {
        url: imageData.url,
        publicId: imageData.publicId,
        order: index,
      };
    });

    const result = await campaignService.addImagesToCampaign(id, images);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'ইমেজ যোগ করা যায়নি',
    });
  }
};

// =======================
// Remove Image
// =======================
export const removeImageFromCampaign = async (req: Request, res: Response) => {
  try {
    const id = getStringParam(req.params.id);
    const publicId = getStringParam(req.params.publicId);

    const result = await campaignService.removeImageFromCampaign(id, publicId);
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'ইমেজ মুছা যায়নি',
    });
  }
};

// =======================
// Export
// =======================
export const campaignController = {
  create: createCampaign,
  getAll: getAllCampaigns,
  getActive: getActiveCampaigns,
  getById: getCampaignById,
  update: updateCampaign,
  updateStatus: updateCampaignStatus,
  delete: deleteCampaign,
  getStats: getCampaignStats,
  addImages: addImagesToCampaign,
  removeImage: removeImageFromCampaign,
};
