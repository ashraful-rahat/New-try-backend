import {
  CampaignResponse,
  CampaignStatsResponse,
  CreateCampaignDTO,
  UpdateCampaignDTO,
} from '../interfaces/campaign.interface';
import { cloudinary } from '../middleware/multer';
import { CampaignModel } from '../models/Campaign.model';

export class CampaignService {
  // Helper method to convert Mongoose document to response format
  private toResponseObject(doc: any) {
    const obj = doc.toObject ? doc.toObject() : doc;

    return {
      _id: obj._id.toString(),
      title: obj.title,
      description: obj.description,
      images: obj.images || [],
      category: obj.category,
      targetAmount: obj.targetAmount,
      collectedAmount: obj.collectedAmount,
      startDate: obj.startDate,
      endDate: obj.endDate,
      status: obj.status,
      priority: obj.priority,
      createdBy:
        typeof obj.createdBy === 'object' && obj.createdBy._id
          ? {
              _id: obj.createdBy._id.toString(),
              name: obj.createdBy.name,
              email: obj.createdBy.email,
            }
          : obj.createdBy?.toString() || obj.createdBy,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    };
  }

  // Create Campaign
  async createCampaign(data: CreateCampaignDTO, createdBy: string): Promise<CampaignResponse> {
    try {
      const campaignData = {
        ...data,
        createdBy: createdBy,
        status: 'active',
        collectedAmount: 0,
        priority: data.priority || 0,
      };

      const campaign = await CampaignModel.create(campaignData);

      return {
        success: true,
        message: 'ক্যাম্পেইন সফলভাবে তৈরি হয়েছে',
        campaign: this.toResponseObject(campaign),
      };
    } catch (error: any) {
      console.error('Error creating campaign:', error);
      throw new Error(error.message || 'ক্যাম্পেইন তৈরি করতে সমস্যা হয়েছে');
    }
  }

  // Get All Campaigns
  async getAllCampaigns(status?: string): Promise<CampaignResponse> {
    try {
      const query: any = {};

      if (status) {
        query.status = status;
      }

      const campaigns = await CampaignModel.find(query)
        .sort({ priority: -1, createdAt: -1 })
        .populate('createdBy', 'name email');

      return {
        success: true,
        message: campaigns.length > 0 ? 'সব ক্যাম্পেইন' : 'কোনো ক্যাম্পেইন নেই',
        campaigns: campaigns.map((campaign) => this.toResponseObject(campaign)),
      };
    } catch (error: any) {
      console.error('Error getting campaigns:', error);
      throw new Error(error.message || 'ক্যাম্পেইন গুলো পাওয়া যায়নি');
    }
  }

  // Get Active Campaigns (for frontend)
  async getActiveCampaigns(): Promise<CampaignResponse> {
    try {
      const campaigns = await CampaignModel.find({ status: 'active' })
        .sort({ priority: -1, createdAt: -1 })
        .populate('createdBy', 'name');

      return {
        success: true,
        message: 'সক্রিয় ক্যাম্পেইন',
        campaigns: campaigns.map((campaign) => this.toResponseObject(campaign)),
      };
    } catch (error: any) {
      console.error('Error getting active campaigns:', error);
      throw new Error(error.message || 'সক্রিয় ক্যাম্পেইন গুলো পাওয়া যায়নি');
    }
  }

  // Get Single Campaign by ID
  async getCampaignById(id: string): Promise<CampaignResponse> {
    try {
      const campaign = await CampaignModel.findById(id).populate('createdBy', 'name email');

      if (!campaign) {
        throw new Error('ক্যাম্পেইন পাওয়া যায়নি');
      }

      return {
        success: true,
        message: 'ক্যাম্পেইন পাওয়া গেছে',
        campaign: this.toResponseObject(campaign),
      };
    } catch (error: any) {
      console.error('Error getting campaign by ID:', error);
      throw new Error(error.message || 'ক্যাম্পেইন পাওয়া যায়নি');
    }
  }

  // Update Campaign
  async updateCampaign(id: string, data: UpdateCampaignDTO): Promise<CampaignResponse> {
    try {
      // If updating images, delete old images from Cloudinary
      if (data.images && data.images.length > 0) {
        const existingCampaign = await CampaignModel.findById(id);
        if (existingCampaign && existingCampaign.images.length > 0) {
          await this.deleteImagesFromCloudinary(existingCampaign.images);
        }
      }

      const campaign = await CampaignModel.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true },
      ).populate('createdBy', 'name email');

      if (!campaign) {
        throw new Error('ক্যাম্পেইন পাওয়া যায়নি');
      }

