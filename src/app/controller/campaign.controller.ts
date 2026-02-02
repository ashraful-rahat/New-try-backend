import { Request, Response } from 'express';
import { getCloudinaryImageData } from '../middleware/multer';
import { CampaignService } from '../services/campaign.service';

const campaignService = new CampaignService();

// Helper functions
const validateCampaignData = (data: any): string | null => {
  if (!data.title || !data.description || !data.category || !data.startDate) {
    return 'টাইটেল, বিবরণ, ক্যাটাগরি এবং শুরুর তারিখ দিন';
  }

  if (data.title.length < 5) {
    return 'টাইটেল ৫ অক্ষরের বেশি হতে হবে';
  }

  if (data.description.length < 20) {
    return 'বিবরণ ২০ অক্ষরের বেশি হতে হবে';
  }

  if (data.targetAmount && data.targetAmount < 0) {
    return 'টার্গেট অ্যামাউন্ট ০ বা তার বেশি হতে হবে';
  }

  return null;
};

// Type-safe parameter extraction
const getStringParam = (param: string | string[] | undefined): string => {
  if (Array.isArray(param)) {
    return param[0]; // Take first element if it's an array
  }
  return param as string; // Cast to string
};

// Create Campaign
export const createCampaign = async (req: Request, res: Response) => {
  try {
    console.log('📤 Create Campaign Request Received');
    console.log('Body:', req.body);
    console.log('Files count:', req.files ? (req.files as Express.Multer.File[]).length : 0);

    // Process uploaded images
    const uploadedFiles = req.files as Express.Multer.File[];
    const images = [];

    if (uploadedFiles && uploadedFiles.length > 0) {
      console.log(`Processing ${uploadedFiles.length} images...`);

      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        console.log(`Image ${i + 1}:`, {
          originalname: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          filename: file.filename,
          path: file.path,
        });

        // Get Cloudinary image data
        const imageData = getCloudinaryImageData(file);

        images.push({
          url: imageData.url,
          publicId: imageData.publicId,
          order: i,
        });

        console.log(`✅ Processed image ${i + 1}: ${imageData.url}`);
      }
    }

    // Prepare campaign data
    const campaignData = {
      title: req.body.title,
      description: req.body.description,
      images,
      category: req.body.category,
      targetAmount: req.body.targetAmount ? parseFloat(req.body.targetAmount) : undefined,
      startDate: new Date(req.body.startDate),
      endDate: req.body.endDate ? new Date(req.body.endDate) : undefined,
      priority: req.body.priority ? parseInt(req.body.priority) : 0,
    };

    // Validate data
    const validationError = validateCampaignData(campaignData);
    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    // For now, use a mock admin ID
    const createdBy = '65a1b2c3d4e5f67890abcdef';

    const result = await campaignService.createCampaign(campaignData, createdBy);

    console.log('✅ Campaign created successfully:', result.campaign?._id);

    res.status(201).json(result);
  } catch (error: any) {
    console.error('❌ Error creating campaign:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'ক্যাম্পেইন তৈরি করতে সমস্যা হয়েছে',
    });
  }
};

// Get All Campaigns
export const getAllCampaigns = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string | undefined;
    const result = await campaignService.getAllCampaigns(status);

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error getting campaigns:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'ক্যাম্পেইন গুলো পাওয়া যায়নি',
    });
  }
};

// Get Active Campaigns
export const getActiveCampaigns = async (req: Request, res: Response) => {
  try {
    const result = await campaignService.getActiveCampaigns();

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error getting active campaigns:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'সক্রিয় ক্যাম্পেইন গুলো পাওয়া যায়নি',
    });
  }
};

// Get Single Campaign - FIXED
export const getCampaignById = async (req: Request, res: Response) => {
  try {
    const id = getStringParam(req.params.id); // ✅ Fixed: Use helper
    const result = await campaignService.getCampaignById(id);

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error getting campaign:', error);
    res.status(error.message === 'ক্যাম্পেইন পাওয়া যায়নি' ? 404 : 400).json({
      success: false,
      message: error.message || 'ক্যাম্পেইন পাওয়া যায়নি',
    });
  }
};

// Update Campaign - FIXED
export const updateCampaign = async (req: Request, res: Response) => {
  try {
    const id = getStringParam(req.params.id); // ✅ Fixed: Use helper

    // Process new images if uploaded
    const uploadedFiles = req.files as Express.Multer.File[];
    let images = undefined;

    if (uploadedFiles && uploadedFiles.length > 0) {
      images = uploadedFiles.map((file, index) => {
        const imageData = getCloudinaryImageData(file);
        return {
          url: imageData.url,
          publicId: imageData.publicId,
          order: index,
        };
      });
    }

    // Prepare update data
    const updateData: any = { ...req.body };

    if (images) {
      updateData.images = images;
    }

    // Convert and validate dates
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }

    // Convert numbers
    if (updateData.targetAmount) {
      updateData.targetAmount = parseFloat(updateData.targetAmount);
    }
    if (updateData.priority) {
      updateData.priority = parseInt(updateData.priority);
    }

    const result = await campaignService.updateCampaign(id, updateData);

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error updating campaign:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'ক্যাম্পেইন আপডেট করতে সমস্যা হয়েছে',
    });
  }
};

// Update Campaign Status - FIXED
export const updateCampaignStatus = async (req: Request, res: Response) => {
  try {
    const id = getStringParam(req.params.id); // ✅ Fixed: Use helper
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
    console.error('Error updating campaign status:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে',
    });
  }
};

// Delete Campaign - FIXED
export const deleteCampaign = async (req: Request, res: Response) => {
  try {
    const id = getStringParam(req.params.id); // ✅ Fixed: Use helper
    const result = await campaignService.deleteCampaign(id);

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error deleting campaign:', error);
    res.status(error.message === 'ক্যাম্পেইন পাওয়া যায়নি' ? 404 : 400).json({
      success: false,
      message: error.message || 'ক্যাম্পেইন ডিলিট করতে সমস্যা হয়েছে',
    });
  }
};

// Get Campaign Statistics
export const getCampaignStats = async (req: Request, res: Response) => {
  try {
    const result = await campaignService.getCampaignStats();

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error getting campaign stats:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'পরিসংখ্যান পাওয়া যায়নি',
    });
  }
};

// Add Images to Campaign - FIXED
export const addImagesToCampaign = async (req: Request, res: Response) => {
  try {
    const id = getStringParam(req.params.id); // ✅ Fixed: Use helper
    const uploadedFiles = req.files as Express.Multer.File[];

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'কমপক্ষে একটি ইমেজ আপলোড করুন',
      });
    }

    const images = uploadedFiles.map((file, index) => {
      const imageData = getCloudinaryImageData(file);
      return {
        url: imageData.url,
        publicId: imageData.publicId,
      };
    });

    const result = await campaignService.addImagesToCampaign(id, images);

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error adding images:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'ইমেজ যোগ করতে সমস্যা হয়েছে',
    });
  }
};

// Remove Image from Campaign - FIXED
export const removeImageFromCampaign = async (req: Request, res: Response) => {
  try {
    const id = getStringParam(req.params.id); // ✅ Fixed: Use helper
    const publicId = getStringParam(req.params.publicId); // ✅ Fixed: Use helper

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'ইমেজ আইডি দিন',
      });
    }

    const result = await campaignService.removeImageFromCampaign(id, publicId);

    res.status(200).json(result);
  } catch (error: any) {
    console.error('Error removing image:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'ইমেজ মুছতে সমস্যা হয়েছে',
    });
  }
};

// Export controller object
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