      return {
        success: true,
        message: 'ক্যাম্পেইন আপডেট হয়েছে',
        campaign: this.toResponseObject(campaign),
      };
    } catch (error: any) {
      console.error('Error updating campaign:', error);
      throw new Error(error.message || 'ক্যাম্পেইন আপডেট করতে সমস্যা হয়েছে');
    }
  }

  // Update Campaign Status
  async updateCampaignStatus(id: string, status: string): Promise<CampaignResponse> {
    try {
      const validStatuses = ['active', 'completed', 'cancelled', 'pending'];

      if (!validStatuses.includes(status)) {
        throw new Error('অবৈধ স্ট্যাটাস');
      }

      const campaign = await CampaignModel.findByIdAndUpdate(
        id,
        { status },
        { new: true },
      ).populate('createdBy', 'name email');

      if (!campaign) {
        throw new Error('ক্যাম্পেইন পাওয়া যায়নি');
      }

      return {
        success: true,
        message: 'ক্যাম্পেইন স্ট্যাটাস আপডেট হয়েছে',
        campaign: this.toResponseObject(campaign),
      };
    } catch (error: any) {
      console.error('Error updating campaign status:', error);
      throw new Error(error.message || 'স্ট্যাটাস আপডেট করতে সমস্যা হয়েছে');
    }
  }

  // Delete Campaign
  async deleteCampaign(id: string): Promise<CampaignResponse> {
    try {
      const campaign = await CampaignModel.findById(id);

      if (!campaign) {
        throw new Error('ক্যাম্পেইন পাওয়া যায়নি');
      }

      // Delete images from Cloudinary
      if (campaign.images.length > 0) {
        await this.deleteImagesFromCloudinary(campaign.images);
      }

      await campaign.deleteOne();

      return {
        success: true,
        message: 'ক্যাম্পেইন মুছে ফেলা হয়েছে',
      };
    } catch (error: any) {
      console.error('Error deleting campaign:', error);
      throw new Error(error.message || 'ক্যাম্পেইন ডিলিট করতে সমস্যা হয়েছে');
    }
  }

  // Get Campaign Statistics
  async getCampaignStats(): Promise<CampaignStatsResponse> {
    try {
      const total = await CampaignModel.countDocuments();
      const active = await CampaignModel.countDocuments({ status: 'active' });
      const completed = await CampaignModel.countDocuments({ status: 'completed' });
      const cancelled = await CampaignModel.countDocuments({ status: 'cancelled' });

      const campaigns = await CampaignModel.find();
      const totalTarget = campaigns.reduce((sum, c) => sum + (c.targetAmount || 0), 0);
      const totalCollected = campaigns.reduce((sum, c) => sum + c.collectedAmount, 0);

      const completionRate =
        totalTarget > 0 ? ((totalCollected / totalTarget) * 100).toFixed(2) : '0';

      return {
        success: true,
        message: 'ক্যাম্পেইন পরিসংখ্যান',
        stats: {
          total,
          active,
          completed,
          cancelled,
          totalTarget,
          totalCollected,
          completionRate,
        },
      };
    } catch (error: any) {
      console.error('Error getting campaign stats:', error);
      throw new Error(error.message || 'পরিসংখ্যান পাওয়া যায়নি');
    }
  }

  // Helper: Delete images from Cloudinary
  private async deleteImagesFromCloudinary(images: Array<{ publicId: string }>) {
    try {
      for (const image of images) {
        if (image.publicId) {
          await cloudinary.uploader.destroy(image.publicId);
        }
      }
    } catch (error) {
      console.error('Error deleting images from Cloudinary:', error);
      // Continue even if deletion fails
    }
  }

  // Add images to existing campaign
  async addImagesToCampaign(
    id: string,
    images: Array<{ url: string; publicId: string }>,
  ): Promise<CampaignResponse> {
    try {
      const campaign = await CampaignModel.findById(id);

      if (!campaign) {
        throw new Error('ক্যাম্পেইন পাওয়া যায়নি');
      }

      const newImages = images.map((img, index) => ({
        url: img.url,
        publicId: img.publicId,
        order: campaign.images.length + index,
      }));

      campaign.images.push(...newImages);
      await campaign.save();

      return {
        success: true,
        message: 'ইমেজ যোগ করা হয়েছে',
        campaign: this.toResponseObject(campaign),
      };
    } catch (error: any) {
      console.error('Error adding images:', error);
      throw new Error(error.message || 'ইমেজ যোগ করতে সমস্যা হয়েছে');
    }
  }

  // Remove specific image from campaign
  async removeImageFromCampaign(id: string, publicId: string): Promise<CampaignResponse> {
    try {
      const campaign = await CampaignModel.findById(id);

      if (!campaign) {
        throw new Error('ক্যাম্পেইন পাওয়া যায়নি');
      }

      const imageIndex = campaign.images.findIndex((img) => img.publicId === publicId);
      if (imageIndex === -1) {
        throw new Error('ইমেজ পাওয়া যায়নি');
      }

      // Delete from Cloudinary
      await cloudinary.uploader.destroy(publicId);

      // Remove from array
      campaign.images.splice(imageIndex, 1);

      // Reorder remaining images
      campaign.images.forEach((img, index) => {
        img.order = index;
      });

      await campaign.save();

      return {
        success: true,
        message: 'ইমেজ মুছে ফেলা হয়েছে',
        campaign: this.toResponseObject(campaign),
      };
    } catch (error: any) {
      console.error('Error removing image:', error);
      throw new Error(error.message || 'ইমেজ মুছতে সমস্যা হয়েছে');
    }
  }
}
